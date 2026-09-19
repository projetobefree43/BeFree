// esse arquivo configura a navegação principal do app (expo-router).
// ele cria uma "pilha" de telas (Stack), onde cada tela nova fica por cima
// da anterior. o cabeçalho padrão fica escondido porque cada tela
// gera o próprio cabeçalho/botão de voltar.

import { Stack } from "expo-router";
import { COLORS } from "../constants/styles";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    />
  );
}
