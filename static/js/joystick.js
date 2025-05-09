function getById(id) {
    return document.getElementById(id);
}

document.addEventListener("DOMContentLoaded", (evento) => {
    const socket = io(); // Conecta ao servidor SocketIO na mesma origem

    let anguloLogicoAtual = 0;  // Ângulo lógico da direção atual (0-359 graus, 0 = Norte)
    let anguloVisualAtual = 0;  // Ângulo de rotação aplicado ao CSS, pode acumular voltas

    // Mapeamento de direções para ângulos (0 = Norte, sentido horário)
    const angulosDirecao = {
        'NORTE': 0,
        'NORDESTE': 45,
        'LESTE': 90,
        'SUDESTE': 135,
        'SUL': 180,
        'SUDOESTE': 225,
        'OESTE': 270,
        'NOROESTE': 315,
        'CENTRO': 0 // Centro aponta para Norte por padrão
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
            } else if (dado && typeof dado.x !== 'undefined' && typeof dado.y !== 'undefined') {
                // Fallback para cálculo com X e Y se 'dado.direcao' não for string
                let xPlaca = parseFloat(dado.x);
                let yPlaca = parseFloat(dado.y);
                let xCalculo = xPlaca - 50;
                let yCalculo = yPlaca - 50;

                const thresholdCentroJS = 5;
                if (Math.abs(xCalculo) < thresholdCentroJS && Math.abs(yCalculo) < thresholdCentroJS) {
                    anguloAlvoLogico = angulosDirecao['CENTRO']; // Ou anguloLogicoAtual para não mover
                } else {
                    let anguloRad = Math.atan2(yCalculo, xCalculo);
                    let anguloDeg = anguloRad * (180 / Math.PI);
                    // O ângulo visual direto que queremos (Norte = 0, Leste = -90, etc.)
                    let anguloVisualDireto = 90 - anguloDeg;
                    // Normaliza para 0-359 para ser o anguloAlvoLogico
                    anguloAlvoLogico = (Math.round(anguloVisualDireto) % 360 + 360) % 360;
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