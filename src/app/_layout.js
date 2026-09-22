// esse arquivo configura a navegação principal do app (expo-router).
// ele cria uma "pilha" de telas (Stack), onde cada tela nova fica por cima
// da anterior. o cabeçalho padrão fica escondido porque cada tela
// gera o próprio cabeçalho/botão de voltar.

import { Stack } from "expo-router";
import { COLORS } from "../constants/styles";
import { LanguageProvider } from "../i18n";

export default function RootLayout() {
  return (
    <LanguageProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
        }}
      />
    </LanguageProvider>
  );
}
