import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";

function FloatingInput({ label, value, onChangeText }: any) {
  const [isFocused, setIsFocused] = useState(false);
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
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
    </View>
  );
}

export default function ForgotPassScreen() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Quên mật khẩu</Text>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "phone" && styles.activeTab]}
          onPress={() => setActiveTab("phone")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "phone" && styles.activeTabText,
            ]}
          >
            Số điện thoại
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "email" && styles.activeTab]}
          onPress={() => setActiveTab("email")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "email" && styles.activeTabText,
            ]}
          >
            Email
          </Text>
        </TouchableOpacity>
      </View>

      {/* Input */}
      {activeTab === "phone" ? (
        <FloatingInput
          label="Số điện thoại"
          value={phone}
          onChangeText={setPhone}
        />
      ) : (
        <FloatingInput
          label="Email"
          value={email}
          onChangeText={setEmail}
        />
      )}

      {/* Back */}
      <TouchableOpacity
        style={styles.backContainer}
        onPress={() => router.push("/auth/LoginScreen")}
      >
        <Text style={styles.backText}>Trở về</Text>
      </TouchableOpacity>

      {/* Confirm */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push({ pathname: "/auth/VerifyScreen", params: { from: "forgotpass" } })}
      >
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>
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

  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },

  activeTab: {
    borderBottomWidth: 2,
    borderColor: "#007BFF",
  },

  tabText: {
    color: "#666",
  },

  activeTabText: {
    color: "#007BFF",
    fontWeight: "bold",
  },

  inputWrapper: {
    marginBottom: 20,
  },

  inputContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 56,
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  input: {
    fontSize: 16,
  },

  backContainer: {
    alignItems: "flex-start",
    marginBottom: 20,
  },

  backText: {
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
});