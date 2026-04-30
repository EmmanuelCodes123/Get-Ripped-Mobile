import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInUp, SlideInDown } from "react-native-reanimated";
import Colors from "../constants/Colors";

const { width, height } = Dimensions.get("window");

const GettingStarted = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background Image from your assets folder */}
      <ImageBackground
        source={require("../assets/images/geting-started.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Dark Gradient Overlay for that "Premium Dark" feel */}
        <LinearGradient
          colors={["transparent", "rgba(3,3,2,0.8)", Colors.background]}
          style={styles.gradient}
        >
          <View style={styles.contentContainer}>
            {/* Massive, bold typography as per the brief */}
            <Animated.View
              entering={FadeInUp.duration(1000).delay(300)}
              style={styles.textGroup}
            >
              <Text style={styles.title}>
                PRECISION{"\n"}
                <Text style={{ color: Colors.primaryGreen }}>TRAINING</Text>
              </Text>

              <Text style={styles.subtitle}>
                Build complex routines. Execute with a distraction-free engine.
                Crush your calisthenics goals.
              </Text>
            </Animated.View>

            {/* Primary Action Button - Aggressive Green */}
            <Animated.View
              entering={SlideInDown.duration(800).springify()} // Springify adds that "premium" bounce
            >
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.button,
                  { backgroundColor: Colors.primaryGreen },
                ]}
                onPress={() => router.push("/auth/login")}
              >
                <Text style={styles.buttonText}>GET STARTED</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backgroundImage: {
    width: width,
    height: height,
    position: "absolute", // Forces the image to ignore padding of parents
    top: 0,
    left: 0,
  },
  gradient: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  contentContainer: {
    width: "100%",
  },
  textGroup: {
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: "900", // Massive, ultra-bold font
    color: Colors.textPrimary,
    lineHeight: 52,
    letterSpacing: -1,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 16,
    lineHeight: 24,
    maxWidth: "90%",
  },
  button: {
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primaryGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: Colors.background, // Contrast against the bright green
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 1,
  },
});

export default GettingStarted;
