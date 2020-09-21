var os = require('os');
const global = require("../global/globalFile");

module.exports.getIPAdress = function(){
    var interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return global.SELF_IP = alias.address;
            }
        }
    }
}