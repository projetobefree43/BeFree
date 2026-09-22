// essa é a tela principal do app (home). aqui o usuário vê:
// - uma saudação com o nome dele
// - o botão SOS grande e pulsante no centro
// - uma frase motivacional
// - os 4 cards de funcionalidades (Rede de Apoio, Relógio, Diário, Conquistas)
// - a barra de navegação embaixo (Início, Buscar, Perfil)

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import { AnimatedScreen } from "../components/animated-screen";
import { MenuCard } from "../components/menu-card";
import { COLORS, FONT_SIZES, SPACING } from "../constants/styles";
import { useLanguage } from "../i18n";
import {
    getCurrentUserId,
    getPrivacySettings,
    getSetting,
    getUserById,
    initDatabase,
} from "../db";

export default function Home() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [userName, setUserName] = useState("");
  const [userPhoto, setUserPhoto] = useState(null);
  const [hideName, setHideName] = useState(false);

  // quando a tela carrega, pega o nome e a foto do usuário do banco
  useEffect(() => {
    const loadUser = async () => {
      try {
        await initDatabase();
        const storedName = await getSetting("currentUserName");
        if (storedName) setUserName(storedName);
        const sessionUserId = await getCurrentUserId();
        if (sessionUserId) {
          const user = await getUserById(sessionUserId);
          if (user?.photo) setUserPhoto(user.photo);
        }
        // verifica se o usuário configurou pra esconder o nome na tela
        const privacy = await getPrivacySettings(sessionUserId);
        setHideName(privacy.hideName);
      } catch (error) {
        console.error("Erro ao carregar nome do usuário:", error);
      }
    };
    loadUser();
  }, []);

  // lista dos 4 cards que aparecem na tela principal
  const cards = [
    {
      id: "3",
      title: "Rede de Apoio",
      titleKey: "supportCardTitle",
      subtitle: "Gestão de contatos",
      subtitleKey: "supportCardSubtitle",
      icon: "account-group-outline",
      route: "/support",
    },
    {
      id: "4",
      title: "Painel do Relógio",
      titleKey: "watchCardTitle",
      subtitle: "BeFree Sync ativo",
      subtitleKey: "watchCardSubtitle",
      icon: "watch-variant",
      route: "/watch",
    },
    {
      id: "5",
      title: "Diário de Gatilhos",
      titleKey: "journalCardTitle",
      subtitle: "Mapeamento Emocional",
      subtitleKey: "journalCardSubtitle",
      icon: "heart-pulse",
      route: "/journal",
    },
    {
      id: "6",
      title: "Conquistas",
      titleKey: "achievementsCardTitle",
      subtitle: "Gamificação & Metas",
      subtitleKey: "achievementsCardSubtitle",
      icon: "trophy-outline",
      route: "/achievements",
    },
  ];

  return (
    <AnimatedScreen>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Saudação ao usuário (mostra o nome ou só "Olá!" se tiver escondido) */}
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <Text style={styles.greeting}>
                {hideName
                  ? `${t("greeting")}! 👋`
                  : t("greetingWithName", { name: userName || "Sophia" })}
              </Text>
              <Text style={styles.subGreeting}>
                {t("subGreeting")}
              </Text>
            </View>
            {/* Seletor de idioma PT/EN */}
            <View style={styles.langToggle}>
              <TouchableOpacity
                style={[styles.langOption, language === "pt" && styles.langOptionActive]}
                onPress={() => setLanguage("pt")}
              >
                <Text
                  style={[styles.langOptionText, language === "pt" && styles.langOptionTextActive]}
                >
                  PT
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.langOption, language === "en" && styles.langOptionActive]}
                onPress={() => setLanguage("en")}
              >
                <Text
                  style={[styles.langOptionText, language === "en" && styles.langOptionTextActive]}
                >
                  EN
                </Text>
              </TouchableOpacity>
            </View>
            {/* Foto de perfil (clica pra ir pro perfil) */}
            <TouchableOpacity
              style={styles.headerPhoto}
              onPress={() => router.push("/profile")}
            >
              {userPhoto ? (
                <Image source={{ uri: userPhoto }} style={styles.headerPhotoImage} />
              ) : (
                <Ionicons name="person" size={28} color={COLORS.white} />
              )}
            </TouchableOpacity>
          </View>

          {/* Botão SOS grande com animação de pulso */}
          <SosButton onPress={() => router.push("/sos")} />

          {/* Banner com frase inspiracional */}
          <View style={styles.banner}>
            <Ionicons
              name="leaf-outline"
              size={24}
              color="#4A6B3E"
              style={styles.bannerIcon}
            />
            <Text style={styles.bannerText}>
              {t("bannerText")}
            </Text>
          </View>

          {/* Grid com os 4 cards de funcionalidades */}
          <View style={styles.grid}>
            {cards.map((card) => (
              <MenuCard
                key={card.id}
                title={t(card.titleKey)}
                subtitle={t(card.subtitleKey)}
                icon={card.icon}
                bgColor={card.bgColor}
                onPress={() => router.push(card.route)}
              />
            ))}
          </View>
        </ScrollView>

        {/* Barra de navegação fixa embaixo */}
        <BottomNav />
      </SafeAreaView>
    </AnimatedScreen>
  );
}

