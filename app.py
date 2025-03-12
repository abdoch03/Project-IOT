from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import paho.mqtt.client as mqtt
import json

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(app)

BROKER = "broker.hivemq.com"
PORT = 1883
TOPIC = "smartcity/poubelles"

mqtt_client = mqtt.Client()

@app.route("/")
def index():
    return render_template("index.html")

def on_connect(client, userdata, flags, rc):
    print("Connecté au broker MQTT")
    client.subscribe(TOPIC)

def on_message(client, userdata, msg):
    data = json.loads(msg.payload.decode())
    print("Message reçu :", data)
    socketio.emit("mqtt_message", data)

mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message
mqtt_client.connect(BROKER, PORT, 60)

@socketio.on("connect")
def handle_connect():
    print("Client WebSocket connecté")

if __name__ == "__main__":
    mqtt_client.loop_start()
    socketio.run(app, debug=True)
