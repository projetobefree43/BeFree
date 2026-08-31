import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS, FONT_SIZES, SPACING } from "../constants/styles";

// Tela de Diário - Registra gatilhos emocionais e respostas
export default function Journal() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header com botão de voltar e título */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={COLORS.primaryDark}
            style={styles.backButton}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Diário de Gatilhos</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Descrição da seção */}
        <Text style={styles.subtitle}>Mapeamento Emocional</Text>

        {/* Card de entrada do diário */}
        <View style={styles.entryCard}>
          {/* Header com data e ícone de emoção */}
          <View style={styles.entryHeader}>
            <Text style={styles.entryDate}>Hoje</Text>
            <MaterialCommunityIcons
              name="heart-pulse"
              size={20}
              color={COLORS.danger}
            />
          </View>
          {/* Dados do registro emocional */}
          <Text style={styles.entryTrigger}>Gatilho: Discussão com colega</Text>
          <Text style={styles.entryEmotion}>Emoção: Raiva/Frustração</Text>
          <Text style={styles.entryResponse}>
            Resposta: Respirei fundo e pedi para conversar depois
          </Text>
        </View>

        {/* Botão para adicionar novo registro */}
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color={COLORS.white} />
          <Text style={styles.addButtonText}>Novo Registro</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Fundo e layout principal
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Header com título
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
  },
  backButton: {
    marginRight: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: "bold",
    color: COLORS.primaryDark,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  subtitle: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textGray,
    marginBottom: SPACING.xl,
  },
  // Card individual de entrada do diário
  entryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  entryDate: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.primaryDark,
  },
  entryTrigger: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.primaryDark,
    marginBottom: SPACING.md,
  },
  entryEmotion: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.danger,
    fontWeight: "600",
    marginBottom: SPACING.md,
  },
  entryResponse: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.primary,
  },
  // Botão para adicionar novo registro
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.lg,
    marginTop: SPACING.lg,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    marginLeft: SPACING.md,
  },
});
