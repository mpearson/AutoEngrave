from flask import Flask, send_from_directory, request, Response
import os
import json
import math
import random
from serial_comms import getCOMPorts, SerialConnection
import time
from database import db, Design, MaterialProfile
import peewee
import datetime
from job_queue import export_gcode

staticDir = os.path.join("..", "client", "build")

app = Flask(__name__, static_folder=staticDir)


# returns a JSON response based on the return value of the wrapped function, passing through any args received
# if the inner function returns a tuple, it must look like (responseObject, statusCode)
# if responseObject is None, returns an empty body
def jsonResponse(endpointFn):
    def wrappedFn(*args, **kwagrgs):
        try:
            endpointResult = endpointFn(*args, **kwagrgs)
            if type(endpointResult) is tuple:
                data, status = endpointResult
            else:
                data = endpointResult
                status = 200
            if data is None:
                body = ""
            else:
                body = json.dumps({"results": data})
        except Exception as e:
            body = json.dumps({"error": str(e)})
            status = 500

        return body, status

    wrappedFn.__name__ = endpointFn.__name__
    return wrappedFn


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
    return getCOMPorts()

@app.route("/api/connection/open", methods=["POST"])
def connection_open():
    port = request.json["port"]
    baudrate = request.json["baudrate"]
    connection.open(port, baudrate)
    return connection.getStatus()

@app.route("/api/connection/close", methods=["POST"])
def connection_close():
    connection.close()
    return connection.getStatus()

@app.route("/api/connection/status", methods=["GET"])
def connection_status():
    return connection.getStatus()


#-----------------------------------------------------------------------------#
#                            Machine Profile API                              #
#-----------------------------------------------------------------------------#

@app.route("/api/settings/machines", methods=["GET"])
@jsonResponse
def list_machines():
    return []

@app.route("/api/settings/machines", methods=["POST"])
@jsonResponse
def create_machine():
    machine = request.json

@app.route("/api/settings/machines/<int:machineID>", methods=["PUT"])
@jsonResponse
def update_machine(machineID):
    machine = request.json

@app.route("/api/settings/machines/<int:machineID>", methods=["DELETE"])
@jsonResponse
def delete_machine(machineID):
    pass


#-----------------------------------------------------------------------------#
#                            Material Profile API                             #
#-----------------------------------------------------------------------------#

@app.route("/api/settings/materials", methods=["GET"])
@jsonResponse
def list_materials():
    records = MaterialProfile.select().order_by(MaterialProfile.updated.desc())
    return [record.serialize() for record in records]

@app.route("/api/settings/materials", methods=["POST"])
@jsonResponse
def create_material():
    material = request.json

@app.route("/api/settings/materials/<int:materialID>", methods=["PUT"])
@jsonResponse
def update_material(materialID):
    material = request.json

@app.route("/api/settings/materials/<int:materialID>", methods=["DELETE"])
@jsonResponse
def delete_material(materialID):
    pass

#-----------------------------------------------------------------------------#
#                             Design Catalog API                              #
#-----------------------------------------------------------------------------#

@app.route("/api/catalog", methods=["GET"])
@jsonResponse
def list_designs():
    records = Design.select().order_by(Design.updated.desc())
    return [record.serialize() for record in records]

@app.route("/api/catalog", methods=["POST"])
@jsonResponse
def create_design():
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
    return {
        "id": record.id,
        "created": record.created.isoformat(),
        "updated": record.updated.isoformat(),
    }, 201

@app.route("/api/catalog/<int:designID>", methods=["PUT"])
@jsonResponse
def update_design(designID):
    jsonData = request.json
    with db.atomic() as transaction:
        record = Design.get_by_id(designID)
        record.name         = jsonData["name"]
        record.description  = jsonData["description"]
        record.dpi          = jsonData["dpi"]
        record.updated      = datetime.datetime.now()
        record.save()

    return {
        "updated": record.updated.isoformat(),
    }

@app.route("/api/catalog/<int:designID>", methods=["DELETE"])
@jsonResponse
def delete_design(designID):
    try:
        record = Design.delete_by_id(designID)
    except DoesNotExist:
        pass

    return None, 204



if __name__ == "__main__":
    app.run(host="0.0.0.0")
    db.connect()
