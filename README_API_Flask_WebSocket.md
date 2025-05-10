# 📡 API Flask com WebSocket – Dashboard em Tempo Real

Este projeto foi desenvolvido para fins educacionais, com o objetivo de receber dados de uma placa embarcada (via HTTP POST), emitir os dados em tempo real via WebSocket e exibi-los em dashboards HTML hospedados na nuvem (Railway).

---
## 🎓 Contexto Educacional – Tarefa da Residência em Sistemas Embarcados

Este projeto faz parte da **Tarefa Prática da Unidade 2 – Capítulo 3** da Residência Técnica em Sistemas Embarcados, com o objetivo de:

- Desenvolver **aplicações IoT com microcontroladores (BitDogLab/RP2040)**.
- Utilizar comunicação sem fio (**Wi-Fi**) para enviar dados para um servidor.
- Criar **dashboards web** para visualizar, em tempo real, os dados da placa.

### 🔹 Enunciado resumido

As aplicações consistem em:

1. **Monitorar o estado dos botões** da placa BitDogLab e enviar via Wi-Fi para um servidor.
2. **Ler a posição do joystick (eixo X e Y)** e enviar para o servidor.
3. **Desafio extra**:
   - Adicionar um sensor adicional (por exemplo, temperatura, umidade, etc.).
   - Criar uma "rosa dos ventos" com base na posição do joystick (ex: Norte, Sul, etc.).
4. **Servidor na nuvem**:
   - Reimplementar tudo utilizando um servidor público (ex: Railway), acessível pela internet.

---

### 🌐 Papel desta API

Esta API Flask com WebSocket é o **servidor de nuvem** criado para receber, processar e exibir os dados das aplicações embarcadas. Ela cumpre os seguintes papéis:

- 📥 Receber dados da placa embarcada via `POST /dados`
- 📡 Enviar dados em tempo real para o dashboard via WebSocket
- 🖥️ Renderizar páginas HTML (`/dashboard/joystick`, `/dashboard/botoes`) que exibem as informações visuais
- 🌩️ Estar sempre online e acessível, hospedada via **Railway**

---

> 📌 O desenvolvimento desta API foi feito com base nos objetivos da atividade prática, respeitando os critérios técnicos e explorando desafios extras com foco no aprendizado e domínio do ecossistema IoT.

---

## 🗂️ Estrutura do Repositório

```text
api-flask/
├── templates/
│   ├── botoes.html
│   └── joystick.html
├── static/
│   ├── css/
│   │   └── botoes.css
│   │   └── joystick.css
│   ├── images/
│   │   └── (imagens e gifs)
│   ├── js/
│   │   └── botoes.js
│   │   └── joystick.js
│
├── app.py
├── requirements.txt
├── Procfile (Para deploy na Railway)
└── README.md
```

---

## 📦 Tecnologias Utilizadas

- **Python + Flask** – Backend e rotas HTTP
- **Flask-SocketIO** – Comunicação em tempo real via WebSocket
- **HTML + JavaScript (Socket.IO)** – Frontend interativo
- **Railway** – Hospedagem na nuvem do servidor
- **JSON** – Formato dos dados enviados pela placa

---

## 🔄 Fluxo de Funcionamento

```text
[1] PLACA (cliente embarcado)
     └── POST /dados → envia JSON com dados (envia via HTTP)

[2] BACKEND Flask (Railway)
     ├── Recebe via @app.route('/dados')
     └── Emite via socketio.emit('novo_dado', data)

[3] FRONTEND (HTML no navegador)
     └── Recebe 'novo_dado' via WebSocket
         → Atualiza a interface em tempo real
```

---

## 🌐 Como funciona na nuvem

A aplicação está hospedada na Railway:

👉 `https://atv-unid2-rse.up.railway.app`


- Esse domínio executa o `app.py` continuamente
- Recebe dados da placa e transmite para os navegadores
- Serve os arquivos HTML (`dashboard/joystick`, `dashboard/botoes`)

---

## 🧠 Conceitos importantes usados

| Conceito | Descrição |
|---------|-----------|
| **API REST** | Rota `POST /dados` recebe dados da placa |
| **WebSocket** | Transmite dados em tempo real para as páginas HTML |
| **Frontend** | Os arquivos `.html` e `.js` exibem os dados no navegador |
| **Backend** | Código Python em `app.py`, com lógica da aplicação |
| **Full Stack** | Projeto completo, com frontend + backend funcionando |
| **Hospedagem na nuvem** | Railway executa a API e serve os dashboards |

---

## 🛠️ Sobre o desenvolvimento

Este foi meu **primeiro projeto full stack construído do zero**. Para entender e aplicar os conceitos de API, WebSocket, backend, frontend e nuvem, busquei informações em diversas fontes, como documentação oficial, fóruns técnicos, colegas e amigos que possuem experiência no assunto e outros recursos educativos.

---

## ✨ Resultado

Um sistema funcional que:
- Recebe dados da placa
- Emite os dados para dashboards em tempo real
- Pode ser acessado publicamente via Railway

---
