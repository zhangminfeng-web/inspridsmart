let net = require('net');
let global = require("../global/globalFile");
let client= new net.Socket();


module.exports.sendFaceData = function(imgData,ip,callback){
    console.log("发送人脸数据");
    //创建socket客户端
    client.setEncoding('binary');

    client.connect(global.PEOPLEFACE_PORT,ip,function() {
        //客户端向服务端socket发送数据
        client.write(imgData);
        callback();
        let t= setTimeout(function(){
            client.destroy();
            clearTimeout(t);
        },500);

    });

    // 为客户端添加“data”事件处理函数
    // data是服务器发回的数据
    client.on('data', function(data) {
        console.log("从服务器接受的数据："+data+"\n");
    });

    //错误出现之后关闭连接
    client.on('error',function(error){
        console.log('error:'+error);
        client.destory();
    });

    // 为客户端添加“close”事件处理函数
    client.on('close', function() {
        console.log('客户端Connect closed');
    });

}

