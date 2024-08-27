import 'package:flutter/material.dart';

import '../models/order.dart';


import 'package:flutter/material.dart';
import '../models/order.dart';

class OrderDetailScreen extends StatelessWidget {
  final Order order;

  OrderDetailScreen({required this.order});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Order #${order.id} Details'),
      ),
      body: ListView.builder(
        itemCount: order.loads.length,
        itemBuilder: (context, index) {
          final load = order.loads[index];
          return ListTile(
            title: Text('Quantity: ${load.quantity}'),
            subtitle: Text(
              'Address: ${load.address}\nDate: ${load.formattedDateTime}',
            ),
          );
        },
      ),
    );
  }
}