# Copyright (c) 2018 Stooge Labs
# URL: www.stoogelabs.com
# Author: Matthew H. Pearson

# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

import numpy as np
import cv2
from svgloader import loadSVG
from engrave import engrave, engravePixels
import json
import time


def movePreview(edgeImg, moveList):
    lastX = 0
    lastY = 0
    for move in moveList:
        laserOn, x, y = move
        # print("%s X%f Y%f" % ("G1" if laserOn else "G0", x, y))
        if lastY != y:
            lastX = x
            lastY = y
        # else:
        if x > lastX:
            x1, x2 = lastX, x
        else:
            x1, x2 = x, lastX
        if laserOn:
            color = (0, 255, 0)
        else:
            color = (192, 64, 16)

        edgeImg[y, x1 : x2] = color

        lastX = x
        lastY = y

        yield

t0 = time.time()
dpi = 80
mmPerPixel = 25.4 / dpi
overscan = 15 # mm
with open("test.svg", "rb") as f:
    img = loadSVG(f.read(), inputDPI=72, outputDPI=dpi, ignoreStrokes=True, antialiasing=False, monochrome=True)

moveList = engrave(img, mmPerPixel, 0, 0, overscan=overscan)

for move in moveList:
    laserOn, x, y = move
    print("%s X%f Y%f" % ("G1" if laserOn else "G0", x, y))


print(time.time() - t0)

# generate preview image
edgeImg = np.zeros((*img.shape, 3), dtype=np.uint8)
preview = movePreview(edgeImg, engravePixels(img, int(overscan / mmPerPixel)))



# np.set_printoptions(threshold=np.inf)

cv2.namedWindow('MyLittleImage')
cv2.startWindowThread()
while cv2.getWindowProperty('MyLittleImage', 0) != -1:

    cv2.imshow('MyLittleImage', edgeImg)

    key = cv2.waitKey(delay=1)
    if key == ord('q'):
        cv2.destroyAllWindows()
        break
    elif key == ord(' '):
        for n in range(20):
            try:
                next(preview)
            except StopIteration:
                pass

