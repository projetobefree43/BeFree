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

// Tela do Relógio - Controla sincronização com dispositivo wearable
export default function Watch() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Botão para voltar */}
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={COLORS.primaryDark}
          style={styles.backBtn}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Ícone grande do relógio */}
        <Ionicons name="watch" size={80} color={COLORS.primary} />
        <Text style={styles.title}>Painel do Relógio</Text>
        <Text style={styles.subtitle}>BeFree Sync ativo</Text>

        {/* Caixa de status da conexão */}
        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>Status da conexão:</Text>
          <Text style={styles.statusValue}>🟢 Conectado</Text>
        </View>

        {/* Caixa de informações sobre sincronização */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Seu relógio inteligente está sincronizado com o BeFree. Receba
            notificações em tempo real!
          </Text>
        </View>

        {/* Botão para abrir configurações */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Abrir Configurações</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    color: COLORS.primaryDark,
    marginTop: SPACING.lg,
  },
  subtitle: {
    fontSize: FONT_SIZES.large,
    color: COLORS.textGray,
    marginBottom: SPACING.xxl,
  },
  statusBox: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    width: "100%",
  },
  statusLabel: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.textGray,
    marginBottom: SPACING.md,
  },
  statusValue: {
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS.primaryDark,
  },
  infoBox: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.xxl,
  },
  infoText: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.primaryDark,
    lineHeight: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: SPACING.xxxl,
    borderRadius: 8,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
  },
});
