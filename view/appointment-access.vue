<template>
    <div>
        <div class="row placeholders">
            <div class="col-xs-12 col-sm-12">
                <!--在线室内设备-->
                <div class="clearfix">
                    <div class="floor_title margin_appointment">
                        <i class="iconfont icon-loumian"></i>
                        <span class="title_index">预约门禁</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="table-search-fieldset">
            <span class="search_box_number">温馨提示：</span>
            <div class="fromSearch">
                <b>
                    <span class="font-appointment-style">请注意：</span>
                    <br>
                    1.不论是人脸识别、二维码或者是密码预约门禁，只是在24小时之内有效，且只能是单次使用，故使用一次后作废。如果想继续使用，请重新点击对应按钮，生成对应门禁识别操作。
                    <br>
                    2.预约门禁功能，虽然方便了外来访客的进去，但是也增加了陌生人员进入小区内部的几率，所以请谨慎使用。
                </b>
            </div>
        </div>
        <div class="clearfix appointment_Equipment_box">
            <div class="single_trigger" @click="toggleActiveStatus" v-for="(item) in allEquipmentlist" :ip="item.ip">{{item.senderName}}</div>
        </div>
        <div class="btn-group-appointment">
            <div class="floor_title margin_appointment text-center">
                <span class="title_index">请点击预约</span>
            </div>
            <button class="btn btn-success" @click="open_QR_code">二维码预约门禁</button>
            <button class="btn btn-success" @click="open_Face_img">人脸识别预约门禁</button>
            <button class="btn btn-success" @click="open_password_str">密码预约门禁</button>
        </div>

        <!--人脸预约门禁-->
        <div class="appointment_model_bg" style="display:none;">
            <div class="appointment_model_content">
                <div class="appointment_model_header">
                    <span class="appointment_model_title" id="model_title">人脸预约门禁</span>
                    <span class="appointment_model_close" @click="closeModelAppointment">×</span>
                </div>
                <div class="appointment_model_mains">
                    <div class="video_show_box_appointment">
                        <video ref="video" id="videoFaceEl" class="videoFace" autoplay></video>
                        <div class="btn_appointment_box">
                            <button type="button" @click="clickPhotograph" class="btn btn-danger">拍照</button>
                        </div>
                    </div>
                    <div class="img_box_appointment">
                        <img :src="imgDateAppointment" ref="img" class="image_show_area" width="100%" height="330">
                        <canvas ref="canvas" width="380" height="330" hidden></canvas>
                        <div class="btn_appointment_box">
                            <button type="button" v-if="imgDateAppointment" @click="sendFaceImg" class="btn btn-danger">发送图片预约门禁</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    module.exports = {
        data:function () {
            return {
                QRCODE:"",  //二维码门禁参数
                sixNumberPassword:"",  //门禁密码
                imgDateAppointment:'',  //图片数据
                allEquipmentlist:[],   //所有设备信息数组
                baseURLS:"http://localhost:43839",    //全局网址
            }
        },
        mounted(){
            let _this = this;
            setInterval(function(){
                _this.initData();
            },5000);
        },
        methods:{
            initData(){
                axios.get(this.baseURLS+"/videoWatch").then(res => {
                    let obj = res.data;
                    if(obj.code == 0){
                        this.allEquipmentlist = obj.doorwayList;
                    }
                });
            },
            async _initVideo(){  //初始化函数
                this.$refs.video.srcObject = await navigator.mediaDevices.getUserMedia({
                    video:true,
                    audio:false
                });
                this._canvas2d = this.$refs.canvas.getContext("2d");
            },
            toggleActiveStatus(event){
                let liEl = $(event.currentTarget);
                liEl.parent().find(".active").removeClass('active');
                liEl.addClass('active');
            },
            open_QR_code(){  //二维码预约门禁
                let that = this;
                let arr = $(".appointment_Equipment_box").find(".active");
                let ip = arr.attr("ip");
                if(arr.length != 0){
                    this.confirmLaert("确定预约二维码门禁吗？",function(){
                        that.QRCODE = "";
                        layer.open({
                            title:"门禁二维码--请保留",
                            type: 1,
                            skin: 'layui-layer-rim', //加上边框
                            area: ['450px', '360px'], //宽高
                            content: '<div class="QR_code_box">' +
                                '<div id="qrcode"></div>' +
                                '</div>'
                        });
                        let qrcodeEl = document.getElementById('qrcode');
                        that.QRCODE = that.createNumberSix();
                        qrcodeEl.innerHTML = "";
                        new QRCode(document.getElementById('qrcode'), "qrcode="+that.QRCODE);
                        //发送二维码
                        $(document).trigger("sendQRcodeNumber",["qrcode="+that.QRCODE,that.QRCODE,ip]);
                    });
                }else{
                    layer.msg("请先选择对应设备,再发送二维码！",{
                        time:3000,
                        icon: 5,
                        shift:6
                    });
                }
            },
            open_Face_img(){  //人脸识别预约门禁
                let arr = $(".appointment_Equipment_box").find(".active");
                let ip = arr.attr("ip");
                if(arr.length != 0){
                    let model = $(".appointment_model_bg");
                    model.show("slow");
                    this._initVideo();
                }else{
                    layer.msg("请先选择对应设备,再点击人脸预约门禁按钮！",{
                        time:3000,
                        icon: 5,
                        shift:6
                    });
                }
            },
            open_password_str(){  //密码预约门禁
                let that = this;
                let arr = $(".appointment_Equipment_box").find(".active");
                let ip = arr.attr("ip");
                if(arr.length != 0){
                    this.sixNumberPassword = this.createNumberSix();
                    this.confirmLaert("确定使用密码预约门禁吗？",function(){
                        layer.open({
                            title:"门禁密码--请保留",
                            type: 1,
                            skin: 'layui-layer-rim', //加上边框
                            area: ['320px', '140px'], //宽高
                            content: '<div class="show_dool_password">门禁密码为：'+that.sixNumberPassword+'</div>'
                        });

                        //发送门禁密码
                        $(document).trigger("sendPasswordNumber",["password="+that.sixNumberPassword,that.sixNumberPassword,ip]);
                    });
                }else{
                    layer.msg("请先选择对应设备,再发送门禁密码！",{
                        time:3000,
                        icon: 5,
                        shift:6
                    });
                }

            },
            clickPhotograph(){   //拍照
                this._canvas2d.drawImage(this.$refs.video,0,0,390,330);
                let oldImg = this._canvas2d.getImageData(0,0,390,330);
                //将截图内容转化为base64
                let newImg = this.createNewCanvas(oldImg,390,330);
                this.imgDateAppointment = newImg;
            },
            sendFaceImg(){      //发送图片预约门禁
                let that = this;
                let arr = $(".appointment_Equipment_box").find(".active");
                let ip = arr.attr("ip");
                if(arr.length != 0){
                    if(this.imgDateAppointment){
                        let str = this.imgDateAppointment.substring("data:image/jpeg;base64,".length);
                        let arrBuffer = this.base64ToUint8Array(str);
                        this.closeModelAppointment();

                        //发送人脸识别数据arrayBuffer
                        $(document).trigger("sendPeopleFaceData",[arrBuffer,ip]);
                    }else{
                        layer.msg("请先拍照！");
                    }
                }else{
                    layer.msg("请先选择对应设备,再发送人脸图片信息！",{
                        time:3000,
                        icon: 5,
                        shift:6
                    });
                }

            },
            base64ToUint8Array(base64String){
                const padding = '='.repeat((4 - base64String.length % 4) % 4);
                const base64 = (base64String + padding)
                    .replace(/\-/g, '+')
                    .replace(/_/g, '/');

                const rawData = window.atob(base64);
                const outputArray = new Uint8Array(rawData.length);

                for (let i = 0; i < rawData.length; ++i) {
                    outputArray[i] = rawData.charCodeAt(i);
                }
                return outputArray;
            },
            createNewCanvas(content,width,height){ //将截图内容转化为base64
                let nCanvas = document.createElement('canvas');
                let nCtx = nCanvas.getContext('2d');
                nCanvas.width = width;
                nCanvas.height = height;
                nCtx.putImageData(content,0,0);
                return nCanvas.toDataURL('image/jpeg');
            },
            closeModelAppointment(){  //关闭弹框
                let model = $(".appointment_model_bg");
                model.hide("slow");
                this.imgDateAppointment = "";
            },
            createNumberSix(){  //随机生成六位数密码
                let numbers = "";
                for (let i = 1; i <= 6; i++) {
                    const num = Math.floor(Math.random() * 10);
                    numbers += num;
                }
                return numbers;
            },
            confirmLaert(str,callback){  //公共的询问弹框
                layer.confirm(str,{
                    btn:['预约','取消'],
                },function(index){
                    layer.close(index);
                    callback();
                },function(){
                    console.log("已取消预约！");
                })
            }
        }
    }
