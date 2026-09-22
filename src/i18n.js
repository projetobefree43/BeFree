// esse arquivo concentra todas as traduções do app.
// cada chave tem uma versão em português (pt) e uma em inglês (en).
// o valor padrão é sempre o texto em português que já existia no app.

import { createContext, useContext, useState } from "react";

export const translations = {
  pt: {
    // textos gerais / comuns a várias telas
    cancel: "Cancelar",
    delete: "Excluir",
    save: "Salvar",
    add: "Adicionar",
    error: "Erro",
    success: "Sucesso",
    requiredFields: "Campos obrigatórios",
    invalidEmail: "Email inválido",
    invalidEmailMessage: "Digite um endereço de email válido.",
    passwordTooShort: "Senha muito curta",
    passwordTooShortMessage: "A senha precisa ter pelo menos 6 caracteres.",
    emailLabel: "Email",
    passwordLabel: "Senha",
    emailPlaceholder: "Digite seu email",
    passwordPlaceholder: "Digite sua senha",
    currentPasswordLabel: "Senha atual",
    currentPasswordPlaceholder: "Digite sua senha atual",
    newPasswordLabel: "Nova senha",
    newPasswordPlaceholder: "Mínimo de 6 caracteres",
    changePasswordButton: "Alterar senha",
    passwordRequiredMessage: "Informe a senha atual e a nova senha.",
    wrongCurrentPassword: "Senha atual incorreta",
    wrongCurrentPasswordMessage: "Verifique a senha atual.",
    passwordChanged: "Sua senha foi alterada.",
    passwordChangeError: "Não foi possível alterar a senha.",
    sessionSection: "Sessão",
    logoutAccountButton: "Sair da conta",

    // tela principal (home / dashboard)
    greeting: "Olá",
    greetingWithName: "Olá, {name}! 👋",
    subGreeting: "Pronta para mais um dia de escolhas livres?",
    sosSubText: "Pressione em emergência",
    bannerText:
      "“Cada escolha certa te aproxima da sua melhor versão.”",
    supportCardTitle: "Rede de Apoio",
    supportCardSubtitle: "Gestão de contatos",
    watchCardTitle: "Painel do Relógio",
    watchCardSubtitle: "BeFree Sync ativo",
    journalCardTitle: "Diário de Gatilhos",
    journalCardSubtitle: "Mapeamento Emocional",
    achievementsCardTitle: "Conquistas",
    achievementsCardSubtitle: "Gamificação & Metas",
    bottomNavHome: "Início",
    bottomNavSearch: "Buscar",
    bottomNavProfile: "Perfil",

    // tela SOS
    sosTitle: "Botão SOS / Pânico",
    sosSubtitle: "Intervenção imediata",
    sosDescription: "Clique para ativar o sistema de emergência.",
    sosActivateButton: "ATIVAR SOS",
    sosConfirmTitle: "Ativar SOS?",
    sosConfirmMessage:
      "Um alerta de emergência será enviado para seus contatos de confiança.",
    activate: "Ativar",
    sosActivatedTitle: "SOS Ativado",
    sosActivatedMessage:
      "Alerta enviado para seus contatos de confiança. Fique em um local seguro e aguarde ajuda.",

    // tela de boas-vindas
    welcomeTitle: "Você merece\numa vida livre.",
    getStartedButton: "Começar agora",
    loginQuestion: "Já tem uma conta?",
    loginButton: "Entrar",

    // tela de login
    loginTitle: "Entrar",
    loginSubtitle: "Bom te ter de volta!",
    rememberMe: "Lembrar de mim",
    forgotPassword: "Esqueceu a senha?",
    noAccount: "Não tem conta? ",
    signUpLink: "Cadastre-se",
    requiredFieldsLoginMessage: "Preencha o email e a senha para entrar.",
    accountNotFound: "Conta não encontrada",
    accountNotFoundMessage:
      "Este email não está cadastrado. Crie uma conta primeiro.",
    wrongPassword: "Senha incorreta",
    wrongPasswordMessage: "Verifique a senha e tente novamente.",
    loginErrorMessage: "Não foi possível entrar. Tente novamente.",

    // tela de cadastro
    registerTitle: "Criar Conta",
    registerSubtitle: "Sua liberdade começa aqui!",
    nameLabel: "Nome completo",
    namePlaceholder: "Digite seu nome",
    createAccountButton: "Criar Conta",
    haveAccount: "Já tem uma conta? ",
    requiredFieldsRegisterMessage: "Preencha nome, email e senha para continuar.",
    emailAlreadyRegistered: "Email já cadastrado",
    emailAlreadyRegisteredMessage:
      "Já existe uma conta com este email. Tente entrar.",
    registerErrorMessage: "Não foi possível criar a conta. Tente novamente.",

    // tela de perfil
    profileTitle: "Perfil",
    infoSection: "Informações",
    memberSinceLabel: "Membro desde:",
    memberSinceValue: "Janeiro 2024",
    streakLabel: "Sequência atual:",
    streakValue: "7 dias",
    settingsSection: "Configurações",
    accountSettingsLabel: "Configurações da Conta",
    privacySettingsLabel: "Privacidade e Segurança",
    helpSupportLabel: "Ajuda e Suporte",
    logoutButton: "Sair da Conta",

    // tela de configurações da conta
    accountSettingsTitle: "Configurações da Conta",
    personalDataSection: "Dados pessoais",
    choosePhotoButton: "Escolher foto",
    removePhotoButton: "Remover foto",
    savePhotoButton: "Salvar foto",
    yourNamePlaceholder: "Seu nome",
    yourEmailPlaceholder: "Seu email",
    saveChangesButton: "Salvar alterações",
    changePasswordSection: "Alterar senha",
    dangerZoneSection: "Zona de perigo",
    deleteMyAccountButton: "Excluir minha conta",
    permissionRequired: "Permissão necessária",
    permissionRequiredMessage:
      "Precisamos de acesso às suas fotos para escolher uma imagem de perfil.",
    photoUpdated: "Sua foto de perfil foi atualizada.",
    photoSaveError: "Não foi possível salvar a foto. Tente novamente.",
    photoRemoved: "Sua foto de perfil foi removida.",
    photoRemoveError: "Não foi possível remover a foto. Tente novamente.",
    requiredFieldsAccountMessage: "Preencha o nome e o email para continuar.",
    emailInUseMessage: "Este email já está em uso por outra conta.",
    dataUpdated: "Seus dados foram atualizados.",
    updateError: "Não foi possível atualizar. Tente novamente.",
    deleteAccountTitle: "Excluir conta",
    deleteAccountMessage:
      "Todos os seus dados (contatos, diário, metas e configurações) serão apagados para sempre. Tem certeza?",
    deleteAccountError: "Não foi possível excluir a conta.",

    // tela de privacidade e segurança
    privacyTitle: "Privacidade e Segurança",
    accessVisibilitySection: "Acesso e visibilidade",
    hideNameSetting: "Ocultar meu nome na tela inicial",
    hideNameHint: "Não exibe seu nome na saudação do app",
    yourDataSection: "Seus dados",
    dataInfoText:
      "Todos os seus dados ficam armazenados somente neste aparelho, em banco local. Nenhuma informação é enviada para servidores.",
    deleteAllDataButton: "Apagar todos os dados do app",
    userNotFound: "Usuário não encontrado.",
    deleteAllDataTitle: "Apagar todos os dados",
    deleteAllDataMessage:
      "Todos os dados locais deste aparelho (contas, diário, contatos e configurações) serão apagados para sempre. Esta ação não pode ser desfeita.",
    deleteEverything: "Apagar tudo",
    deleteAllError: "Não foi possível apagar os dados.",

    // tela de ajuda e suporte
    helpTitle: "Ajuda e Suporte",
    emergencyContactsSection: "Contatos de emergência",
    cvvTitle: "CVV - Centro de Valorização da Vida",
    cvvSubtitle: "Ligação gratuita, 24h por dia. Disque 188",
    samuTitle: "SAMU",
    samuSubtitle: "Emergência médica. Disque 192",
    contactUsSection: "Fale com a gente",
    supportEmailTitle: "E-mail de suporte",
    quickAccessSection: "Acesso rápido",
    supportNetworkTitle: "Rede de Apoio",
    supportNetworkSubtitle: "Gerencie seus contatos de confiança",
    sosQuickAccessTitle: "Botão SOS / Pânico",
    sosQuickAccessSubtitle: "Ative o alerta de emergência",
    faqSection: "Perguntas frequentes",
    faq1q: "Como funciona o botão SOS?",
    faq1a:
      'Ao tocar em "Ativar SOS", um alerta de emergência é emitido com um som de 5 segundos e o app mostra as orientações. Edite seus contatos de confiança na Rede de Apoio.',
    faq2q: "Onde meus dados são armazenados?",
    faq2a:
      "Tudo fica salvo somente no seu aparelho, em banco local. Nenhuma informação é enviada para servidores. Você pode apagar tudo em Perfil → Privacidade e Segurança.",
    faq3q: "Como editar ou remover um contato?",
    faq3a: "Abra a Rede de Apoio, toque no contato e use os botões de editar ou excluir.",
    faq4q: "Como altero minha senha?",
    faq4a:
      'Vá em Perfil → Privacidade e Segurança ou em Configurações da Conta e use o campo "Alterar senha".',
    faq5q: "Preciso de ajuda agora. O que faço?",
    faq5a:
      "Toque no botão SOS ou ligue gratuitamente para o CVV (188) ou SAMU (192). Você não está sozinho.",
    aboutSection: "Sobre o BeFree",
    aboutText:
      "BeFree é um aplicativo de apoio ao bem-estar com dados salvos localmente. Versão 1.0.0.",
    openFailed: "Não foi possível abrir",
    tryLater: "Tente novamente mais tarde.",

    // tela da rede de apoio
    supportTitle: "Rede de Apoio",
    supportSubtitle: "Gestão de contatos",
    addContactButton: "Adicionar Contato",
    modalEditContactTitle: "Editar Contato",
    modalNewContactTitle: "Novo Contato",
    contactNameLabel: "Nome",
    contactPhoneLabel: "Telefone",
    contactNamePlaceholder: "Nome do contato",
    requiredFieldsContactMessage:
      "Preencha o nome e o telefone do contato para continuar.",
    deleteContactTitle: "Excluir contato",
    deleteContactMessage:
      "Tem certeza que deseja excluir {name} da sua rede de apoio?",

    // tela de busca
    searchTitle: "Buscar",
    searchPlaceholder: "Buscar na aplicação...",
    searchEmptyPrompt: "Digite para buscar opções no app",
    noResults: 'Nenhum resultado para "{query}"',
    resultsLabel: "Opções encontradas",
    searchHomeTitle: "Início",
    searchHomeSubtitle: "Hub central do app",
    searchSosTitle: "Botão SOS / Pânico",
    searchSosSubtitle: "Intervenção imediata",
    searchSupportTitle: "Rede de Apoio",
    searchSupportSubtitle: "Gestão de contatos",
    searchWatchTitle: "Painel do Relógio",
    searchWatchSubtitle: "BeFree Sync ativo",
    searchJournalTitle: "Diário de Gatilhos",
    searchJournalSubtitle: "Mapeamento Emocional",
    searchAchievementsTitle: "Conquistas",
    searchAchievementsSubtitle: "Gamificação & Metas",
    searchProfileTitle: "Perfil",
    searchProfileSubtitle: "Sua conta e configurações",
    searchPrivacyTitle: "Privacidade e Segurança",
    searchPrivacySubtitle: "Proteção de dados e acesso",
    searchHelpTitle: "Ajuda e Suporte",
    searchHelpSubtitle: "Contato e perguntas frequentes",

    // diário de gatilhos
    journalTitle: "Diário de Gatilhos",
    journalSubtitle: "Mapeamento Emocional",
    entryTrigger: "Gatilho: {value}",
    entryEmotion: "Emoção: {value}",
    entryResponse: "Resposta: {value}",
    newEntryButton: "Novo Registro",
    modalEditEntryTitle: "Editar Registro",
    modalNewEntryTitle: "Novo Registro",
    triggerLabel: "Gatilho",
    triggerPlaceholder: "O que aconteceu?",
    emotionLabel: "Emoção",
    emotionPlaceholder: "Como você se sentiu?",
    responseLabel: "Resposta",
    responsePlaceholder: "Como você reagiu?",
    requiredField: "Campo obrigatório",
    requiredTriggerMessage:
      "Descreva o gatilho que você identificou para continuar.",
    deleteEntryTitle: "Excluir registro",
    deleteEntryMessage: "Tem certeza que deseja excluir este registro?",

    // conquistas
    achievementsTitle: "Conquistas",
    achievementsSubtitle: "Gamificação & Metas",
    progressLabel: "Progresso: 40%",
    firstAchievementTitle: "Primeira Conquista",
    firstAchievementDesc: "Completou 1 dia",
    streakAchievementTitle: "Sequência",
    streakAchievementDesc: "7 dias seguidos",
    championAchievementTitle: "Campeão",
    championAchievementDesc: "30 dias de vitórias",

    // painel do relógio
    watchTitle: "Painel do Relógio",
    watchSubtitle: "BeFree Sync ativo",
    connectionStatusLabel: "Status da conexão:",
    connected: "🟢 Conectado",
    disconnected: "🔴 Desconectado",
    watchInfoText:
      "Seu relógio inteligente está sincronizado com o BeFree. Receba notificações em tempo real!",
    openSettingsButton: "Abrir Configurações",
    syncSettingsTitle: "Configurações do Sync",
    realtimeNotificationsLabel: "Notificações em tempo real",
    relapseAlertsHint: "Recebe alertas de recaída",
    wristVibrationLabel: "Vibração no pulso",
    stressAlertHint: "Alerta físico ao estresse",
    closeButton: "Fechar",
  },

  en: {
    // general texts / common to many screens
    cancel: "Cancel",
    delete: "Delete",
    save: "Save",
    add: "Add",
    error: "Error",
    success: "Success",
    requiredFields: "Required fields",
    invalidEmail: "Invalid email",
    invalidEmailMessage: "Enter a valid email address.",
    passwordTooShort: "Password too short",
    passwordTooShortMessage: "The password must have at least 6 characters.",
    emailLabel: "Email",
    passwordLabel: "Password",
    emailPlaceholder: "Enter your email",
    passwordPlaceholder: "Enter your password",
    currentPasswordLabel: "Current password",
    currentPasswordPlaceholder: "Enter your current password",
    newPasswordLabel: "New password",
    newPasswordPlaceholder: "Minimum 6 characters",
    changePasswordButton: "Change password",
    passwordRequiredMessage: "Enter your current and new password.",
    wrongCurrentPassword: "Incorrect current password",
    wrongCurrentPasswordMessage: "Check your current password.",
    passwordChanged: "Your password was changed.",
    passwordChangeError: "Could not change the password.",
    sessionSection: "Session",
    logoutAccountButton: "Log out",

    // main screen (home / dashboard)
    greeting: "Hello",
    greetingWithName: "Hello, {name}! 👋",
    subGreeting: "Ready for another day of free choices?",
    sosSubText: "Press in emergency",
    bannerText:
      "“Every right choice brings you closer to your best self.”",
    supportCardTitle: "Support Network",
    supportCardSubtitle: "Contact management",
    watchCardTitle: "Watch Panel",
    watchCardSubtitle: "BeFree Sync active",
    journalCardTitle: "Trigger Diary",
    journalCardSubtitle: "Emotional Mapping",
    achievementsCardTitle: "Achievements",
    achievementsCardSubtitle: "Gamification & Goals",
    bottomNavHome: "Home",
    bottomNavSearch: "Search",
    bottomNavProfile: "Profile",

    // SOS screen
    sosTitle: "SOS / Panic Button",
    sosSubtitle: "Immediate intervention",
    sosDescription: "Tap to activate the emergency system.",
    sosActivateButton: "ACTIVATE SOS",
    sosConfirmTitle: "Activate SOS?",
    sosConfirmMessage:
      "An emergency alert will be sent to your trusted contacts.",
    activate: "Activate",
    sosActivatedTitle: "SOS Activated",
    sosActivatedMessage:
      "Alert sent to your trusted contacts. Stay in a safe place and wait for help.",

    // welcome screen
    welcomeTitle: "You deserve\na free life.",
    getStartedButton: "Get started",
    loginQuestion: "Already have an account?",
    loginButton: "Log in",

    // login screen
    loginTitle: "Log in",
    loginSubtitle: "Good to have you back!",
    rememberMe: "Remember me",
    forgotPassword: "Forgot your password?",
    noAccount: "Don't have an account? ",
    signUpLink: "Sign up",
    requiredFieldsLoginMessage: "Fill in your email and password to log in.",
    accountNotFound: "Account not found",
    accountNotFoundMessage:
      "This email is not registered. Create an account first.",
    wrongPassword: "Incorrect password",
    wrongPasswordMessage: "Check your password and try again.",
    loginErrorMessage: "Could not log in. Try again.",

    // registration screen
    registerTitle: "Create Account",
    registerSubtitle: "Your freedom starts here!",
    nameLabel: "Full name",
    namePlaceholder: "Enter your name",
    createAccountButton: "Create Account",
    haveAccount: "Already have an account? ",
    requiredFieldsRegisterMessage:
      "Fill in your name, email and password to continue.",
    emailAlreadyRegistered: "Email already registered",
    emailAlreadyRegisteredMessage:
      "There is already an account with this email. Try logging in.",
    registerErrorMessage: "Could not create the account. Try again.",

    // profile screen
    profileTitle: "Profile",
    infoSection: "Information",
    memberSinceLabel: "Member since:",
    memberSinceValue: "January 2024",
    streakLabel: "Current streak:",
    streakValue: "7 days",
    settingsSection: "Settings",
    accountSettingsLabel: "Account Settings",
    privacySettingsLabel: "Privacy and Security",
    helpSupportLabel: "Help and Support",
    logoutButton: "Log Out",

    // account settings screen
    accountSettingsTitle: "Account Settings",
    personalDataSection: "Personal data",
    choosePhotoButton: "Choose photo",
    removePhotoButton: "Remove photo",
    savePhotoButton: "Save photo",
    yourNamePlaceholder: "Your name",
    yourEmailPlaceholder: "Your email",
    saveChangesButton: "Save changes",
    changePasswordSection: "Change password",
    dangerZoneSection: "Danger zone",
    deleteMyAccountButton: "Delete my account",
    permissionRequired: "Permission required",
    permissionRequiredMessage:
      "We need access to your photos to choose a profile picture.",
    photoUpdated: "Your profile picture was updated.",
    photoSaveError: "Could not save the photo. Try again.",
    photoRemoved: "Your profile picture was removed.",
    photoRemoveError: "Could not remove the photo. Try again.",
    requiredFieldsAccountMessage: "Fill in your name and email to continue.",
    emailInUseMessage: "This email is already in use by another account.",
    dataUpdated: "Your data was updated.",
    updateError: "Could not update. Try again.",
    deleteAccountTitle: "Delete account",
    deleteAccountMessage:
      "All your data (contacts, diary, goals and settings) will be permanently deleted. Are you sure?",
    deleteAccountError: "Could not delete the account.",

    // privacy and security screen
    privacyTitle: "Privacy and Security",
    accessVisibilitySection: "Access and visibility",
    hideNameSetting: "Hide my name on the home screen",
    hideNameHint: "Does not show your name in the app greeting",
    yourDataSection: "Your data",
    dataInfoText:
      "All your data is stored only on this device, in a local database. No information is sent to servers.",
    deleteAllDataButton: "Delete all app data",
    userNotFound: "User not found.",
    deleteAllDataTitle: "Delete all data",
    deleteAllDataMessage:
      "All local data on this device (accounts, diary, contacts and settings) will be permanently deleted. This action cannot be undone.",
    deleteEverything: "Delete everything",
    deleteAllError: "Could not delete the data.",

    // help and support screen
    helpTitle: "Help and Support",
    emergencyContactsSection: "Emergency contacts",
    cvvTitle: "CVV - Life Appreciation Center",
    cvvSubtitle: "Free call, 24 hours a day. Dial 188",
    samuTitle: "SAMU",
    samuSubtitle: "Medical emergency. Dial 192",
    contactUsSection: "Talk to us",
    supportEmailTitle: "Support email",
    quickAccessSection: "Quick access",
    supportNetworkTitle: "Support Network",
    supportNetworkSubtitle: "Manage your trusted contacts",
    sosQuickAccessTitle: "SOS / Panic Button",
    sosQuickAccessSubtitle: "Activate the emergency alert",
    faqSection: "Frequently asked questions",
    faq1q: "How does the SOS button work?",
    faq1a:
      'When you tap "Activate SOS", an emergency alert goes off with a 5-second sound and the app shows the instructions. Edit your trusted contacts in the Support Network.',
    faq2q: "Where is my data stored?",
    faq2a:
      "Everything is saved only on your device, in a local database. No information is sent to servers. You can delete everything in Profile → Privacy and Security.",
    faq3q: "How do I edit or remove a contact?",
    faq3a:
      "Open the Support Network, tap the contact and use the edit or delete buttons.",
    faq4q: "How do I change my password?",
    faq4a:
      'Go to Profile → Privacy and Security or Account Settings and use the "Change password" field.',
    faq5q: "I need help right now. What do I do?",
    faq5a:
      "Tap the SOS button or call for free CVV (188) or SAMU (192). You are not alone.",
    aboutSection: "About BeFree",
    aboutText:
      "BeFree is a wellbeing support app with data saved locally. Version 1.0.0.",
    openFailed: "Could not open",
    tryLater: "Try again later.",

    // support network screen
    supportTitle: "Support Network",
    supportSubtitle: "Contact management",
    addContactButton: "Add Contact",
    modalEditContactTitle: "Edit Contact",
    modalNewContactTitle: "New Contact",
    contactNameLabel: "Name",
    contactPhoneLabel: "Phone",
    contactNamePlaceholder: "Contact name",
    requiredFieldsContactMessage:
      "Fill in the contact's name and phone number to continue.",
    deleteContactTitle: "Delete contact",
    deleteContactMessage:
      "Are you sure you want to remove {name} from your support network?",

    // search screen
    searchTitle: "Search",
    searchPlaceholder: "Search the app...",
    searchEmptyPrompt: "Type to search for options in the app",
    noResults: 'No results for "{query}"',
    resultsLabel: "Options found",
    searchHomeTitle: "Home",
    searchHomeSubtitle: "Central app hub",
    searchSosTitle: "SOS / Panic Button",
    searchSosSubtitle: "Immediate intervention",
    searchSupportTitle: "Support Network",
    searchSupportSubtitle: "Contact management",
    searchWatchTitle: "Watch Panel",
    searchWatchSubtitle: "BeFree Sync active",
    searchJournalTitle: "Trigger Diary",
    searchJournalSubtitle: "Emotional Mapping",
    searchAchievementsTitle: "Achievements",
    searchAchievementsSubtitle: "Gamification & Goals",
    searchProfileTitle: "Profile",
    searchProfileSubtitle: "Your account and settings",
    searchPrivacyTitle: "Privacy and Security",
    searchPrivacySubtitle: "Data protection and access",
    searchHelpTitle: "Help and Support",
    searchHelpSubtitle: "Contact and frequently asked questions",

    // trigger diary
    journalTitle: "Trigger Diary",
    journalSubtitle: "Emotional Mapping",
    entryTrigger: "Trigger: {value}",
    entryEmotion: "Emotion: {value}",
    entryResponse: "Response: {value}",
    newEntryButton: "New Entry",
    modalEditEntryTitle: "Edit Entry",
    modalNewEntryTitle: "New Entry",
    triggerLabel: "Trigger",
    triggerPlaceholder: "What happened?",
    emotionLabel: "Emotion",
    emotionPlaceholder: "How did you feel?",
    responseLabel: "Response",
    responsePlaceholder: "How did you react?",
    requiredField: "Required field",
    requiredTriggerMessage:
      "Describe the trigger you identified to continue.",
    deleteEntryTitle: "Delete entry",
    deleteEntryMessage: "Are you sure you want to delete this entry?",

    // achievements
    achievementsTitle: "Achievements",
    achievementsSubtitle: "Gamification & Goals",
    progressLabel: "Progress: 40%",
    firstAchievementTitle: "First Achievement",
    firstAchievementDesc: "Completed 1 day",
    streakAchievementTitle: "Streak",
    streakAchievementDesc: "7 days in a row",
    championAchievementTitle: "Champion",
    championAchievementDesc: "30 days of victories",

    // watch panel
    watchTitle: "Watch Panel",
    watchSubtitle: "BeFree Sync active",
    connectionStatusLabel: "Connection status:",
    connected: "🟢 Connected",
    disconnected: "🔴 Disconnected",
    watchInfoText:
      "Your smartwatch is synced with BeFree. Get real-time notifications!",
    openSettingsButton: "Open Settings",
    syncSettingsTitle: "Sync Settings",
    realtimeNotificationsLabel: "Real-time notifications",
    relapseAlertsHint: "Receives relapse alerts",
    wristVibrationLabel: "Wrist vibration",
    stressAlertHint: "Physical stress alert",
    closeButton: "Close",
  },
};

// estado global simples que guarda o idioma atual
// o padrão é sempre "pt" (nada muda até o usuário apertar o botão)
const LanguageContext = createContext({
  language: "pt",
  setLanguage: () => {},
  toggleLanguage: () => {},
});

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("pt");

  const toggleLanguage = () => {
    setLanguage((current) => (current === "pt" ? "en" : "pt"));
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, toggleLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// hook que as telas usam pra pegar o idioma atual, trocar de idioma
// e traduzir qualquer chave: useLanguage().t("minhaChave", { param: valor })
export function useLanguage() {
  const context = useContext(LanguageContext);

  const t = (key, params) => {
    let text = translations[context.language]?.[key] ?? translations.pt[key] ?? key;
    if (params) {
      for (const [paramKey, paramValue] of Object.entries(params)) {
        text = text.split(`{${paramKey}}`).join(String(paramValue));
      }
    }
    return text;
  };

  return { ...context, t };
}