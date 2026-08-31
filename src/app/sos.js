import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS, FONT_SIZES, SPACING } from "../constants/styles";

// Tela de Emergência - Ativa o sistema SOS/Pânico
export default function SOS() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Botão para voltar à tela anterior */}
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={COLORS.white}
          style={styles.backBtn}
        />
      </TouchableOpacity>

      {/* Conteúdo centralizado da tela SOS */}
      <View style={styles.content}>
        {/* Ícone de alerta */}
        <Ionicons name="alert-circle" size={80} color={COLORS.white} />

        {/* Título e descrição */}
        <Text style={styles.title}>Botão SOS / Pânico</Text>
        <Text style={styles.subtitle}>Intervenção imediata</Text>
        <Text style={styles.description}>
          Clique no botão para ativar o sistema de emergência.
        </Text>

        {/* Botão de emergência em destaque */}
        <TouchableOpacity style={styles.sosButton}>
          <Text style={styles.sosButtonText}>ATIVAR SOS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.danger, // Fundo vermelho de alerta
  },
  backBtn: {
    padding: SPACING.lg,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.xxxl,
  },
  title: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: "bold",
    color: COLORS.white,
    marginTop: SPACING.lg,
  },
  subtitle: {
    fontSize: FONT_SIZES.large,
    color: COLORS.dangerLight,
    marginBottom: SPACING.lg,
  },
  description: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.white,
    textAlign: "center",
    marginBottom: SPACING.xxl,
  },
  sosButton: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxxl,
    borderRadius: 12,
  },
  sosButtonText: {
    color: COLORS.danger,
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    textAlign: "center",
  },
});
