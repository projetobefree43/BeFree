/*
  Projeto BeFree - ESP32 com Wi-Fi

  Pinagem usada neste firmware:
  - Botao de informacoes: D19 / GPIO 19
  - Botao modo esporte: D18 / GPIO 18
  - Botao de ajuda: D5 / GPIO 5
  - Sinal do sensor de batimento: D34 / GPIO 34 (ADC1)
  - OLED SDA: D26 / GPIO 26
  - OLED SCL: D27 / GPIO 27

  Os tres botoes sao ligados diretamente ao GND. Por isso o firmware usa
  INPUT_PULLUP: solto = HIGH e pressionado = LOW.

  O ESP32 cria uma API HTTP na porta 80. O celular deve estar na mesma rede
  Wi-Fi e acessar o IP mostrado no OLED ou no monitor Serial.

  Endpoints para o aplicativo:
  GET  http://IP_DO_ESP32/api/status
       Retorna BPM, risco, modo esporte, alerta e estado dos botoes.
  POST http://IP_DO_ESP32/api/command?command=toggle_sport
       Alterna o modo esporte.
  POST http://IP_DO_ESP32/api/command?command=help
       Registra um pedido de ajuda. O app deve chamar o contato de seguranca.
  POST http://IP_DO_ESP32/api/command?command=clear_alert
       Desliga o alerta manualmente.

  Para usar na IDE do Arduino, instale a biblioteca Adafruit SSD1306 e sua
  dependencia Adafruit GFX pelo Gerenciador de Bibliotecas.
*/

#include <WiFi.h>
#include <WebServer.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include "wifi_credentials.h"

// As credenciais ficam em wifi_credentials.h, que nao e versionado.

// Botoes ligados diretamente ao GND.
const int PIN_BOTAO_INFO = 19;
const int PIN_BOTAO_ESPORTE = 18;
const int PIN_BOTAO_AJUDA = 5;

// GPIO 34 pertence ao ADC1 e continua disponivel durante o uso do Wi-Fi.
const int PIN_SENSOR_BATIMENTO = 34;

// O OLED e o unico dispositivo ligado ao barramento I2C.
const int I2C_SDA = 26;
const int I2C_SCL = 27;
const uint8_t OLED_ADDRESS = 0x3C;

const int SCREEN_WIDTH = 128;
const int SCREEN_HEIGHT = 64;

Adafruit_SSD1306 tela(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
WebServer servidor(80);

bool wifiConectado = false;
bool servidorIniciado = false;
bool modoEsporte = false;
bool modoAlerta = false;
bool pedidoAjuda = false;

bool botaoEsporteAnterior = HIGH;
bool botaoAjudaAnterior = HIGH;

int leituraSensor = 0;
int bpm = 0;
float risco = 0.0;
float sinalAnterior = 0.0;
bool picoDetectado = false;
unsigned long ultimoBatimento = 0;
unsigned long ultimoPedidoAjuda = 0;
unsigned long ultimaTentativaWiFi = 0;
unsigned long ultimaAtualizacaoTela = 0;

unsigned long idPedidoAjuda = 0;

const float LIMIAR_RISCO_ALERTA = 4.5;
const int BPM_MAXIMO_NORMAL = 115;

void adicionarCabecalhosHttp() {
  // Necessario para permitir que o app faca requisicoes HTTP locais.
  servidor.sendHeader("Access-Control-Allow-Origin", "*");
  servidor.sendHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  servidor.sendHeader("Access-Control-Allow-Headers", "Content-Type");
}

void responderJson(int codigo, const String& json) {
  adicionarCabecalhosHttp();
  servidor.send(codigo, "application/json; charset=utf-8", json);
}

void mostrarMensagem(const String& linha1, const String& linha2 = "") {
  tela.clearDisplay();
  tela.setTextColor(SSD1306_WHITE);
  tela.setTextSize(1);
  tela.setCursor(0, 10);
  tela.println(linha1);

  if (linha2.length() > 0) {
    tela.setCursor(0, 30);
    tela.println(linha2);
  }

  tela.display();
}

void mostrarAguardandoWiFi() {
  mostrarMensagem("Conectando ao Wi-Fi...", WIFI_SSID);
}

void mostrarIpWiFi() {
  tela.clearDisplay();
  tela.setTextColor(SSD1306_WHITE);
  tela.setTextSize(1);
  tela.setCursor(0, 3);
  tela.println("BeFree conectado");
  tela.setCursor(0, 20);
  tela.println("IP do ESP32:");
  tela.setCursor(0, 38);
  tela.println(WiFi.localIP().toString());
  tela.display();
}

void conectarWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  mostrarAguardandoWiFi();

  Serial.print("Conectando ao Wi-Fi");
  unsigned long inicio = millis();

  while (WiFi.status() != WL_CONNECTED && millis() - inicio < 20000) {
    delay(500);
    Serial.print(".");
  }

  wifiConectado = WiFi.status() == WL_CONNECTED;
  Serial.println();

  if (wifiConectado) {
    Serial.print("Wi-Fi conectado. IP: ");
    Serial.println(WiFi.localIP());
    mostrarIpWiFi();
    delay(1800);
  } else {
    Serial.println("Nao foi possivel conectar ao Wi-Fi.");
    mostrarMensagem("Wi-Fi nao conectado", "Confira SSID e senha");
  }
}

