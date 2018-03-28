from flask import Flask, send_from_directory
import os

# currentDir = os.path.dirname( __file__)
staticDir = os.path.join('..', 'client', 'static')

app = Flask(__name__, static_folder=staticDir)

@app.route('/')
def root():
    return app.send_static_file('index.html')

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory(os.path.join('..', 'client', 'static', path))
