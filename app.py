from flask import Flask, request, render_template_string
import os

app = Flask(__name__)

#Armazenar ultimo dado recebido
ultimo_dado = {}

@app.route('/dados', methods = ['POST'])
def receber_dados():
    global ultimo_dado
    data= request.json
    ultimo_dado = data  #Salva os ultimos dados recebidos
    print(f"Dados recebidos: {data}")
    return {"status": "ok"}, 200

@app.route('/dashboard')
def dashboard():
    global ultimo_dado
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Dashboard IoT</title>
        <meta http-equiv="refresh" content="1">
        <style>
            body { font-family: Arial; text-align: center; margin-top: 50px; }
            .box { display: inline-block; border: 1px solid #ccc; padding: 20px; border-radius: 10px; }
            h1 { color: #333; }
            p { font-size: 20px; }
        </style>
    </head>
    <body>
        <div class="box">
            <h1>Últimos Dados Recebidos</h1>
            <p><strong>Botão A:</strong> {{ botao_a }}</p>
            <p><strong>Botão B:</strong> {{ botao_b }}</p>
            <p><strong>Joystick X:</strong> {{ x }}</p>
            <p><strong>Joystick Y:</strong> {{ y }}</p>
        </div>
    </body>
    </html>
    """

    valor_botao_a = ultimo_dado.get("botao_a")
    valor_botao_b = ultimo_dado.get("botao_b")

    status_botao_a = "Pressionado!" if valor_botao_a == 1 else "solto" if valor_botao_a == 0 else "N/A"
    status_botao_b = "Pressionado!" if valor_botao_b == 1 else "solto" if valor_botao_b == 0 else "N/A"
    
    return render_template_string(html,
        botao_a=status_botao_a,
        botao_b=status_botao_b,
        x=ultimo_dado.get("x", "N/A"),
        y=ultimo_dado.get("y", "N/A")
    )

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port)
