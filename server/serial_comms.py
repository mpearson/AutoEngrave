from serial.tools import list_ports


def getCOMPorts():
    return [port.device for port in list_ports.comports()]
