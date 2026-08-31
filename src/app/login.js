import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, FONT_SIZES, SPACING } from "../constants/styles";

// Tela de Login - Autenticação de usuário
export default function Login() {
  const router = useRouter();
  // Estado para o checkbox "Lembrar de mim"
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Botão de voltar */}
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={COLORS.primaryDark}
          style={styles.backButton}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Títulos de boas-vindas */}
        <Text style={styles.title}>Entrar</Text>
        <Text style={styles.subtitle}>Bom te ter de volta!</Text>

        {/* Campo de Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu email"
            placeholderTextColor={COLORS.textGray}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Campo de Senha */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor={COLORS.textGray}
            secureTextEntry
          />
        </View>

        {/* Opções: Lembrar de mim e Esqueceu a senha? */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <Ionicons
              name={rememberMe ? "checkbox" : "square-outline"}
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.checkboxLabel}>Lembrar de mim</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        </View>

        {/* Botão de login */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/home")}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        {/* Divisor "OU" com linha */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Ou</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Login com redes sociais */}
        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="google" size={24} color="#EA4335" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="facebook" size={24} color="#1877F2" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="apple" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Link para criação de conta */}
        <TouchableOpacity
          style={styles.footerLink}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.footerText}>
            Não tem uma conta? <Text style={styles.footerTextBold}>Criar</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Container e background
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.xxxl,
    paddingVertical: SPACING.xxl,
  },
  // Botão de voltar
  backButton: {
    marginBottom: SPACING.xxl,
    paddingHorizontal: SPACING.md,
  },
  // Área de conteúdo
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: SPACING.md,
  },
  // Título da página
  title: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: "bold",
    color: COLORS.primaryDark,
    marginBottom: SPACING.md,
  },
  // Subtítulo descritivo
  subtitle: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textGray,
    marginBottom: SPACING.xxxl,
  },
  // Grupo de input (label + campo)
  inputGroup: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: FONT_SIZES.normal,
    fontWeight: "bold",
    color: COLORS.primaryDark,
    marginBottom: SPACING.md,
  },
  // Campo de texto
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    fontSize: FONT_SIZES.normal,
    borderWidth: 1,
    borderColor: "#DDD",
    color: COLORS.primaryDark,
  },
  // Opções de lembrar e esqueceu senha
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xxl,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxLabel: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.primary,
    marginLeft: SPACING.sm,
  },
  forgotPassword: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
  // Botão principal de login
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    paddingVertical: SPACING.lg,
    alignItems: "center",
    marginBottom: SPACING.xxl,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
  },
  // Divisor com texto "Ou"
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xxl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#DDD",
  },
  dividerText: {
    marginHorizontal: SPACING.md,
    color: COLORS.textGray,
    fontSize: FONT_SIZES.normal,
  },
  // Botões de redes sociais
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: SPACING.lg,
    marginBottom: SPACING.xxl,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDD",
  },
  // Link de footer para criar conta
  footerLink: {
    alignItems: "center",
  },
  footerText: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.textGray,
  },
  footerTextBold: {
    fontWeight: "bold",
    color: COLORS.primaryDark,
  },
});
