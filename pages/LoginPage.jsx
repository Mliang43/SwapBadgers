// pages/LoginPage.jsx
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

// BACKEND IMPORTS ADDED HERE
import { logIn, signUp } from "../firebase/auth";

export default function LoginPage({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // NEW BACKEND-ENABLED LOGIN FUNCTION
  const handleEmailLogin = async () => {
    if (!email.trim()) {
      Alert.alert("Validation Error", "Please enter your email.");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Validation Error", "Please enter your password.");
      return;
    }
    if (!email.toLowerCase().endsWith("@wisc.edu")) {
      Alert.alert("Error", "Only UW–Madison @wisc.edu emails can log in.");
      return;
    }

    setLoading(true);

    try {
      // Try logging in existing user
      await logIn(email.trim(), password.trim());
      navigation.replace("MainApp");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        // ✨ Auto-create account for new users
        try {
          await signUp(email.trim(), password.trim());
          Alert.alert("Account Created", "Welcome to BadgerSwap!");
          navigation.replace("MainApp");
        } catch (signupError) {
          Alert.alert("Signup Error", signupError.message);
        }
      } else {
        Alert.alert("Login Error", err.message);
      }
    }

    setLoading(false);
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace("MainApp");
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="shield" size={50} color="#666" />
            </View>
            <Text style={styles.appTitle}>BadgerSwap</Text>
            <Text style={styles.tagline}>Trusted marketplace for UW-Madison</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="youremail@wisc.edu"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                />
                <TouchableOpacity onPress={() => setShowPassword((s) => !s)} style={styles.eyeIcon}>
                  <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
              onPress={handleEmailLogin}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Log In</Text>}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn} disabled={loading}>
              <Ionicons name="checkbox" size={20} color="#000" />
              <Text style={styles.googleButtonText}>Continue with Google (UW)</Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("SignupPage")}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#000",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 50,
  },
  inputIcon: { marginRight: 12 },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  eyeIcon: { padding: 4 },
  primaryButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
    minHeight: 50,
  },
  primaryButtonDisabled: { opacity: 0.6 },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: "#999",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#000",
    paddingVertical: 16,
    marginBottom: 24,
    gap: 8,
    minHeight: 50,
  },
  googleButtonText: { color: "#000", fontSize: 16, fontWeight: "500" },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
    flexWrap: "wrap",
  },
  signupText: { fontSize: 14, color: "#666" },
  signupLink: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
