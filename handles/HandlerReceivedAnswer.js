const global = require("../global/globalFile");

module.exports.receivedAnswer = async function(data,documentEl){

    //将type还原成offer
    //data.type = "answer"; //对接本地PC机
    //console.log(data);
    //data.type = "offer"; //对接安卓

    //设置远端与连接关联的描述信息
    await global.KEY_OFFER_PEER_CONNECTION.setRemoteDescription(new RTCSessionDescription(data));

    console.log("peerA的offer、answer信息交换完成");
}