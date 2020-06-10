cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-admob-plus.AdMob",
      "file": "plugins/cordova-admob-plus/www/admob.js",
      "pluginId": "cordova-admob-plus",
      "clobbers": [
        "admob"
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
    "cordova-admob-plus": "0.0.0",
    "cordova-plugin-purchase": "10.1.1",
    "cordova-plugin-whitelist": "1.3.4"
  };
});