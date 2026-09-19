// esse componente é o cabeçalho padrão das telas.
// ele tem um botão de voltar (seta pra esquerda) e o título da tela.
// em vez de cada tela criar o próprio cabeçalho, todas usam esse.

import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, FONT_SIZES, SPACING } from "../constants/styles";

interface ScreenHeaderProps {
  title: string;
  onBackPress: () => void;
}

export function ScreenHeader({ title, onBackPress }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBackPress}>
        <Ionicons name="arrow-back" size={24} color={COLORS.primaryDark} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.white,
    gap: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: "bold",
    color: COLORS.primaryDark,
  },
});
