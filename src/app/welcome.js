import { useRouter } from "expo-router";
import {
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../../assets/images/welcome-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        {/* Topo - Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Textos da tela */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Você merece{"\n"}uma vida livre.</Text>
          <Text style={styles.subtitle}>
            Cada escolha certa te{"\n"}aproxima da sua{"\n"}melhor versão.
          </Text>
        </View>

        {/* Botões e Ações (Rodapé) */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/register")} // Altere para a rota de cadastro quando criar
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Começar agora</Text>
          </TouchableOpacity>

          <Text style={styles.loginQuestion}>Já tem uma conta?</Text>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/login")} // Altere para a rota de login quando criar
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Entrar</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: "space-between",
    paddingHorizontal: 28,
    paddingVertical: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  logo: {
    width: 220,
    height: 140,
  },
  textContainer: {
    alignItems: "flex-start",
    alignSelf: "flex-end",
    width: "75%",
    marginTop: -90,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#f5fff2",
    lineHeight: 34,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#ffffff",
    lineHeight: 22,
    fontWeight: "500",
  },
  actionsContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: "#4B6B38",
    width: "60%",
    paddingVertical: 16,
    borderRadius: 42,
    alignItems: "center",
    marginBottom: 16,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginQuestion: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    width: "60%",
    paddingVertical: 16,
    borderRadius: 42,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#121212",
    fontSize: 16,
    fontWeight: "bold",
  },
});
