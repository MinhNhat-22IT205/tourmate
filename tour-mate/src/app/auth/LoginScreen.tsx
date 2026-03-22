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
    secureTextEntry,
    isPassword,
}: any) {
    const [isFocused, setIsFocused] = useState(false);
    const [hidePassword, setHidePassword] = useState(true);


  const animated = new Animated.Value(value ? 1 : 0);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

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
    color: "#666",

    backgroundColor: "#fff",
    paddingHorizontal: 6,
    zIndex: 10,
  };

  React.useEffect(() => {
    Animated.timing(animated, {
      toValue: isFocused || value ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  return (
    <View style={styles.inputWrapper}>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword ? hidePassword : secureTextEntry}
          onFocus={handleFocus}
          onBlur={handleBlur}
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

export default function LoginScreen() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      {/* App Name */}
      <Text style={styles.appName}>Tour Mate</Text>

      {/* Title */}
      <Text style={styles.title}>Đăng nhập</Text>

      {/* Username */}
      <FloatingInput
        label="Tên đăng nhập"
        value={username}
        onChangeText={setUsername}
      />

      {/* Password */}
      <FloatingInput
        label="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        isPassword
      />

      {/* Forgot password */}
    <TouchableOpacity
        style={styles.forgotContainer}
        onPress={() => router.push("/auth/ForgotPassScreen")}
        >
        <Text style={styles.forgotText}>Quên mật khẩu?</Text>
    </TouchableOpacity>

      {/* Login button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>

      {/* Register */}
      <View style={styles.registerContainer}>
        <Text>Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.push("/auth/RegisterScreen")}>
        <Text style={styles.registerText}>Đăng ký</Text>
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

  appName: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
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

  forgotContainer: {
    alignItems: "flex-end",
    marginBottom: 20,
  },

  forgotText: {
    color: "#007BFF",
  },

  button: {
    backgroundColor: "#007BFF",
    height: 56,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },

  registerText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});