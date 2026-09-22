// essa é a tela de login. aqui o usuário digita email e senha pra entrar
// na conta dele. se os dados estiverem certos, o app salva o id do usuário
// e manda pra tela principal (home).

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { AnimatedButton } from "../components/animated-button";
import { AnimatedScreen } from "../components/animated-screen";
import { COLORS, FONT_SIZES, SPACING } from "../constants/styles";
import { getUserByEmail, initDatabase, setSetting } from "../db";
import { useLanguage } from "../i18n";

export default function Login() {
  const router = useRouter();
  const { t } = useLanguage();

  // "useState" é como o React guarda dados que podem mudar na tela.
  // aqui a gente guarda o email, a senha, e se o usuário quer ser lembrado
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // essa função roda quando o usuário clica no botão "Entrar"
  const handleLogin = async () => {
    const emailValue = email.trim().toLowerCase();

    // verifica se os campos foram preenchidos
    if (!emailValue || !password) {
      Alert.alert(
        t("requiredFields"),
        t("requiredFieldsLoginMessage")
      );
      return;
    }

    try {
      await initDatabase();

      // procura o usuário no banco pelo email
      const user = await getUserByEmail(emailValue);
      if (!user) {
        Alert.alert(
          t("accountNotFound"),
          t("accountNotFoundMessage")
        );
        return;
      }

      // verifica se a senha bate com a que tá no banco
      if (user.password !== password) {
        Alert.alert(t("wrongPassword"), t("wrongPasswordMessage"));
        return;
      }

      // se tudo certo, salva o id e nome do usuário como "sessão ativa"
      // e manda pra tela principal
      await setSetting("currentUserId", String(user.id));
      await setSetting("currentUserName", user.name);
      router.replace("/home");
    } catch (error) {
      console.error("Erro ao entrar:", error);
      Alert.alert(t("error"), t("loginErrorMessage"));
    }
  };

  return (
    <AnimatedScreen>
      <SafeAreaView style={styles.container}>
        {/* KeyboardAvoidingView faz o conteúdo subir quando o teclado aparece */}
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Botão de voltar */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primaryDark} />
          </TouchableOpacity>

          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Títulos */}
            <Text style={styles.title}>{t("loginTitle")}</Text>
            <Text style={styles.subtitle}>{t("loginSubtitle")}</Text>

            {/* Campo de Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t("emailLabel")}</Text>
              <TextInput
                style={styles.input}
                placeholder={t("emailPlaceholder")}
                placeholderTextColor={COLORS.textGray}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Campo de Senha */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t("passwordLabel")}</Text>
              <TextInput
                style={styles.input}
                placeholder={t("passwordPlaceholder")}
                placeholderTextColor={COLORS.textGray}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* Opções: lembrar de mim e esqueceu a senha */}
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
                <Text style={styles.checkboxLabel}>{t("rememberMe")}</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.forgotPassword}>{t("forgotPassword")}</Text>
              </TouchableOpacity>
            </View>

            {/* Botão de Login (usa o AnimatedButton que tem animação de escala) */}
            <AnimatedButton
              title={t("loginButton")}
              onPress={handleLogin}
              style={styles.button}
            />

            {/* Link pra ir pra tela de cadastro */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>{t("noAccount")}</Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.registerLink}>{t("signUpLink")}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  backBtn: {
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.lg,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.xxxl,
  },
  title: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: "bold",
    color: COLORS.primaryDark,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textGray,
    marginBottom: SPACING.xxxl,
  },
  inputGroup: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.primaryDark,
    marginBottom: SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    fontSize: FONT_SIZES.medium,
    backgroundColor: COLORS.white,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    paddingVertical: SPACING.sm,
  },
  checkboxLabel: {
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZES.normal,
    color: COLORS.primaryDark,
  },
  forgotPassword: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.primary,
    paddingVertical: SPACING.sm,
  },
  button: {
    marginBottom: SPACING.xl,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  footerText: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.textGray,
  },
  registerLink: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.primary,
    fontWeight: "bold",
  },
});
