import random
import time
import paho.mqtt.client as mqtt
import json

broker = "broker.hivemq.com"
port = 1883
topic = "smartcity/poubelles"


def on_connect(client, userdata, flags, rc):
    print("Connecté avec le code de résultat " + str(rc))


client = mqtt.Client()
client.on_connect = on_connect
client.connect(broker, port, 60)

poubelles = []
for i in range(1,51):
    poubelle = {
        "id": i,
        "distance": random.randint(60, 100),
        "pourcentage": 0
    }
    poubelles.append(poubelle)

while True:
    for poubelle in poubelles:
        decrement = random.uniform(0.5, 2.0)
        poubelle["distance"] = max(0, poubelle["distance"] - decrement)

        poubelle["pourcentage"] = (100 - poubelle["distance"]) / 100 * 100

        message = {
            "id": poubelle["id"],
            "distance": round(poubelle["distance"], 2),
            "pourcentage": round(poubelle["pourcentage"], 2)
        }

        client.publish(topic, json.dumps(message))
        print(f"Envoyé à MQTT: {message}")

    time.sleep(10)
