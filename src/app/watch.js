// essa é a tela do Painel do Relógio. aqui o usuário configura como o
// relógio inteligente (wearable) se comunica com o app.
// ele pode ligar/desligar notificações e vibração do relógio.

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { COLORS, FONT_SIZES, SPACING } from "../constants/styles";
import { AnimatedScreen } from "../components/animated-screen";
import { getCurrentUserId, getWatchSettings, initDatabase, setSetting } from "../db";

export default function Watch() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [userId, setUserId] = useState(null);

  // carrega as configurações salvas do relógio quando a tela aparece
  useEffect(() => {
    const loadSettings = async () => {
      try {
        await initDatabase();
        const sessionUserId = await getCurrentUserId();
        setUserId(sessionUserId);
        const settings = await getWatchSettings(sessionUserId);
        setNotifications(settings.notifications);
        setVibration(settings.vibration);
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      }
    };
    loadSettings();
  }, []);

  // salva as configurações no banco quando o usuário muda algo
  const persistSettings = async (next) => {
    try {
      await initDatabase();
      await setSetting(`watch.notifications.${userId}`, JSON.stringify(next.notifications));
      await setSetting(`watch.vibration.${userId}`, JSON.stringify(next.vibration));
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
    }
  };

  // liga/desliga as notificações
  const toggleNotifications = () => {
    const next = !notifications;
    setNotifications(next);
    persistSettings({ notifications: next, vibration });
  };

  // liga/desliga a vibração
  const toggleVibration = () => {
    const next = !vibration;
    setVibration(next);
    persistSettings({ notifications, vibration: next });
  };

  // se pelo menos uma das duas opções tá ligada, o relógio tá "conectado"
  const connected = notifications || vibration;

  return (
    <AnimatedScreen>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primaryDark} />
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Ionicons name="watch" size={80} color={COLORS.primary} />
          <Text style={styles.title}>Painel do Relógio</Text>
          <Text style={styles.subtitle}>BeFree Sync ativo</Text>

          {/* Mostra se o relógio tá conectado ou não */}
          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>Status da conexão:</Text>
            <Text style={styles.statusValue}>
              {connected ? "🟢 Conectado" : "🔴 Desconectado"}
            </Text>
          </View>

          {/* Caixa informativa */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Seu relógio inteligente está sincronizado com o BeFree. Receba notificações em tempo real!
            </Text>
          </View>

          {/* Botão que abre o modal de configurações */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>Abrir Configurações</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Modal = janela que aparece por cima da tela quando clica no botão */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Configurações do Sync</Text>

              {/* Switch = botão de ligar/desligar (tipo o do iPhone) */}
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Notificações em tempo real</Text>
                  <Text style={styles.settingHint}>Recebe alertas de recaída</Text>
                </View>
                <Switch
                  value={notifications}
                  onValueChange={toggleNotifications}
                  trackColor={{ true: COLORS.primary }}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Vibração no pulso</Text>
                  <Text style={styles.settingHint}>Alerta físico ao estresse</Text>
                </View>
                <Switch
                  value={vibration}
                  onValueChange={toggleVibration}
                  trackColor={{ true: COLORS.primary }}
                />
              </View>

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    width: "100%",
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xxxl,
  },
  title: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: "bold",
    color: COLORS.primaryDark,
    marginTop: SPACING.xl,
    textAlign: "center",
  },
  subtitle: {
    fontSize: FONT_SIZES.large,
    color: COLORS.textGray,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
    textAlign: "center",
  },
  statusBox: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    width: "100%",
  },
  statusLabel: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.textGray,
    marginBottom: SPACING.sm,
  },
  statusValue: {
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS.primaryDark,
  },
  infoBox: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    width: "100%",
  },
  infoText: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.primaryDark,
    textAlign: "center",
    lineHeight: 22,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    width: "100%",
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: SPACING.xxl,
  },
  modalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.xl,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: "bold",
    color: COLORS.primaryDark,
    marginBottom: SPACING.xl,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.md,
    marginBottom: SPACING.sm,
  },
  settingInfo: {
    flex: 1,
    marginRight: SPACING.lg,
  },
  settingLabel: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.textDark,
  },
  settingHint: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.textGray,
    marginTop: SPACING.xs,
  },
  modalCloseButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.lg,
    alignItems: "center",
    marginTop: SPACING.lg,
  },
  modalCloseText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
  },
});
