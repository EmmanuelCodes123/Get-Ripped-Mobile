import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "../components/dashboard/Calendar";
import { CategoryList } from "../components/dashboard/CategoryList";
import { Footer } from "../components/dashboard/Footer";
import { Header } from "../components/dashboard/Header";
import { PremadeWorkouts } from "../components/dashboard/PremadeWorkouts";
import { UserWorkouts } from "../components/dashboard/UserWorkouts";
import Colors from "../constants/Colors";

const Dashboard = () => {
  // We use a single-item array to wrap the scrollable middle sections
  const dashboardData = [{ id: "scrollable-content" }];

  const renderScrollableBody = () => (
    <View style={styles.scrollableContent}>
      <Calendar />
      <CategoryList />
      <PremadeWorkouts />
      <UserWorkouts />
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.darkGreen, Colors.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.4, y: 0.4 }}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER: Outside the list = STUCK to top */}
        <Header />

        <FlatList
          data={dashboardData}
          keyExtractor={(item) => item.id}
          renderItem={renderScrollableBody}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listPadding}
        />

        {/* FOOTER: Outside the list = STUCK to bottom */}
        <Footer />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollableContent: {
    paddingBottom: 20, // Space between last component and Footer
  },
  listPadding: {
    paddingBottom: 20,
  },
});

export default Dashboard;
