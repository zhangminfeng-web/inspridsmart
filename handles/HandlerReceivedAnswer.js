const global = require("../global/globalFile");

module.exports.receivedAnswer = async function(data,documentEl){

    console.log("服务端接收到answer信息");

    //设置远端与连接关联的描述信息
    await global.KEY_OFFER_PEER_CONNECTION.setRemoteDescription(new RTCSessionDescription(data));

    console.log("服务端的offer、answer信息交换完成");
}