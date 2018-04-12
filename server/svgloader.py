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
import cairosvg

def traverse(node, fn, root=True):
    fn(node, root)
    for child in node.children:
        traverse(child, fn, False)

def removeStrokes(node, root):
    if root is not True and node.get("stroke", "none") != "none":
        node["visibility"] = "hidden"

def disableAntialiasing(node, root):
    if root is not True:
        node["shape-rendering"] = "crispEdges"

'''
loads an SVG file and renders it into a numpy array
'''
def loadSVG(bytestring, outputDPI=72, inputDPI=72, ignoreStrokes=False, antialiasing=True, monochrome=False):
    tree = cairosvg.surface.Tree(bytestring=bytestring)

    if ignoreStrokes:
        traverse(tree, removeStrokes)
    if not antialiasing:
        traverse(tree, disableAntialiasing)

    # set the target bitmap DPI
    scale = outputDPI / inputDPI

    surface = cairosvg.surface.PNGSurface(
        tree,
        None,           # no, I don't want to save a friggin PNG file you wanker
        inputDPI,       # stupid library seems to completely ignore this, yet it's a required param
        None,           # whatever
        scale=scale     # finally something that actually works!
    )

    img = np.frombuffer(surface.cairo.get_data(), np.uint8)
    img.shape = (surface.cairo.get_width(), surface.cairo.get_height(), 4)

    if monochrome:
        # only keep the alpha layer; no colors up in here!
        # and we don't need to worry about any of that dark grey bullshit from illustrator
        output = np.copy(img[:, :, 3])
    else:
        # full ARGB output
        output = np.copy(img)

    surface.finish()

    return output
