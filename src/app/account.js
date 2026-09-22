// essa é a tela de Configurações da Conta. aqui o usuário pode:
// - mudar a foto de perfil (escolher da galeria)
// - editar nome e email
// - alterar a senha
// - sair da conta
// - excluir a conta permanentemente

import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
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
import { ScreenHeader } from "../components/screen-header";
import { COLORS, FONT_SIZES, SPACING } from "../constants/styles";
import {
  deleteUser,
  getCurrentUserId,
  getUserByEmail,
  getUserById,
  initDatabase,
  removeSetting,
  setSetting,
  updateUserEmail,
  updateUserName,
  updateUserPassword,
  updateUserPhoto,
} from "../db";
import { useLanguage } from "../i18n";

// regex = expressão regular que valida se o email tem formato correto
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AccountSettings() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // carrega os dados do usuário logado quando a tela aparece
  // se não tiver ninguém logado, manda pro login
  useEffect(() => {
    const loadAccount = async () => {
      try {
        await initDatabase();
        const sessionUserId = await getCurrentUserId();
        if (!sessionUserId) {
          router.replace("/login");
          return;
        }
        const found = await getUserById(sessionUserId);
        if (!found) {
          router.replace("/login");
          return;
        }
        setUser(found);
        setName(found.name);
        setEmail(found.email);
        setPhoto(found.photo ?? null);
      } catch (error) {
        console.error("Erro ao carregar conta:", error);
      }
    };
    loadAccount();
  }, [router]);

  // abre a galeria do celular pra escolher uma foto
  const handlePickPhoto = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        t("permissionRequired"),
        t("permissionRequiredMessage"),
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });
    if (result.canceled || !result.assets[0]) {
      return;
    }
    const asset = result.assets[0];
    // se a foto veio em base64 (texto codificado), usa ela direto
    // senão, usa o caminho da imagem no celular
    if (asset.base64) {
      setPhoto(`data:image/jpeg;base64,${asset.base64}`);
    } else {
      setPhoto(asset.uri);
    }
  };

  // salva a foto escolhida no banco
  const handleSavePhoto = async () => {
    try {
      await initDatabase();
      await updateUserPhoto(user.id, photo ?? null);
      setUser({ ...user, photo: photo ?? null });
      Alert.alert(t("success"), t("photoUpdated"));
    } catch (error) {
      console.error("Erro ao salvar foto:", error);
      Alert.alert(t("error"), t("photoSaveError"));
    }
  };

  // remove a foto de perfil
  const handleRemovePhoto = async () => {
    try {
      await initDatabase();
      await updateUserPhoto(user.id, null);
      setPhoto(null);
      setUser({ ...user, photo: null });
      Alert.alert(t("success"), t("photoRemoved"));
    } catch (error) {
      console.error("Erro ao remover foto:", error);
      Alert.alert(t("error"), t("photoRemoveError"));
    }
  };

  // salva as alterações no nome e email
  const handleSaveProfile = async () => {
    const nameValue = name.trim();
    const emailValue = email.trim().toLowerCase();
    if (!nameValue || !emailValue) {
      Alert.alert(
        t("requiredFields"),
        t("requiredFieldsAccountMessage"),
      );
      return;
    }
    if (!EMAIL_REGEX.test(emailValue)) {
      Alert.alert(t("invalidEmail"), t("invalidEmailMessage"));
      return;
    }
    try {
      await initDatabase();
      // verifica se já existe outro usuário com esse email
      const existing = await getUserByEmail(emailValue);
      if (existing && existing.id !== user.id) {
        Alert.alert(
          t("emailAlreadyRegistered"),
          t("emailInUseMessage"),
        );
        return;
      }
      await updateUserName(user.id, nameValue);
      await updateUserEmail(user.id, emailValue);
      await setSetting("currentUserName", nameValue);
      setUser({ ...user, name: nameValue, email: emailValue });
      Alert.alert(t("success"), t("dataUpdated"));
    } catch (error) {
      console.error("Erro ao atualizar conta:", error);
      Alert.alert(t("error"), t("updateError"));
    }
  };

  // altera a senha (verifica se a senha atual tá correta primeiro)
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert(
        t("requiredFields"),
        t("passwordRequiredMessage"),
      );
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert(
        t("passwordTooShort"),
        t("passwordTooShortMessage"),
      );
      return;
    }
    try {
      await initDatabase();
      if (currentPassword !== user.password) {
        Alert.alert(t("wrongCurrentPassword"), t("wrongCurrentPasswordMessage"));
        return;
      }
      await updateUserPassword(user.id, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      Alert.alert(t("success"), t("passwordChanged"));
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      Alert.alert(t("error"), t("passwordChangeError"));
    }
  };

  // exclui a conta permanentemente (mostra aviso antes)
  const handleDeleteAccount = () => {
    Alert.alert(
      t("deleteAccountTitle"),
      t("deleteAccountMessage"),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("delete"),
          style: "destructive",
          onPress: async () => {
            try {
              await initDatabase();
              await deleteUser(user.id);
              await removeSetting("currentUserId");
              await removeSetting("currentUserName");
              router.replace("/login");
            } catch (error) {
              console.error("Erro ao excluir conta:", error);
              Alert.alert(t("error"), t("deleteAccountError"));
            }
          },
        },
      ],
    );
  };

  // logout: limpa sessão e manda pro login
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
          title={t("accountSettingsTitle")}
          onBackPress={() => router.back()}
        />

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Dados pessoais: foto, nome e email */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="person-circle-outline"
                size={22}
                color={COLORS.primary}
              />
              <Text style={styles.sectionTitle}>{t("personalDataSection")}</Text>
            </View>

            {/* área da foto de perfil */}
            <View style={styles.photoContainer}>
              {photo ? (
                <Image source={{ uri: photo }} style={styles.photo} />
              ) : (
                <View style={[styles.photo, styles.photoPlaceholder]}>
                  <Ionicons name="person" size={48} color={COLORS.textGray} />
                </View>
              )}
              <TouchableOpacity
                style={styles.photoButton}
                onPress={handlePickPhoto}
              >
                <Ionicons
                  name="camera-outline"
                  size={18}
                  color={COLORS.primary}
                />
                <Text style={styles.photoButtonText}>{t("choosePhotoButton")}</Text>
              </TouchableOpacity>
              {photo ? (
                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={handleRemovePhoto}
                >
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color={COLORS.danger}
                  />
                  <Text
                    style={[styles.photoButtonText, styles.removePhotoText]}
                  >
                    {t("removePhotoButton")}
                  </Text>
                </TouchableOpacity>
              ) : null}
              <AnimatedButton
                title={t("savePhotoButton")}
                onPress={handleSavePhoto}
                style={styles.savePhotoButton}
              />
            </View>

            {/* campos de nome e email */}
            <Text style={styles.label}>{t("nameLabel")}</Text>
            <TextInput
              style={styles.input}
              placeholder={t("yourNamePlaceholder")}
              placeholderTextColor={COLORS.textGray}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <Text style={styles.label}>{t("emailLabel")}</Text>
            <TextInput
              style={styles.input}
              placeholder={t("yourEmailPlaceholder")}
              placeholderTextColor={COLORS.textGray}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />

            <AnimatedButton
              title={t("saveChangesButton")}
              onPress={handleSaveProfile}
              style={styles.saveButton}
            />
          </View>

          {/* Alterar senha */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="lock-closed-outline"
                size={22}
                color={COLORS.primary}
              />
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

          {/* Sessão (logout) */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="log-out-outline"
                size={22}
                color={COLORS.primary}
              />
              <Text style={styles.sectionTitle}>{t("sessionSection")}</Text>
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleLogout}
            >
              <Ionicons
                name="exit-outline"
                size={20}
                color={COLORS.primaryDark}
              />
              <Text style={styles.actionButtonText}>{t("logoutAccountButton")}</Text>
            </TouchableOpacity>
          </View>

          {/* Zona de perigo (excluir conta) */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="warning-outline"
                size={22}
                color={COLORS.danger}
              />
              <Text style={[styles.sectionTitle, styles.dangerTitle]}>
                {t("dangerZoneSection")}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.actionButton, styles.dangerButton]}
              onPress={handleDeleteAccount}
            >
              <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
              <Text style={[styles.actionButtonText, styles.dangerText]}>
                {t("deleteMyAccountButton")}
              </Text>
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
  dangerTitle: {
    color: COLORS.danger,
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
  photoContainer: {
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: SPACING.sm,
  },
  photoPlaceholder: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: "#DDD",
    alignItems: "center",
    justifyContent: "center",
  },
  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  photoButtonText: {
    marginLeft: SPACING.xs,
    fontSize: FONT_SIZES.normal,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  removePhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  removePhotoText: {
    color: COLORS.danger,
  },
  savePhotoButton: {
    marginTop: SPACING.md,
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
