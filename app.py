from flask import Flask, request, render_template
from flask_socketio import SocketIO, emit
import os
import threading

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*") 

# Armazenar último dado recebido
ultimo_dado_joy = {}
ultimo_dado_but = {}

# Lock para proteger acesso às variáveis globais
lock = threading.Lock()

def processar_joy(data):
    global ultimo_dado_joy
    with lock:
        ultimo_dado_joy = data
    print(f"[Thread JOY] Dados processados: {data}")
    socketio.emit('novo_dado', data)

def processar_but(data):
    global ultimo_dado_but
    with lock:
        ultimo_dado_but = data
    print(f"[Thread BUT] Dados processados: {data}")
    socketio.emit('novo_dado', data)

@app.route('/dadosjoystick', methods=['POST'])
def receber_dados_joys():
    data = request.json
    # dispara o processamento em uma thread separada
    threading.Thread(target=processar_joy, args=(data,), daemon=True).start()
    return {"status": "ok"}, 200

@app.route('/dadosbotoes', methods=['POST'])
def receber_dados_butt():
    data = request.json
    # dispara o processamento em uma thread separada
    threading.Thread(target=processar_but, args=(data,), daemon=True).start()
    return {"status": "ok"}, 200

@app.route('/dashboard/botoes')
def dashboard_botoes():
    return render_template('botoes.html')

@app.route('/dashboard/joystick')
def dashboard_joystick():
    return render_template('joystick.html')

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    # passa use_reloader=False para não duplicar threads em dev
    socketio.run(app, host='0.0.0.0', port=port, use_reloader=False)
