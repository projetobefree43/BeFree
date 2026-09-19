// esse arquivo é o "cérebro" dos dados do app. aqui a gente cria e acessa
// tudo que o app precisa guardar: usuários, diário de gatilhos, contatos
// de apoio, configurações do relógio e privacidade.
// tudo fica salvo direto no celular do usuário (banco local), sem servidor.

import * as SQLite from "expo-sqlite";

// nome e versão do banco de dados. a versão serve pra gente poder
// atualizar as tabelas do banco sem perder os dados do usuário
const DATABASE_NAME = "befree.db";
const DATABASE_VERSION = 3;

// variável que guarda a "promessa" de conexão com o banco
// (uma promessa é tipo uma garantia de que o banco vai abrir, só que pode demorar)
let dbPromise = null;

// essa função abre o banco uma única vez e reutiliza a mesma conexão
function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DATABASE_NAME);
  }
  return dbPromise;
}

// função auxiliar pra converter texto "true"/"1" em valor booleano (verdadeiro/falso)
const toBool = (value) => value === "true" || value === "1";

// essa função cria todas as tabelas do banco na primeira vez que o app roda,
// e também atualiza o banco se a gente mudar algo nas tabelas em uma versão nova
export async function initDatabase() {
  const db = await getDb();
  const result = await db.getFirstAsync("PRAGMA user_version");
  let currentVersion = result?.user_version ?? 0;

  // se já tá na versão mais recente, não precisa fazer nada
  if (currentVersion >= DATABASE_VERSION) {
    return;
  }

  // versão 0 = primeira vez que o app roda, cria tudo do zero
  if (currentVersion === 0) {
    await db.execAsync(`
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  photo TEXT,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS journal_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  date_label TEXT NOT NULL,
  trigger TEXT NOT NULL,
  emotion TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS support_contacts (
  id INTEGER PRIMARY KEY KEY AUTOINCREMENT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);
    `);

    // dados de exemplo pro diário (pra o usuário não ver a tela vazia)
    await db.runAsync(
      "INSERT INTO journal_entries (date_label, trigger, emotion, response, created_at) VALUES (?, ?, ?, ?, ?)",
      "Hoje",
      "Discussão com colega",
      "Raiva/Frustração",
      "Respirei fundo e pedi para conversar depois",
      Date.now()
    );

    // contatos de exemplo na rede de apoio
    await db.runAsync(
      "INSERT INTO support_contacts (name, phone, created_at) VALUES (?, ?, ?)",
      "Mãe",
      "(11) 98765-4321",
      Date.now()
    );
    await db.runAsync(
      "INSERT INTO support_contacts (name, phone, created_at) VALUES (?, ?, ?)",
      "Melhor Amiga",
      "(21) 99876-5432",
      Date.now()
    );
    await db.runAsync(
      "INSERT INTO support_contacts (name, phone, created_at) VALUES (?, ?, ?)",
      "Terapeuta",
      "(11) 3456-7890",
      Date.now()
    );

    currentVersion = 1;
  }

  // versão 1 → 2: adiciona coluna user_id pra ligar diário e contatos ao usuário
  if (currentVersion === 1) {
    await db.execAsync(`
ALTER TABLE journal_entries ADD COLUMN user_id INTEGER NOT NULL DEFAULT 0;
ALTER TABLE support_contacts ADD COLUMN user_id INTEGER NOT NULL DEFAULT 0;
    `);
    const firstUser = await db.getFirstAsync("SELECT MIN(id) AS userId FROM users");
    const firstUserId = firstUser?.userId ?? null;

    // função auxiliar que liga os dados antigos ao primeiro usuário ou apaga se não tiver ninguém
    const assignOrClear = async (table) => {
      if (firstUserId) {
        await db.runAsync(
          `UPDATE ${table} SET user_id = ? WHERE user_id = 0`,
          firstUserId
        );
      } else {
        await db.runAsync(`DELETE FROM ${table} WHERE user_id = 0`);
      }
    };
    await assignOrClear("journal_entries");
    await assignOrClear("support_contacts");

    // verifica se existia uma tabela de metas de economia e migra ela também
    const hasGoals = await db.getFirstAsync(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'economy_goals'"
    );
    if (hasGoals) {
      await db.execAsync(
        "ALTER TABLE economy_goals ADD COLUMN user_id INTEGER NOT NULL DEFAULT 0"
      );
      await assignOrClear("economy_goals");
    }

    currentVersion = 2;
  }

  // versão 2 → 3: adiciona coluna de foto no perfil do usuário
  if (currentVersion === 2) {
    await db.execAsync(
      "ALTER TABLE users ADD COLUMN photo TEXT"
    );
    currentVersion = 3;
  }

  // salva a versão atual do banco pra não repetir essas atualizações
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

// ===== USUÁRIOS =====

// cria um usuário novo com nome, email e senha, e já cria dados de exemplo pra ele
export async function createUser({ name, email, password }) {
  const db = await getDb();
  const result = await db.runAsync(
    "INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)",
    name,
    email,
    password,
    Date.now()
  );
  const userId = result.lastInsertRowId;

  // cria um registro de exemplo no diário
  await db.runAsync(
    "INSERT INTO journal_entries (user_id, date_label, trigger, emotion, response, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    userId,
    "Hoje",
    "Discussão com colega",
    "Raiva/Frustração",
    "Respirei fundo e pedi para conversar depois",
    Date.now()
  );

  // cria contatos de exemplo na rede de apoio
  await db.runAsync(
    "INSERT INTO support_contacts (user_id, name, phone, created_at) VALUES (?, ?, ?, ?)",
    userId,
    "Mãe",
    "(11) 98765-4321",
    Date.now()
  );
  await db.runAsync(
    "INSERT INTO support_contacts (user_id, name, phone, created_at) VALUES (?, ?, ?, ?)",
    userId,
    "Melhor Amiga",
    "(21) 99876-5432",
    Date.now()
  );
  await db.runAsync(
    "INSERT INTO support_contacts (user_id, name, phone, created_at) VALUES (?, ?, ?, ?)",
    userId,
    "Terapeuta",
    "(11) 3456-7890",
    Date.now()
  );

  return userId;
}

// busca um usuário pelo email (usado no login)
export async function getUserByEmail(email) {
  const db = await getDb();
  return db.getFirstAsync("SELECT * FROM users WHERE email = ?", email);
}

// busca um usuário pelo id (usado pra carregar dados na tela de perfil)
export async function getUserById(id) {
  const db = await getDb();
  return db.getFirstAsync("SELECT * FROM users WHERE id = ?", id);
}

// atualiza o nome do usuário
export async function updateUserName(id, name) {
  const db = await getDb();
  await db.runAsync("UPDATE users SET name = ? WHERE id = ?", name, id);
}

// atualiza o email do usuário
export async function updateUserEmail(id, email) {
  const db = await getDb();
  await db.runAsync("UPDATE users SET email = ? WHERE id = ?", email, id);
}

// atualiza a senha do usuário
export async function updateUserPassword(id, password) {
  const db = await getDb();
  await db.runAsync("UPDATE users SET password = ? WHERE id = ?", password, id);
}

// atualiza a foto de perfil do usuário
export async function updateUserPhoto(id, photo) {
  const db = await getDb();
  await db.runAsync("UPDATE users SET photo = ? WHERE id = ?", photo, id);
}

// apaga um usuário e todos os dados ligados a ele (diário, contatos, config)
export async function deleteUser(id) {
  const db = await getDb();
  await db.runAsync("DELETE FROM journal_entries WHERE user_id = ?", id);
  await db.runAsync("DELETE FROM support_contacts WHERE user_id = ?", id);
  await db.runAsync(
    "DELETE FROM settings WHERE key IN (?, ?, ?, ?)",
    `watch.notifications.${id}`,
    `watch.vibration.${id}`,
    "currentUserId",
    "currentUserName"
  );
  await db.runAsync("DELETE FROM users WHERE id = ?", id);
}

// ===== CONFIGURAÇÕES (chave/valor) =====

// pega o id do usuário que tá logado agora (tá guardado como config)
export async function getCurrentUserId() {
  const value = await getSetting("currentUserId");
  return value ? Number(value) : null;
}

// lê uma configuração qualquer pelo nome da chave
export async function getSetting(key) {
  const db = await getDb();
  const row = await db.getFirstAsync(
    "SELECT value FROM settings WHERE key = ?",
    key
  );
  return row ? row.value : null;
}

// salva ou atualiza uma configuração (se já existir, atualiza o valor)
export async function setSetting(key, value) {
  const db = await getDb();
  await db.runAsync(
    "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    key,
    value
  );
}

// remove uma configuração
export async function removeSetting(key) {
  const db = await getDb();
  await db.runAsync("DELETE FROM settings WHERE key = ?", key);
}

// ===== DIÁRIO DE GATILHOS =====

// busca todos os registros do diário de um usuário (do mais novo pro mais antigo)
export async function getEntries(userId) {
  const db = await getDb();
  const rows = await db.getAllAsync(
    "SELECT * FROM journal_entries WHERE user_id = ? ORDER BY id DESC",
    userId
  );
  return rows.map((row) => ({
    id: row.id,
    dateLabel: row.date_label,
    trigger: row.trigger,
    emotion: row.emotion,
    response: row.response,
  }));
}

// cria um registro novo no diário
export async function insertEntry({ userId, dateLabel, trigger, emotion, response }) {
  const db = await getDb();
  const result = await db.runAsync(
    "INSERT INTO journal_entries (user_id, date_label, trigger, emotion, response, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    userId,
    dateLabel,
    trigger,
    emotion,
    response,
    Date.now()
  );
  return result.lastInsertRowId;
}

// atualiza um registro existente no diário
export async function updateEntry(id, userId, { trigger, emotion, response }) {
  const db = await getDb();
  await db.runAsync(
    "UPDATE journal_entries SET trigger = ?, emotion = ?, response = ? WHERE id = ? AND user_id = ?",
    trigger,
    emotion,
    response,
    id,
    userId
  );
}

// apaga um registro do diário
export async function deleteEntry(id, userId) {
  const db = await getDb();
  await db.runAsync(
    "DELETE FROM journal_entries WHERE id = ? AND user_id = ?",
    id,
    userId
  );
}

// ===== REDE DE APOIO =====

// busca todos os contatos de apoio de um usuário
export async function getContacts(userId) {
  const db = await getDb();
  const rows = await db.getAllAsync(
    "SELECT * FROM support_contacts WHERE user_id = ? ORDER BY id",
    userId
  );
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    phone: row.phone,
  }));
}

