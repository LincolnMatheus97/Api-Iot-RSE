from flask import Flask, request, render_template_string
from flask_socketio import SocketIO, emit
import os

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*") 

#Armazenar ultimo dado recebido
ultimo_dado = {}

@app.route('/dados', methods = ['POST'])
def receber_dados():
    global ultimo_dado
    data= request.json
    ultimo_dado = data  #Salva os ultimos dados recebidos
    print(f"Dados recebidos: {data}")
    socketio.emit('novo_dado', data) 
    return {"status": "ok"}, 200

@app.route('/dashboard/botoes')
def dashboard_botoes():
    global ultimo_dado
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Status dos Botões</title>
        <script src="https://cdn.socket.io/4.4.1/socket.io.min.js"></script>
        <script>
            const socket = io();

            socket.on("novo_dado", function(dado) {
                document.getElementById("status_botao_a").innerText = dado.botao_a == 1 ? "Pressionado!" : dado.botao_a == 0 ? "Solto" : "N/A";
                document.getElementById("status_botao_b").innerText = dado.botao_b == 1 ? "Pressionado!" : dado.botao_b == 0 ? "Solto" : "N/A";
            });
        </script>
        <style>
            body { font-family: Arial; text-align: center; margin-top: 50px; }
            .box { display: inline-block; border: 1px solid #ccc; padding: 20px; border-radius: 10px; }
        </style>
    </head>
    <body>
        <div class="box">
            <h1>Status dos Botões</h1>
            <p><strong>Botão A:</strong> <span id="status_botao_a">--</span></p>
            <p><strong>Botão B:</strong> <span id="status_botao_b">--</span></p>
        </div>
    </body>
    </html>
    """


    return render_template_string(html)

@app.route('/dashboard/joystick')
def dashboard_joystick():
    global ultimo_dado
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Joystick</title>
        <script src="https://cdn.socket.io/4.4.1/socket.io.min.js"></script>
        <script>
            const socket = io();

            socket.on("novo_dado", function(dado) {
                document.getElementById("x").innerText = dado.x;
                document.getElementById("y").innerText = dado.y;
                document.getElementById("direcao").innerText = dado.direcao;
            });
        </script>
        <style>
            body { font-family: Arial; text-align: center; margin-top: 50px; }
            .box { display: inline-block; border: 1px solid #ccc; padding: 20px; border-radius: 10px; }
        </style>
    </head>
    <body>
        <h1>Status do Joystick </h1>
        <div class="box">
        <p><strong>X:</strong> <span id="x">--</span></p>
        <p><strong>Y:</strong> <span id="y">--</span></p>
        <p><strong>Direção:</strong> <span id="direcao">--</span></p>
        </div>
    </body>
    </html>
    """

    return render_template_string(html)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    socketio.run(app, host='0.0.0.0', port=port)
