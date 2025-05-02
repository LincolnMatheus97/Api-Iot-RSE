from flask import Flask, request

app = Flask(__name__)

@app.route('/dados', methods = ['POST'])
def receber_dados():
    data= request.json
    print(f"Dados recebidos: {data}")
    return {"status": "ok"}, 200

if __name__ == '__main__':
    app.run(debug=True)