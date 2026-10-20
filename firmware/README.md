# Firmware do BeFree

Este firmware integra o ESP32, o sensor de batimento, o OLED I2C, tres botoes e uma API HTTP para comunicacao com o aplicativo.

## Pinagem

- Botao de informacoes: D19 / GPIO 19
- Botao modo esporte: D18 / GPIO 18
- Botao de ajuda: D5 / GPIO 5
- Sensor de batimento (S): D34 / GPIO 34
- OLED SDA: D26 / GPIO 26
- OLED SCL: D27 / GPIO 27

Os botoes sao ligados ao GND e usam INPUT_PULLUP. O GPIO 34 pertence ao ADC1, por isso pode ser usado junto com Wi-Fi. O acelerometro e o giroscopio nao fazem parte deste circuito.

## Bibliotecas da IDE Arduino

- WiFi.h e WebServer.h: ja fazem parte do core do ESP32.
- Wire.h: comunicacao I2C.
- Adafruit SSD1306 e Adafruit GFX Library: controle do OLED.

Copie wifi_credentials.example.h para wifi_credentials.h e preencha WIFI_SSID e WIFI_PASSWORD antes de gravar o firmware. O arquivo wifi_credentials.h fica fora do Git para nao publicar a senha.

## API para o aplicativo

O celular e o ESP32 precisam estar na mesma rede Wi-Fi. O ESP32 mostra o IP no OLED e no monitor Serial, em 115200 baud.

### Consultar leituras

GET http://IP_DO_ESP32/api/status

Exemplo de resposta:

{
  "ok": true,
  "wifiConnected": true,
  "ip": "192.168.0.50",
  "bpm": 82,
  "risk": 0,
  "sportMode": false,
  "alert": false,
  "helpRequestId": 0,
  "buttons": {
    "info": false,
    "sport": false,
    "help": false
  }
}

### Enviar comandos

POST http://IP_DO_ESP32/api/command?command=toggle_sport
POST http://IP_DO_ESP32/api/command?command=sport_on
POST http://IP_DO_ESP32/api/command?command=sport_off
POST http://IP_DO_ESP32/api/command?command=help
POST http://IP_DO_ESP32/api/command?command=clear_alert

O comando help registra o pedido de ajuda sem ativar o modo alerta. O app identifica a mudança em helpRequestId e inicia a chamada para o primeiro contato salvo na Rede de Apoio.

## Regras do prototipo

- O modo alerta automatico e ativado quando o risco ultrapassa o limiar configurado.
- O alerta e desligado quando o risco volta a zero e o BPM retorna ate 115.
- O modo esporte desliga o alerta automatico.
- A tela principal mostra BPM, risco e se o esporte esta ON ou OFF.
- Ao pressionar o botao de informacoes, o OLED mostra BPM, risco e modo esporte.
- O botao de ajuda mostra uma confirmacao e nao ativa o modo alerta.
