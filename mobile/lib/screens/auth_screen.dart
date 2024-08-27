import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/auth_provider.dart';
import 'package:fluttertoast/fluttertoast.dart';

class AuthScreen extends ConsumerStatefulWidget {
  @override
  _AuthScreenState createState() => _AuthScreenState();
}

class _AuthScreenState extends ConsumerState<AuthScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _fullNameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _companyNameController = TextEditingController();
  final _addressController = TextEditingController();
  final _countryController = TextEditingController();
  String? _selectedState;
  final _cityController = TextEditingController();
  final _zipCodeController = TextEditingController();
  bool _isLogin = true;
  bool _isLoading = false;

  final List<List<String>> states = [
    ["NY", "New York"],
    ["CA", "California"],
    ["TX", "Texas"],
  ];

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _fullNameController.dispose();
    _phoneController.dispose();
    _companyNameController.dispose();
    _addressController.dispose();
    _countryController.dispose();
    _cityController.dispose();
    _zipCodeController.dispose();
    super.dispose();
  }


  void _showToast(String message, bool isError) {
    Fluttertoast.showToast(
      msg: message,
      toastLength: Toast.LENGTH_SHORT,
      gravity: ToastGravity.BOTTOM,
      timeInSecForIosWeb: 1,
      backgroundColor: isError ? Colors.red : Colors.green,
      textColor: Colors.white,
      fontSize: 16.0,
    );
  }

  void _submitForm() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });
      try {
        if (_isLogin) {
          await ref.read(authProvider.notifier).signIn(
            _emailController.text,
            _passwordController.text,
          );
          _showToast("Logged in successfully", false);
          Navigator.of(context).pushReplacementNamed('/home');
        } else {
          final userData = {
            "email": _emailController.text,
            "full_name": _fullNameController.text,
            "phone": _phoneController.text,
            "password": _passwordController.text,
            "confirm_password": _passwordController.text,
            "profile": {
              "company_name": _companyNameController.text,
              "address": _addressController.text,
              "country": _countryController.text,
              "state": _selectedState,
              "city": _cityController.text,
              "zip_code": _zipCodeController.text,
            }
          };
          await ref.read(authProvider.notifier).signUp(userData);
          _showToast("Registered successfully", false);
          setState(() {
            _isLogin = true;
          });
          // Clear all fields except email
          _passwordController.clear();
          _fullNameController.clear();
          _phoneController.clear();
          _companyNameController.clear();
          _addressController.clear();
          _countryController.clear();
          _selectedState = null;
          _cityController.clear();
          _zipCodeController.clear();
        }
      } catch (e) {
        _showToast("Error: ${e.toString()}", true);
      } finally {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Colors.indigo.shade900, Colors.purple],
            // colors: [Colors.blue.shade400, Colors.blue.shade900],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              child: Padding(
                padding: EdgeInsets.all(24.0),
                child: Card(
                  elevation: 4,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Padding(
                    padding: EdgeInsets.all(32.0),
                    child: Form(
                      key: _formKey,
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            _isLogin ? 'Welcome Back' : 'Create Account',
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: Colors.blue.shade800,
                            ),
                          ),
                          SizedBox(height: 32),
                          _buildTextField(
                            controller: _emailController,
                            label: 'Email',
                            icon: Icons.email,
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Please enter your email';
                              }
                              return null;
                            },
                          ),
                          SizedBox(height: 16),
                          _buildTextField(
                            controller: _passwordController,
                            label: 'Password',
                            icon: Icons.lock,
                            obscureText: true,
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Please enter your password';
                              }
                              return null;
                            },
                          ),
                          if (!_isLogin) ...[
                            SizedBox(height: 16),
                            _buildTextField(
                              controller: _fullNameController,
                              label: 'Full Name',
                              icon: Icons.person,
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Please enter your full name';
                                }
                                return null;
                              },
                            ),
                            SizedBox(height: 16),
                            _buildTextField(
                              controller: _phoneController,
                              label: 'Phone',
                              icon: Icons.phone,
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Please enter your phone number';
                                }
                                return null;
                              },
                            ),
                            SizedBox(height: 16),
                            _buildTextField(
                              controller: _companyNameController,
                              label: 'Company Name',
                              icon: Icons.business,
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Please enter your company name';
                                }
                                return null;
                              },
                            ),
                            SizedBox(height: 16),
                            _buildTextField(
                              controller: _addressController,
                              label: 'Address',
                              icon: Icons.location_on,
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Please enter your address';
                                }
                                return null;
                              },
                            ),
                            SizedBox(height: 16),
                            _buildTextField(
                              controller: _countryController,
                              label: 'Country',
                              icon: Icons.flag,
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Please enter your country';
                                }
                                return null;
                              },
                            ),
                            SizedBox(height: 16),
                            _buildStateDropdown(),
                            SizedBox(height: 16),
                            _buildTextField(
                              controller: _cityController,
                              label: 'City',
                              icon: Icons.location_city,
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Please enter your city';
                                }
                                return null;
                              },
                            ),
                            SizedBox(height: 16),
                            _buildTextField(
                              controller: _zipCodeController,
                              label: 'ZIP Code',
                              icon: Icons.local_post_office,
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Please enter your ZIP code';
                                }
                                return null;
                              },
                            ),
                          ],
                          SizedBox(height: 32),
                          _isLoading
                              ? const CircularProgressIndicator()
                              : ElevatedButton(
                            onPressed: _submitForm,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.blue.shade800,
                              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                              textStyle: TextStyle(fontSize: 18),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(30),
                              ),
                            ),
                            child: Text(_isLogin ? 'Login' : 'Register', style: const TextStyle(color: Colors.white),),
                          ),
                          const SizedBox(height: 16),
                          TextButton(
                            onPressed: () {
                              setState(() {
                                _isLogin = !_isLogin;
                              });
                            },
                            child: Text(
                              _isLogin ? 'Create an account' : 'Already have an account? Login',
                              style: TextStyle(color: Colors.blue.shade800),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    bool obscureText = false,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon, color: Colors.blue.shade800),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.blue.shade200),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.blue.shade800, width: 2),
        ),
        filled: true,
        fillColor: Colors.blue.shade50,
      ),
      obscureText: obscureText,
      validator: validator,
    );
  }

  Widget _buildStateDropdown() {
    return DropdownButtonFormField<String>(
      value: _selectedState,
      decoration: InputDecoration(
        labelText: 'State',
        prefixIcon: Icon(Icons.location_city, color: Colors.blue.shade800),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.blue.shade200),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.blue.shade800, width: 2),
        ),
        filled: true,
        fillColor: Colors.blue.shade50,
      ),
      items: states.map((state) {
        return DropdownMenuItem(
          value: state[0],
          child: Text(state[1]),
        );
      }).toList(),
      onChanged: (value) {
        setState(() {
          _selectedState = value;
        });
      },
      validator: (value) {
        if (value == null || value.isEmpty) {
          return 'Please select a state';
        }
        return null;
      },
    );
  }
}