// essa é a tela de cadastro. aqui o usuário preenche nome, email e senha
// pra criar uma conta nova. depois de criar, o app salva ele como "logado"
// e manda direto pra tela principal.

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
import {
    createUser,
    getUserByEmail,
    initDatabase,
    setSetting,
} from "../db";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // essa função roda quando o usuário clica em "Criar Conta"
  const handleRegister = async () => {
    const nameValue = name.trim();
    const emailValue = email.trim().toLowerCase();

    // verifica se todos os campos foram preenchidos
    if (!nameValue || !emailValue || !password) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha nome, email e senha para continuar."
      );
      return;
    }

    // verifica se o email tem um formato válido (tem @ e .)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      Alert.alert("Email inválido", "Digite um endereço de email válido.");
      return;
    }

    // a senha precisa ter pelo menos 6 caracteres
    if (password.length < 6) {
      Alert.alert(
        "Senha muito curta",
        "A senha precisa ter pelo menos 6 caracteres."
      );
      return;
    }

    try {
      await initDatabase();

      // verifica se já existe alguém com esse email cadastrado
      const existing = await getUserByEmail(emailValue);
      if (existing) {
        Alert.alert(
          "Email já cadastrado",
          "Já existe uma conta com este email. Tente entrar."
        );
        return;
      }

      // cria o usuário no banco e salva a sessão
      const userId = await createUser({ name: nameValue, email: emailValue, password });
      await setSetting("currentUserId", String(userId));
      await setSetting("currentUserName", nameValue);

      // manda direto pra tela principal
      router.replace("/home");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      Alert.alert(
        "Erro",
        "Não foi possível criar a conta. Tente novamente."
      );
    }
  };

  return (
    <AnimatedScreen>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Botão de voltar */}
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={COLORS.primaryDark}
              />
            </TouchableOpacity>

            {/* Cabeçalho com título */}
            <View style={styles.header}>
              <Text style={styles.title}>Criar Conta</Text>
              <Text style={styles.subtitle}>Sua liberdade começa aqui!</Text>
            </View>

            {/* Formulário com os 3 campos */}
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome completo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Digite seu nome"
                  placeholderTextColor={COLORS.textGray}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Digite seu email"
                  placeholderTextColor={COLORS.textGray}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Senha</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Digite sua senha"
                  placeholderTextColor={COLORS.textGray}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              {/* Botão de cadastrar */}
              <AnimatedButton
                title="Criar Conta"
                onPress={handleRegister}
                style={styles.submitButton}
              />
            </View>

            {/* Link pra ir pra tela de login */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Já tem uma conta? </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={styles.loginLink}>Entrar</Text>
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
  content: {
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    marginTop: SPACING.xxl,
    marginBottom: SPACING.xxxl,
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
  },
  form: {
    marginBottom: SPACING.xxl,
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
  submitButton: {
    marginTop: SPACING.xl,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: SPACING.lg,
  },
  footerText: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.textGray,
  },
  loginLink: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.primary,
    fontWeight: "bold",
  },
});