void garantirConexaoWiFi() {
  if (WiFi.status() == WL_CONNECTED) {
    wifiConectado = true;
    return;
  }

  wifiConectado = false;

  // Tenta reconectar sem bloquear o loop por muito tempo.
  if (millis() - ultimaTentativaWiFi >= 10000) {
    ultimaTentativaWiFi = millis();
    WiFi.disconnect();
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  }
}

void lerSensorBatimento() {
  leituraSensor = analogRead(PIN_SENSOR_BATIMENTO);
  float variacao = leituraSensor - sinalAnterior;
  unsigned long agora = millis();

  // A simulacao considera uma subida rapida do sinal como um pico.
  if (variacao > 120 && !picoDetectado) {
    if (ultimoBatimento > 0) {
      unsigned long intervalo = agora - ultimoBatimento;

      // Aceita aproximadamente de 30 a 200 BPM.
      if (intervalo >= 300 && intervalo <= 2000) {
        bpm = 60000 / intervalo;
      }
    }

    ultimoBatimento = agora;
    picoDetectado = true;
  }

  if (variacao < 0) {
    picoDetectado = false;
  }

  // Sem novo pico por 2,5 segundos, considera a leitura normalizada/zerada.
  if (agora - ultimoBatimento > 2500) {
    bpm = 0;
  }

  sinalAnterior = leituraSensor;
}

void calcularRisco() {
  if (bpm <= BPM_MAXIMO_NORMAL) {
    risco = 0.0;
    return;
  }

  risco = (bpm - 110) / 10.0;

  if (risco > 10.0) {
    risco = 10.0;
  }
}

void atualizarAlerta() {
  if (modoEsporte) {
    modoAlerta = false;
    return;
  }

  if (risco > LIMIAR_RISCO_ALERTA) {
    modoAlerta = true;
  }

  // O alerta desliga sozinho quando risco e batimento normalizam.
  if (risco <= 0.0 && bpm <= BPM_MAXIMO_NORMAL) {
    modoAlerta = false;
  }
}

void registrarPedidoDeAjuda() {
  // O pedido de ajuda nao ativa modoAlerta.
  pedidoAjuda = true;
  ultimoPedidoAjuda = millis();
  idPedidoAjuda++;

  Serial.print("HELP_REQUEST id=");
  Serial.println(idPedidoAjuda);
}

void lerBotoes() {
  bool botaoEsporte = digitalRead(PIN_BOTAO_ESPORTE);
  bool botaoAjuda = digitalRead(PIN_BOTAO_AJUDA);

  if (botaoEsporteAnterior == HIGH && botaoEsporte == LOW) {
    modoEsporte = !modoEsporte;

    if (modoEsporte) {
      modoAlerta = false;
    }
  }

  if (botaoAjudaAnterior == HIGH && botaoAjuda == LOW) {
    registrarPedidoDeAjuda();
  }

  botaoEsporteAnterior = botaoEsporte;
  botaoAjudaAnterior = botaoAjuda;
}

String criarJsonStatus() {
  String json = "{";
  json += "\"ok\":true,";
  json += "\"wifiConnected\":" + String(wifiConectado ? "true" : "false") + ",";
  json += "\"ip\":\"" + WiFi.localIP().toString() + "\",";
  json += "\"bpm\":" + String(bpm) + ",";
  json += "\"risk\":" + String(risco, 1) + ",";
  json += "\"sportMode\":" + String(modoEsporte ? "true" : "false") + ",";
  json += "\"alert\":" + String(modoAlerta ? "true" : "false") + ",";
  json += "\"helpRequestId\":" + String(idPedidoAjuda) + ",";
  json += "\"buttons\":{";
  json += "\"info\":" + String(digitalRead(PIN_BOTAO_INFO) == LOW ? "true" : "false") + ",";
  json += "\"sport\":" + String(digitalRead(PIN_BOTAO_ESPORTE) == LOW ? "true" : "false") + ",";
  json += "\"help\":" + String(digitalRead(PIN_BOTAO_AJUDA) == LOW ? "true" : "false");
  json += "}}";
  return json;
}

void tratarStatus() {
  responderJson(200, criarJsonStatus());
}

