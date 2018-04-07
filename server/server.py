from flask import Flask, send_from_directory, request
import os
import json
import math
import random
from serial_comms import getCOMPorts, SerialConnection
import time

staticDir = os.path.join("..", "client", "build")

app = Flask(__name__, static_folder=staticDir)


connection = SerialConnection()

# @app.route("/")
# def root():
#     return app.send_static_file("index.html")

# @app.route("/<path:filename>")
# def send_static1(filename):
#     return send_from_directory(staticDir, filename)

# @app.route("/static/<path:filename>")
# def send_static2(filename):
#     return send_from_directory(os.path.join(staticDir, "static"), filename)

# @app.route("/images/<path:filename>")
# def send_static3(filename):
#     return send_from_directory(os.path.join(staticDir, "images"), filename)



@app.route("/api/console/send", methods=["POST"])
def console_send():
    if not connection.connected:
        return json.dumps({
            "error": "Can't send command: machine is not connected!"
        }), 400

    try:
        command = request.json["command"]
        response = connection.send(command, blocking=True)
    except Exception as e:
        return json.dumps({
            "error": 'Error sending command %r: %s' % (command, str(e))
        }), 400

    return json.dumps({
        "results": response
    })
    # if command == "M114":
    #     return json.dumps({
    #         "results": "5.000X, 5.000Y, 9.000Z"
    #     })
    # elif random.random() > 0.3:
    #     return json.dumps({
    #         "results": None
    #     })
    # else:



@app.route("/api/console/pause", methods=["POST"])
def console_pause():
    # stop sending G-code
    pass

@app.route("/api/console/resume", methods=["POST"])
def console_resume():
    # resume sending G-code
    pass

# G4 - sleep for S<seconds> or P<milliseconds>
# G90 - absolute coords
# G91 - relative coords
# G28 - home
# M3 - enable laser
# M5 - disable laser




@app.route("/api/connection/scan", methods=["GET"])
def connection_scan():
    return json.dumps({
        "results": getCOMPorts()
    })

@app.route("/api/connection/open", methods=["POST"])
def connection_open():
    # try:
    port = request.json["port"]
    baudrate = request.json["baudrate"]
    connection.open(port, baudrate)
    return json.dumps({
        "results": connection.getStatus()
    })
    # except Exception as e:
    #     return json.dumps({
    #         "error": str(e)
    #     }), 400

@app.route("/api/connection/close", methods=["POST"])
def connection_close():
    connection.close()
    return json.dumps({
        "results": connection.getStatus()
    })

@app.route("/api/connection/status", methods=["GET"])
def connection_status():
    return json.dumps({
        "results": connection.getStatus()
    })







if __name__ == "__main__":
    app.run()
