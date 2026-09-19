// esse componente é um botão que tem uma animação de "esmagar" quando clica.
// quando o usuário pressiona, o botão fica um pouco menor (escala 0.92),
// e quando solta, ele volta ao tamanho normal. isso dá uma sensação de toque.

import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { COLORS, FONT_SIZES, SPACING } from "../constants/styles";

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function AnimatedButton({
  title,
  onPress,
  style,
  textStyle,
}: AnimatedButtonProps) {
  // useSharedValue guarda o valor da escala atual (1 = tamanho normal)
  const scale = useSharedValue(1);

  // aplica a animação de escala no estilo do botão
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={() => {
        // quando aperta, diminui pra 0.92 com animação suave (spring)
        scale.set(withSpring(0.92));
      }}
      onPressOut={() => {
        // quando solta, volta pro tamanho normal
        scale.set(withSpring(1));
      }}
      activeOpacity={1}
    >
      <Animated.View style={[styles.base, style, animatedStyle]}>
        <Text style={[styles.baseText, textStyle]}>{title}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl,
    alignItems: "center",
    justifyContent: "center",
  },
  baseText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    textAlign: "center",
  },
});