// adiciona um contato novo na rede de apoio
export async function insertContact({ userId, name, phone }) {
  const db = await getDb();
  const result = await db.runAsync(
    "INSERT INTO support_contacts (user_id, name, phone, created_at) VALUES (?, ?, ?, ?)",
    userId,
    name,
    phone,
    Date.now()
  );
  return result.lastInsertRowId;
}

// atualiza um contato existente
export async function updateContact(id, userId, { name, phone }) {
  const db = await getDb();
  await db.runAsync(
    "UPDATE support_contacts SET name = ?, phone = ? WHERE id = ? AND user_id = ?",
    name,
    phone,
    id,
    userId
  );
}

// apaga um contato da rede de apoio
export async function deleteContact(id, userId) {
  const db = await getDb();
  await db.runAsync(
    "DELETE FROM support_contacts WHERE id = ? AND user_id = ?",
    id,
    userId
  );
}

// ===== PAINEL DO RELÓGIO =====

// carrega as configurações de notificação e vibração do relógio inteligente
export async function getWatchSettings(userId) {
  const db = await getDb();
  const notifKey = userId ? `watch.notifications.${userId}` : "watch.notifications";
  const vibrKey = userId ? `watch.vibration.${userId}` : "watch.vibration";
  const raw = await db.getAllAsync(
    "SELECT key, value FROM settings WHERE key IN (?, ?)",
    notifKey,
    vibrKey
  );
  let notifications = true;
  let vibration = true;
  for (const row of raw) {
    if (row.key === notifKey) notifications = toBool(row.value);
    if (row.key === vibrKey) vibration = toBool(row.value);
  }
  return { notifications, vibration };
}

// ===== PRIVACIDADE E SEGURANÇA =====

// carrega as configurações de privacidade do usuário (ex: esconder nome)
export async function getPrivacySettings(userId) {
  const hideName = await getSetting(`privacy.hideName.${userId}`);
  return { hideName: toBool(hideName) };
}

// salva as configurações de privacidade
export async function setPrivacySettings(userId, { hideName }) {
  const key = `privacy.hideName.${userId}`;
  if (hideName) {
    await setSetting(key, "true");
  } else {
    await removeSetting(key);
  }
}

// apaga todos os dados locais do app (usuários, diários, contatos e configs)
// essa função é usada quando o usuário quer "resetar" tudo
export async function resetDatabase() {
  const db = await getDb();
  await db.execAsync(`
DELETE FROM journal_entries;
DELETE FROM support_contacts;
DELETE FROM settings;
DELETE FROM users;
DELETE FROM sqlite_sequence;
  `);
}
