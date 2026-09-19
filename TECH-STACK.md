# BeFree — Tech Stack

Documentação das tecnologias utilizadas no projeto, levantada a partir de
`package.json`, imports e configurações do código. Este arquivo é apenas
informativo e não é referenciado pelo código do app.

## Framework principal

- **React Native**: `0.86.2`
- **React**: `19.2.3`
- **Expo SDK**: `~57.0.12`

O projeto foi criado com `create-expo-app` (template Expo Router) e usa
**Expo Go** / development builds para rodar.

## Linguagem

O projeto é **misto**:

- **TypeScript** (`~6.0.3`) nas pastas `src/components`, `src/constants` e
  `src/hooks` (arquivos `.ts`/`.tsx`).
- **JavaScript** nas rotas/telas do app (`src/app/*.js`), bem como em
  `src/db.js`.
- `tsconfig.json` estende `expo/tsconfig.base` com `strict: true` e os aliases
  `@/*` → `./src/*` e `@/assets/*` → `./assets/*`.

## Navegação

- **Expo Router** (`expo-router` `~57.0.12`) com **roteamento por arquivos**
  em `src/app/`.
- O layout raiz (`src/app/_layout.js`) usa um `Stack` com cabeçalho oculto
  (`headerShown: false`), onde cada tela gerencia seu próprio cabeçalho/botão
  de voltar.
- Não há uso de React Navigation direto — o Expo Router o encapsula.

## Gerenciamento de estado

- **State local do React** (`useState`/`useEffect`) nas telas.
- **Persistência em SQLite** via `expo-sqlite` (ver "Armazenamento local").
- **Não** usa Redux, Zustand, MobX ou Context API.

## Estilização

- **`StyleSheet` nativo do React Native** para todos os componentes e telas.
- Paleta de cores, espaçamentos, tamanhos de fonte e pesos centralizados em
  `src/constants/styles.ts` (`COLORS`, `SPACING`, `FONT_SIZES`,
  `FONT_WEIGHTS`, `COMMON_STYLES`).
- `react-native-reanimated` (`4.5.1`) para animações (entrada de tela, pulso
  do SOS, escala de botões/cards).
- Há resquícios do template Expo com CSS variables (`src/global.css`) e
  `@/constants/theme.ts` (tema claro/escuro) usados por componentes nativos do
  template (`themed-text`, `themed-view`, etc.), que não são importados pelas
  telas atuais.

## Backend / API

- **Sem backend remoto.** Aplicação 100% local.
- Não há chamadas a Firebase, Supabase ou qualquer serviço HTTP.
- Única integração externa: `expo-image-picker` (escolha de foto de perfil da
  galeria/câmera, armazenada localmente como base64) e `expo-web-browser` /
  `expo-linking` (abrir URLs no navegador), ambos em funcionalidades pontuais.
- `help.js` usa `Linking.openURL` para chamadas telefônicas/email de suporte.

## Armazenamento local

- **SQLite** via `expo-sqlite` (`~57.0.2`), banco `befree.db`, gerenciado por
  `src/db.js`.
  - Tabelas: `users`, `journal_entries`, `support_contacts`, `settings`.
  - Migrações por `PRAGMA user_version` (versão atual: 3).
- **`@react-native-async-storage/async-storage`** (`~3.1.1`) está listado como
  dependência, porém o código efetivamente usa SQLite para todo o
  armazenamento (o AsyncStorage não é importado em nenhum arquivo atualmente).

## Ferramentas de build / dev

- **Expo CLI** (SDK 57) — scripts: `start`, `android`, `ios`, `web`, `lint`.
- **Metro bundler** (config em `metro.config.js`, que adiciona `wasm` às
  extensões de assets, necessário para o `expo-sqlite`).
- **TypeScript** + **ESLint** (`eslint-config-expo` flat config em
  `eslint.config.js`).
- Experimentos de runtime ativados em `app.json`: `reactCompiler: true` e
  `typedRoutes: true`.
- Repositório usa Git.

