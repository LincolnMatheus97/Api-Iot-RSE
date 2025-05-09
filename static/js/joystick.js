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
        if (elementoRosaDosVentos && typeof dado.x !== 'undefined' && typeof dado.y !== 'undefined') {
            let xVal = parseFloat(dado.x);
            let yVal = parseFloat(dado.y);

            // Evita divisão por zero ou comportamento indefinido se x e y forem 0
            if (xVal === 0 && yVal === 0) {
                // Se o joystick estiver no centro, não rotaciona a rosa dos ventos
                elementoRosaDosVentos.style.transform = 'rotate(0deg)';
            } else {
                // Calcula o ângulo usando atan2, que leva em conta o quadrante correto
                // atan2(y, x) retorna o ângulo em radianos entre o vetor (x, y) e o eixo x
                let anguloRad = Math.atan2(yVal, xVal);

                // Converte radianos para graus
                let anguloDeg = anguloRad * (180 / Math.PI);

                // Ajusta a rotação para que 0 graus fique para cima
                let rotacaoFinal = 90 - anguloDeg;
                
                // Aplica a rotação
                elementoRosaDosVentos.style.transform = `rotate(${rotacaoFinal}deg)`; 
            }
        } else if (elementoRosaDosVentos && typeof dado.direcao === 'string') {
            let anguloDirecao = 0;
            switch (dado.direcao.toUpperCase()) {
                case 'Norte': anguloDirecao = 0; break;
                case 'Nordeste': anguloDirecao = -45; break;
                case 'Leste': anguloDirecao = -90; break;
                case 'Sudeste': anguloDirecao = -135; break;
                case 'Sul': anguloDirecao = -180; break;
                case 'Sudoeste': anguloDirecao = -225; break; // ou 135
                case 'Oeste': anguloDirecao = -270; break; // ou 90
                case 'Noroeste': anguloDirecao = -315; break; // ou 45
                default: anguloDirecao = 0; // Padrão para Norte se desconhecido
            }
            elementoRosaDosVentos.style.transform = `rotate(${anguloDirecao}deg)`;
        }

    });
}); 