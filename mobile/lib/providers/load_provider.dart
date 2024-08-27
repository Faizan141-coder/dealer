import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/load.dart';

// class LoadsNotifier extends StateNotifier<List<Load>> {
//   LoadsNotifier() : super([]);
//
//   void addLoad(Load load) {
//     state = [...state, load];
//   }
//
//   void updateLoad(int index, Load updatedLoad) {
//     state = [
//       ...state.sublist(0, index),
//       updatedLoad,
//       ...state.sublist(index + 1),
//     ];
//   }
//
//   void removeLoad(int index) {
//     state = [...state]..removeAt(index);
//   }
//
//   void clearLoads() {
//     state = [];
//   }
// }
//
// final loadsProvider = StateNotifierProvider<LoadsNotifier, List<Load>>((ref) => LoadsNotifier());



import '../providers/auth_provider.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class LoadsNotifier extends StateNotifier<List<Load>> {
  final Ref ref;

  LoadsNotifier(this.ref) : super([]);

  Future<void> fetchLoads() async {
    final authState = ref.read(authProvider);
    if (!authState.isAuthenticated || authState.accessToken == null) {
      return;
    }

    try {
      final response = await http.get(
        Uri.parse('https://demo.dennis.co.ke/api/v1/loads/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${authState.accessToken}',
        },
      );

      if (response.statusCode == 200) {
        final loads = (jsonDecode(response.body) as List)
            .map((loadData) => Load(
          quantity: loadData['quantity'],
          address: loadData['address'],
          dateTime: DateTime.parse('${loadData['date']} ${loadData['time']}'),
        ))
            .toList();
        state = loads;
      } else {
        throw Exception('Failed to fetch loads: ${response.body}');
      }
    } catch (e) {
      // Handle error
      rethrow;
    }
  }

  void addLoad(Load load) {
    state = [...state, load];
  }

  void updateLoad(int index, Load updatedLoad) {
    state = [
      ...state.sublist(0, index),
      updatedLoad,
      ...state.sublist(index + 1),
    ];
  }

  void removeLoad(int index) {
    state = [...state]..removeAt(index);
  }

  void clearLoads() {
    state = [];
  }
}

final loadsProvider = StateNotifierProvider<LoadsNotifier, List<Load>>((ref) => LoadsNotifier(ref));