String obterComandoRecebido() {
  if (servidor.hasArg("command")) {
    return servidor.arg("command");
  }

  // Tambem aceita {"command":"help"} para clientes que preferem JSON.
  if (servidor.hasArg("plain")) {
    String corpo = servidor.arg("plain");
    if (corpo.indexOf("toggle_sport") >= 0) return "toggle_sport";
    if (corpo.indexOf("sport_on") >= 0) return "sport_on";
    if (corpo.indexOf("sport_off") >= 0) return "sport_off";
    if (corpo.indexOf("clear_alert") >= 0) return "clear_alert";
    if (corpo.indexOf("help") >= 0) return "help";
  }

  return "";
}

void tratarComando() {
  String comando = obterComandoRecebido();

  if (comando == "toggle_sport") {
    modoEsporte = !modoEsporte;
    if (modoEsporte) modoAlerta = false;
  } else if (comando == "sport_on") {
    modoEsporte = true;
    modoAlerta = false;
  } else if (comando == "sport_off") {
    modoEsporte = false;
  } else if (comando == "clear_alert") {
    modoAlerta = false;
  } else if (comando == "help") {
    registrarPedidoDeAjuda();
  } else {
    responderJson(400, "{\"ok\":false,\"error\":\"Comando invalido.\"}");
    return;
  }

  String resposta = "{\"ok\":true,\"command\":\"" + comando + "\",\"status\":";
  resposta += criarJsonStatus();
  resposta += "}";
  responderJson(200, resposta);
}

void tratarOpcoes() {
  adicionarCabecalhosHttp();
  servidor.send(204);
}

void tratarRaiz() {
  responderJson(200, "{\"ok\":true,\"service\":\"BeFree ESP32\",\"api\":\"/api/status\"}");
}

void tratarNaoEncontrado() {
  responderJson(404, "{\"ok\":false,\"error\":\"Rota nao encontrada.\"}");
}

void configurarServidor() {
  servidor.on("/", HTTP_GET, tratarRaiz);
  servidor.on("/api/status", HTTP_GET, tratarStatus);
  servidor.on("/api/status", HTTP_OPTIONS, tratarOpcoes);
  servidor.on("/api/command", HTTP_OPTIONS, tratarOpcoes);
  servidor.on("/api/command", HTTP_ANY, tratarComando);
  servidor.onNotFound(tratarNaoEncontrado);
  servidor.begin();
  servidorIniciado = true;
  Serial.println("Servidor HTTP iniciado na porta 80.");
}

void mostrarTelaPrincipal() {
  if (millis() - ultimaAtualizacaoTela < 250) {
    return;
  }

  ultimaAtualizacaoTela = millis();
  tela.clearDisplay();
  tela.setTextColor(SSD1306_WHITE);
  tela.setTextSize(1);

  if (pedidoAjuda && millis() - ultimoPedidoAjuda < 3000) {
    tela.setTextSize(2);
    tela.setCursor(0, 10);
    tela.println("AJUDA");
    tela.println("ENVIADA");
  } else if (digitalRead(PIN_BOTAO_INFO) == LOW) {
    tela.setCursor(0, 0);
    tela.println("INFO");
    tela.setCursor(0, 15);
    tela.print("BPM: ");
    tela.println(bpm);
    tela.print("RISCO: ");
    tela.println(risco, 1);
    tela.print("ESPORTE: ");
    tela.println(modoEsporte ? "ON" : "OFF");
  } else if (modoAlerta) {
    tela.setTextSize(2);
    tela.setCursor(0, 10);
    tela.println("RESPIRA");
    tela.println("CALMA");
  } else {
    tela.setCursor(0, 0);
    tela.println("BeFree pronto");
    tela.setCursor(0, 18);
    tela.print("BPM: ");
    tela.println(bpm);
    tela.print("RISCO: ");
    tela.println(risco, 1);
    tela.print("ESPORTE: ");
    tela.println(modoEsporte ? "ON" : "OFF");
  }

  tela.display();
}

void setup() {
  Serial.begin(115200);

  pinMode(PIN_BOTAO_INFO, INPUT_PULLUP);
  pinMode(PIN_BOTAO_ESPORTE, INPUT_PULLUP);
  pinMode(PIN_BOTAO_AJUDA, INPUT_PULLUP);
  pinMode(PIN_SENSOR_BATIMENTO, INPUT);

  Wire.begin(I2C_SDA, I2C_SCL);

  if (!tela.begin(SSD1306_SWITCHCAPVCC, OLED_ADDRESS)) {
    Serial.println("Falha ao iniciar o OLED.");
  }

  mostrarMensagem("Iniciando BeFree...");
  conectarWiFi();

  if (wifiConectado) {
    configurarServidor();
  }
}

void loop() {
  garantirConexaoWiFi();

  if (wifiConectado && !servidorIniciado) {
    configurarServidor();
  }

  if (wifiConectado && servidorIniciado) {
    servidor.handleClient();
  }

  lerSensorBatimento();
  lerBotoes();
  calcularRisco();
  atualizarAlerta();
  mostrarTelaPrincipal();

  if (pedidoAjuda && millis() - ultimoPedidoAjuda >= 3000) {
    pedidoAjuda = false;
  }

  delay(10);
}
