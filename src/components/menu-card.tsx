// esse componente é um cartão de menu que aparece na tela principal (home).
// ele mostra um ícone, um título e uma descrição, e tem uma animação
// de encolher quando o usuário clica (pra mostrar que é clicável).

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, ViewStyle } from "react-native";
import { COLORS, FONT_SIZES, SPACING } from "../constants/styles";
import { AnimatedCard } from "./animated-card";
import type { ComponentProps } from "react";

type MaterialIconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

interface MenuCardProps {
  title: string;
  subtitle: string;
  icon: MaterialIconName;
  bgColor?: string;
  textColor?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function MenuCard({
  title,
  subtitle,
  icon,
  bgColor = COLORS.white,
  textColor = COLORS.primaryDark,
  onPress,
  style,
}: MenuCardProps) {
  // se o fundo for vermelho (botão de perigo), as cores de texto mudam
  const iconColor = bgColor === "#E57373" ? "#FFFFFF" : "#4A6B3E";
  const subtitleColor = bgColor === "#E57373" ? "#FFEBEE" : "#4E7A42";

  return (
    <AnimatedCard
      onPress={onPress}
      style={[styles.card, { backgroundColor: bgColor }, style]}
    >
      <MaterialCommunityIcons
        name={icon}
        size={28}
        color={iconColor}
        style={styles.icon}
      />
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: subtitleColor }]}>
        {subtitle}
      </Text>
    </AnimatedCard>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    borderRadius: 16,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 132,
  },
  icon: {
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  subtitle: {
    fontSize: FONT_SIZES.normal,
    textAlign: "center",
    lineHeight: 18,
  },
});
