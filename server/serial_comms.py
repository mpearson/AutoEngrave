import serial
from serial.tools import list_ports
import datetime


def getCOMPorts():
    return [port.device for port in list_ports.comports()]

def cleanCommand(command):
    parts = command.split(";", 1)
    if len(parts) > 0:
        return (parts[0].strip() + "\n").encode("ascii")
    return None


class SerialConnection(object):
    def __init__(self):
        self.port = None
        self.baudrate = None
        self.serial = None
        self.connectedTime = None

    @property
    def connected(self):
        return self.serial is not None

    def open(self, port, baudrate):
        if self.serial is not None:
            print('Warning: Already connected to "%s"! Disconnecting...' % self.port)
            self.serial.close()
        try:
            self.serial = serial.Serial(port, baudrate)
            self.port = port
            self.baudrate = baudrate
            self.connectedTime = datetime.datetime.now()
        except Exception as e:
            self.serial = None
            self.port = None
            self.baudrate = None
            self.connectedTime = None

            raise

    def close(self):
        if self.serial is not None:
            self.serial.close()
            self.serial = None
            self.port = None
            self.baudrate = None
            self.connectedTime = None

    def getStatus(self):
        connectedTime = None if self.connectedTime is None else self.connectedTime.isoformat()
        return {
            "connected": self.serial is not None,
            "port": self.port,
            "baudrate": self.baudrate,
            "connectedTime": connectedTime,
        }

    def send(self, command, blocking=True):
        cleaned = cleanCommand(command)
        if cleaned is None:
            return None

        self.serial.write(cleaned)
        if blocking:
            response = self.serial.readline() # Wait for response with carriage return
            return response.strip().decode("ascii")
