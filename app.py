from flask import Flask, request, render_template
from flask_socketio import SocketIO, emit
import os

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*") 

#Armazenar ultimo dado recebido
ultimo_dado_joy = {}
ultimo_dado_but = {}

@app.route('/dadosjoystick', methods=['POST'])
def receber_dados_joys():
    global ultimo_dado_joy
    data= request.json
    ultimo_dado_joy = data  #Salva os ultimos dados recebidos
    print(f"Dados recebidos joystick: {data}")
    socketio.emit('novo_dado', data) 
    return {"status": "ok"}, 200

@app.route('/dadosbotoes', methods=['POST'])
def receber_dados_butt():
    global ultimo_dado_but
    data= request.json
    ultimo_dado_but = data  #Salva os ultimos dados recebidos
    print(f"Dados recebidos botoes: {data}")
    socketio.emit('novo_dado', data) 

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    socketio.run(app, host='0.0.0.0', port=port)
