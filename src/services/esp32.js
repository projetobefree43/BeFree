// Cliente HTTP do ESP32.
// O celular e o ESP32 precisam estar conectados à mesma rede Wi-Fi.

function normalizarEndereco(endereco) {
  const valor = String(endereco || "").trim();

  if (!valor) {
    throw new Error("Informe o IP do ESP32.");
  }

  const comProtocolo = /^https?:\/\//i.test(valor)
    ? valor
    : `http://${valor}`;

  return comProtocolo.replace(/\/+$/, "");
}

async function requisicaoEsp32(endereco, caminho, opcoes = {}) {
  const baseUrl = normalizarEndereco(endereco);
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), 5000);

  try {
    const resposta = await fetch(`${baseUrl}${caminho}`, {
      ...opcoes,
      signal: controlador.signal,
      headers: {
        Accept: "application/json",
        ...(opcoes.headers || {}),
      },
    });

    const dados = await resposta.json();

    if (!resposta.ok || dados.ok === false) {
      throw new Error(dados.error || `ESP32 respondeu com HTTP ${resposta.status}.`);
    }

    return dados;
  } finally {
    clearTimeout(temporizador);
  }
}

export async function consultarStatusEsp32(endereco) {
  return requisicaoEsp32(endereco, "/api/status");
}

export async function enviarComandoEsp32(endereco, comando) {
  return requisicaoEsp32(
    endereco,
    `/api/command?command=${encodeURIComponent(comando)}`,
    { method: "POST" }
  );
}

export function obterEnderecoEsp32(endereco) {
  return normalizarEndereco(endereco);
}
