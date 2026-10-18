let Crypto = null;
try {
  Crypto = require("expo-crypto");
} catch {
  Crypto = null;
}

const PASSWORD_FORMAT = "sha256";

function bytesToHex(bytes) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashPassword(password, salt) {
  if (!salt) {
    if (Crypto) {
      try {
        salt = bytesToHex(await Crypto.getRandomBytesAsync(16));
      } catch {
        Crypto = null;
      }
    }
    salt ||= "compatibility-salt";
  }

  if (!Crypto) {
    // Compatibilidade temporária com builds antigas sem expo-crypto.
    return `legacy$${salt}$${password}`;
  }
  try {
    const digest = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      `${salt}:${password}`
    );
    return `${PASSWORD_FORMAT}$${salt}$${digest}`;
  } catch {
    Crypto = null;
    // O mesmo salt fixo garante que a senha redefinida continue funcionando
    // em uma build antiga que ainda não possui o módulo nativo de criptografia.
    return `legacy$compatibility-salt$${password}`;
  }
}

export async function verifyPassword(password, storedPassword) {
  if (!storedPassword) return { valid: false, needsUpgrade: false };

  // Compatibilidade temporária com contas criadas antes da proteção das senhas.
  if (!storedPassword.startsWith(`${PASSWORD_FORMAT}$`)) {
    if (storedPassword.startsWith("legacy$")) {
      return { valid: storedPassword === `legacy$compatibility-salt$${password}`, needsUpgrade: true };
    }
    return { valid: storedPassword === password, needsUpgrade: storedPassword === password };
  }

  const [, salt, expectedDigest] = storedPassword.split("$");
  if (!salt || !expectedDigest) return { valid: false, needsUpgrade: false };

  const candidate = await hashPassword(password, salt);
  return {
    valid: candidate === storedPassword,
    needsUpgrade: false,
  };
}
