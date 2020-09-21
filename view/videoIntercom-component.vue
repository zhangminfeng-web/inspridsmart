<template>
    <div>
        <div class="row placeholders">
            <div class="col-xs-12 col-sm-12 placeholder">
                <!--在线室内设备-->
                <div class="title_row_style clearfix">
                    <div class="floor_title video_intercom">
                        <i class="iconfont icon-fl-jia"></i>
                        <span class="title_index">在线室内设备</span>
                    </div>
                    <ul class="clearfix list_all_item" id="house_list">
                        <li @click="endAnswerInfo" v-for="item in indoorList" port="58888" :ip="item.ip">{{item.senderName}}</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    module.exports = {
        data:function(){
            return {
                indoorList:[],   //可视对讲设备数组集合
                baseURLS:"http://localhost:43839", //全局网址
            }
        },
        created(){
            this._jqThis = $(this);
            this.init();
            this._jqThis.on('receiver_offer',this.endOffer);
        },
        methods:{
            //返回一个新建的 RTCPeerConnection实例，它代表了本地机器与远端机器的一条连接。
            getPeerConnector(){
                return new RTCPeerConnection();
            },
            endOffer(e,data){
                console.log(data);
                console.log("需要发送offer啦");
            },
            async endAnswerInfo(event){  //发送answer
                let El = $(event.currentTarget);
                let ip = El.attr("ip");
                //1.调用连接对象，返回一个RTCPeerConnection实例
                let peerConnection = this.getPeerConnector();

                this._jqThis.trigger('receiver_offer',"你好吗？");

                //2.创建一个offer
                let answer = await peerConnection.createOffer();
                answer.type = "answer";
                console.log(answer);
                axios.get(this.baseURLS+"/sendAnswer?ip="+ip+"&type=answer&sdp="+answer.sdp).then(res => {
                    console.log(res);
                });
            },
            init(){     //初始化获取设备信息
                axios.get(this.baseURLS+"/videoIntercom").then(res => {
                    let obj = res.data;
                    if(obj.code == 0){
                        this.indoorList = obj.indoorList;
                    }
                })
            }
        }
    }
</script>

<style>
    .fromSearch>i{
        display: block;
        position: absolute;
        right:0;
        top:0;
        padding:6px 8px;
        cursor:pointer;
        font-size:20px;
        color:#C0C0C0;
    }

    .video_intercom{
        margin:30px 0 !important;
    }

    .fromSearch>i:hover{
        opacity: .8;
    }

    .title_row_style{
        margin-bottom:30px;
    }

    .floor_title{
        margin-bottom:15px;
    }

    .floor_title>i{
        font-size:24px;
        color:#000;
    }

    .title_index{
        font-size: 20px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: #000000;
    }

    .list_all_item>li{
        width:150px;
        height:40px;
        line-height: 40px;
        text-align: center;
        border-radius:20px;
        font-size: 18px;
        font-family: MicrosoftYaHei;
        color: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(0, 0, 0, 0.5);
        margin-right:10px;
        margin-bottom:10px;
        float:left;
        cursor: pointer;
    }

    .list_all_item>li.active,
    .list_all_item>li:hover{
        border:1px solid #E41612;
        background:rgba(252,231,231,.6);
        color:#E41612;
    }

    .scroll_ul>li>a{
        color: rgba(0, 0, 0, 0.5);
    }

    .scroll_ul>li:hover>a{
        color:#E41612;
        text-decoration:none;
    }
</style>