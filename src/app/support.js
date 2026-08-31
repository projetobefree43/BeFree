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

// Tela de Rede de Apoio - Gerencia contatos de emergência
export default function Support() {
  const router = useRouter();

  // Lista de contatos de apoio (pode vir de um banco de dados)
  const contacts = [
    { id: 1, name: "Mãe", phone: "(11) 98765-4321" },
    { id: 2, name: "Melhor Amiga", phone: "(21) 99876-5432" },
    { id: 3, name: "Terapeuta", phone: "(11) 3456-7890" },
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
        <Text style={styles.title}>Rede de Apoio</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Descrição da seção */}
        <Text style={styles.subtitle}>Gestão de contatos</Text>

        {/* Lista de contatos renderizada dinamicamente */}
        {contacts.map((contact) => (
          <View key={contact.id} style={styles.contactCard}>
            {/* Ícone de usuário */}
            <MaterialCommunityIcons
              name="account"
              size={40}
              color={COLORS.primary}
            />
            {/* Dados do contato */}
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactPhone}>{contact.phone}</Text>
            </View>
          </View>
        ))}

        {/* Botão para adicionar novo contato */}
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color={COLORS.white} />
          <Text style={styles.addButtonText}>Adicionar Contato</Text>
        </TouchableOpacity>
      </ScrollView>
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
  subtitle: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textGray,
    marginBottom: SPACING.xl,
  },
  // Card de contato individual
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  contactInfo: {
    marginLeft: SPACING.lg,
    flex: 1,
  },
  contactName: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.primaryDark,
  },
  contactPhone: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.textGray,
    marginTop: SPACING.sm,
  },
  // Botão para adicionar contato
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
