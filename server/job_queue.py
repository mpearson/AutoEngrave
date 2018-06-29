from database import Design, MachineProfile
from svgloader import loadSVG
from engrave import engrave, engravePixels
import base64


def export_gcode(job):
    yield "M3\n\n"

    # machine = MachineProfile.get_by_id(job["machineID"])
    # feedRate = machine.defaultFeedRate

    # TODO: get this from the machine profile, obvs
    defaultFeedRate = 30000

    for task in job["tasks"]:
        design = Design.get_by_id(task["designID"])
        if design.filetype == "image/svg+xml":
            yield "\n; Beginning design \"%s\"...\n\n" % design.name

            x = task["x"]
            y = task["y"]
            width = task["width"]
            height = task["height"]

            dataOffset = design.imageData.index(",") + 1
            imgFile = base64.b64decode(design.imageData[dataOffset:])
            scale = width / design.width

            img = loadSVG(
                imgFile,
                inputDPI=design.dpi,
                outputDPI=task["dpi"] * scale,
                ignoreStrokes=True,
                antialiasing=False,
                monochrome=True
            )
            # dpi = 80
            # mmPerPixel = width / design.width # 25.4 / dpi
            mmPerPixel = 25.4 / task["dpi"]
            overscan = 10 # mm
            moveList = engrave(img, mmPerPixel, x, y, overscan=overscan)

            power = min(1.0, max(0.0, task["power"] * 0.01))
            engraveFeedRate = min(1.0, max(0.0, task["speed"] * 0.01)) * 30000

            currentFeedRate = defaultFeedRate
            feedRateChanged = True

            for move in moveList:
                command, laserOn, x, y = move

                params = [command, "X%.5f" % x, "Y%.5f" % y]
                if command == "G1":
                    if laserOn:
                        params.append("S%.5f" % power)
                    else:
                        params.append("S0.00000")
                    if currentFeedRate != engraveFeedRate:
                        currentFeedRate = engraveFeedRate
                        feedRateChanged = True
                else:
                    if currentFeedRate != defaultFeedRate:
                        currentFeedRate = defaultFeedRate
                        feedRateChanged = True

                if feedRateChanged:
                    params.append("F%d" % currentFeedRate)
                    feedRateChanged = False

                yield " ".join(params) + "\n"

        else:
            yield "\n; Skipping non-SVG file \"%s\"...\n\n" % design.name

    yield "\nM5\n"
