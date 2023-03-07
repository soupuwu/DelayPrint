// https://docs.octoprint.org/en/master/plugins/gettingstarted.html#frontend-fun-how-to-add-functionality-to-octoprint-s-web-interface

$(function() {
  function DelayPrintViewModel(parameters) {
      var self = this;

      self.settings = parameters[0];
      self.dialog = ko.observable(undefined)

      self.time_input = ko.observable(undefined)
  }

  self.getDialogText = function(dialog_type) {
    if(dialog_type == "dialog:choice") {
      return gettext("Run print now or later?");
    }
    else if (dialog_type == "dialog:schedule") {
      return gettext("Schedule print for when?");
    }
    else {
      return gettext("");
    }
  };

  self.onDataUpdaterPluginMessage = function(plugin, data) {
    if(plugin != "delayprint") {
      return
    }
    switch(data.action) {
      case "dialog:show":
        self.showDialog(self.getDialogText(data.action), data.parameters);
        break;
      case "dialog:hide":
        self.hideDialog();
        break;
    }
  };

  self.dialogChoice = function(params, index) {
    Octoprint.plugins.delayprint.select(params[index])
  };
// TODO: implement UI for scheduling
  self.showDialog = function(text, parameters) {
    var opts = {
      title: gettext("Delay Print"),
      message: text,
      selections: Array.from(parameters),
      maycancel: true,
      onselect: function(choice_index) {
        if(index > -1) {
          self.dialogChoice(parameters, index);
        }
      },
      onclose: function() {
        self.dialog = ko.observable(undefined);
      }
    };
    self.dialog(showSelectionDialog(opts));
  };

  self.hideDialog = function() {
    if(self.dialog != undefined) {
      self.dialog('hide');
      self.dialog = ko.observable(undefined);
    }
  }


  OCTOPRINT_VIEWMODELS.push([
      DelayPrintViewModel,
      ["settingsViewModel"],
  ]);
});