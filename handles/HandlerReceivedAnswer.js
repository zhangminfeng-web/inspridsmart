const global = require("../global/globalFile");

module.exports.receivedAnswer = async function(data,documentEl){

    //将type还原成offer
    data.type = "answer";

    //设置远端与连接关联的描述信息
    await global.KEY_OFFER_PEER_CONNECTION.setRemoteDescription(new RTCSessionDescription(data));

    console.log("peerA和peerB的offer、answer信息减缓完成");
}