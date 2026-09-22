// essa é a tela de Privacidade e Segurança. aqui o usuário pode:
// - esconder o nome na tela inicial (pra privacidade)
// - alterar a senha
// - ver informações sobre onde os dados ficam salvos
// - apagar todos os dados do app
// - sair da conta

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { AnimatedButton } from "../components/animated-button";
import { AnimatedScreen } from "../components/animated-screen";
import { ScreenHeader } from "../components/screen-header";
import { COLORS, FONT_SIZES, SPACING } from "../constants/styles";
import {
    getCurrentUserId,
    getPrivacySettings,
    getUserById,
    initDatabase,
    removeSetting,
    resetDatabase,
    setPrivacySettings,
    updateUserPassword,
} from "../db";
import { useLanguage } from "../i18n";

export default function Privacy() {
  const router = useRouter();
  const { t } = useLanguage();
  const [userId, setUserId] = useState(null);
  const [hideName, setHideName] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // carrega as configurações de privacidade do usuário
  useEffect(() => {
    const loadSettings = async () => {
      try {
        await initDatabase();
        const sessionUserId = await getCurrentUserId();
        if (!sessionUserId) {
          router.replace("/login");
          return;
        }
        setUserId(sessionUserId);
        const settings = await getPrivacySettings(sessionUserId);
        setHideName(settings.hideName);
      } catch (error) {
        console.error("Erro ao carregar configurações de privacidade:", error);
      }
    };
    loadSettings();
  }, [router]);

  // liga/desliga a opção de esconder o nome na tela inicial
  const toggleHideName = () => {
    const next = !hideName;
    setHideName(next);
    if (userId) {
      setPrivacySettings(userId, { hideName: next }).catch((error) => {
        console.error("Erro ao salvar privacidade:", error);
      });
    }
  };

  // altera a senha (mesma lógica da tela de conta)
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert(
        t("requiredFields"),
        t("passwordRequiredMessage")
      );
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert(
        t("passwordTooShort"),
        t("passwordTooShortMessage")
      );
      return;
    }
    try {
      await initDatabase();
      const user = await getUserById(userId);
      if (!user) {
        Alert.alert(t("error"), t("userNotFound"));
        return;
      }
      if (currentPassword !== user.password) {
        Alert.alert(t("wrongCurrentPassword"), t("wrongCurrentPasswordMessage"));
        return;
      }
      await updateUserPassword(userId, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      Alert.alert(t("success"), t("passwordChanged"));
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      Alert.alert(t("error"), t("passwordChangeError"));
    }
  };

  // apaga TODOS os dados do app (todas as contas, diários, contatos, configs)
  // essa ação é irreversível
  const handleDeleteAllData = () => {
    Alert.alert(
      t("deleteAllDataTitle"),
      t("deleteAllDataMessage"),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("deleteEverything"),
          style: "destructive",
          onPress: async () => {
            try {
              await initDatabase();
              await resetDatabase();
              router.replace("/welcome");
            } catch (error) {
              console.error("Erro ao apagar dados:", error);
              Alert.alert(t("error"), t("deleteAllError"));
            }
          },
        },
      ]
    );
  };

  // logout
  const handleLogout = async () => {
    try {
      await initDatabase();
      await removeSetting("currentUserId");
      await removeSetting("currentUserName");
      router.replace("/login");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <AnimatedScreen>
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          title={t("privacyTitle")}
          onBackPress={() => router.back()}
        />

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Opção de esconder o nome */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="eye-off-outline" size={22} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>{t("accessVisibilitySection")}</Text>
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>
                  {t("hideNameSetting")}
                </Text>
                <Text style={styles.settingHint}>
                  {t("hideNameHint")}
                </Text>
              </View>
              <Switch
                value={hideName}
                onValueChange={toggleHideName}
                trackColor={{ true: COLORS.primary }}
              />
            </View>
          </View>

          {/* Alterar senha */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="lock-closed-outline" size={22} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>{t("changePasswordSection")}</Text>
            </View>

            <Text style={styles.label}>{t("currentPasswordLabel")}</Text>
            <TextInput
              style={styles.input}
              placeholder={t("currentPasswordPlaceholder")}
              placeholderTextColor={COLORS.textGray}
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />

            <Text style={styles.label}>{t("newPasswordLabel")}</Text>
            <TextInput
              style={styles.input}
              placeholder={t("newPasswordPlaceholder")}
              placeholderTextColor={COLORS.textGray}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <AnimatedButton
              title={t("changePasswordButton")}
              onPress={handleChangePassword}
              style={styles.saveButton}
            />
          </View>

          {/* Informações sobre dados */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="shield-checkmark-outline" size={22} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>{t("yourDataSection")}</Text>
            </View>

            <View style={styles.infoBox}>
              <Ionicons name="hardware-chip-outline" size={20} color={COLORS.primary} />
              <Text style={styles.infoText}>
                {t("dataInfoText")}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.actionButton, styles.dangerButton]}
              onPress={handleDeleteAllData}
            >
              <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
              <Text style={[styles.actionButtonText, styles.dangerText]}>
                {t("deleteAllDataButton")}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sessão (logout) */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="log-out-outline" size={22} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>{t("sessionSection")}</Text>
            </View>

            <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
              <Ionicons name="exit-outline" size={20} color={COLORS.primaryDark} />
              <Text style={styles.actionButtonText}>{t("logoutAccountButton")}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  section: {
    marginBottom: SPACING.xxl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.primaryDark,
    marginLeft: SPACING.sm,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
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
    marginBottom: SPACING.lg,
    color: COLORS.textDark,
  },
  saveButton: {
    marginTop: SPACING.sm,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  infoText: {
    flex: 1,
    fontSize: FONT_SIZES.normal,
    color: COLORS.primaryDark,
    marginLeft: SPACING.md,
    lineHeight: 22,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  actionButtonText: {
    flex: 1,
    marginLeft: SPACING.md,
    fontSize: FONT_SIZES.normal,
    fontWeight: "bold",
    color: COLORS.primaryDark,
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  dangerText: {
    color: COLORS.danger,
  },
});