</script>

<style>
    .appointment_Equipment_box{
        width:100%;
        height:160px;
        overflow: hidden;
        overflow-y: auto;
        border:1px solid #ddd;
        margin:20px 0;
        padding:10px;
    }

    .appointment_Equipment_box>.single_trigger{
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

    .appointment_Equipment_box>.single_trigger.active,
    .appointment_Equipment_box>.single_trigger:hover{
        border:1px solid #E41612;
        background:rgba(252,231,231,.6);
        color:#E41612;
    }

    .margin_appointment{
        margin:20px 0 !important;
    }

    .font-appointment-style{
        color:#AC1923;
    }

    .QR_code_box{
        display: flex;
        justify-content: center;
        margin-top:25px;
    }

    .show_dool_password{
        display: flex;
        justify-content: center;
        margin-top:23px;
        font-weight:600;
        font-size:26px;
    }

    /*弹框样式*/
    .appointment_model_bg{
        width:100%;
        height:100%;
        background:rgba(0,0,0,.5);
        position:fixed;
        z-index: 10000;
        top:0;
        left:0;
    }

    .appointment_model_content{
        width:800px;
        height:440px;
        border:1px solid #ddd;
        border-radius:5px;
        position:absolute;
        top:50%;
        left:50%;
        margin-left:-400px;
        margin-top:-220px;
        background:#fff;
    }

    .appointment_model_header{
        width:100%;
        height:40px;
        padding:0 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom:1px solid #ddd;
    }

    .appointment_model_title{
        font-size: 18px;
        font-family: MicrosoftYaHei;
        color: rgba(0, 0, 0, 0.85);
    }

    .appointment_model_close{
        font-size: 30px;
        font-weight: 500;
        line-height: 1;
        color: #333;
        text-shadow: 0 1px 0 #fff;
        cursor: pointer;
    }

    .appointment_model_close:hover{
        opacity: .6;
    }

    .appointment_model_mains{
        width:100%;
        height:400px;
        padding:10px 10px;
    }

    .video_show_box_appointment{
        height:380px;
        width:49%;
        float:left;
        border:1px solid #ddd;
    }

    .video_show_box_appointment>.videoFace{
        width:100%;
        height:330px;
        object-fit: fill;
    }

    .img_box_appointment{
        height:380px;
        width:49%;
        float:right;
        border:1px solid #ddd;
    }

    .image_show_area{
        width:100%;
        height:330px;
    }

    .btn_appointment_box{
        display: flex;
        justify-content: center;
        align-items: center;
        width:100%;
        height:50px;
    }

</style>