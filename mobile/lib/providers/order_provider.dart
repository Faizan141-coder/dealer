import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;
import '../models/load.dart';
import '../models/order.dart';
import 'auth_provider.dart';
import 'load_provider.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';




class OrdersNotifier extends StateNotifier<List<Order>> {
  final Ref ref;

  OrdersNotifier(this.ref) : super([]);

  Future<void> fetchOrders() async {
    final authState = ref.read(authProvider);
    if (!authState.isAuthenticated || authState.accessToken == null) {
      return;
    }

    try {
      final response = await http.get(
        Uri.parse('https://demo.dennis.co.ke/api/v1/orders/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${authState.accessToken}',
        },
      );

      if (response.statusCode == 200) {
        final orders = (jsonDecode(response.body) as List)
            .map((orderData) => Order(
                  id: orderData['order_number'],
                  loads: (orderData['loads'] as List)
                      .map((loadData) => Load.fromJson(loadData))
                      .toList(),
                  images: (orderData['images'] as List)
                      .map((imageData) => OrderImage.fromJson(imageData))
                      .toList(),
                  status: orderData['status'],
                  createdAt: DateTime.parse(orderData['created_at']),
                  updatedAt: DateTime.parse(orderData['updated_at']),
                ))
            .toList();
        state = orders;
      } else {
        throw Exception('Failed to fetch orders: ${response.body}');
      }
    } catch (e) {
      // Handle error
      rethrow;
    }
  }

  void addOrder(Order order) {
    state = [order, ...state];
  }
}

final ordersProvider = StateNotifierProvider<OrdersNotifier, List<Order>>((ref) => OrdersNotifier(ref));

class OrderController extends StateNotifier<AsyncValue<void>> {
  OrderController(this.ref) : super(const AsyncValue.data(null));

  final Ref ref;
  final ImagePicker _picker = ImagePicker();

  Future<void> submitOrder(List<Load> loads, List<File> images) async {
    state = AsyncValue.loading();
    try {
      if (loads.isEmpty) {
        throw Exception("Cannot submit an empty order");
      }

      final authState = ref.read(authProvider);
      if (!authState.isAuthenticated || authState.accessToken == null) {
        throw Exception("User is not authenticated");
      }

      var uri = Uri.parse('https://demo.dennis.co.ke/api/v1/orders/');
      var request = http.MultipartRequest('POST', uri);

      request.headers.addAll({
        'Authorization': 'Bearer ${authState.accessToken}',
      });

      // Convert loads to JSON, ensuring no null values
      var loadsJson = loads.map((load) => load.toJson()).toList();

      request.fields['loads'] = jsonEncode(loadsJson);

      for (var i = 0; i < images.length; i++) {
        var file = await http.MultipartFile.fromPath(
          'images',
          images[i].path,
          filename: 'image_$i.jpg',
        );
        request.files.add(file);
      }

      var streamedResponse = await request.send();
      var response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode == 201) {
        final responseData = jsonDecode(response.body);
        final newOrder = Order.fromJson(responseData);
        ref.read(ordersProvider.notifier).addOrder(newOrder);
        ref.read(loadsProvider.notifier).clearLoads();
        state = AsyncValue.data(null);
      } else {
        throw Exception('Failed to submit order: ${response.body}');
      }
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
      throw e;
    }
  }

  Future<List<File>> pickImages() async {
    final List<XFile>? pickedFiles = await _picker.pickMultiImage();
    return pickedFiles?.map((xfile) => File(xfile.path)).toList() ?? [];
  }

  Future<File?> takePhoto() async {
    final XFile? photo = await _picker.pickImage(source: ImageSource.camera);
    return photo != null ? File(photo.path) : null;
  }
}

final orderControllerProvider = StateNotifierProvider<OrderController, AsyncValue<void>>(
      (ref) => OrderController(ref),
);

