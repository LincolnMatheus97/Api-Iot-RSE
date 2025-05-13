function getById(id) {
    return document.getElementById(id);
}

document.addEventListener("DOMContentLoaded", (evento) => {
    const socket = io(); // Conecta ao servidor SocketIO na mesma origem

    let anguloLogicoAtual = 0;  // Ângulo lógico da direção atual (0-359 graus, 0 = Norte)
    let anguloVisualAtual = 0;  // Ângulo de rotação aplicado ao CSS, pode acumular voltas

    // Mapeamento de direções para ângulos (0 = Norte, ângulos notaveis)
    const angulosDirecao = {
        'NORTE': 0,
        'NOROESTE': 45,
        'OESTE': 90,
        'SUDOESTE': 135,
        'SUL': 180,
        'SUDESTE': 225,
        'LESTE': 270,
        'NORDESTE': 315,
        'CENTRO': 0 // Centro aponta para Norte por padrão
    };

    socket.on("dados_joy", (dado) => {
        const elementoX = getById("x");
        const elementoY = getById("y");
        const elementoDirecao = getById("direcao");
        const elementoRosaDosVentos = getById("rosaDosVentos");

        // Atualiza os elementos de texto com os dados recebidos
        if (elementoX) {
            elementoX.innerText = (dado && typeof dado.x !== 'undefined') ? dado.x : "--";
        }
        if (elementoY) {
            elementoY.innerText = (dado && typeof dado.y !== 'undefined') ? dado.y : "--";
        }
        if (elementoDirecao) {
            elementoDirecao.innerText = (dado && typeof dado.direcao !== 'undefined') ? dado.direcao : "--";
        }

        // Atualiza a rosa dos ventos
        if (elementoRosaDosVentos) {
            let anguloAlvoLogico;

            if (dado && typeof dado.direcao === 'string') {
                const direcaoUpper = dado.direcao.toUpperCase();
                if (angulosDirecao.hasOwnProperty(direcaoUpper)) {
                    anguloAlvoLogico = angulosDirecao[direcaoUpper];
                } else {
                    anguloAlvoLogico = anguloLogicoAtual; // Mantém o ângulo se a direção for desconhecida
                }
            } else {
                // Nenhum dado útil para rotação, não faz nada
                return;
            }

            // Calcula a diferença pelo caminho mais curto
            let diferenca = anguloAlvoLogico - anguloLogicoAtual;

            // Normaliza a diferença para estar entre -180 e 180
            if (diferenca > 180) {
                diferenca -= 360;
            } else if (diferenca < -180) {
                diferenca += 360;
            }

            anguloVisualAtual += diferenca;
            elementoRosaDosVentos.style.transform = `rotate(${anguloVisualAtual}deg)`;
            anguloLogicoAtual = anguloAlvoLogico; // Atualiza o ângulo lógico para o próximo cálculo
        }
    });
}); 