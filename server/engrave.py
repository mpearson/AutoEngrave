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

'''
Generates a binary image with 1 for horizontal edges and 0 elsehwere
'''
def findEdges(img):
    # converting from uint8 to int8 creates an image where black = 1 and white = -1
    normalized = img.astype(np.int8)
    # add 1px to the left and right edges so the diff is the same width as the original
    padded = cv2.copyMakeBorder(normalized, 0, 0, 1, 1, cv2.BORDER_CONSTANT, value=0)

    return np.diff(padded, axis=1) != 0

'''
Generates laser commands in the form of (command, laserOn, X, Y) tuples with raw pixel coordinates
command is either G0 or G1
laserOn means set laser power to non-zero
'''
def engravePixels(img, overscan=None, bidirectional=True):
    edges = findEdges(img)
    reverse = False

    for y, row in enumerate(edges):
        offsets = np.nonzero(row)[0]
        if offsets.shape[0] == 0:
            continue
        elif offsets.shape[0] % 2 != 0:
            raise Exception("Error: Edge detection found an odd number of edges (%d) in row %d" % (offsets.shape[0], y))

        if reverse:
            offsets = offsets[::-1]

        # start overscan
        if overscan is not None:
            yield ("G0", False, offsets[0] - overscan, y)

        # actually engrave the row
        laserOn = False
        for x in offsets:
            yield ("G1", laserOn, x, y)
            laserOn = not laserOn

        # end overscan
        if overscan is not None:
            yield ("G1", False, offsets[-1] + overscan, y)

        if bidirectional:
            reverse = not reverse
            if overscan is not None:
                overscan = -overscan

'''
Generates laser commands in the form of (laserOn, X, Y) tuples
'''
def engrave(img, unitsPerPixel, originX=0, originY=0, overscan=None, bidirectional=True):
    if overscan is not None:
        overscan /= unitsPerPixel

    for move in engravePixels(img, overscan=overscan, bidirectional=bidirectional):
        command, laserOn, x, y = move
        x = (x * unitsPerPixel) + originX
        y = (y * unitsPerPixel) + originY
        yield (command, laserOn, x, y)
