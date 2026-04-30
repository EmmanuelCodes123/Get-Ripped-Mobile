import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";

export const PremadeWorkouts = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Premade Workouts</Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
    >
      {[1, 2].map((item) => (
        <View key={item} style={styles.card}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
            }}
            style={styles.img}
          />
          <View style={styles.overlay}>
            <Text style={styles.name}>Extreme Core</Text>
            <Text style={styles.meta}>⏱ 20 min</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: 30 },
  title: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: "800",
    marginLeft: 24,
    marginBottom: 15,
  },
  scroll: { paddingLeft: 24 },
  card: {
    width: 160,
    height: 160,
    borderRadius: 30,
    overflow: "hidden",
    marginRight: 16,
  },
  img: { width: "100%", height: "100%" },
  overlay: { position: "absolute", bottom: 15, left: 15 },
  name: { color: "#FFF", fontWeight: "800" },
  meta: { color: "#FFF", fontSize: 10, opacity: 0.8 },
});
