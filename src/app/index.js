// essa é a primeira tela que aparece quando o app abre (tela de splash).
// ela mostra o logo do BeFree por 2.5 segundos e depois redireciona
// automaticamente pra tela de boas-vindas.

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";

// essas são as bibliotecas que eu uso: expo pra navegação e react native pra parte visual
export default function Index() {
  const router = useRouter();

  // useEffect é tipo um "quando a tela carregar, faz isso"
  // aqui, quando a tela aparece, ele cria um timer de 2.5 segundos
  // e depois manda o usuário pra tela de boas-vindas
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/welcome");
    }, 2500);

    // essa parte limpa o timer se o usuário sair da tela antes dos 2.5s
    return () => clearTimeout(timer);
  }, [router]);

  return (
    // LinearGradient cria um fundo com degrade de verde (as cores do app)
    <LinearGradient
      colors={["#80A86A", "#9FB882", "#DCEAC9", "#EDF6DF"]}
      style={styles.container}
    >
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </LinearGradient>
  );
}

// estilos da tela (StyleSheet é como o React Native organiza o visual)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: "85%",
    aspectRatio: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "100%",
    height: "100%",
  },
});
