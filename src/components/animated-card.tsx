// esse componente é um cartão que "encolhe" quando o usuário clica.
// é a base dos cards clicáveis do app (usado dentro do menu-card).
// ele apenas cuida da animação de apertar; o conteúdo vem por fora.

import React from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

interface AnimatedCardProps {
  style?: ViewStyle | any;
  onPress?: () => void;
  children: React.ReactNode;
}

export function AnimatedCard({ style, onPress, children }: AnimatedCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={() => {
        scale.set(withSpring(0.95));
      }}
      onPressOut={() => {
        scale.set(withSpring(1));
      }}
      activeOpacity={1}
      style={style}
    >
      <Animated.View style={[styles.fill, animatedStyle]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
  },
});
