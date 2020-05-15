cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-play-games-services/www/play-games-services.js",
        "id": "cordova-plugin-play-games-services.PlayGamesServices",
        "pluginId": "cordova-plugin-play-games-services",
        "clobbers": [
            "cordova.plugins.playGamesServices",
            "window.plugins.playGamesServices"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-play-games-services": "1.1.2",
    "cordova-plugin-purchase": "10.1.1",
    "cordova-plugin-whitelist": "1.3.4"
}
// BOTTOM OF METADATA
});