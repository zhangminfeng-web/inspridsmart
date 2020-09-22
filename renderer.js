let intercom_intercom = require("./udp/intercomClient");

$(document).ready(function(){
    //返回一个新建的 RTCPeerConnection实例，它代表了本地机器与远端机器的一条连接。
    let peerConnection = new RTCPeerConnection();

    setTimeout(function(){
        $("#house_list_intercom").on("sendAnswer","li",async function(e,ip){
            console.log("发送answer");
            //1.获取本地数据流
            const stream = await navigator.mediaDevices.getUserMedia({
                video:true,
                //false:true
            });

            //2.将本地流信息展示在video中
            document.getElementById('local').srcObject = stream;

            //3.创建一个answer
            let answer = await peerConnection.createOffer();
            answer.type = "answer";

            //发送answer
            intercom_intercom.sendIntercomInfo(ip,answer,function(data){
                console.log("前端拿到服务器的返回值");
                console.log(data);
            });
        });
    },1000);
});
