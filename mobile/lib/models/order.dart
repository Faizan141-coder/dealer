import 'package:intl/intl.dart';
import 'load.dart';

class OrderImage {
  final String title;
  final String image;
  final DateTime createdAt;
  final DateTime updatedAt;

  OrderImage({
    required this.title,
    required this.image,
    required this.createdAt,
    required this.updatedAt,
  });

  factory OrderImage.fromJson(Map<String, dynamic> json) {
    return OrderImage(
      title: json['title'],
      image: json['image'],
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }
}

class Order {
  final String id;
  final List<Load> loads;
  final List<OrderImage> images;
  final String status;
  final DateTime createdAt;
  final DateTime updatedAt;

  Order({
    required this.id,
    required this.loads,
    required this.images,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  });

  String get formattedDate => DateFormat('MMMM d, y').format(createdAt);

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['order_number'],
      loads: (json['loads'] as List).map((load) => Load.fromJson(load)).toList(),
      images: (json['images'] as List).map((image) => OrderImage.fromJson(image)).toList(),
      status: json['status'],
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }
}