// esse componente é o botão SOS circular que fica pulsando no centro da tela.
// a animação de pulso faz ele crescer e diminuir infinitamente pra chamar atenção
function SosButton({ onPress }) {
  // useSharedValue é tipo uma "variável animada" que o React Native consegue
  // mover suavemente na tela (não é uma variável normal do JavaScript)
  const pulse = useSharedValue(1);
  const { t } = useLanguage();

  useEffect(() => {
    // essa animação faz o valor ir de 1 → 1.15 → 1 infinitas vezes
    // cada ciclo dura 1.8 segundos (900ms pra crescer + 900ms pra diminuir)
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 900 }),
        withTiming(1, { duration: 900 })
      ),
      -1,
      false
    );
  }, [pulse]);

  // aplica a animação no estilo do anel ao redor do botão
  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 0.9 - (pulse.value - 1) * 6,
  }));

  return (
    <View style={styles.sosSection}>
      <Animated.View style={[styles.sosRing, ringStyle]} />
      <TouchableOpacity
        style={styles.sosButton}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <Ionicons name="alert-circle-outline" size={44} color={COLORS.white} />
        <Text style={styles.sosText}>SOS</Text>
        <Text style={styles.sosSubText}>{t("sosSubText")}</Text>
      </TouchableOpacity>
    </View>
  );
}

// barra de navegação inferior (Início, Buscar, Perfil)
function BottomNav() {
  const router = useRouter();
  const { t } = useLanguage();
  return (
    <View style={styles.bottomBar}>
      {[
        { icon: "home", labelKey: "bottomNavHome", route: "/home", active: true },
        { icon: "search-outline", labelKey: "bottomNavSearch", route: "/search" },
        { icon: "person-outline", labelKey: "bottomNavProfile", route: "/profile" },
      ].map((tab, idx) => (
        <TouchableOpacity
          key={idx}
          style={[styles.tabItem, tab.active && styles.tabItemActive]}
          onPress={() => router.push(tab.route)}
        >
          <Ionicons
            name={tab.icon}
            size={22}
            color={tab.active ? "#4A6B3E" : "#888"}
          />
          <Text style={[styles.tabText, tab.active && styles.tabActive]}>
            {t(tab.labelKey)}
          </Text>
          {tab.active && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl + SPACING.xl,
    paddingBottom: 84,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.xs + SPACING.sm,
  },
  headerInfo: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  greeting: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: "bold",
    color: COLORS.primaryDark,
    lineHeight: 34,
  },
  subGreeting: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textDark,
    marginTop: SPACING.md,
    lineHeight: 22,
  },
  headerPhoto: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  headerPhotoImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  langToggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 3,
    marginRight: SPACING.sm,
  },
  langOption: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 9,
  },
  langOptionActive: {
    backgroundColor: COLORS.primary,
  },
  langOptionText: {
    fontSize: FONT_SIZES.small,
    fontWeight: "bold",
    color: COLORS.textGray,
  },
  langOptionTextActive: {
    color: COLORS.white,
  },
  sosSection: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xl,
  },
  sosRing: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(229, 115, 115, 0.35)",
  },
  sosButton: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#E57373",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E57373",
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  sosText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xlarge,
    fontWeight: "bold",
    marginTop: SPACING.xs,
    lineHeight: 28,
  },
  sosSubText: {
    color: "#FFEBEE",
    fontSize: 11,
    lineHeight: 14,
    marginTop: SPACING.xs,
    textAlign: "center",
    paddingHorizontal: SPACING.sm,
    maxWidth: 112,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primaryLight,
    borderRadius: 16,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.xl + SPACING.lg + SPACING.md,
  },
  bannerIcon: {
    marginRight: SPACING.lg,
  },
  bannerText: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.primaryDark,
    fontWeight: "600",
    flex: 1,
    lineHeight: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    columnGap: SPACING.md,
    rowGap: SPACING.md,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    paddingVertical: SPACING.sm,
    paddingBottom: SPACING.xl,
  },
  tabItem: {
    alignItems: "center",
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  tabItemActive: {
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
  },
  tabIndicator: {
    marginTop: SPACING.xs,
    width: 10,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.primaryDark,
  },
  tabText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textGray,
    marginTop: SPACING.xs,
  },
  tabActive: {
    color: COLORS.primaryDark,
    fontWeight: "700",
  },
});
