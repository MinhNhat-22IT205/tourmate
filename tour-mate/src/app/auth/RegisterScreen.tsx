import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

function FloatingInput({
  label,
  value,
  onChangeText,
  isPassword,
}: any) {
  const [isFocused, setIsFocused] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);

  const animated = new Animated.Value(value ? 1 : 0);

  React.useEffect(() => {
    Animated.timing(animated, {
      toValue: isFocused || value ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: "absolute" as const,
    left: 12,
    top: animated.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -10],
    }),
    fontSize: animated.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: isFocused ? "#007BFF" : "#666",

    backgroundColor: "#fff",
    paddingHorizontal: 6,
    zIndex: 10,
  };

  return (
    <View style={styles.inputWrapper}>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword ? hidePassword : false}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {isPassword && (
          <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
            <Ionicons
              name={hidePassword ? "eye" : "eye-off"}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function RegisterScreen() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Đăng ký</Text>

      {/* Username */}
      <FloatingInput
        label="Tên đăng nhập"
        value={username}
        onChangeText={setUsername}
      />

      {/* Email */}
      <FloatingInput
        label="Email"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password */}
      <FloatingInput
        label="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        isPassword
      />

      {/* Confirm Password */}
      <FloatingInput
        label="Xác nhận mật khẩu"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        isPassword
      />

      {/* Register button */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push({ pathname: "/auth/VerifyScreen", params: { from: "register" } })}
      >
        <Text style={styles.buttonText}>Đăng ký</Text>
      </TouchableOpacity>

      {/* Go to Login */}
      <View style={styles.loginContainer}>
        <Text>Đã có tài khoản? </Text>
        <TouchableOpacity onPress={() => router.push("/auth/LoginScreen")}>
          <Text style={styles.loginText}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 24,
  },

  inputWrapper: {
    marginBottom: 20,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 56,
    backgroundColor: "#fff",
  },

  input: {
    flex: 1,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#007BFF",
    height: 56,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },

  loginText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});