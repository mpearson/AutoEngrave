from flask import Flask, send_from_directory, request
import os
import json
import math
import random
from serial_comms import getCOMPorts

staticDir = os.path.join("..", "client", "static")

app = Flask(__name__, static_folder=staticDir)

@app.route("/")
def root():
    return app.send_static_file("index.html")

@app.route("/static/<path:path>")
def send_static(path):
    return send_from_directory(os.path.join(staticDir, path))


@app.route("/console/send", methods=["POST"])
def console_send():
    command = request.json["command"]
    if command == "M114":
        return json.dumps({
            "results": "5.000X, 5.000Y, 9.000Z"
        })
    elif random.random() > 0.3:
        return json.dumps({
            "results": None
        })
    else:
        return json.dumps({
            "error": "your request is bad, and you should feel bad"
        }), 400


@app.route("/console/pause", methods=["POST"])
def console_pause():
    # stop sending G-code
    pass

@app.route("/console/resume", methods=["POST"])
def console_resume():
    # resume sending G-code
    pass

# G4 - sleep for S<seconds> or P<milliseconds>
# G90 - absolute coords
# G91 - relative coords
# G28 - home
# M3 - enable laser
# M5 - disable laser



@app.route("/comms/scan", methods=["GET"])
def comms_scan():
    return json.dumps({
        "results": [*getCOMPorts(), "COM%d" % random.choice((69, 420, 729))]
    })







if __name__ == "__main__":
    app.run()
