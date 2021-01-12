const net = require('net');
const global = require("../global/globalFile");
const Udp = require("../udp/cloudUdpServer");
let socket_server = null;
let list = [];
let len = 0;

let serverMenuTree = { "valueData": null };

const tcp = net.createServer(socket => {
    socket_server = socket;

    // 创建socket服务端
    //console.log('net服务端有新连接进来了: ' + socket_server.remoteAddress + ':' + socket_server.remotePort);

    //接收到数据
    socket_server.on('data',function(data){
        var buf = data.length;
        len += buf;
        list.push(data);
    });

    //客户端关闭事件
    socket_server.on('close',async function(data){
        //console.log('net服务端断开连接....');
        serverMenuTree.valueData = Buffer.concat(list, len);
        list =[];
        len = 0;
        //socket_server.end();
    });

    //数据错误事件
    socket_server.on('error',function(exception){
        //console.log('net服务端报错:' + exception);
        //socket_server.destroy();
    });

}).listen(global.VIDEO_PORT);

//向端口写入数据到达服务端
exports.sendInfo = async function(ip,type,callback){
    //通过udp协议打开视频端口
    await Udp.sendOpenVideo(ip,type);
    //监听数据发生改变时，触发的回调事件
    Object.defineProperty(serverMenuTree,'valueData',{
        get:(value) => {
            callback(value);
        },
        set:(value) => {
            callback(value);
        }
    })
};

/*关闭客户端与服务端的链接*/
exports.close = async function(ip,type,callback){
    //通过udp协议关闭视频端口
    await Udp.sendCloseVideo(ip,type);
    socket_server.destroy();
    callback && callback();
};
