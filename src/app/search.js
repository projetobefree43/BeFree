import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS, FONT_SIZES, SPACING } from "../constants/styles";

// Tela de Busca - Permite pesquisar conteúdo na app
export default function Search() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Barra de navegação com título */}
      <View style={styles.header}>
        {/* Botão para voltar */}
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={COLORS.primaryDark}
            style={styles.backButton}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Buscar</Text>
      </View>

      {/* Área de conteúdo com buscador */}
      <View style={styles.content}>
        {/* Caixa de entrada para busca */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={COLORS.textGray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar na aplicação..."
            placeholderTextColor={COLORS.textGray}
          />
        </View>

        {/* Estado vazio quando nenhuma busca foi feita */}
        <View style={styles.emptyState}>
          <Ionicons name="search" size={80} color="#DDD" />
          <Text style={styles.emptyText}>Comece a digitar para buscar</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
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
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    marginBottom: SPACING.xxl,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    marginTop: 16,
  },
});
