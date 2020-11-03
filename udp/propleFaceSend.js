const dgram = require('dgram');
const global = require("../global/globalFile");
const udp_client = dgram.createSocket('udp4');

module.exports.sendPeopleSendImg = function(arrayBuffer,callback){
    udp_client.bind(function (){
        udp_client.setBroadcast(true);
    });
    console.log(arrayBuffer);
    udp_client.send(arrayBuffer,global.PEOPLEFACE_PORT, '255.255.255.255',(err) => {
        console.log(err);
        callback();
        if(err != null){  //Uint8Array
            console.log(err);
        }
    });
}