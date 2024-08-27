
import 'package:intl/intl.dart';

class Load {
  final int quantity;
  final String address;
  final DateTime dateTime;

  Load({required this.quantity, required this.address, required this.dateTime});

  String get formattedDateTime => DateFormat('EEEE, MMMM d, y   h:mm a').format(dateTime);

  Map<String, dynamic> toJson() => {
    'quantity': quantity,
    'address': address,
    'date': DateFormat('yyyy-MM-dd').format(dateTime),
    'time': DateFormat('HH:mm:ss').format(dateTime),
  };

  factory Load.fromJson(Map<String, dynamic> json) {
    return Load(
      quantity: json['quantity'],
      address: json['address'],
      dateTime: DateTime.parse('${json['date']} ${json['time']}'),
    );
  }
}