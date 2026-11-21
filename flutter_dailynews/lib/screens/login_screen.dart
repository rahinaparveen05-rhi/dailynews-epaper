import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../main.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _numberController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _isCreateMode = false;
  bool _obscurePassword = true;
  String? _signedInName;
  String? _signedInNumber;

  @override
  void initState() {
    super.initState();
    _loadAccount();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _numberController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _loadAccount() async {
    final prefs = await SharedPreferences.getInstance();
    if (mounted) {
      setState(() {
        _signedInName = prefs.getString('dailynews_user_name');
        _signedInNumber = prefs.getString('dailynews_user_number');
      });
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    final prefs = await SharedPreferences.getInstance();
    final name = _nameController.text.trim();
    final number = _numberController.text.replaceAll(RegExp(r'\D'), '');

    await prefs.setString('dailynews_user_name', name);
    await prefs.setString('dailynews_user_number', number);
    await prefs.setString('dailynews_user_password', _passwordController.text);

    if (mounted) {
      setState(() {
        _signedInName = name;
        _signedInNumber = number;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            _isCreateMode ? 'Account created for $name' : 'Signed in as $name',
          ),
        ),
      );
    }
  }

  Future<void> _signOut() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('dailynews_user_name');
    await prefs.remove('dailynews_user_number');
    await prefs.remove('dailynews_user_password');
    if (mounted) {
      setState(() {
        _signedInName = null;
        _signedInNumber = null;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Reader Account')),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: _signedInName != null
            ? Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _signedInName!,
                    style: const TextStyle(
                      fontFamily: 'Georgia',
                      fontSize: 26,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Mobile: $_signedInNumber',
                    style: const TextStyle(color: DailyNewsApp.mutedGray),
                  ),
                  const SizedBox(height: 24),
                  OutlinedButton.icon(
                    onPressed: _signOut,
                    icon: const Icon(Icons.logout),
                    label: const Text('Sign Out'),
                  ),
                ],
              )
            : Form(
                key: _formKey,
                child: ListView(
                  children: [
                    SegmentedButton<bool>(
                      segments: const [
                        ButtonSegment(value: false, label: Text('Sign In')),
                        ButtonSegment(value: true, label: Text('Create Account')),
                      ],
                      selected: {_isCreateMode},
                      onSelectionChanged: (val) {
                        setState(() => _isCreateMode = val.first);
                      },
                    ),
                    const SizedBox(height: 20),
                    TextFormField(
                      controller: _nameController,
                      decoration: const InputDecoration(
                        labelText: 'Full Name',
                        border: OutlineInputBorder(borderRadius: BorderRadius.zero),
                      ),
                      validator: (v) =>
                          (v == null || v.trim().length < 2) ? 'Enter your full name' : null,
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _numberController,
                      keyboardType: TextInputType.phone,
                      decoration: const InputDecoration(
                        labelText: 'Mobile Number',
                        border: OutlineInputBorder(borderRadius: BorderRadius.zero),
                      ),
                      validator: (v) {
                        final digits = (v ?? '').replaceAll(RegExp(r'\D'), '');
                        return digits.length != 10
                            ? 'Enter a valid 10-digit mobile number'
                            : null;
                      },
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _passwordController,
                      obscureText: _obscurePassword,
                      decoration: InputDecoration(
                        labelText: 'Password',
                        border: const OutlineInputBorder(borderRadius: BorderRadius.zero),
                        suffixIcon: IconButton(
                          icon: Icon(
                            _obscurePassword ? Icons.visibility : Icons.visibility_off,
                          ),
                          onPressed: () =>
                              setState(() => _obscurePassword = !_obscurePassword),
                        ),
                      ),
                      validator: (v) => (v == null || v.length < 6)
                          ? 'Password must be at least 6 characters'
                          : null,
                    ),
                    const SizedBox(height: 24),
                    FilledButton(
                      onPressed: _submit,
                      style: FilledButton.styleFrom(
                        backgroundColor: DailyNewsApp.inkBlack,
                        foregroundColor: Colors.white,
                        shape: const RoundedRectangleBorder(),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      child: Text(_isCreateMode ? 'Create Account' : 'Sign In'),
                    ),
                  ],
                ),
              ),
      ),
    );
  }
}
