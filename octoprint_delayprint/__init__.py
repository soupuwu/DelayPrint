##################################################################################
# Octolapse - A plugin for OctoPrint used for making stabilized timelapse videos.
# Copyright (C) 2023 Ryan Hanson
##################################################################################

import octoprint.plugin
import octoprint.printer
import octoprint.events
from octoprint.events import Events as OEvents
import flask

try:
  import schedule
except ModuleNotFoundError:
  import sys
  print("Could not import schedule module!")
  sys.exit(-1)

class DelayPrintPlugin(octoprint.plugin.StartupPlugin,
                       octoprint.plugin.ShutdownPlugin,
                       octoprint.plugin.TemplatePlugin,
                       octoprint.plugin.AssetPlugin,
                       octoprint.plugin.SimpleApiPlugin,
                       octoprint.plugin.EventHandlerPlugin):

    # startup plugin
    def on_after_startup(self):
        self._logger.info("Hello World!")

    # shutdown plugin
    def on_shutdown(self):
      self._logger.info("Warning: Delay Print jobs do not currently persist across shutdowns!")

    # Asset plugin
    def get_assets(self):
       return dict(
        js=["js/delayprint.js"]
       )

    # SimpleApi plugin
    def get_api_commands(self):
      return dict(select=["file", "starttime"])

    def on_api_command(self, command, data):
      if command == "select":
        self.schedule_print(data["file"], data["starttime"])

    def on_api_get(self, request):
      return super().on_api_get(request)
    
    # EventHandler plugin
    def on_event(self, event, payload):
      if event == OEvents.PRINT_STARTED:
        # When print is started, pop up and ask the user if they want it to run now or later
        pass

      if event == OEvents.DISCONNECTED:
        # if printer is disconnected, close any plugin dialog
        pass
      
      return super().on_event(event, payload)

    # DelayPrint
    def trigger_scheduled_print(self, file):
      if octoprint.printer.is_ready():
        try: 
          octoprint.printer.select_file(path=file, sd=False, printAfterSelect=True)
          pass
        except octoprint.printer.InvalidFileType:
          ## TODO: log file was bad also probably do this when scheduling not triggering
          pass
        except octoprint.printer.InvalidFileLocation:
          ## TODO: log issue / do this earlier also
          pass
      else:
        ## TODO: log that print was unable to start
        pass

    def schedule_print(self, file, start_time):
      pass

__plugin_pythoncompat__ = ">=3.6,<4"
__plugin_implementation__ = DelayPrintPlugin()
