// Painel de conexão do ESP32.
// O celular e o ESP32 precisam estar na mesma rede Wi-Fi.

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AnimatedScreen } from "../components/animated-screen";
import { COLORS, FONT_SIZES, SPACING } from "../constants/styles";
import {
  getContacts,
  getCurrentUserId,
  getSetting,
  getWatchSettings,
  initDatabase,
  setSetting,
} from "../db";
import {
  consultarStatusEsp32,
  enviarComandoEsp32,
  obterEnderecoEsp32,
} from "../services/esp32";
import { useLanguage } from "../i18n";

function textoComValor(t, chave, valor) {
  return t(chave).replace("{address}", valor);
}

export default function Watch() {
  const router = useRouter();
  const { t } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [userId, setUserId] = useState(null);
  const [endereco, setEndereco] = useState("");
  const [conectado, setConectado] = useState(false);
  const [conectando, setConectando] = useState(false);
  const [status, setStatus] = useState(null);
  const ultimoPedidoAjuda = useRef(0);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        await initDatabase();
        const sessionUserId = await getCurrentUserId();
        setUserId(sessionUserId);

        const settings = await getWatchSettings(sessionUserId);
        setNotifications(settings.notifications);
        setVibration(settings.vibration);

        if (sessionUserId) {
          const enderecoSalvo = await getSetting(
            "watch.esp32.address." + sessionUserId
          );
          if (enderecoSalvo) setEndereco(enderecoSalvo);
        }
      } catch (error) {
        console.error("Erro ao carregar painel do ESP32:", error);
      }
    };

    carregarDados();
  }, []);

  const abrirContatoDeSeguranca = useCallback(async () => {
    try {
      const contatos = userId ? await getContacts(userId) : [];
      const contato = contatos[0];

      if (!contato || !contato.phone) {
        Alert.alert(t("helpRequestTitle"), t("noSafetyContactMessage"));
        return;
      }

      const telefone = String(contato.phone).replace(/[^0-9+]/g, "");

      // O pedido vindo do botao fisico ja representa uma acao de ajuda.
      // O sistema abre diretamente o discador do primeiro contato salvo.
      try {
        await Linking.openURL("tel:" + telefone);
      } catch {
        Alert.alert(t("error"), t("callSafetyContactError"));
      }
    } catch (error) {
      console.error("Erro ao abrir contato de seguranca:", error);
    }
  }, [t, userId]);

  const conectar = async () => {
    let enderecoNormalizado;

    try {
      enderecoNormalizado = obterEnderecoEsp32(endereco);
      setConectando(true);

      const dados = await consultarStatusEsp32(enderecoNormalizado);
      setEndereco(enderecoNormalizado);
      setStatus(dados);
      setConectado(true);
      ultimoPedidoAjuda.current = Number(dados.helpRequestId || 0);

      if (userId) {
        await setSetting(
          "watch.esp32.address." + userId,
          enderecoNormalizado
        );
      }
    } catch (error) {
      setConectado(false);
      setStatus(null);
      Alert.alert(t("error"), t("esp32ConnectionError"));
      console.error("Erro ao conectar ao ESP32:", error);
    } finally {
      setConectando(false);
    }
  };

  useEffect(() => {
    if (!conectado || !endereco) return undefined;

    let cancelado = false;

    const atualizarStatus = async () => {
      try {
        const dados = await consultarStatusEsp32(endereco);
        if (cancelado) return;

        setStatus(dados);

        const novoId = Number(dados.helpRequestId || 0);
        if (novoId > ultimoPedidoAjuda.current) {
          ultimoPedidoAjuda.current = novoId;
          abrirContatoDeSeguranca();
        }
      } catch (error) {
        if (!cancelado) {
          setConectado(false);
          console.error("ESP32 desconectado:", error);
        }
      }
    };

    atualizarStatus();
    const intervalo = setInterval(atualizarStatus, 1500);

    return () => {
      cancelado = true;
      clearInterval(intervalo);
    };
  }, [abrirContatoDeSeguranca, conectado, endereco]);

  const enviarComando = async (comando) => {
    if (!conectado) {
      Alert.alert(t("error"), t("esp32ConnectionError"));
      return;
    }

    try {
      const resposta = await enviarComandoEsp32(endereco, comando);
      setStatus(resposta.status);
    } catch (error) {
      setConectado(false);
      Alert.alert(t("error"), t("esp32ConnectionError"));
      console.error("Erro ao enviar comando ao ESP32:", error);
    }
  };

  const persistSettings = async (next) => {
    try {
      await initDatabase();
      await setSetting(
        "watch.notifications." + userId,
        JSON.stringify(next.notifications)
      );
      await setSetting(
        "watch.vibration." + userId,
        JSON.stringify(next.vibration)
      );
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
    }
  };

  const toggleNotifications = () => {
    const next = !notifications;
    setNotifications(next);
    persistSettings({ notifications: next, vibration });
  };

  const toggleVibration = () => {
    const next = !vibration;
    setVibration(next);
    persistSettings({ notifications, vibration: next });
  };

  const valorModoEsporte = status?.sportMode ? t("onLabel") : t("offLabel");
  const valorAlerta = status?.alert ? t("onLabel") : t("offLabel");

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
          <Text style={styles.title}>{t("watchTitle")}</Text>
          <Text style={styles.subtitle}>{t("watchSubtitle")}</Text>

          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>{t("connectionStatusLabel")}</Text>
            <Text style={styles.statusValue}>
              {conectado ? t("connected") : t("disconnected")}
            </Text>
            {conectado && (
              <Text style={styles.addressText}>
                {textoComValor(t, "esp32ConnectedAt", endereco)}
              </Text>
            )}
          </View>

          <View style={styles.connectionBox}>
            <Text style={styles.inputLabel}>{t("esp32IpLabel")}</Text>
            <TextInput
              value={endereco}
              onChangeText={setEndereco}
              placeholder={t("esp32IpPlaceholder")}
              placeholderTextColor={COLORS.textGray}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              style={styles.ipInput}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={conectar}
              disabled={conectando}
            >
              {conectando ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>
                  {conectado
                    ? t("reconnectEsp32Button")
                    : t("connectEsp32Button")}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>{t("watchInfoText")}</Text>
          </View>

          {status && (
            <View style={styles.dataBox}>
              <Text style={styles.dataTitle}>{t("watchTitle")}</Text>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>{t("bpmLabel")}</Text>
                <Text style={styles.dataValue}>{status.bpm}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>{t("riskLabel")}</Text>
                <Text style={styles.dataValue}>{status.risk}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>{t("sportModeLabel")}</Text>
                <Text style={styles.dataValue}>{valorModoEsporte}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>{t("alertLabel")}</Text>
                <Text style={styles.dataValue}>{valorAlerta}</Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, !conectado && styles.disabledButton]}
            onPress={() => enviarComando("toggle_sport")}
            disabled={!conectado}
          >
            <Text style={styles.buttonText}>{t("sportModeLabel")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.helpButton, !conectado && styles.disabledButton]}
            onPress={() => enviarComando("help")}
            disabled={!conectado}
          >
            <Ionicons name="call-outline" size={20} color={COLORS.white} />
            <Text style={styles.buttonText}>{t("requestHelpButton")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.secondaryButtonText}>
              {t("openSettingsButton")}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>{t("syncSettingsTitle")}</Text>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>
                    {t("realtimeNotificationsLabel")}
                  </Text>
                  <Text style={styles.settingHint}>
                    {t("relapseAlertsHint")}
                  </Text>
                </View>
                <Switch
                  value={notifications}
                  onValueChange={toggleNotifications}
                  trackColor={{ true: COLORS.primary }}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>
                    {t("wristVibrationLabel")}
                  </Text>
                  <Text style={styles.settingHint}>
                    {t("stressAlertHint")}
                  </Text>
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
                <Text style={styles.modalCloseText}>{t("closeButton")}</Text>
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
    alignItems: "center",
    width: "100%",
    paddingHorizontal: SPACING.xxl,
    paddingBottom: SPACING.xxxl,
  },
  title: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: "bold",
    color: COLORS.primaryDark,
    marginTop: SPACING.lg,
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
  addressText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textGray,
    marginTop: SPACING.sm,
  },
  connectionBox: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    width: "100%",
  },
  inputLabel: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.textDark,
    marginBottom: SPACING.sm,
  },
  ipInput: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.medium,
    color: COLORS.textDark,
    marginBottom: SPACING.md,
  },
  infoBox: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    width: "100%",
  },
  infoText: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.primaryDark,
    textAlign: "center",
    lineHeight: 22,
  },
  dataBox: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    width: "100%",
  },
  dataTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS.primaryDark,
    marginBottom: SPACING.md,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primaryLight,
  },
  dataLabel: {
    color: COLORS.textGray,
    fontSize: FONT_SIZES.medium,
  },
  dataValue: {
    color: COLORS.textDark,
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    width: "100%",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  helpButton: {
    backgroundColor: COLORS.danger,
    borderRadius: 12,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
  },
  secondaryButton: {
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: SPACING.lg,
    width: "100%",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  secondaryButtonText: {
    color: COLORS.primaryDark,
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
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
