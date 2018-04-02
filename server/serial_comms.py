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
            raise Exception("Already connected to %s!" % self.connection)
        # try:
        self.connection = serial.Serial(port, baud)
        self.connection.open()
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
        return {
            "connected": self.connection is not None,
            "port": self.port,
            "baudrate": self.baudrate,
            "connectedTime": self.connectedTime.isoformat(),
        }
