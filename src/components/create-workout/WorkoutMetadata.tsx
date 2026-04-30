import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../../constants/Colors";

interface Props {
  name: string;
  setName: (val: string) => void;
  rounds: string;
  setRounds: (val: string) => void;
  selectedCategories: string[];
  toggleCategory: (cat: string) => void;
}

const categoriesList = [
  "Arms",
  "Legs",
  "Core",
  "Chest",
  "Back",
  "Full Body",
  "Cardio",
];

export const WorkoutMetadata = ({
  name,
  setName,
  rounds,
  setRounds,
  selectedCategories,
  toggleCategory,
}: Props) => (
  <View style={styles.container}>
    <Text style={styles.label}>ROUTINE NAME</Text>
    <TextInput
      placeholder="e.g. Upper Body Burn"
      placeholderTextColor={Colors.textMuted}
      style={styles.input}
      value={name}
      onChangeText={setName}
      autoCorrect={false}
    />

    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>CIRCUIT ROUNDS</Text>
        <TextInput
          keyboardType="numeric"
          style={styles.numberInput}
          value={rounds}
          onChangeText={setRounds}
          placeholder="1"
          placeholderTextColor={Colors.textMuted}
        />
      </View>

      <View style={{ flex: 2.5, marginLeft: 16 }}>
        <Text style={styles.label}>CATEGORIES (Multi-select)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categoriesList.map((cat) => {
            const isSelected = selectedCategories.includes(cat);
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => toggleCategory(cat)}
                style={[styles.catPill, isSelected && styles.activePill]}
                activeOpacity={0.7}
              >
                <Text style={[styles.catText, isSelected && styles.activeText]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { paddingVertical: 10 },
  label: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: "900",
    marginBottom: 10,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: Colors.cardBackground,
    height: 60,
    borderRadius: 14,
    paddingHorizontal: 16,
    color: Colors.textPrimary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.subtleGreen,
  },
  row: { flexDirection: "row", marginTop: 20, alignItems: "flex-end" },
  numberInput: {
    backgroundColor: Colors.cardBackground,
    height: 60,
    borderRadius: 14,
    color: Colors.primaryGreen,
    textAlign: "center",
    fontWeight: "900",
    fontSize: 18,
    borderWidth: 1,
    borderColor: Colors.subtleGreen,
  },
  catPill: {
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 14,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  activePill: {
    backgroundColor: Colors.darkGreen,
    borderColor: Colors.primaryGreen,
  },
  catText: { color: Colors.textSecondary, fontWeight: "700" },
  activeText: { color: Colors.primaryGreen },
});
