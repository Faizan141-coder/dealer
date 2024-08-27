import 'package:flutter/material.dart';

import '../models/load.dart';

// class AddLoadDialog extends StatefulWidget {
//   final Function(Load) onAdd;
//   final Load? initialLoad;
//
//   AddLoadDialog({required this.onAdd, this.initialLoad});
//
//   @override
//   _AddLoadDialogState createState() => _AddLoadDialogState();
// }
//
// class _AddLoadDialogState extends State<AddLoadDialog> {
//   final _formKey = GlobalKey<FormState>();
//   late TextEditingController _quantityController;
//   late TextEditingController _addressController;
//   late DateTime _selectedDate;
//   late TimeOfDay _selectedTime;
//
//   @override
//   void initState() {
//     super.initState();
//     final initialLoad = widget.initialLoad;
//     _quantityController = TextEditingController(text: initialLoad?.quantity.toString() ?? '');
//     _addressController = TextEditingController(text: initialLoad?.address ?? '');
//     _selectedDate = initialLoad?.dateTime ?? DateTime.now();
//     _selectedTime = TimeOfDay.fromDateTime(initialLoad?.dateTime ?? DateTime.now());
//   }
//
//   @override
//   void dispose() {
//     _quantityController.dispose();
//     _addressController.dispose();
//     super.dispose();
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return AlertDialog(
//       title: Text(widget.initialLoad == null ? 'Add Load' : 'Edit Load'),
//       content: Form(
//         key: _formKey,
//         child: Column(
//           mainAxisSize: MainAxisSize.min,
//           children: [
//             TextFormField(
//               controller: _quantityController,
//               decoration:  InputDecoration(labelText: 'Quantity'),
//               keyboardType: TextInputType.number,
//               validator: (value) {
//                 if (value == null || value.isEmpty) {
//                   return 'Please enter a quantity';
//                 }
//                 return null;
//               },
//             ),
//             TextFormField(
//               controller: _addressController,
//               decoration:  InputDecoration(labelText: 'Address'),
//               validator: (value) {
//                 if (value == null || value.isEmpty) {
//                   return 'Please enter an address';
//                 }
//                 return null;
//               },
//             ),
//             Row(
//               children: [
//                 Text('Date: ${_selectedDate.toString().split(' ')[0]}'),
//                 IconButton(
//                   icon: Icon(Icons.calendar_today),
//                   onPressed: () => _selectDate(context),
//                 ),
//               ],
//             ),
//             Row(
//               children: [
//                 Text('Time: ${_selectedTime.format(context)}'),
//                 IconButton(
//                   icon: Icon(Icons.access_time),
//                   onPressed: () => _selectTime(context),
//                 ),
//               ],
//             ),
//           ],
//         ),
//       ),
//       actions: [
//         TextButton(
//           onPressed: () => Navigator.of(context).pop(),
//           child: Text('Cancel'),
//         ),
//         ElevatedButton(
//           onPressed: _submitForm,
//           child: Text(widget.initialLoad == null ? 'Add' : 'Update'),
//         ),
//       ],
//     );
//   }
//
//   Future<void> _selectDate(BuildContext context) async {
//     final DateTime? picked = await showDatePicker(
//       context: context,
//       initialDate: _selectedDate,
//       firstDate: DateTime.now(),
//       lastDate: DateTime.now().add(Duration(days: 365)),
//     );
//     if (picked != null && picked != _selectedDate) {
//       setState(() {
//         _selectedDate = picked;
//       });
//     }
//   }
//
//   Future<void> _selectTime(BuildContext context) async {
//     final TimeOfDay? picked = await showTimePicker(
//       context: context,
//       initialTime: _selectedTime,
//     );
//     if (picked != null && picked != _selectedTime) {
//       setState(() {
//         _selectedTime = picked;
//       });
//     }
//   }
//
//   void _submitForm() {
//     if (_formKey.currentState!.validate()) {
//       final quantity = int.parse(_quantityController.text);
//       final address = _addressController.text;
//       final dateTime = DateTime(
//         _selectedDate.year,
//         _selectedDate.month,
//         _selectedDate.day,
//         _selectedTime.hour,
//         _selectedTime.minute,
//       );
//
//       final newLoad = Load(
//         quantity: quantity,
//         address: address,
//         dateTime: dateTime,
//       );
//
//       widget.onAdd(newLoad);
//     }
//   }
// }



class AddLoadDialog extends StatefulWidget {
  final Function(Load) onAdd;
  final Load? initialLoad;

  AddLoadDialog({required this.onAdd, this.initialLoad});

  @override
  _AddLoadDialogState createState() => _AddLoadDialogState();
}

class _AddLoadDialogState extends State<AddLoadDialog> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _quantityController;
  late TextEditingController _addressController;
  late DateTime _selectedDate;
  late TimeOfDay _selectedTime;

  @override
  void initState() {
    super.initState();
    final initialLoad = widget.initialLoad;
    _quantityController = TextEditingController(text: initialLoad?.quantity.toString() ?? '');
    _addressController = TextEditingController(text: initialLoad?.address ?? '');
    _selectedDate = initialLoad?.dateTime ?? DateTime.now();
    _selectedTime = TimeOfDay.fromDateTime(initialLoad?.dateTime ?? DateTime.now());
  }

  @override
  void dispose() {
    _quantityController.dispose();
    _addressController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(widget.initialLoad == null ? 'Add Load' : 'Edit Load'),
      content: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextFormField(
              controller: _quantityController,
              decoration: const InputDecoration(labelText: 'Quantity'),
              keyboardType: TextInputType.number,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter a quantity';
                }
                return null;
              },
            ),
            TextFormField(
              controller: _addressController,
              decoration: const InputDecoration(labelText: 'Address'),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter an address';
                }
                return null;
              },
            ),
            Row(
              children: [
                Text('Date: ${_selectedDate.toString().split(' ')[0]}'),
                IconButton(
                  icon: const Icon(Icons.calendar_today),
                  onPressed: () => _selectDate(context),
                ),
              ],
            ),
            Row(
              children: [
                Text('Time: ${_selectedTime.format(context)}'),
                IconButton(
                  icon: const Icon(Icons.access_time),
                  onPressed: () => _selectTime(context),
                ),
              ],
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: _submitForm,
          child: Text(widget.initialLoad == null ? 'Add' : 'Update'),
        ),
      ],
    );
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  Future<void> _selectTime(BuildContext context) async {
    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: _selectedTime,
    );
    if (picked != null && picked != _selectedTime) {
      setState(() {
        _selectedTime = picked;
      });
    }
  }

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      final quantity = int.parse(_quantityController.text);
      final address = _addressController.text;
      final dateTime = DateTime(
        _selectedDate.year,
        _selectedDate.month,
        _selectedDate.day,
        _selectedTime.hour,
        _selectedTime.minute,
      );

      final newLoad = Load(
        quantity: quantity,
        address: address,
        dateTime: dateTime,
      );

      widget.onAdd(newLoad);
    }
  }
}