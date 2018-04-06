import serial
from serial.tools import list_ports
import datetime


def getCOMPorts():
    return [port.device for port in list_ports.comports()]


class SerialConnection(object):
    def __init__(self):
        self.port = None
        self.baudrate = None
        self.connection = None
        self.connectedTime = None

    def open(self, port, baudrate):
        if self.connection is not None:
            print("Warning: Already connected to %s!" % self.connection)
        # try:
        self.connection = serial.Serial(port, baudrate)
        self.connectedTime = datetime.datetime.now()
        # except Exception as e:


    def close(self):
        if self.connection is not None:
            self.connection.close()
            self.connection = None
            self.port = None
            self.baudrate = None
            self.connectedTime = None

    def getStatus(self):
        connectedTime = None if self.connectedTime is None else self.connectedTime.isoformat()
        return {
            "connected": self.connection is not None,
            "port": self.port,
            "baudrate": self.baudrate,
            "connectedTime": connectedTime,
        }
