import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'models.dart' as models;
import 'screens/splash_screen.dart' as splash;
import 'screens/login_screen.dart' as login;
import 'screens/register_screen.dart' as register;
import 'screens/home_screen.dart' as home;

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  static const _tokenKey = 'auth_token';
  static const _userKey = 'auth_user';

  String? _token;
  models.AppUser? _user;

  @override
  void initState() {
    super.initState();
    _restoreSession();
  }

  void _handleLoggedIn(String token, models.AppUser user) {
    setState(() {
      _token = token;
      _user = user;
    });
    _persistSession(token, user);
  }

  void _handleLogout() {
    setState(() {
      _token = null;
      _user = null;
    });
    _clearSession();
  }

  Future<void> _restoreSession() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final storedToken = prefs.getString(_tokenKey);
      final storedUser = prefs.getString(_userKey);
      if (storedToken == null || storedUser == null) {
        return;
      }
      final decoded = jsonDecode(storedUser);
      if (decoded is Map<String, dynamic>) {
        final user = models.AppUser.fromJson(decoded);
        setState(() {
          _token = storedToken;
          _user = user;
        });
      }
    } catch (_) {}
  }

  Future<void> _persistSession(String token, models.AppUser user) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_tokenKey, token);
      await prefs.setString(
        _userKey,
        jsonEncode({
          'id': user.id,
          'name': user.name,
          'email': user.email,
          'role': user.role,
        }),
      );
    } catch (_) {}
  }

  Future<void> _clearSession() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_tokenKey);
      await prefs.remove(_userKey);
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Quick Glow Grocer',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF00C97B),
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
      ),
      routes: {
        '/': (context) => splash.SplashScreen(
          onTap: () {
            if (_token != null && _user != null) {
              Navigator.of(context).pushReplacementNamed('/home');
            } else {
              Navigator.of(context).pushReplacementNamed('/login');
            }
          },
        ),
        '/login': (context) {
          if (_token != null && _user != null) {
            return home.HomeScreen(
              token: _token,
              user: _user,
              onLogout: () {
                _handleLogout();
                Navigator.of(context).pushReplacementNamed('/login');
              },
            );
          }
          return login.LoginScreen(
            onLoggedIn: (token, user) {
              _handleLoggedIn(token, user);
              Navigator.of(context).pushReplacementNamed('/home');
            },
          );
        },
        '/register': (context) {
          if (_token != null && _user != null) {
            return home.HomeScreen(
              token: _token,
              user: _user,
              onLogout: () {
                _handleLogout();
                Navigator.of(context).pushReplacementNamed('/login');
              },
            );
          }
          return register.RegisterScreen(
            onRegistered: (token, user) {
              _handleLoggedIn(token, user);
              Navigator.of(context).pushReplacementNamed('/home');
            },
          );
        },
        '/home': (context) => home.HomeScreen(
          token: _token,
          user: _user,
          onLogout: () {
            _handleLogout();
            Navigator.of(context).pushReplacementNamed('/login');
          },
        ),
      },
    );
  }
}
