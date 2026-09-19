// esse componente é um "envelope" pra qualquer tela. ele faz a tela
// aparecer suavemente (fade-in = vai ficando visível aos poucos)
// e subindo de baixo pra cima (slide-up). é usado em quase todas as telas.

import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

interface AnimatedScreenProps {
  children: React.ReactNode;
  style?: any;
}

export function AnimatedScreen({ children, style }: AnimatedScreenProps) {
  const fadeAnim = useSharedValue(0); // começa invisível (0)
  const slideAnim = useSharedValue(30); // começa 30 unidades mais pra baixo

  useEffect(() => {
    // quando a tela monta (aparece), anima:
    // - opacity: vai de 0 (invisível) pra 1 (totalmente visível)
    // - posição: vai de 30 pra 0 (sobe até o lugar certo)
    // tudo em 400 milissegundos (menos de meio segundo)
    fadeAnim.value = withTiming(1, { duration: 400 });
    slideAnim.value = withTiming(0, { duration: 400 });
  }, [fadeAnim, slideAnim]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  return (
    <Animated.View style={[styles.flex, animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
