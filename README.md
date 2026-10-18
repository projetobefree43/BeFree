# BeFree

BeFree é um protótipo acadêmico de apoio à interrupção do impulso de apostar. O aplicativo organiza diário, rede de apoio, privacidade e uma simulação do SOS. A integração física com um smartwatch faz parte das próximas etapas do projeto embarcado.

## 💡 Sobre o projeto

O projeto nasceu como um trabalho escolar, unindo tecnologia e saúde mental no combate à ludopatia (vício em jogos de azar). A proposta é usar dados biométricos captados por um smartwatch (como frequência cardíaca e outros sinais de estresse/ansiedade) para identificar momentos de risco e intervir antes que o usuário ceda ao impulso de apostar.

## ✨ Funcionalidades

- 📱 Aplicativo mobile multiplataforma (Android/iOS)
- ⌚ Painel de configuração e simulação do futuro smartwatch
- 🔔 Simulação de alerta e intervenção local
- 💾 Armazenamento local de dados do usuário
- 🌐 Landing page institucional do projeto

## 🚀 Tecnologias utilizadas

- **React Native** com **Expo** — desenvolvimento do app mobile
- **SQLite** — banco de dados local
- **JavaScript**

## 📂 Estrutura do projeto

```
BeFree/
├── src/app/        # Telas e rotas do aplicativo mobile
├── src/db.js       # SQLite local e migrações
├── assets/         # Imagens e áudio da simulação
└── Landing-page/   # Landing page institucional
```


## 🔧 Como rodar o projeto

### Pré-requisitos

- Node.js instalado
- Node.js 22.13 ou superior
- Expo SDK 57

### Passos

```bash
# Clone o repositório
git clone https://github.com/projetobefree43/BeFree.git

# Entre na pasta do projeto
cd BeFree

# Instale as dependências
npm install

# Inicie o projeto com o Expo
npx expo start
```

As senhas são armazenadas com hash e salt, e o identificador da sessão fica no armazenamento seguro do dispositivo. O SQLite continua sendo local: não há backend remoto.

O botão SOS é uma simulação acadêmica. Ele toca um alerta local por cinco segundos e mostra uma orientação, mas não envia mensagens ou ligações. O painel do relógio salva preferências locais, mas ainda não se comunica com hardware.

## 👥 Equipe

Projeto desenvolvido em grupo por:

- Gabriel Henrique Pierri Martins
- Francisco Ferrreira de Almeida
- Vitor Zappalla Lovato

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos.
