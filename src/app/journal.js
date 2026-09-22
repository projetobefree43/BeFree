// essa é a tela do Diário de Gatilhos. aqui o usuário pode registrar
// situações que o deixaram mal (o gatilho), como se sentiu (a emoção)
// e como reagiu (a resposta). serve pra ele perceber padrões nos
// momentos difíceis e aprender a lidar melhor com eles.

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
    deleteEntry,
    getCurrentUserId,
    getEntries,
    initDatabase,
    insertEntry,
    updateEntry,
} from "../db";
import { useLanguage } from "../i18n";

// formata a data de hoje no formato "Segunda-feira, 3 de set."
const formatTodayLabel = () => {
  const now = new Date();
  const label = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
};

export default function Journal() {
  const router = useRouter();
  const { t } = useLanguage();
  const [entries, setEntries] = useState([]);
  const [userId, setUserId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [trigger, setTrigger] = useState("");
  const [emotion, setEmotion] = useState("");
  const [response, setResponse] = useState("");

  // carrega todos os registros do diário quando a tela aparece
  useEffect(() => {
    const loadEntries = async () => {
      try {
        await initDatabase();
        const sessionUserId = await getCurrentUserId();
        setUserId(sessionUserId);
        if (sessionUserId) {
          const rows = await getEntries(sessionUserId);
          setEntries(rows);
        }
      } catch (error) {
        console.error("Erro ao carregar registros:", error);
      }
    };
    loadEntries();
  }, []);

  // abre o modal pra criar um registro novo (limpa todos os campos)
  const openNewEntry = () => {
    setEditingEntry(null);
    setTrigger("");
    setEmotion("");
    setResponse("");
    setModalVisible(true);
  };

  // abre o modal pra editar um registro existente (preenche os campos com os dados)
  const openEditEntry = (entry) => {
    setEditingEntry(entry);
    setTrigger(entry.trigger);
    setEmotion(entry.emotion);
    setResponse(entry.response);
    setModalVisible(true);
  };

  // salva um registro novo ou atualiza um existente
  const handleSaveEntry = async () => {
    const triggerValue = trigger.trim();
    const emotionValue = emotion.trim();
    const responseValue = response.trim();

    // o gatilho é obrigatório (as outras duas opções são facultativas)
    if (!triggerValue) {
      Alert.alert(
        t("requiredField"),
        t("requiredTriggerMessage")
      );
      return;
    }

    try {
      await initDatabase();
      if (!userId) return;

      if (editingEntry) {
        // se tá editando, atualiza o registro que já existe
        await updateEntry(editingEntry.id, userId, {
          trigger: triggerValue,
          emotion: emotionValue || "Não informado",
          response: responseValue || "Não informado",
        });
        // atualiza a lista na tela também
        setEntries(
          entries.map((entry) =>
            entry.id === editingEntry.id
              ? {
                  ...entry,
                  trigger: triggerValue,
                  emotion: emotionValue || "Não informado",
                  response: responseValue || "Não informado",
                }
              : entry
          )
        );
      } else {
        // se é novo, cria um registro novo
        const id = await insertEntry({
          userId,
          dateLabel: formatTodayLabel(),
          trigger: triggerValue,
          emotion: emotionValue || "Não informado",
          response: responseValue || "Não informado",
        });
        // adiciona no início da lista (pra aparecer primeiro)
        setEntries([
          {
            id,
            dateLabel: formatTodayLabel(),
            trigger: triggerValue,
            emotion: emotionValue || "Não informado",
            response: responseValue || "Não informado",
          },
          ...entries,
        ]);
      }
    } catch (error) {
      console.error("Erro ao salvar registro:", error);
    }

    // limpa tudo e fecha o modal
    setEditingEntry(null);
    setTrigger("");
    setEmotion("");
    setResponse("");
    setModalVisible(false);
  };

  // pergunta se tem certeza antes de apagar um registro
  const handleDeleteEntry = (entry) => {
    Alert.alert(
      t("deleteEntryTitle"),
      t("deleteEntryMessage"),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("delete"),
          style: "destructive",
          onPress: async () => {
            try {
              await initDatabase();
              if (!userId) return;
              await deleteEntry(entry.id, userId);
              setEntries(entries.filter((item) => item.id !== entry.id));
            } catch (error) {
              console.error("Erro ao excluir registro:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <AnimatedScreen>
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          title={t("journalTitle")}
          onBackPress={() => router.back()}
        />

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.subtitle}>{t("journalSubtitle")}</Text>

          {/* mostra todos os registros do diário */}
          {entries.map((entry) => (
            <View key={entry.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryDate}>{entry.dateLabel}</Text>
                <View style={styles.entryHeaderActions}>
                  <MaterialCommunityIcons
                    name="heart-pulse"
                    size={20}
                    color={COLORS.danger}
                  />
                  {/* botão de editar */}
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => openEditEntry(entry)}
                  >
                    <Ionicons
                      name="pencil"
                      size={18}
                      color={COLORS.primaryDark}
                    />
                  </TouchableOpacity>
                  {/* botão de apagar */}
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleDeleteEntry(entry)}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={18}
                      color={COLORS.danger}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.entryTrigger}>
                {t("entryTrigger", { value: entry.trigger })}
              </Text>
              <Text style={styles.entryEmotion}>
                {t("entryEmotion", { value: entry.emotion })}
              </Text>
              <Text style={styles.entryResponse}>
                {t("entryResponse", { value: entry.response })}
              </Text>
            </View>
          ))}

          {/* botão pra criar um registro novo */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={openNewEntry}
          >
            <Ionicons name="add" size={24} color={COLORS.white} />
            <Text style={styles.addButtonText}>{t("newEntryButton")}</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* modal de cadastro/edição de registro */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => {
            setEditingEntry(null);
            setModalVisible(false);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>
                {editingEntry ? t("modalEditEntryTitle") : t("modalNewEntryTitle")}
              </Text>

              <Text style={styles.modalLabel}>{t("triggerLabel")}</Text>
              <TextInput
                style={styles.modalInput}
                placeholder={t("triggerPlaceholder")}
                placeholderTextColor={COLORS.textGray}
                value={trigger}
                onChangeText={setTrigger}
              />

              <Text style={styles.modalLabel}>{t("emotionLabel")}</Text>
              <TextInput
                style={styles.modalInput}
                placeholder={t("emotionPlaceholder")}
                placeholderTextColor={COLORS.textGray}
                value={emotion}
                onChangeText={setEmotion}
              />

              <Text style={styles.modalLabel}>{t("responseLabel")}</Text>
              <TextInput
                style={[styles.modalInput, styles.modalMultiline]}
                placeholder={t("responsePlaceholder")}
                placeholderTextColor={COLORS.textGray}
                multiline
                value={response}
                onChangeText={setResponse}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => {
                    setEditingEntry(null);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalCancelText}>{t("cancel")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalConfirmButton}
                  onPress={handleSaveEntry}
                >
                  <Text style={styles.modalConfirmText}>{t("save")}</Text>
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
  entryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: SPACING.md,
    marginBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  entryHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  editButton: {
    padding: SPACING.xs,
  },
  entryDate: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.primaryDark,
  },
  entryTrigger: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.textDark,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  entryEmotion: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.textDark,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  entryResponse: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.textDark,
    lineHeight: 20,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.lg,
    justifyContent: "center",
    marginTop: SPACING.sm,
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
  modalMultiline: {
    minHeight: 72,
    textAlignVertical: "top",
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
