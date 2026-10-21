# BeFree

BeFree é um protótipo acadêmico de apoio à interrupção do impulso de apostar. O aplicativo oferece diário de gatilhos, rede de apoio, privacidade, redefinição de senha e integração Wi-Fi com um protótipo baseado em ESP32.

## Funcionalidades

- Aplicativo mobile Android/iOS com React Native e Expo.
- Cadastro, login e redefinição de senha.
- Banco SQLite local, com dados separados por usuário.
- Diário de gatilhos e Rede de Apoio.
- SOS local simulado, conforme a proposta acadêmica.
- Painel do relógio conectado ao ESP32 por HTTP na rede Wi-Fi.
- Leitura de BPM, risco, modo esporte e alerta.
- Pedido de ajuda pelo botão físico ou pelo app, abrindo o discador do primeiro contato salvo.

## Tecnologias

- React Native, Expo SDK 57 e Expo Router.
- SQLite local com expo-sqlite.
- ESP32 com WiFi.h e WebServer.h.
- OLED SSD1306 usando I2C.
- Sensor de batimento no ADC1.

## Estrutura

    BeFree/
    ├── src/app/              Telas e rotas do aplicativo
    ├── src/services/         Comunicação HTTP com o ESP32
    ├── src/db.js             SQLite local e migrações
    ├── firmware/              Código C++ para a IDE Arduino
    ├── assets/                Imagens e áudio
    └── Landing-page/          Página institucional

## Como rodar o aplicativo

### Pré-requisitos

- Node.js 22.13 ou superior.
- npm.
- Expo SDK 57.
- Android Studio/emulador ou um celular Android.

### Instalação

    git clone https://github.com/projetobefree43/BeFree.git
    cd BeFree
    npm install
    npx expo start

Para executar em um aparelho Android conectado, use a opção Android no Expo ou:

    npx expo start --android

Para gerar uma nova versão instalável, é necessário criar um novo build do aplicativo depois das alterações do projeto.

## Como preparar o ESP32

1. Abra firmware/BeFree.ino na IDE Arduino.
2. Instale a placa ESP32 e as bibliotecas Adafruit SSD1306 e Adafruit GFX Library.
3. Copie firmware/wifi_credentials.example.h para firmware/wifi_credentials.h.
4. Preencha WIFI_SSID e WIFI_PASSWORD no arquivo local.
5. Selecione a placa ESP32 e a porta USB.
6. Grave o firmware.

O arquivo wifi_credentials.h é ignorado pelo Git e não deve ser publicado, pois contém a senha da rede.

### Pinagem do firmware

- Botão de informações: GPIO 19.
- Botão modo esporte: GPIO 18.
- Botão de ajuda: GPIO 5.
- Sinal do sensor de batimento: GPIO 34, ADC1.
- OLED SDA: GPIO 26.
- OLED SCL: GPIO 27.

Os três botões são ligados ao GND e usam INPUT_PULLUP. O acelerômetro e o giroscópio foram totalmente desconsiderados e não utilizam nenhum pino.

## Como conectar o aplicativo ao ESP32

1. Conecte o ESP32 a uma rede Wi-Fi preenchida em wifi_credentials.h.
2. Conecte o celular à mesma rede ou ao mesmo hotspot.
3. Veja o IP do ESP32 no OLED ou no monitor Serial, em 115200 baud.
4. No app, abra Painel do Relógio.
5. Digite o IP e toque em Conectar ao ESP32.

O app consulta automaticamente:

    GET http://IP_DO_ESP32/api/status

Para enviar comandos, ele usa:

    POST http://IP_DO_ESP32/api/command?command=toggle_sport
    POST http://IP_DO_ESP32/api/command?command=help

O celular e o ESP32 precisam estar na mesma rede. Se o roteador ou hotspot tiver isolamento entre dispositivos, a conexão local poderá ser bloqueada.

## Regras do protótipo

- O alerta automático é ativado conforme o limiar de risco do firmware.
- O alerta desliga quando o risco chega a zero e o BPM retorna até 115.
- O modo esporte suspende o alerta automático.
- O modo ajuda não ativa o alerta; ele comunica o app e abre o discador do contato salvo.
- O SOS do aplicativo continua sendo uma simulação local e não envia mensagens.

## Dados e segurança

As contas, contatos, diário e configurações são armazenados localmente no aparelho. As senhas são protegidas com hash e salt. O aplicativo não possui backend remoto.

## Equipe

- Gabriel Henrique Pierri Martins
- Francisco Ferreira de Almeida
- Vitor Zappalla Lovato

## Licença

Projeto desenvolvido para fins acadêmicos.
