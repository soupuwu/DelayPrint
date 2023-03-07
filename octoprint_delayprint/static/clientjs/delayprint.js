(function (global, factory) {
  if (typeof define === "function" && define.amd) {
      define(["OctoPrintClient"], factory);
  } else {
      factory(global.OctoPrintClient);
  }
})(this, function(OctoPrintClient) {
  var OctoPrintDelayPrintClient = function(base) {
      this.base = base;
  };

  OctoPrintDelayPrintClient.prototype.get = function(refresh, opts) {
      return this.base.get(this.base.getSimpleApiUrl("delayprint"), opts);
  };

  OctoPrintDelayPrintClient.prototype.select = function(choice, opts) {
      var data = {
          choice: choice
      };
      return this.base.simpleApiCommand("delayprint", "select", data, opts);
  };

  OctoPrintClient.registerPluginComponent("delayprint", OctoPrintDelayPrintClient);
  return OctoPrintDelayPrintClient;
});