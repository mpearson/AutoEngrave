from serial.tools import list_ports


def getCOMPorts():
    return [port.device for port in list_ports.comports()]


class SerialConnection(object):
    def __init__(self):
        self.connection = None

    def open(self, port, baud):
        if self.connection is None:
            raise Exception("Already connected to %s!" % self.connection)
        self.connection = serial.Serial(port, baud)
        self.connection.open()

    def close(self):
        if self.connection is not None:
            self.connection.close()
            self.connection = None
