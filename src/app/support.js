// essa é a tela da Rede de Apoio. aqui o usuário cadastra os contatos
// de pessoas de confiança (família, amigos, terapeuta) que podem ser
// acionados quando ele precisar de ajuda. ele pode editar e apagar contatos.

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { AnimatedScreen } from "../components/animated-screen";
import { ScreenHeader } from "../components/screen-header";
import { COLORS, FONT_SIZES, SPACING } from "../constants/styles";
import {
    deleteContact,
    getContacts,
    getCurrentUserId,
    initDatabase,
    insertContact,
    updateContact,
} from "../db";
import { useLanguage } from "../i18n";

export default function Support() {
  const router = useRouter();
  const { t } = useLanguage();
  const [contacts, setContacts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");

  // carrega os contatos salvos quando a tela aparece
  useEffect(() => {
    const loadContacts = async () => {
      try {
        await initDatabase();
        const sessionUserId = await getCurrentUserId();
        setUserId(sessionUserId);
        if (sessionUserId) {
          const rows = await getContacts(sessionUserId);
          setContacts(rows);
        }
      } catch (error) {
        console.error("Erro ao carregar contatos:", error);
      }
    };
    loadContacts();
  }, []);

  // abre o modal pra cadastrar um contato novo
  const openNewContact = () => {
    setEditingContact(null);
    setNewName("");
    setNewPhone("");
    setModalVisible(true);
  };

  // abre o modal pra editar um contato existente
  const openEditContact = (contact) => {
    setEditingContact(contact);
    setNewName(contact.name);
    setNewPhone(contact.phone);
    setModalVisible(true);
  };

  // salva o contato (novo ou editado)
  const handleSaveContact = async () => {
    const name = newName.trim();
    const phone = newPhone.trim();

    // os dois campos são obrigatórios
    if (!name || !phone) {
      Alert.alert(
        t("requiredFields"),
        t("requiredFieldsContactMessage")
      );
      return;
    }

    try {
      await initDatabase();
      if (!userId) return;

      if (editingContact) {
        // se tá editando, atualiza o contato que já existe
        await updateContact(editingContact.id, userId, { name, phone });
        setContacts(
          contacts.map((contact) =>
            contact.id === editingContact.id
              ? { ...contact, name, phone }
              : contact
          )
        );
      } else {
        // se é novo, cria um contato novo
        const id = await insertContact({ userId, name, phone });
        setContacts([...contacts, { id, name, phone }]);
      }
    } catch (error) {
      console.error("Erro ao salvar contato:", error);
    }

    // limpa e fecha o modal
    setEditingContact(null);
    setNewName("");
    setNewPhone("");
    setModalVisible(false);
  };

  // pergunta se tem certeza antes de apagar um contato
  const handleDeleteContact = (contact) => {
    Alert.alert(
      t("deleteContactTitle"),
      t("deleteContactMessage", { name: contact.name }),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("delete"),
          style: "destructive",
          onPress: async () => {
            try {
              await initDatabase();
              if (!userId) return;
              await deleteContact(contact.id, userId);
              setContacts(
                contacts.filter((item) => item.id !== contact.id)
              );
            } catch (error) {
              console.error("Erro ao excluir contato:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <AnimatedScreen>
      <SafeAreaView style={styles.container}>
        <ScreenHeader title={t("supportTitle")} onBackPress={() => router.back()} />
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.subtitle}>{t("supportSubtitle")}</Text>

          {/* lista de contatos cadastrados */}
          {contacts.map((contact) => (
            <View key={contact.id} style={styles.contactCard}>
              <MaterialCommunityIcons
                name="account"
                size={40}
                color={COLORS.primary}
              />
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactPhone}>{contact.phone}</Text>
              </View>
              {/* botão de editar */}
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => openEditContact(contact)}
              >
                <Ionicons
                  name="pencil"
                  size={20}
                  color={COLORS.primaryDark}
                />
              </TouchableOpacity>
              {/* botão de apagar */}
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleDeleteContact(contact)}
              >
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color={COLORS.danger}
                />
              </TouchableOpacity>
            </View>
          ))}

          {/* botão pra adicionar contato novo */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={openNewContact}
          >
            <Ionicons name="add" size={24} color={COLORS.white} />
            <Text style={styles.addButtonText}>{t("addContactButton")}</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* modal de cadastro/edição de contato */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => {
            setEditingContact(null);
            setModalVisible(false);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>
                {editingContact ? t("modalEditContactTitle") : t("modalNewContactTitle")}
              </Text>

              <Text style={styles.modalLabel}>{t("contactNameLabel")}</Text>
              <TextInput
                style={styles.modalInput}
                placeholder={t("contactNamePlaceholder")}
                placeholderTextColor={COLORS.textGray}
                value={newName}
                onChangeText={setNewName}
              />

              <Text style={styles.modalLabel}>{t("contactPhoneLabel")}</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="(00) 00000-0000"
                placeholderTextColor={COLORS.textGray}
                keyboardType="phone-pad"
                value={newPhone}
                onChangeText={setNewPhone}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => {
                    setEditingContact(null);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalCancelText}>{t("cancel")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalConfirmButton}
                  onPress={handleSaveContact}
                >
                  <Text style={styles.modalConfirmText}>
                    {editingContact ? t("save") : t("add")}
                  </Text>
                </TouchableOpacity>
              </View>
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
  content: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  subtitle: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textGray,
    marginBottom: SPACING.xl,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  contactInfo: {
    marginLeft: SPACING.lg,
    flex: 1,
  },
  editButton: {
    padding: SPACING.sm,
  },
  contactName: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.primaryDark,
  },
  contactPhone: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.textGray,
    marginTop: SPACING.sm,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.lg,
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  addButtonText: {
    color: COLORS.white,
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
  modalLabel: {
    fontSize: FONT_SIZES.normal,
    fontWeight: "bold",
    color: COLORS.primaryDark,
    marginBottom: SPACING.sm,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    fontSize: FONT_SIZES.medium,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.lg,
  },
  modalActions: {
    flexDirection: "row",
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  modalCancelButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: COLORS.primaryDark,
    borderRadius: 12,
    paddingVertical: SPACING.lg,
    alignItems: "center",
  },
  modalCancelText: {
    color: COLORS.primaryDark,
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.lg,
    alignItems: "center",
  },
  modalConfirmText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
  },
});
