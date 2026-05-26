import { Pressable, StyleSheet, Text } from "react-native";

export function FilterButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.filterButton, active && styles.filterButtonActive]} onPress={onPress}>
      <Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#c9ccd6",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  filterButtonActive: {
    backgroundColor: "#244c8f",
    borderColor: "#244c8f",
  },
  filterText: {
    color: "#333",
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#fff",
  },
});
