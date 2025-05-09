function getById(id) {
    return document.getElementById(id);
}

document.addEventListener("DOMContentLoaded", (evento) => {
    const socket = io(); // Conecta ao servidor SocketIO na mesma origem

    socket.on("novo_dado", function (dado) {
        // Verifica se os dados do joystick existem
        const elementoX = getById("x");
        const elementoY = getById("y");
        const elementoDirecao = getById("direcao");
        const elementoRosaDosVentos = getById("rosaDosVentos");

        // Atualiza os elementos com os dados recebidos
        elementoX.innerText = (dado && typeof dado.x !== 'undefined') ? dado.x : "--";
        elementoY.innerText = (dado && typeof dado.y !== 'undefined') ? dado.y : "--";
        elementoDirecao.innerText = (dado && typeof dado.direcao !== 'undefined') ? dado.direcao : "--";

        // Atualiza a rosa dos ventos
        if (elementoRosaDosVentos) {
            if (dado && typeof dado.direcao === 'string') { // Prioriza a string de direção da placa
                const direcaoUpper = dado.direcao.toUpperCase();
                let anguloRotacao = 0; // Ângulo para rotacionar a imagem

                // Define o ângulo de rotação para que a MARCAÇÃO da direção na imagem aponte para cima.
                // Assumindo que a imagem da rosa dos ventos tem N no topo.
                switch (direcaoUpper) {
                    case 'NORTE':    anguloRotacao = 0; break;
                    case 'NORDESTE': anguloRotacao = -45; break;
                    case 'LESTE':    anguloRotacao = -90; break;
                    case 'SUDESTE':  anguloRotacao = -135; break;
                    case 'SUL':      anguloRotacao = -180; break;
                    case 'SUDOESTE': anguloRotacao = -225; break;
                    case 'OESTE':    anguloRotacao = -270; break;
                    case 'NOROESTE': anguloRotacao = -315; break;
                    case 'CENTRO':
                        anguloRotacao = 0; // Quando a placa diz "Centro", aponta para Norte.
                        break;
                    default:
                        anguloRotacao = 0; // Padrão para Norte se direção desconhecida
                }
                elementoRosaDosVentos.style.transform = `rotate(${anguloRotacao}deg)`;

            } else if (dado && typeof dado.x !== 'undefined' && typeof dado.y !== 'undefined') {
                // Fallback: Executa APENAS se 'dado.direcao' NÃO for uma string válida (ou não for enviada).
                // Com base no seu código C, 'dado.direcao' é sempre enviada, então este bloco pode ser raramente usado.
                let xPlaca = parseFloat(dado.x);
                let yPlaca = parseFloat(dado.y);

                // Transladar os valores para que o centro (50,50) se torne (0,0)
                let xCalculo = xPlaca - 50;
                let yCalculo = yPlaca - 50;

                // Pequena zona morta no JS para flutuações muito próximas do centro absoluto (50,50)
                // caso 'dado.direcao' não seja fornecida.
                const thresholdCentroJS = 5;
                if (Math.abs(xCalculo) < thresholdCentroJS && Math.abs(yCalculo) < thresholdCentroJS) {
                    elementoRosaDosVentos.style.transform = 'rotate(0deg)'; // Centro, aponta para Norte
                } else {
                    // Calcula o ângulo para fazer o VETOR do joystick apontar para cima
                    let anguloRad = Math.atan2(yCalculo, xCalculo); // yCalculo primeiro
                    let anguloDeg = anguloRad * (180 / Math.PI);
                    let rotacaoFinal = 90 - anguloDeg; // Ajuste para alinhar com o topo da tela
                    elementoRosaDosVentos.style.transform = `rotate(${rotacaoFinal}deg)`;
                }
            }
        }

    });
}); 