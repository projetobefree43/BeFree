// esse componente é uma caixinha de informação usada na tela de Perfil.
// ela mostra um rótulo (ex: "Membro desde:") e um valor (ex: "Janeiro 2024")
// lado a lado.

import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, SPACING } from "../constants/styles";

interface InfoBoxProps {
  label: string;
  value: string;
}

export function InfoBox({ label, value }: InfoBoxProps) {
  return (
    <View style={styles.box}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.textGray,
  },
  value: {
    fontSize: FONT_SIZES.normal,
    fontWeight: "bold",
    color: COLORS.primaryDark,
  },
});
