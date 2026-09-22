// essa é a tela de emergência (SOS). quando o usuário clica no botão "ATIVAR SOS",
// o app toca um som de alerta por 5 segundos e mostra uma mensagem de orientação.
// o som toca mesmo se o celular estiver no silencioso (modo mudo).

import { Ionicons } from "@expo/vector-icons";
import { setAudioModeAsync, useAudioPlayer } from "expo-audio";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";
import { AnimatedScreen } from "../components/animated-screen";
import { COLORS, FONT_SIZES, SPACING } from "../constants/styles";
import { useLanguage } from "../i18n";

// tempo que o som de alerta fica tocando (em segundos)
const SOS_ALERT_DURATION_SECONDS = 5;

export default function SOS() {
  const router = useRouter();
  const { t } = useLanguage();
  // player é o "reprodutor" de áudio. aqui ele carrega o arquivo de som de alerta
  const player = useAudioPlayer(require("../../assets/audio/sos-alert.wav"));
  // useRef guarda uma referência pro timer de parada do som
  const stopTimer = useRef(null);

  useEffect(() => {
    // configura o áudio pra tocar mesmo no modo silencioso do celular
    setAudioModeAsync({ playsInSilentMode: true });

    // limpa o timer se a tela for fechada (pra não dar erro)
    return () => {
      if (stopTimer.current) {
        clearTimeout(stopTimer.current);
        stopTimer.current = null;
      }
    };
  }, []);

  // essa função toca o som de alerta e para depois de 5 segundos
  const playAlert = () => {
    player.seekTo(0);
    player.play();

    // cria um timer que vai pausar o som depois de 5 segundos
    if (stopTimer.current) clearTimeout(stopTimer.current);
    stopTimer.current = setTimeout(() => {
      stopTimer.current = null;
      if (player.isLoaded) {
        player.pause();
      }
    }, SOS_ALERT_DURATION_SECONDS * 1000);
  };

  // essa função é chamada quando o usuário clica em "ATIVAR SOS"
  // primeiro mostra um aviso perguntando se tem certeza
  const handleSOS = () => {
    Alert.alert(
      t("sosConfirmTitle"),
      t("sosConfirmMessage"),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("activate"),
          onPress: () => {
            // se o usuário confirmar, toca o som e mostra orientação
            playAlert();
            Alert.alert(
              t("sosActivatedTitle"),
              t("sosActivatedMessage")
            );
          },
        },
      ]
    );
  };

  return (
    <AnimatedScreen>
      <SafeAreaView style={styles.container}>
        {/* Botão de voltar */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>

        {/* Conteúdo centralizado */}
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Ionicons name="alert-circle" size={80} color={COLORS.white} />
          <Text style={styles.title}>{t("sosTitle")}</Text>
          <Text style={styles.subtitle}>{t("sosSubtitle")}</Text>
          <Text style={styles.description}>
            {t("sosDescription")}
          </Text>

          {/* Botão grande de ativação */}
          <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
            <Text style={styles.sosButtonText}>{t("sosActivateButton")}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.danger,
  },
  backBtn: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
    alignSelf: "flex-start",
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.xxxl,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xxxl,
  },
  title: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: "bold",
    color: COLORS.white,
    marginTop: SPACING.xl,
    textAlign: "center",
  },
  subtitle: {
    fontSize: FONT_SIZES.large,
    color: COLORS.dangerLight,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
    textAlign: "center",
  },
  description: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.white,
    textAlign: "center",
    marginBottom: SPACING.xxxl,
    lineHeight: 24,
  },
  sosButton: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxxl,
    borderRadius: 12,
  },
  sosButtonText: {
    color: COLORS.danger,
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    textAlign: "center",
  },
});
