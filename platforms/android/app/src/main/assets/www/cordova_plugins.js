cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-play-games-services.PlayGamesServices",
      "file": "plugins/cordova-plugin-play-games-services/www/play-games-services.js",
      "pluginId": "cordova-plugin-play-games-services",
      "clobbers": [
        "cordova.plugins.playGamesServices",
        "window.plugins.playGamesServices"
      ]
    },
    {
      "id": "cordova-plugin-purchase.InAppBillingPlugin",
      "file": "plugins/cordova-plugin-purchase/www/store-android.js",
      "pluginId": "cordova-plugin-purchase",
      "clobbers": [
        "store"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-play-games-services": "1.1.2",
    "cordova-plugin-purchase": "10.1.1",
    "cordova-plugin-whitelist": "1.3.4"
  };
});