function getById(id) {
    return document.getElementById(id);
}

document.addEventListener("DOMContentLoaded", (evento) => {
    const socket = io(); // Conecta ao servidor SocketIO na mesma origem

    let anguloLogicoAtual = 0;  // Ângulo lógico da direção atual (0-359 graus, 0 = Norte)
    let anguloVisualAtual = 0;  // Ângulo de rotação aplicado ao CSS, pode acumular voltas

    // Mapeamento de direções para ângulos (90 = Norte, ângulos notaveis)
    const angulosDirecao = {
        'LESTE': 0,
        'NORDESTE': 45,
        'NORTE': 90,
        'NOROESTE': 135,
        'OESTE': 180,
        'SUDOESTE': 225,
        'SUL': 270,
        'SUDESTE': 315,
        'CENTRO': 90 // Centro aponta para Norte por padrão
    };

    socket.on("novo_dado", function (dado) {
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