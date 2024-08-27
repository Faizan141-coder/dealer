import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:loading_indicator/loading_indicator.dart';

import '../models/load.dart';
import '../providers/load_provider.dart';
import '../providers/order_provider.dart';
import '../widgets/add_load_widget.dart';


class DashboardScreen extends ConsumerStatefulWidget {
  @override
  _DashboardScreenState createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {
  bool _isSubmittingOrder = false;
  List<File> _selectedImages = [];

  @override
  Widget build(BuildContext context) {
    final loads = ref.watch(loadsProvider);
    final orderController = ref.read(orderControllerProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Make orders',
          style: TextStyle(fontSize: 18, color: Colors.black54),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => showAddLoadDialog(context, ref),
        tooltip: 'Add Loads',
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(50)),
        backgroundColor: Colors.indigo,
        child: const Icon(Icons.add, color: Colors.white, size: 28),
      ),
      floatingActionButtonLocation: loads.isNotEmpty ? FloatingActionButtonLocation.endFloat : FloatingActionButtonLocation.centerFloat,
      body: Column(
        children: [
          Expanded(child: buildLoadList(loads, ref)),
          if (loads.isNotEmpty)
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      ElevatedButton.icon(
                        onPressed: () async {
                          List<File> pickedImages = await orderController.pickImages();
                          setState(() {
                            _selectedImages.addAll(pickedImages);
                          });
                        },
                        icon: Icon(Icons.photo_library),
                        label: Text('Select Images'),
                      ),
                      ElevatedButton.icon(
                        onPressed: () async {
                          File? photo = await orderController.takePhoto();
                          if (photo != null) {
                            setState(() {
                              _selectedImages.add(photo);
                            });
                          }
                        },
                        icon: Icon(Icons.camera_alt),
                        label: Text('Take Photo'),
                      ),
                    ],
                  ),
                  if (_selectedImages.isNotEmpty)
                    Container(
                      height: 100,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: _selectedImages.length,
                        itemBuilder: (context, index) {
                          return Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Image.file(_selectedImages[index], height: 80, width: 80, fit: BoxFit.cover),
                          );
                        },
                      ),
                    ),
                  SizedBox(height: 16),
                  if (_isSubmittingOrder)
                    const SizedBox(
                      width: 48,
                      height: 48,
                      child: LoadingIndicator(
                        indicatorType: Indicator.ballPulse,
                        colors: [Colors.blue],
                      ),
                    )
                  else
                    ElevatedButton.icon(
                      onPressed: () {
                        setState(() {
                          _isSubmittingOrder = true;
                        });
                        orderController.submitOrder(loads, _selectedImages).then((_) {
                          setState(() {
                            _isSubmittingOrder = false;
                            _selectedImages.clear();
                          });
                          Fluttertoast.showToast(
                            msg: "Order submitted successfully!",
                            toastLength: Toast.LENGTH_SHORT,
                            gravity: ToastGravity.BOTTOM,
                            backgroundColor: Colors.green,
                            textColor: Colors.white,
                          );
                        }).catchError((error) {
                          setState(() {
                            _isSubmittingOrder = false;
                          });
                          Fluttertoast.showToast(
                            msg: "Failed to submit order: $error",
                            toastLength: Toast.LENGTH_LONG,
                            gravity: ToastGravity.BOTTOM,
                            backgroundColor: Colors.red,
                            textColor: Colors.white,
                          );
                        });
                      },
                      icon: const Icon(Icons.send, size: 16, color: Colors.white),
                      label: const Text('Submit Order', style: TextStyle(fontSize: 16, color: Colors.white)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.indigo,
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                      ),
                    ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget buildLoadList(List<Load> loads, WidgetRef ref) {
    return RefreshIndicator(
      onRefresh: () async {
        await ref.read(loadsProvider.notifier).fetchLoads();
      },
      child: ListView.separated(
        itemCount: loads.length,
        separatorBuilder: (context, index) => const Divider(height: 1, color: Colors.grey),
        itemBuilder: (context, index) {
          final load = loads[index];
          return ListTile(
            title: Text('Quantity: ${load.quantity}', style: const TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Address: ${load.address}'),
                Text('Date: ${load.formattedDateTime}'),
              ],
            ),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                IconButton(
                  icon: const Icon(Icons.edit, color: Colors.blue),
                  onPressed: () => showEditLoadDialog(context, ref, index, load),
                ),
                IconButton(
                  icon: const Icon(Icons.delete, color: Colors.red),
                  onPressed: () {
                    ref.read(loadsProvider.notifier).removeLoad(index);
                    Fluttertoast.showToast(
                      msg: "Load deleted successfully!",
                      toastLength: Toast.LENGTH_SHORT,
                      gravity: ToastGravity.BOTTOM,
                      backgroundColor: Colors.red,
                      textColor: Colors.white,
                    );
                  },
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  void showAddLoadDialog(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (context) => AddLoadDialog(
        onAdd: (load) {
          ref.read(loadsProvider.notifier).addLoad(load);
          Navigator.of(context).pop();
          Fluttertoast.showToast(
            msg: "Load added successfully!",
            toastLength: Toast.LENGTH_SHORT,
            gravity: ToastGravity.BOTTOM,
            backgroundColor: Colors.green,
            textColor: Colors.white,
          );
        },
      ),
    );
  }

  void showEditLoadDialog(BuildContext context, WidgetRef ref, int index, Load load) {
    showDialog(
      context: context,
      builder: (context) => AddLoadDialog(
        onAdd: (updatedLoad) {
          ref.read(loadsProvider.notifier).updateLoad(index, updatedLoad);
          Navigator.of(context).pop();
          Fluttertoast.showToast(
            msg: "Load updated successfully!",
            toastLength: Toast.LENGTH_SHORT,
            gravity: ToastGravity.BOTTOM,
            backgroundColor: Colors.blue,
            textColor: Colors.white,
          );
        },
        initialLoad: load,
      ),
    );
  }
}