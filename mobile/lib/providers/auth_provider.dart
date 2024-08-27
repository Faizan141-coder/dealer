import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class AuthState {
  final bool isAuthenticated;
  final String? accessToken;
  final String? refreshToken;

  AuthState({required this.isAuthenticated, this.accessToken, this.refreshToken});
}

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier() : super(AuthState(isAuthenticated: false)) {
    _init();
  }

  Future<void> _init() async {
    final prefs = await SharedPreferences.getInstance();
    final accessToken = prefs.getString('access_token');
    final refreshToken = prefs.getString('refresh_token');
    if (accessToken != null && refreshToken != null) {
      state = AuthState(isAuthenticated: true, accessToken: accessToken, refreshToken: refreshToken);
    }
  }

  Future<void> signIn(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('https://demo.dennis.co.ke/api/v1/user/token/'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final accessToken = data['access'] as String;
        final refreshToken = data['refresh'] as String;
        await _saveTokens(accessToken, refreshToken);
        state = AuthState(isAuthenticated: true, accessToken: accessToken, refreshToken: refreshToken);
      } else {
        final data = jsonDecode(response.body);
        final detail = data['detail'] as String;
        throw Exception(detail);
      }
    } catch (e) {
      throw Exception(e);
      // throw Exception('Error during sign in: $e');
    }
  }

  Future<void> signUp(Map<String, dynamic> userData) async {
    final response = await http.post(
      Uri.parse('https://demo.dennis.co.ke/api/v1/user/signup/'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(userData),
    );

    if (jsonDecode(response.body)['message'] == 'User registered successfully') {
    // if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['detail'];
    } else {
      final data = jsonDecode(response.body);
      // final detail = data['email'][0];
      throw Exception(data);
      // throw Exception('Failed to sign up: ${response.body}');
    }
  }

  Future<void> signOut() async {
    await _removeTokens();
    state = AuthState(isAuthenticated: false);
  }

  Future<void> checkAuth() async {
    final prefs = await SharedPreferences.getInstance();
    final accessToken = prefs.getString('access_token');
    final refreshToken = prefs.getString('refresh_token');
    if (accessToken != null && refreshToken != null) {
      // Here you might want to validate the token with the server
      // For now, we'll assume it's valid
      state = AuthState(isAuthenticated: true, accessToken: accessToken, refreshToken: refreshToken);
    } else {
      state = AuthState(isAuthenticated: false);
    }
  }

  Future<void> refreshToken() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final refreshToken = prefs.getString('refresh_token');

      if (refreshToken == null) {
        throw Exception('No refresh token available');
      }

      final response = await http.post(
        Uri.parse('https://demo.dennis.co.ke/api/v1/user/token/refresh/'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'refresh': refreshToken,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final newAccessToken = data['access'] as String;
        await _saveTokens(newAccessToken, refreshToken);
        state = AuthState(isAuthenticated: true, accessToken: newAccessToken, refreshToken: refreshToken);
      } else {
        throw Exception('Failed to refresh token: ${response.body}');
      }
    } catch (e) {
      await signOut();
      throw Exception('Error during token refresh: $e');
    }
  }

  Future<void> _saveTokens(String accessToken, String refreshToken) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('access_token', accessToken);
    await prefs.setString('refresh_token', refreshToken);
  }

  Future<void> _removeTokens() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('access_token');
    await prefs.remove('refresh_token');
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) => AuthNotifier());