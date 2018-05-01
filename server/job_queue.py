from database import Design
from svgloader import loadSVG
from engrave import engrave, engravePixels
import base64


def export_gcode(job):
    yield "M3\n\n"

    for task in job["tasks"]:
        design = Design.get_by_id(task["designID"])
        if design.filetype == "image/svg+xml":
            yield "\n; Beginning design \"%s\"...\n\n" % design.name

            x = task["x"]
            y = task["y"]
            width = task["width"]
            height = task["height"]

            offset = design.imageData.index(",") + 1
            imgFile = base64.b64decode(design.imageData[offset:])
            scale = width / design.width

            img = loadSVG(
                imgFile,
                inputDPI=design.dpi,
                outputDPI=task["dpi"] * scale,
                ignoreStrokes=True,
                antialiasing=False,
                monochrome=True)

            # dpi = 80
            # mmPerPixel = width / design.width # 25.4 / dpi
            mmPerPixel = 25.4 / task["dpi"]
            overscan = 10 # mm

            moveList = engrave(img, mmPerPixel, x, y, overscan=overscan)

            for move in moveList:
                laserOn, x, y = move
                yield "%s X%f Y%f\n" % ("G1" if laserOn else "G0", x, y)
        else:
            yield "\n; Skipping non-SVG file \"%s\"...\n\n" % design.name

    yield "\nM5\n"
