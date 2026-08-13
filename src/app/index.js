import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para a tela /welcome após 2.5 segundos
    const timer = setTimeout(() => {
      router.replace("/welcome");
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
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
