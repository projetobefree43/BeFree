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

// Tela de Conquistas - Gamificação e progresso do usuário
export default function Achievements() {
  const router = useRouter();

  // Lista de badges/conquistas alcançáveis (pode vir de um banco de dados)
  const achievements = [
    {
      id: 1,
      icon: "star",
      title: "Primeira Conquista",
      description: "Completou 1 dia",
    },
    { id: 2, icon: "fire", title: "Sequência", description: "7 dias seguidos" },
    {
      id: 3,
      icon: "trophy",
      title: "Campeão",
      description: "30 dias de vitórias",
    },
  ];

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
        <Text style={styles.title}>Conquistas</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Descrição da seção */}
        <Text style={styles.subtitle}>Gamificação & Metas</Text>

        {/* Barra de progresso do usuário */}
        <View style={styles.progressBox}>
          <Text style={styles.progressLabel}>Progresso: 40%</Text>
          <View style={styles.progressBar}>
            {/* Barra preenchida dinamicamente */}
            <View style={[styles.progressFill, { width: "40%" }]} />
          </View>
        </View>

        {/* Lista de conquistas renderizadas dinamicamente */}
        {achievements.map((achievement) => (
          <View key={achievement.id} style={styles.achievementCard}>
            {/* Ícone da conquista em dourado */}
            <MaterialCommunityIcons
              name={achievement.icon}
              size={40}
              color={COLORS.warning}
            />
            {/* Informações da conquista */}
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementDesc}>
                {achievement.description}
              </Text>
            </View>
          </View>
        ))}
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
  // Caixa com barra de progresso
  progressBox: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.xxl,
  },
  progressLabel: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.primaryDark,
    marginBottom: SPACING.md,
  },
  // Barra de progresso visual
  progressBar: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
  },
  // Card individual de conquista
  achievementCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  achievementInfo: {
    marginLeft: SPACING.lg,
    flex: 1,
  },
  achievementTitle: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.primaryDark,
  },
  achievementDesc: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.textGray,
    marginTop: SPACING.sm,
  },
});
