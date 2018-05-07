from flask import Flask, send_from_directory, request, Response
import os
import json
import math
import random
from serial_comms import getCOMPorts, SerialConnection
import time
from database import db, Design
import peewee
import datetime
from job_queue import export_gcode

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
# M106 - fan on
# M107 - fan  off


@app.route("/api/job/export", methods=["GET", "POST"])
def job_export_gcode():
    if request.method == "GET":
        job = json.loads(request.args.get("job"))
    else:
        job = request.json

    response = Response(export_gcode(job), mimetype="application/octet-stream")
    fileName = datetime.datetime.now().isoformat() + ".g"
    response.headers["Content-Disposition"] = "attachment; filename=" + fileName

    return response


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


#-----------------------------------------------------------------------------#
#                            Machine Profile API                              #
#-----------------------------------------------------------------------------#

@app.route("/api/settings/machines", methods=["GET"])
def list_machines():
    return json.dumps({"results": []})

@app.route("/api/settings/machines", methods=["POST"])
def create_machine():
    machine = request.json

@app.route("/api/settings/machines/<int:machineID>", methods=["PUT"])
def update_machine(machineID):
    machine = request.json

@app.route("/api/settings/machines/<int:machineID>", methods=["DELETE"])
def delete_machine(machineID):
    pass


#-----------------------------------------------------------------------------#
#                            Material Profile API                             #
#-----------------------------------------------------------------------------#

@app.route("/api/settings/materials", methods=["GET"])
def list_macterials():
    return json.dumps({"results": []})

@app.route("/api/settings/materials", methods=["POST"])
def create_material():
    material = request.json

@app.route("/api/settings/materials/<int:materialID>", methods=["PUT"])
def update_material(materialID):
    material = request.json

@app.route("/api/settings/materials/<int:materialID>", methods=["DELETE"])
def delete_material(materialID):
    pass


x = 0

#-----------------------------------------------------------------------------#
#                             Design Catalog API                              #
#-----------------------------------------------------------------------------#

@app.route("/api/catalog", methods=["GET"])
def list_designs():
    try:
        records = Design.select().order_by(Design.updated.desc())
        results = [record.serialize() for record in records]
    except Exception as e:
        return json.dumps({"error": str(e)}), 500

    return json.dumps({"results": results})

@app.route("/api/catalog", methods=["POST"])
def create_design():
    # return json.dumps({"results": int(random.random() * 1000)})
    try:
        jsonData = request.json
        with db.atomic() as transaction:
            record = Design.create(
                name        = jsonData["name"],
                description = jsonData["description"],
                width       = jsonData["width"],
                height      = jsonData["height"],
                dpi         = jsonData["dpi"],
                filetype    = jsonData["filetype"],
                imageData   = jsonData["imageData"],
            )
        return json.dumps({
            "results": {
                "id": record.id,
                "created": record.created.isoformat(),
            }
        }), 201
    except Exception as e:
        return json.dumps({"error": str(e)}), 500

@app.route("/api/catalog/<int:designID>", methods=["PUT"])
def update_design(designID):
    try:
        jsonData = request.json
        with db.atomic() as transaction:
            record = Design.get_by_id(designID)
            record.name         = jsonData["name"]
            record.description  = jsonData["description"]
            record.dpi          = jsonData["dpi"]
            record.updated      = datetime.datetime.now()
            record.save()

    except Exception as e:
        return json.dumps({"error": str(e)}), 500
    else:
        return json.dumps({
            "results": {
                "updated": record.updated.isoformat(),
            }
        })

@app.route("/api/catalog/<int:designID>", methods=["DELETE"])
def delete_design(designID):
    try:
        record = Design.delete_by_id(designID)
    except DoesNotExist:
        pass
    except Exception as e:
        return json.dumps({"error": str(e)}), 500
    else:
        return "", 204



if __name__ == "__main__":
    app.run()
    db.connect()
