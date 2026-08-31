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

// Tela Principal (Dashboard) - Hub central de acesso a todas as funcionalidades
export default function Home() {
  const router = useRouter();

  // Array de cards com as principais funcionalidades do app
  const cards = [
    {
      id: "1",
      title: "Economia & Metas",
      subtitle: "Conscientização Financeira",
      icon: "piggy-bank-outline",
      route: "/economy",
      color: "#FFFFFF",
      textColor: "#1C3113",
    },
    {
      id: "2",
      title: "Botão SOS / Pânico",
      subtitle: "Intervenção imediata",
      icon: "alert-circle-outline",
      route: "/sos",
      color: "#E57373",
      textColor: "#FFFFFF",
    },
    {
      id: "3",
      title: "Rede de Apoio",
      subtitle: "Gestão de contatos",
      icon: "account-group-outline",
      route: "/support",
      color: "#FFFFFF",
      textColor: "#1C3113",
    },
    {
      id: "4",
      title: "Painel do Relógio",
      subtitle: "BeFree Sync ativo",
      icon: "watch-variant",
      route: "/watch",
      color: "#FFFFFF",
      textColor: "#1C3113",
    },
    {
      id: "5",
      title: "Diário de Gatilhos",
      subtitle: "Mapeamento Emocional",
      icon: "heart-pulse",
      route: "/journal",
      color: "#FFFFFF",
      textColor: "#1C3113",
    },
    {
      id: "6",
      title: "Conquistas",
      subtitle: "Gamificação & Metas",
      icon: "trophy-outline",
      route: "/achievements",
      color: "#FFFFFF",
      textColor: "#1C3113",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, Ana! 👋</Text>
            <Text style={styles.subGreeting}>
              Pronta para mais um dia de escolhas livres?
            </Text>
          </View>
        </View>

        <View style={styles.banner}>
          <Ionicons
            name="leaf-outline"
            size={24}
            color="#4A6B3E"
            style={styles.bannerIcon}
          />
          <Text style={styles.bannerText}>
            "Cada escolha certa te aproxima da sua melhor versão."
          </Text>
        </View>

        <View style={styles.gridContainer}>
          {cards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[styles.card, { backgroundColor: card.color }]}
              onPress={() => router.push(card.route)}
            >
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons
                  name={card.icon}
                  size={28}
                  color={card.color === "#E57373" ? "#FFFFFF" : "#4A6B3E"}
                />
              </View>
              <Text style={[styles.cardTitle, { color: card.textColor }]}>
                {card.title}
              </Text>
              <Text
                style={[
                  styles.cardSubtitle,
                  { color: card.color === "#E57373" ? "#FFEBEE" : "#6B8E59" },
                ]}
              >
                {card.subtitle}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Navegação Inferior */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push("/home")}
        >
          <Ionicons name="home" size={22} color="#4A6B3E" />
          <Text style={[styles.tabText, styles.tabActive]}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push("/search")}
        >
          <Ionicons name="search-outline" size={22} color="#888" />
          <Text style={styles.tabText}>Buscar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push("/profile")}
        >
          <Ionicons name="person-outline" size={22} color="#888" />
          <Text style={styles.tabText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Fundo e layout principal
  container: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  // Seção de boas-vindas
  header: {
    marginBottom: SPACING.xxl,
  },
  greeting: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: "bold",
    color: COLORS.primaryDark,
  },
  subGreeting: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textDark,
    marginTop: SPACING.md,
  },
  // Banner inspiracional
  banner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  bannerIcon: {
    marginRight: SPACING.md,
  },
  bannerText: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.primaryDark,
    fontWeight: "600",
    flex: 1,
  },
  // Grid de cards
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 80,
  },
  // Card individual de funcionalidade
  card: {
    width: "48%",
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  cardHeader: {
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: FONT_SIZES.normal,
    fontWeight: "bold",
    marginBottom: SPACING.md,
  },
  cardSubtitle: {
    fontSize: FONT_SIZES.small,
  },
  // Barra de navegação inferior fixa
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
  },
  tabItem: {
    alignItems: "center",
  },
  tabText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textGray,
    marginTop: SPACING.sm,
  },
  tabActive: {
    color: COLORS.primaryDark,
    fontWeight: "600",
  },
});
