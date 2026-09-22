// essa é a tela de Ajuda e Suporte. aqui o usuário encontra:
// - contatos de emergência (CVV e SAMU) com ligação direta
// - e-mail de suporte do app
// - links rápidos pra Rede de Apoio e Botão SOS
// - perguntas frequentes (FAQ) com respostas sobre o app
// - informações sobre o BeFree

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Linking,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { AnimatedScreen } from "../components/animated-screen";
import { ScreenHeader } from "../components/screen-header";
import { COLORS, FONT_SIZES, SPACING } from "../constants/styles";
import { useLanguage } from "../i18n";

// lista de perguntas frequentes (as chaves apontam pra uma tradução)
const FAQ = [
  { qKey: "faq1q", aKey: "faq1a" },
  { qKey: "faq2q", aKey: "faq2a" },
  { qKey: "faq3q", aKey: "faq3a" },
  { qKey: "faq4q", aKey: "faq4a" },
  { qKey: "faq5q", aKey: "faq5a" },
];

// função que abre links externos (telefone, e-mail, etc.)
const openExternalUrl = async (url, alertTitle, alertMessage) => {
  try {
    await Linking.openURL(url);
  } catch (_) {
    Alert.alert(alertTitle, alertMessage);
  }
};

export default function Help() {
  const router = useRouter();
  const { t } = useLanguage();
  // expandedIndex controla qual pergunta do FAQ tá aberta (nenhuma = null)
  const [expandedIndex, setExpandedIndex] = useState(null);

  const openLink = (url) => openExternalUrl(url, t("openFailed"), t("tryLater"));

  return (
    <AnimatedScreen>
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          title={t("helpTitle")}
          onBackPress={() => router.back()}
        />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Contatos de emergência (ligação direta) */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="medkit-outline" size={22} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>{t("emergencyContactsSection")}</Text>
            </View>

            {/* CVV - quando clica, abre a tela de ligação do celular */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => openLink("tel:188")}
            >
              <Ionicons name="heart-outline" size={20} color={COLORS.danger} />
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>{t("cvvTitle")}</Text>
                <Text style={styles.actionSubtitle}>
                  {t("cvvSubtitle")}
                </Text>
              </View>
              <Ionicons name="call-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>

            {/* SAMU */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => openLink("tel:192")}
            >
              <Ionicons name="ambulance" size={20} color={COLORS.danger} />
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>{t("samuTitle")}</Text>
                <Text style={styles.actionSubtitle}>
                  {t("samuSubtitle")}
                </Text>
              </View>
              <Ionicons name="call-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* Fale com a gente (e-mail de suporte) */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="chatbubbles-outline" size={22} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>{t("contactUsSection")}</Text>
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                openLink(
                  "mailto:projetobefree43@gmail.com?subject=Ajuda%20e%20Suporte"
                )
              }
            >
              <Ionicons name="mail-outline" size={20} color={COLORS.primary} />
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>{t("supportEmailTitle")}</Text>
                <Text style={styles.actionSubtitle}>projetobefree43@gmail.com</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textGray} />
            </TouchableOpacity>
          </View>

          {/* Acesso rápido pra funcionalidades importantes */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="flash-outline" size={22} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>{t("quickAccessSection")}</Text>
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/support")}
            >
              <Ionicons name="account-group-outline" size={20} color={COLORS.primary} />
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>{t("supportNetworkTitle")}</Text>
                <Text style={styles.actionSubtitle}>{t("supportNetworkSubtitle")}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textGray} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/sos")}
            >
              <Ionicons name="alert-circle-outline" size={20} color={COLORS.danger} />
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>{t("sosQuickAccessTitle")}</Text>
                <Text style={styles.actionSubtitle}>{t("sosQuickAccessSubtitle")}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textGray} />
            </TouchableOpacity>
          </View>

          {/* Perguntas frequentes (FAQ) - clica pra ver a resposta */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="help-circle-outline" size={22} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>{t("faqSection")}</Text>
            </View>

            {FAQ.map((item, index) => {
              const open = expandedIndex === index;
              return (
                <View key={index} style={styles.faqCard}>
                  <TouchableOpacity
                    style={styles.faqHeader}
                    onPress={() => setExpandedIndex(open ? null : index)}
                  >
                    <Text style={styles.faqQuestion}>{t(item.qKey)}</Text>
                    <Ionicons
                      name={open ? "chevron-up" : "chevron-down"}
                      size={20}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                  {/* a resposta só aparece se a pergunta tiver aberta */}
                  {open && <Text style={styles.faqAnswer}>{t(item.aKey)}</Text>}
                </View>
              );
            })}
          </View>

          {/* Sobre o app */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle-outline" size={22} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>{t("aboutSection")}</Text>
            </View>

            <View style={styles.infoBox}>
              <Ionicons name="leaf-outline" size={20} color={COLORS.primary} />
              <Text style={styles.infoText}>
                {t("aboutText")}
              </Text>
            </View>
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
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  actionInfo: {
    flex: 1,
    marginLeft: SPACING.md,
    marginRight: SPACING.md,
  },
  actionTitle: {
    fontSize: FONT_SIZES.normal,
    fontWeight: "bold",
    color: COLORS.primaryDark,
  },
  actionSubtitle: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.textGray,
    marginTop: SPACING.xs,
  },
  faqCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.lg,
  },
  faqQuestion: {
    flex: 1,
    fontSize: FONT_SIZES.normal,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginRight: SPACING.md,
  },
  faqAnswer: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.textGray,
    lineHeight: 22,
    paddingBottom: SPACING.lg,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    padding: SPACING.lg,
  },
  infoText: {
    flex: 1,
    fontSize: FONT_SIZES.normal,
    color: COLORS.primaryDark,
    marginLeft: SPACING.md,
    lineHeight: 22,
  },
});
