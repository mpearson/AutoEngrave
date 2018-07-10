from database import Design, MachineProfile
from svgloader import loadSVG
from engrave import engrave, engravePixels
import base64


def runGCodeTask(task):
    yield "\n; Running custom g-code...\n\n"
    for command in task["commands"]:
        yield command.strip() + "\n"


def runDesignTask(task):
    # machine = MachineProfile.get_by_id(job["machineID"])
    # feedRate = machine.defaultFeedRate

    # TODO: get this from the machine profile, obvs
    maxFeedRate = 30000
    travelFeedRate = 0.25 * maxFeedRate

    design = Design.get_by_id(task["designID"])
    if design.filetype != "image/svg+xml":
        yield "\n; Skipping non-SVG file \"%s\"...\n\n" % design.name
        return

    yield "\n; Beginning design \"%s\"...\n\n" % design.name

    dataOffset = design.imageData.index(",") + 1
    imgFile = base64.b64decode(design.imageData[dataOffset:])

    # dpi = 80
    # mmPerPixel = width / design.width # 25.4 / dpi
    mmPerPixel = 25.4 / task["dpi"]
    overscan = 10 # mm
    x = task["x"]
    y = task["y"]
    targetWidth = task["width"]
    targetHeight = task["height"]
    originalWidth = design.width * 25.4 / design.dpi
    scale = targetWidth / originalWidth

    img = loadSVG(
        imgFile,
        inputDPI=design.dpi,
        outputDPI=task["dpi"] * scale,
        ignoreStrokes=True,
        antialiasing=False,
        monochrome=True
    )

    moveList = engrave(img, mmPerPixel, x, y, overscan=overscan)

    power = min(1.0, max(0.0, task["power"] * 0.01))
    engraveFeedRate = min(1.0, max(0.0, task["speed"] * 0.01)) * maxFeedRate

    currentFeedRate = travelFeedRate
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
            if currentFeedRate != travelFeedRate:
                currentFeedRate = travelFeedRate
                feedRateChanged = True

        if feedRateChanged:
            params.append("F%d" % currentFeedRate)
            feedRateChanged = False

        yield " ".join(params) + "\n"


def export_gcode(job):
    for task in job["tasks"]:
        taskType = task["type"]
        if taskType == "gcode":
            commands = runGCodeTask(task)
        elif taskType == "raster":
            commands = runDesignTask(task)

        for command in commands:
            yield command
