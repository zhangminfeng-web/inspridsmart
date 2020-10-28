const global = require("../global/globalFile");

module.exports.receivedAnswerICE = async function(data,documentEl){

    //获取answerPc连接对象
    let answerPc = global.KEY_ANSWER_PEER_CONNECTION;

    console.log(answerPc);
    console.log("客户端处理服务端发送来的ice信息");
    console.log(data);

    //客户端接收answer_ice消息
    if(answerPc){
        if(!data.sdpMLineIndex){
            data.sdpMLineIndex = 0;
            data.sdpMid = "audio";
        }
        console.log("*******");
        console.log(data);
        console.log(data.candidate);

        setTimeout(function(){
            answerPc.addIceCandidate(new RTCIceCandidate(data));
        })

    }

    console.log("客户端交换ice信息完成了");
};