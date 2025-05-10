import { getById } from "./joystick.js";

document.addEventListener("DOMContentLoaded", (evento) => {
    const socket = io(); // Conecta ao servidor SocketIO na mesma origem

    const botaoAElemento = getById("botao-A"); // Botão A
    const botaoBElemento = getById("botao-B"); // Botão B

    const statusBotaoAElemento = getById("status_botao_a"); // Status do Botão A
    const statusBotaoBElemento = getById("status_botao_b"); // Status do Botão B

    // Atualiza os elementos de texto com os dados recebidos
    socket.on("novo_dado", (dado) => {
        if (dado) {
            // Lógica para o Botão A
            if (typeof dado.botao_a !== 'undefined') {
                if (botaoAElemento) {
                    if (dado.botao_a == 1) {
                        botaoAElemento.classList.add("pressionado");
                    } else {
                        botaoAElemento.classList.remove("pressionado");
                    }
                }
                // Atualiza o texto de status 
                if (statusBotaoAElemento) {
                    statusBotaoAElemento.innerText = dado.botao_a == 1 ? "Pressionado!" : "Solto";
                }
            } else {
                // Se dado.botao_a não vier, remove o estado pressionado e limpa o status
                if (botaoAElemento) {
                    botaoAElemento.classList.remove("pressionado");
                }
                if (statusBotaoAElemento) {
                    statusBotaoAElemento.innerText = "N/A";
                }
            }

            // Lógica para o Botão B
            if (typeof dado.botao_b !== 'undefined') {
                if (botaoBElemento) {
                    if (dado.botao_b == 1) {
                        botaoBElemento.classList.add("pressionado");
                    } else {
                        botaoBElemento.classList.remove("pressionado");
                    }
                }
                // Atualiza o texto de status 
                if (statusBotaoBElemento) {
                    statusBotaoBElemento.innerText = dado.botao_b == 1 ? "Pressionado!" : "Solto";
                }
            } else {
                // Se dado.botao_b não vier, remove o estado pressionado e limpa o status
                if (botaoBElemento) {
                    botaoBElemento.classList.remove("pressionado");
                }
                if (statusBotaoBElemento) {
                    statusBotaoBElemento.innerText = "N/A";
                }
            }
        }
    });
});