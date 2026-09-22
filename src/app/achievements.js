// essa é a tela de Conquistas. aqui o usuário vê seu progresso
// e as metas que pode alcançar usando o app (tipo "7 dias seguidos",
// "30 dias de vitórias"). é uma forma de gamificação pra motivar.

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { AnimatedScreen } from "../components/animated-screen";
import { ScreenHeader } from "../components/screen-header";
import { COLORS, FONT_SIZES, SPACING } from "../constants/styles";
import { useLanguage } from "../i18n";

export default function Achievements() {
  const router = useRouter();
  const { t } = useLanguage();

  // lista de conquistas que o usuário pode desbloquear
  const achievements = [
    {
      id: 1,
      icon: "star",
      title: "Primeira Conquista",
      titleKey: "firstAchievementTitle",
      description: "Completou 1 dia",
      descriptionKey: "firstAchievementDesc",
    },
    {
      id: 2,
      icon: "fire",
      title: "Sequência",
      titleKey: "streakAchievementTitle",
      description: "7 dias seguidos",
      descriptionKey: "streakAchievementDesc",
    },
    {
      id: 3,
      icon: "trophy",
      title: "Campeão",
      titleKey: "championAchievementTitle",
      description: "30 dias de vitórias",
      descriptionKey: "championAchievementDesc",
    },
  ];

  return (
    <AnimatedScreen>
      <SafeAreaView style={styles.container}>
        <ScreenHeader title={t("achievementsTitle")} onBackPress={() => router.back()} />

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.subtitle}>{t("achievementsSubtitle")}</Text>

          {/* barra de progresso (estática por enquanto) */}
          <View style={styles.progressBox}>
            <Text style={styles.progressLabel}>{t("progressLabel")}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: "40%" }]} />
            </View>
          </View>

          {/* lista de conquistas */}
          {achievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementCard}>
              <MaterialCommunityIcons
                name={achievement.icon}
                size={40}
                color={COLORS.warning}
              />
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{t(achievement.titleKey)}</Text>
                <Text style={styles.achievementDesc}>
                  {t(achievement.descriptionKey)}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  subtitle: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textGray,
    marginBottom: SPACING.xl,
  },
  progressBox: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.xxl,
  },
  progressLabel: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.primaryDark,
    marginBottom: SPACING.md,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.success,
  },
  achievementCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 16,
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
