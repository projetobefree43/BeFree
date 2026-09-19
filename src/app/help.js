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

// lista de perguntas frequentes e suas respostas
const FAQ = [
  {
    q: "Como funciona o botão SOS?",
    a: "Ao tocar em \"Ativar SOS\", um alerta de emergência é emitido com um som de 5 segundos e o app mostra as orientações. Edite seus contatos de confiança na Rede de Apoio.",
  },
  {
    q: "Onde meus dados são armazenados?",
    a: "Tudo fica salvo somente no seu aparelho, em banco local. Nenhuma informação é enviada para servidores. Você pode apagar tudo em Perfil → Privacidade e Segurança.",
  },
  {
    q: "Como editar ou remover um contato?",
    a: "Abra a Rede de Apoio, toque no contato e use os botões de editar ou excluir.",
  },
  {
    q: "Como altero minha senha?",
    a: "Vá em Perfil → Privacidade e Segurança ou em Configurações da Conta e use o campo \"Alterar senha\".",
  },
  {
    q: "Preciso de ajuda agora. O que faço?",
    a: "Toque no botão SOS ou ligue gratuitamente para o CVV (188) ou SAMU (192). Você não está sozinho.",
  },
];

// função que abre links externos (telefone, e-mail, etc.)
const openExternalUrl = async (url) => {
  try {
    await Linking.openURL(url);
  } catch (_) {
    Alert.alert("Não foi possível abrir", "Tente novamente mais tarde.");
  }
};

export default function Help() {
  const router = useRouter();
  // expandedIndex controla qual pergunta do FAQ tá aberta (nenhuma = null)
  const [expandedIndex, setExpandedIndex] = useState(null);

  return (
    <AnimatedScreen>
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          title="Ajuda e Suporte"
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
              <Text style={styles.sectionTitle}>Contatos de emergência</Text>
            </View>

            {/* CVV - quando clica, abre a tela de ligação do celular */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => openExternalUrl("tel:188")}
            >
              <Ionicons name="heart-outline" size={20} color={COLORS.danger} />
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>CVV - Centro de Valorização da Vida</Text>
                <Text style={styles.actionSubtitle}>
                  Ligação gratuita, 24h por dia. Disque 188
                </Text>
              </View>
              <Ionicons name="call-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>

            {/* SAMU */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => openExternalUrl("tel:192")}
            >
              <Ionicons name="ambulance" size={20} color={COLORS.danger} />
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>SAMU</Text>
                <Text style={styles.actionSubtitle}>
                  Emergência médica. Disque 192
                </Text>
              </View>
              <Ionicons name="call-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* Fale com a gente (e-mail de suporte) */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="chatbubbles-outline" size={22} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Fale com a gente</Text>
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                openExternalUrl(
                  "mailto:projetobefree43@gmail.com?subject=Ajuda%20e%20Suporte"
                )
              }
            >
              <Ionicons name="mail-outline" size={20} color={COLORS.primary} />
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>E-mail de suporte</Text>
                <Text style={styles.actionSubtitle}>projetobefree43@gmail.com</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textGray} />
            </TouchableOpacity>
          </View>

          {/* Acesso rápido pra funcionalidades importantes */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="flash-outline" size={22} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Acesso rápido</Text>
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/support")}
            >
              <Ionicons name="account-group-outline" size={20} color={COLORS.primary} />
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>Rede de Apoio</Text>
                <Text style={styles.actionSubtitle}>Gerencie seus contatos de confiança</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textGray} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/sos")}
            >
              <Ionicons name="alert-circle-outline" size={20} color={COLORS.danger} />
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>Botão SOS / Pânico</Text>
                <Text style={styles.actionSubtitle}>Ative o alerta de emergência</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textGray} />
            </TouchableOpacity>
          </View>

          {/* Perguntas frequentes (FAQ) - clica pra ver a resposta */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="help-circle-outline" size={22} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Perguntas frequentes</Text>
            </View>

            {FAQ.map((item, index) => {
              const open = expandedIndex === index;
              return (
                <View key={index} style={styles.faqCard}>
                  <TouchableOpacity
                    style={styles.faqHeader}
                    onPress={() => setExpandedIndex(open ? null : index)}
                  >
                    <Text style={styles.faqQuestion}>{item.q}</Text>
                    <Ionicons
                      name={open ? "chevron-up" : "chevron-down"}
                      size={20}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                  {/* a resposta só aparece se a pergunta tiver aberta */}
                  {open && <Text style={styles.faqAnswer}>{item.a}</Text>}
                </View>
              );
            })}
          </View>

          {/* Sobre o app */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle-outline" size={22} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Sobre o BeFree</Text>
            </View>

            <View style={styles.infoBox}>
              <Ionicons name="leaf-outline" size={20} color={COLORS.primary} />
              <Text style={styles.infoText}>
                BeFree é um aplicativo de apoio ao bem-estar com dados salvos
                localmente. Versão 1.0.0.
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
