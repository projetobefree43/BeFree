// essa é a tela de login. aqui o usuário digita email e senha pra entrar
// na conta dele. se os dados estiverem certos, o app salva o id do usuário
// e manda pra tela principal (home).

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
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
import {
  getUserByEmail,
  initDatabase,
  resetPassword,
  saveSession,
  updateUserPassword,
} from "../db";
import { verifyPassword } from "../security";
import { useLanguage } from "../i18n";

export default function Login() {
  const router = useRouter();
  const { t } = useLanguage();

  // "useState" é como o React guarda dados que podem mudar na tela.
  // aqui a gente guarda o email, a senha, e se o usuário quer ser lembrado
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotVisible, setForgotVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");

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
      const passwordResult = await verifyPassword(password, user.password);
      if (!passwordResult.valid) {
        Alert.alert(t("wrongPassword"), t("wrongPasswordMessage"));
        return;
      }

      if (passwordResult.needsUpgrade) {
        await updateUserPassword(user.id, password);
      }

      // se tudo certo, salva o id e nome do usuário como "sessão ativa"
      // e manda pra tela principal
      await saveSession(user.id, user.name);
      router.replace("/home");
    } catch (error) {
      console.error("Erro ao entrar:", error);
      Alert.alert(t("error"), t("loginErrorMessage"));
    }
  };

  const handleResetPassword = async () => {
    try {
      await initDatabase();
      await resetPassword({
        email: resetEmail,
        newPassword: resetNewPassword,
        confirmPassword: resetConfirmPassword,
      });
      setForgotVisible(false);
      setResetEmail("");
      setResetNewPassword("");
      setResetConfirmPassword("");
      Alert.alert(t("success"), t("passwordResetSuccess"));
    } catch (error) {
      const code = String(error?.message ?? error ?? "");
      console.error("Erro ao redefinir senha:", error);
      if (code === "RESET_REQUIRED_FIELDS") {
        Alert.alert(t("requiredFields"), t("passwordResetRequiredMessage"));
      } else if (code === "RESET_PASSWORD_MISMATCH") {
        Alert.alert(t("passwordsDoNotMatch"), t("passwordsDoNotMatchMessage"));
      } else if (code === "RESET_PASSWORD_TOO_SHORT") {
        Alert.alert(t("passwordTooShort"), t("passwordTooShortMessage"));
      } else if (code === "RESET_ACCOUNT_NOT_FOUND") {
        Alert.alert(t("accountNotFound"), t("accountNotFoundMessage"));
      } else {
        Alert.alert(
          t("error"),
          __DEV__ && code ? `${t("passwordResetError")}\n\n${code}` : t("passwordResetError")
        );
      }
    }
  };

  const openResetPassword = () => {
    setResetEmail(email.trim().toLowerCase());
    setForgotVisible(true);
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
                placeholderTextColor="#65705F"
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
                placeholderTextColor="#65705F"
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
              <TouchableOpacity onPress={openResetPassword}>
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

          <Modal
            visible={forgotVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setForgotVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>{t("forgotPasswordTitle")}</Text>
                <Text style={styles.modalSubtitle}>{t("forgotPasswordSubtitle")}</Text>

                <TextInput
                  style={styles.input}
                  placeholder={t("emailPlaceholder")}
                  placeholderTextColor="#65705F"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={resetEmail}
                  onChangeText={setResetEmail}
                />
                <TextInput
                  style={[styles.input, styles.modalInput]}
                  placeholder={t("newPasswordPlaceholder")}
                  placeholderTextColor="#65705F"
                  secureTextEntry
                  value={resetNewPassword}
                  onChangeText={setResetNewPassword}
                />
                <TextInput
                  style={[styles.input, styles.modalInput]}
                  placeholder={t("confirmPasswordPlaceholder")}
                  placeholderTextColor="#65705F"
                  secureTextEntry
                  value={resetConfirmPassword}
                  onChangeText={setResetConfirmPassword}
                />

                <AnimatedButton
                  title={t("resetPasswordButton")}
                  onPress={handleResetPassword}
                  style={styles.modalButton}
                />
                <TouchableOpacity
                  onPress={() => setForgotVisible(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>{t("cancel")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
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
    borderColor: "#AFC7A2",
    borderRadius: 12,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    fontSize: FONT_SIZES.medium,
    backgroundColor: COLORS.white,
    color: COLORS.textDark,
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    padding: SPACING.xxl,
    backgroundColor: "rgba(28, 49, 19, 0.45)",
  },
  modalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: SPACING.xxl,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: "bold",
    color: COLORS.primaryDark,
    marginBottom: SPACING.sm,
  },
  modalSubtitle: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.textGray,
    marginBottom: SPACING.xl,
  },
  modalInput: {
    marginTop: SPACING.md,
  },
  modalButton: {
    marginTop: SPACING.xl,
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: SPACING.lg,
  },
  cancelButtonText: {
    color: COLORS.primaryDark,
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
  },
});
