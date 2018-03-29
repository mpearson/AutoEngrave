from serial.tools import list_ports



    #  --------------------------------------------------------------
    #  Printer connection handling
    #  --------------------------------------------------------------

    def connect_to_printer(self, port, baud, dtr):
        try:
            self.p.connect(port, baud, dtr)
        except SerialException as e:
            # Currently, there is no errno, but it should be there in the future
            if e.errno == 2:
                self.logError(_("Error: You are trying to connect to a non-existing port."))
            elif e.errno == 8:
                self.logError(_("Error: You don't have permission to open %s.") % port)
                self.logError(_("You might need to add yourself to the dialout group."))
            else:
                self.logError(traceback.format_exc())
            # Kill the scope anyway
            return False
        except OSError as e:
            if e.errno == 2:
                self.logError(_("Error: You are trying to connect to a non-existing port."))
            else:
                self.logError(traceback.format_exc())
            return False
        self.statuscheck = True
        self.status_thread = threading.Thread(target = self.statuschecker)
        self.status_thread.start()
        return True

    def do_connect(self, l):
        a = l.split()
        p = self.scanserial()
        port = self.settings.port
        if (port == "" or port not in p) and len(p) > 0:
            port = p[0]
        baud = self.settings.baudrate or 115200
        if len(a) > 0:
            port = a[0]
        if len(a) > 1:
            try:
                baud = int(a[1])
            except:
                self.log("Bad baud value '" + a[1] + "' ignored")
        if len(p) == 0 and not port:
            self.log("No serial ports detected - please specify a port")
            return
        if len(a) == 0:
            self.log("No port specified - connecting to %s at %dbps" % (port, baud))
        if port != self.settings.port:
            self.settings.port = port
            self.save_in_rc("set port", "set port %s" % port)
        if baud != self.settings.baudrate:
            self.settings.baudrate = baud
            self.save_in_rc("set baudrate", "set baudrate %d" % baud)
        self.connect_to_printer(port, baud, self.settings.dtr)

    def scanserial(self):
        """scan for available ports. return a list of device names."""
        return list_ports.comports()

    def online(self):
        self.log("\rPrinter is now online")
        self.write_prompt()

    def do_disconnect(self, l):
        self.p.disconnect()

    def help_disconnect(self):
        self.log("Disconnects from the printer")

    def do_block_until_online(self, l):
        while not self.p.online:
            time.sleep(0.1)
