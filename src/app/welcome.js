// essa é a tela de boas-vindas, o primeiro contato do usuário com o app.
// ela mostra o logo, uma frase motivacional e dois botões: um pra criar
// conta e outro pra entrar se já tiver conta.

import { useRouter } from "expo-router";
import {
    Image,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS, FONT_SIZES, SPACING } from "../constants/styles";
import { useLanguage } from "../i18n";

export default function WelcomeScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    // ImageBackground mostra uma imagem de fundo que cobre a tela toda
    <ImageBackground
      source={require("../../assets/images/welcome-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      {/* SafeAreaView evita que o conteúdo fique escondido atrás da barra do celular */}
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo no topo */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Texto principal de apresentação */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{t("welcomeTitle")}</Text>
          </View>

          {/* Botões de ação: criar conta ou entrar */}
          <View style={styles.actionsContainer}>
            {/* botão verde grande que manda pra tela de cadastro */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push("/register")}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>{t("getStartedButton")}</Text>
            </TouchableOpacity>

            <Text style={styles.loginQuestion}>{t("loginQuestion")}</Text>

            {/* botão com borda que manda pra tela de login */}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push("/login")}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>{t("loginButton")}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xl,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 0,
  },
  logo: {
    width: 200,
    height: 200,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: SPACING.sm,
    flexShrink: 1,
    marginTop: SPACING.xs,
  },
  title: {
    fontSize: FONT_SIZES.xxxlarge,
    fontWeight: "bold",
    color: COLORS.primaryDark,
    textAlign: "center",
    marginBottom: SPACING.xl,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: FONT_SIZES.large,
    color: COLORS.primaryDark,
    textAlign: "center",
    lineHeight: 28,
  },
  actionsContainer: {
    alignItems: "center",
    width: "100%",
    marginTop: "auto",
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    width: "100%",
    marginBottom: SPACING.lg,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    textAlign: "center",
  },
  loginQuestion: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.primaryDark,
    marginVertical: SPACING.md,
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: COLORS.primaryDark,
    borderRadius: 12,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    width: "100%",
  },
  secondaryButtonText: {
    color: COLORS.primaryDark,
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    textAlign: "center",
  },
});
