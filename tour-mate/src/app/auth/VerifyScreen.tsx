import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function VerifyScreen() {
  const router = useRouter();
  const { from } = useLocalSearchParams(); // Lấy thông tin màn hình trước đó
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Nếu nhập xong 1 số, tự động nhảy sang ô tiếp theo
    if (text.length !== 0 && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Logic khi bấm nút xóa (Backspace)
    if (e.nativeEvent.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        // Nếu ô hiện tại trống, lùi về ô trước và xóa ký tự ô đó
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const handleBack = () => {
    if (from === "register") {
      router.push("/auth/RegisterScreen" as any);
    } else if (from === "forgotpass") {
      router.push("/auth/ForgotPassScreen" as any);
    } else {
      router.back();
    }
  };

  const handleVerify = () => {
    // Giả sử mã OTP đúng
    if (from === "forgotpass") {
      // Luồng Quên mật khẩu: Tiến đến trang nhập mật khẩu mới
      router.push("/auth/NewPassScreen" as any);
    } else if (from === "register") {
      // Luồng Đăng ký: Xác thực xong thì về Login để đăng nhập
      router.push("/auth/LoginScreen" as any);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác thực</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            value={digit}
            ref={(el) => {
                inputs.current[index] = el;
              }}
          />
        ))}
      </View>

      <View style={styles.linkRow}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.linkTextBlue}>Trở về</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => console.log("Gửi lại mã")}>
          <Text style={styles.linkTextBlue}>Gửi lại</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
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
    marginBottom: 30,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingHorizontal: 5,
  },
  linkTextBlue: {
    color: "#007BFF",
    fontWeight: "500",
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