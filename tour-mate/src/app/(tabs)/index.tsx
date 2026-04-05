import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

export default function HomeScreen() {
  const [weather, setWeather] = useState<{ temp: number; code: number } | null>(null);
  const [address, setAddress] = useState("Đang xác định...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setAddress("Quyền vị trí bị từ chối");
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      let geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geocode.length > 0) {
        const place = geocode[0];
        // Hiển thị Quận/Huyện hoặc Thành phố
        setAddress(`${place.subregion || place.city || "Vị trí của bạn"}`);
      }

      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        const data = await response.json();
        setWeather({
          temp: Math.round(data.current_weather.temperature),
          code: data.current_weather.weathercode,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Hàm chuyển đổi Weather Code sang mô tả Tiếng Việt
  const getWeatherDesc = (code: number) => {
    if (code === 0) return "Trời quang";
    if (code <= 3) return "Nhiều mây";
    if (code >= 45 && code <= 48) return "Có sương mù";
    if (code >= 51 && code <= 67) return "Đang có mưa";
    if (code >= 71 && code <= 77) return "Có tuyết rơi";
    if (code >= 80 && code <= 82) return "Mưa rào";
    if (code >= 95) return "Có dông";
    return "Thời tiết hiện tại";
  };

  const getWeatherIcon = (code: number) => {
    if (code === 0) return "sunny";
    if (code <= 3) return "partly-sunny";
    if (code >= 51 && code <= 67) return "rainy";
    return "cloudy";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.welcomeText}>Chào mừng trở lại,</Text>
            <Text style={styles.headerTitle}>Sẵn sàng khám phá?</Text>
          </View>
          <View style={styles.profileBadge}>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </View>
        </View>

        <View style={styles.weatherCard}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <View style={styles.weatherInfo}>
                <Ionicons 
                  name={weather ? getWeatherIcon(weather.code) : "sunny"} 
                  size={30} 
                  color="#FFD700" 
                />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.tempText}>{weather ? `${weather.temp}°C` : "--°C"}</Text>
                  <Text style={styles.weatherDesc}>
                    {weather ? getWeatherDesc(weather.code) : "Đang tải..."}
                  </Text>
                </View>
              </View>
              <View style={styles.locationInfo}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="location" size={14} color="white" />
                  <Text style={styles.locationText} numberOfLines={1}> {address}</Text>
                </View>
                <Text style={styles.dateText}>
                  Hôm nay, {new Date().toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' })}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <View style={styles.actionRow}>
          {[
            { label: "Thông báo", icon: "notifications" },
            { label: "Hỏi AI", icon: "chatbubble-ellipses" },
            { label: "Hỗ trợ", icon: "help-buoy" },
            { label: "Chuyến đi", icon: "airplane" }
          ].map((item, index) => (
            <View key={index} style={styles.actionItem}>
              <View style={styles.actionIcon}>
                <Ionicons name={item.icon as any} size={20} color="#007BFF" />
              </View>
              <Text style={styles.actionLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Tìm kiếm chuyến đi tiếp theo</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
          {["Tất cả", "Biển", "Núi", "Thành phố", "Rừng"].map((cat, i) => (
            <TouchableOpacity key={i} style={[styles.categoryBtn, i === 0 && styles.categoryActive]}>
              <Text style={[styles.categoryText, i === 0 && styles.categoryTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Xu hướng hiện nay</Text>
          <TouchableOpacity><Text style={styles.seeAll}>Xem tất cả</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.cardTrending}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4' }} 
              style={styles.cardImage} 
            />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Nghỉ dưỡng Bali</Text>
              <Text style={styles.cardLoc}>Indonesia</Text>
              <View style={styles.priceRow}>
                <Text style={styles.cardPrice}>Từ $450</Text>
                <TouchableOpacity style={styles.arrowBtn}>
                  <Ionicons name="arrow-forward" size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        <Text style={styles.sectionTitle}>Gợi ý cho bạn</Text>
        <View style={styles.recommendCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34' }} 
            style={styles.recommendImg} 
          />
          <View style={styles.recommendInfo}>
            <View>
              <View style={styles.badgeLabel}><Text style={styles.badgeText}>ƯU ĐÃI</Text></View>
              <Text style={styles.recommendTitle}>Khám phá Thung lũng Napa</Text>
              <Text style={styles.recommendPrice}>$320 / người</Text>
            </View>
            <TouchableOpacity style={styles.bookBtn}>
              <Text style={styles.bookText}>Đặt ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { 
    backgroundColor: "#007BFF", 
    padding: 24, 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30, 
    paddingTop: 60 
  },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  welcomeText: { color: "#E0E0E0", fontSize: 14 },
  headerTitle: { color: "white", fontSize: 22, fontWeight: "bold" },
  profileBadge: { backgroundColor: "rgba(255,255,255,0.2)", padding: 8, borderRadius: 12 },
  weatherCard: { 
    backgroundColor: "rgba(255,255,255,0.15)", 
    borderRadius: 20, 
    padding: 16, 
    marginTop: 20, 
    flexDirection: "row", 
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 80
  },
  weatherInfo: { flexDirection: "row", alignItems: "center" },
  tempText: { color: "white", fontSize: 24, fontWeight: "bold" },
  weatherDesc: { color: "white", fontSize: 12 },
  locationInfo: { alignItems: "flex-end", flex: 1, marginLeft: 10 },
  locationText: { color: "white", fontWeight: "bold", fontSize: 13 },
  dateText: { color: "white", fontSize: 10, opacity: 0.8 },
  content: { padding: 20 },
  actionRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 25 },
  actionItem: { alignItems: "center" },
  actionIcon: { 
    backgroundColor: "white", 
    padding: 12, 
    borderRadius: 15, 
    elevation: 3, 
    shadowColor: "#000", 
    shadowOpacity: 0.1, 
    shadowRadius: 5 
  },
  actionLabel: { marginTop: 8, fontSize: 12, color: "#444", fontWeight: "500" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, marginTop: 10, color: "#333" },
  categoryRow: { marginBottom: 20 },
  categoryBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: "#F0F0F0", marginRight: 10 },
  categoryActive: { backgroundColor: "#007BFF" },
  categoryText: { color: "#666", fontWeight: "500" },
  categoryTextActive: { color: "white", fontWeight: "bold" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  seeAll: { color: "#007BFF", fontWeight: "500" },
  cardTrending: { width: 220, height: 280, borderRadius: 25, overflow: "hidden", marginRight: 15 },
  cardImage: { width: "100%", height: "100%", position: "absolute" },
  cardInfo: { position: "absolute", bottom: 0, padding: 15, width: "100%", backgroundColor: "rgba(0,0,0,0.2)" },
  cardTitle: { color: "white", fontWeight: "bold", fontSize: 18 },
  cardLoc: { color: "#EEE", fontSize: 12 },
  priceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 5 },
  cardPrice: { color: "white", fontWeight: "bold", fontSize: 16 },
  arrowBtn: { backgroundColor: "#007BFF", borderRadius: 12, padding: 6 },
  recommendCard: { flexDirection: "row", backgroundColor: "white", padding: 12, borderRadius: 20, elevation: 2 },
  recommendImg: { width: 100, height: 100, borderRadius: 15 },
  recommendInfo: { flex: 1, marginLeft: 15, justifyContent: "space-between" },
  badgeLabel: { backgroundColor: "#E3F2FD", alignSelf: "flex-start", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5, marginBottom: 4 },
  badgeText: { color: "#007BFF", fontSize: 10, fontWeight: "bold" },
  recommendTitle: { fontWeight: "bold", fontSize: 15, color: "#333" },
  recommendPrice: { color: "#666", fontSize: 13, marginTop: 2 },
  bookBtn: { backgroundColor: "#007BFF", paddingVertical: 6, paddingHorizontal: 15, borderRadius: 10, alignSelf: "flex-end" },
  bookText: { color: "white", fontSize: 12, fontWeight: "bold" }
});