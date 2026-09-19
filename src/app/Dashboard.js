// esse é o Dashboard, que é praticamente uma cópia da tela home.
// ele tem as mesmas funcionalidades: saudação, botão SOS, banner,
// cards de funcionalidades e barra de navegação.
// serve como uma rota alternativa pra tela principal.

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
import {
  getCurrentUserId,
  getPrivacySettings,
  getSetting,
  getUserById,
  initDatabase,
} from "../db";

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userPhoto, setUserPhoto] = useState(null);
  const [hideName, setHideName] = useState(false);

  // carrega os dados do usuário logado quando a tela aparece
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
        const privacy = await getPrivacySettings(sessionUserId);
        setHideName(privacy.hideName);
      } catch (error) {
        console.error("Erro ao carregar nome do usuário:", error);
      }
    };
    loadUser();
  }, []);

  // lista dos 4 cards de funcionalidades
  const cards = [
    {
      id: "3",
      title: "Rede de Apoio",
      subtitle: "Gestão de contatos",
      icon: "account-group-outline",
      route: "/support",
    },
    {
      id: "4",
      title: "Painel do Relógio",
      subtitle: "BeFree Sync ativo",
      icon: "watch-variant",
      route: "/watch",
    },
    {
      id: "5",
      title: "Diário de Gatilhos",
      subtitle: "Mapeamento Emocional",
      icon: "heart-pulse",
      route: "/journal",
    },
    {
      id: "6",
      title: "Conquistas",
      subtitle: "Gamificação & Metas",
      icon: "trophy-outline",
      route: "/achievements",
    },
  ];

  return (
    <AnimatedScreen>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Saudação ao usuário */}
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <Text style={styles.greeting}>
                {hideName ? "Olá! 👋" : `Olá, ${userName || "Sophia"}! 👋`}
              </Text>
              <Text style={styles.subGreeting}>
                Pronta para mais um dia de escolhas livres?
              </Text>
            </View>
            <TouchableOpacity
              style={styles.headerPhoto}
              onPress={() => router.push("/profile")}
            >
              {userPhoto ? (
                <Image source={{ uri: userPhoto }} style={styles.headerPhotoImage} />
              ) : (
                <Ionicons name="person" size={24} color={COLORS.white} />
              )}
            </TouchableOpacity>
          </View>

          {/* Botão SOS */}
          <SosButton onPress={() => router.push("/sos")} />

          {/* Banner inspiracional */}
          <View style={styles.banner}>
            <Ionicons
              name="leaf-outline"
              size={24}
              color="#4A6B3E"
              style={styles.bannerIcon}
            />
            <Text style={styles.bannerText}>
              {"\u201CCada escolha certa te aproxima da sua melhor versão.\u201D"}
            </Text>
          </View>

          {/* Grid com cards */}
          <View style={styles.grid}>
            {cards.map((card) => (
              <MenuCard
                key={card.id}
                title={card.title}
                subtitle={card.subtitle}
                icon={card.icon}
                bgColor={card.bgColor}
                onPress={() => router.push(card.route)}
              />
            ))}
          </View>
        </ScrollView>

        <BottomNav />
      </SafeAreaView>
    </AnimatedScreen>
  );
}

// botão SOS com animação de pulso (mesmo conceito do home.js)
function SosButton({ onPress }) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 900 }),
        withTiming(1, { duration: 900 })
      ),
      -1,
      false
    );
  }, [pulse]);

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
        <Ionicons name="alert-circle-outline" size={56} color={COLORS.white} />
        <Text style={styles.sosText}>SOS</Text>
        <Text style={styles.sosSubText}>Pressione em emergência</Text>
      </TouchableOpacity>
    </View>
  );
}

// barra de navegação inferior
function BottomNav() {
  const router = useRouter();
  return (
    <View style={styles.bottomBar}>
      {[
        { icon: "home", label: "Início", route: "/home", active: true },
        { icon: "search-outline", label: "Buscar", route: "/search" },
        { icon: "person-outline", label: "Perfil", route: "/profile" },
      ].map((tab, idx) => (
        <TouchableOpacity
          key={idx}
          style={styles.tabItem}
          onPress={() => router.push(tab.route)}
        >
          <Ionicons
            name={tab.icon}
            size={22}
            color={tab.active ? "#4A6B3E" : "#888"}
          />
          <Text style={[styles.tabText, tab.active && styles.tabActive]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl,
    paddingBottom: 96,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.xxl,
  },
  headerInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  greeting: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: "bold",
    color: COLORS.primaryDark,
    lineHeight: 32,
  },
  subGreeting: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.primaryDark,
    marginTop: SPACING.sm,
    lineHeight: 22,
  },
  headerPhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
  sosSection: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xxxl,
  },
  sosRing: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "rgba(229, 115, 115, 0.35)",
  },
  sosButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#E57373",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E57373",
    shadowOpacity: 0.5,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  sosText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: "bold",
    marginTop: SPACING.sm,
    lineHeight: 32,
  },
  sosSubText: {
    color: "#FFEBEE",
    fontSize: FONT_SIZES.small,
    marginTop: SPACING.xs,
  },
  banner: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 16,
    padding: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xxl,
  },
  bannerIcon: {
    marginRight: SPACING.lg,
  },
  bannerText: {
    flex: 1,
    fontSize: FONT_SIZES.normal,
    color: COLORS.primaryDark,
    fontStyle: "italic",
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
    paddingVertical: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  tabItem: {
    alignItems: "center",
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  tabText: {
    fontSize: FONT_SIZES.small,
    color: "#888",
    marginTop: SPACING.sm,
  },
  tabActive: {
    color: COLORS.primaryDark,
    fontWeight: "600",
  },
});