## Outras bibliotecas relevantes

- **Ícones**: `@expo/vector-icons` (`~15.0.2` — `Ionicons` e
  `MaterialCommunityIcons`).
- **Imagens**: `expo-image` (`~57.0.2`).
- **Animações**: `react-native-reanimated` (`4.5.1`) +
  `react-native-worklets` (`0.10.1`);
  `expo-glass-effect` e `expo-symbols` presentes no template.
- **UI nativa**: `@expo/ui` (`~57.0.10`).
- **Áudio**: `expo-audio` (`~57.0.4`) — usado na tela SOS (`sos-alert.wav`).
- **Mídia**: `expo-image-picker` (`~57.0.15`).
- **Suporte multi-plataforma**: `react-native-safe-area-context`,
  `react-native-screens` (usados pelo Expo Router);
  `react-native-web` (`~0.21.0`) para Web;
  `expo-linear-gradient`.
- **Utilitários**: `expo-constants`, `expo-device`, `expo-font`,
  `expo-linking`, `expo-splash-screen`, `expo-status-bar`, `expo-system-ui`,
  `expo-web-browser`.
- **Dev/ferramentas**: `@expo/ngrok`.

## Estrutura de pastas

```
BeFree/
├── assets/                 # Mídia (imagens, áudio, ícones)
│   ├── audio/              #   sos-alert.wav
│   ├── images/             #   logo.png, welcome-bg.png, etc.
│   └── expo.icon/
├── scripts/                # Scripts auxiliares (reset-project)
├── src/
│   ├── app/                # Rotas/telas (Expo Router, por arquivo)
│   │   ├── _layout.js      #   Stack raiz (cabeçalho oculto)
│   │   ├── index.js        #   Splash/redirect
│   │   ├── welcome.js      #   Onboarding
│   │   ├── login.js        #   Login
│   │   ├── register.js     #   Cadastro
│   │   ├── home.js         #   Tela principal (hub)
│   │   ├── Dashboard.js    #   Cópia visual de home.js (duplicada)
│   │   ├── journal.js      #   Diário de gatilhos
│   │   ├── sos.js          #   Botão SOS / pânico
│   │   ├── support.js      #   Rede de apoio (contatos)
│   │   ├── search.js       #   Busca de opções
│   │   ├── watch.js        #   Painel do relógio (sync)
│   │   ├── achievements.js #   Conquistas/gamificação
│   │   ├── profile.js      #   Perfil do usuário
│   │   ├── account.js      #   Configurações da conta
│   │   ├── privacy.js      #   Privacidade e segurança
│   │   └── help.js         #   Ajuda e suporte
│   ├── components/         # Componentes reutilizáveis
│   │   ├── animated-*.tsx  #   Botão/card/ícone/tela com animação
│   │   ├── menu-card.tsx   #   Card de funcionalidade
│   │   ├── screen-header.tsx # Cabeçalho com botão voltar
│   │   ├── info-box.tsx    #   Caixa de informação
│   │   ├── themed-*.tsx    #   (template) texto/visão temáticos
│   │   └── ui/collapsible.tsx # (template)
│   ├── constants/          # Configurações
│   │   ├── styles.ts       #   COLORS / SPACING / FONT_SIZES
│   │   └── theme.ts        #   (template) tema claro/escuro
│   ├── hooks/              # Hooks customizados
│   │   ├── use-color-scheme.ts(.web).ts
│   │   └── use-theme.ts    #   (usados pelo template)
│   ├── db.js               # Camada de acesso ao SQLite
│   └── global.css          # Variáveis CSS (web) do template
├── app.json                # Configuração do Expo
├── metro.config.js         # Config do Metro (wasm)
├── eslint.config.js        # Config do ESLint
├── tsconfig.json           # Config do TypeScript
└── package.json
```

> **Nota:** Os arquivos marcados como "(template)" são códigos deixados pelo
> `create-expo-app` (starter). Eles não são importados pelas telas atuais do
> app e podem ser removidos futuramente, caso confirmado que não são usados.
```
