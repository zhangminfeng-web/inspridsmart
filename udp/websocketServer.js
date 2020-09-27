const ws = require("nodejs-websocket");
const global = require("../global/globalFile");
console.log("开始建立连接...");
var server = ws.createServer(function(conn){
    console.log("新的连接进来了...");
    conn.on("text", function (str){
        console.log("收到的信息为:"+str);
    });
    conn.on("close", function (code,reason){
        console.log("关闭连接");
    });
    conn.on("error", function (code,reason){
        console.log("异常关闭");
    });
}).listen(global.WEB_INTERCOM_PORT,function(){
    console.log("websocket服务已经启动...");
});