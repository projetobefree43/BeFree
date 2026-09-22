// essa é a tela de Busca. aqui o usuário pode pesquisar por qualquer
// funcionalidade do app digitando palavras-chave. o app lista todas as
// opções que combinam com o que foi digitado, e ele pode clicar pra ir.

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
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
import { useLanguage } from "../i18n";

// lista de todas as funcionalidades que o usuário pode buscar
// cada uma tem título, subtítulo, ícone, rota (pra onde vai) e palavras-chave
const OPTIONS = [
  {
    title: "Início",
    titleKey: "searchHomeTitle",
    subtitle: "Hub central do app",
    subtitleKey: "searchHomeSubtitle",
    icon: "home",
    route: "/home",
    keywords: "inicio home principal dashboard menu inicial",
  },
  {
    title: "Botão SOS / Pânico",
    titleKey: "searchSosTitle",
    subtitle: "Intervenção imediata",
    subtitleKey: "searchSosSubtitle",
    icon: "alert-circle-outline",
    route: "/sos",
    keywords: "sos panico emergencia alerta urgencia ajuda desespero",
  },
  {
    title: "Rede de Apoio",
    titleKey: "searchSupportTitle",
    subtitle: "Gestão de contatos",
    subtitleKey: "searchSupportSubtitle",
    icon: "account-group-outline",
    route: "/support",
    keywords: "apoio contatos rede contato telefone suporte pessoas terapeuta",
  },
  {
    title: "Painel do Relógio",
    titleKey: "searchWatchTitle",
    subtitle: "BeFree Sync ativo",
    subtitleKey: "searchWatchSubtitle",
    icon: "watch-variant",
    route: "/watch",
    keywords: "relogio watch sync wearable notificacoes vibracao",
  },
  {
    title: "Diário de Gatilhos",
    titleKey: "searchJournalTitle",
    subtitle: "Mapeamento Emocional",
    subtitleKey: "searchJournalSubtitle",
    icon: "heart-pulse",
    route: "/journal",
    keywords: "diario gatilhos emocao registro anotacoes sentimentos",
  },
  {
    title: "Conquistas",
    titleKey: "searchAchievementsTitle",
    subtitle: "Gamificação & Metas",
    subtitleKey: "searchAchievementsSubtitle",
    icon: "trophy-outline",
    route: "/achievements",
    keywords: "conquistas trofeus gamificacao recompensas vitorias",
  },
  {
    title: "Perfil",
    titleKey: "searchProfileTitle",
    subtitle: "Sua conta e configurações",
    subtitleKey: "searchProfileSubtitle",
    icon: "person-outline",
    route: "/profile",
    keywords: "perfil conta usuario configuracoes sair logout dados",
  },
  {
    title: "Privacidade e Segurança",
    titleKey: "searchPrivacyTitle",
    subtitle: "Proteção de dados e acesso",
    subtitleKey: "searchPrivacySubtitle",
    icon: "lock-closed-outline",
    route: "/privacy",
    keywords: "privacidade seguranca senha dados ocultar esconder apagar limpar",
  },
  {
    title: "Ajuda e Suporte",
    titleKey: "searchHelpTitle",
    subtitle: "Contato e perguntas frequentes",
    subtitleKey: "searchHelpSubtitle",
    icon: "help-circle-outline",
    route: "/help",
    keywords: "ajuda suporte faq contato duvidas telefone email cvv samu central",
  },
];

// essa função normaliza o texto (tira acentos, deixa tudo minúsculo)
// pra facilitar a busca (ex: "Diário" e "diario" viram a mesma coisa)
const normalize = (text) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

// essa função compara o que o usuário digitou com as opções disponíveis
// e retorna as que mais combinam, ordenadas por relevância
const buildResults = (query) => {
  const term = normalize(query.trim());
  if (!term) return [];
  const results = [];
  for (const option of OPTIONS) {
    const title = normalize(option.title);
    const subtitle = normalize(option.subtitle);
    const keywords = normalize(option.keywords);
    let score = 0;
    // dá nota maior se achar no título do que nas keywords
    if (title.startsWith(term)) score = 3;
    else if (title.includes(term)) score = 2;
    else if (subtitle.includes(term) || keywords.includes(term)) score = 1;
    if (score > 0) results.push({ ...option, score });
  }
  // ordena do maior score pro menor (melhores resultados primeiro)
  return results.sort((a, b) => b.score - a.score);
};

export default function Search() {
  const router = useRouter();
  const { t } = useLanguage();
  const [query, setQuery] = useState("");

  const results = buildResults(query);
  const searching = query.trim().length > 0;

  return (
    <AnimatedScreen>
      <SafeAreaView style={styles.container}>
        <ScreenHeader title={t("searchTitle")} onBackPress={() => router.back()} />

        <View style={styles.content}>
          {/* barra de busca com ícone de lupa e botão de limpar */}
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color={COLORS.textGray} />
            <TextInput
              style={styles.searchInput}
              placeholder={t("searchPlaceholder")}
              placeholderTextColor={COLORS.textGray}
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")} hitSlop={10}>
                <Ionicons name="close-circle" size={20} color={COLORS.textGray} />
              </TouchableOpacity>
            )}
          </View>

          {/* se não digitou nada, mostra mensagem pedindo pra buscar */}
          {!searching ? (
            <View style={styles.emptyState}>
              <Ionicons name="search" size={80} color="#DDD" />
              <Text style={styles.emptyText}>
                {t("searchEmptyPrompt")}
              </Text>
            </View>
          ) : /* se digitou mas não achou nada */
          results.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search" size={80} color="#DDD" />
              <Text style={styles.emptyText}>
                {t("noResults", { query: query.trim() })}
              </Text>
            </View>
          ) : (
            /* se achou resultados, mostra a lista */
            <ScrollView
              style={styles.resultsList}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.resultsLabel}>{t("resultsLabel")}</Text>
              {results.map((option) => (
                <TouchableOpacity
                  key={option.route}
                  style={styles.resultCard}
                  onPress={() => router.push(option.route)}
                  activeOpacity={0.8}
                >
                  <View style={styles.resultIcon}>
                    <Ionicons name={option.icon} size={20} color={COLORS.primary} />
                  </View>
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultTitle}>{t(option.titleKey)}</Text>
                    <Text style={styles.resultSubtitle}>{t(option.subtitleKey)}</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={COLORS.textGray}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
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
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl + SPACING.xl,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    marginBottom: SPACING.xl,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    fontSize: FONT_SIZES.medium,
    color: COLORS.textDark,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 80,
  },
  emptyText: {
    fontSize: FONT_SIZES.medium,
    color: "#888",
    marginTop: SPACING.lg,
    textAlign: "center",
  },
  resultsList: {
    flex: 1,
  },
  resultsLabel: {
    fontSize: FONT_SIZES.normal,
    fontWeight: "bold",
    color: COLORS.primaryDark,
    marginBottom: SPACING.md,
  },
  resultCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  resultInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  resultTitle: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.primaryDark,
  },
  resultSubtitle: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.textGray,
    marginTop: SPACING.xs,
  },
});
