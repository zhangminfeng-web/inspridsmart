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
        <div class="btn-group-appointment">
            <div class="floor_title margin_appointment text-center">
                <span class="title_index">请点击预约</span>
            </div>
            <button class="btn btn-success" @click="open_QR_code">二维码预约门禁</button>
            <button class="btn btn-success" @click="open_Face_img">人脸识别预约门禁</button>
            <button class="btn btn-success" @click="open_password_str">密码预约门禁</button>
        </div>

    </div>
</template>

<script>
    module.exports = {
        data:function () {
            return {
                QRCODE:"",  //二维码门禁参数
                sixNumberPassword:"",  //门禁密码
            }
        },
        methods:{
            open_QR_code(){  //二维码预约门禁
                let that = this;
                this.confirmLaert("确定预约二维码门禁吗？",function(){
                    that.QRCODE = "";
                    layer.open({
                        title:"门禁二维码--请截图",
                        type: 1,
                        skin: 'layui-layer-rim', //加上边框
                        area: ['450px', '300px'], //宽高
                        content: '<div class="QR_code_box">' +
                            '<div id="qrcode"></div>' +
                            '</div>'
                    });
                    let qrcodeEl = document.getElementById("qrcode");
                    that.QRCODE = that.createNumberSix();
                    qrcodeEl.innerHTML = "";
                    var qrcode = new QRCode(qrcodeEl, {
                        width: 200,
                        height: 200,
                        colorDark: "#fff",
                        colorLight: "#14AEFF",
                    });

                    qrcode.makeCode(that.QRCODE);
                });
            },
            open_Face_img(){  //人脸识别预约门禁

            },
            open_password_str(){  //密码预约门禁
                let that = this;
                this.sixNumberPassword = this.createNumberSix();
                this.confirmLaert("确定使用密码预约门禁吗？",function(){
                    layer.open({
                        title:"门禁密码--请截图",
                        type: 1,
                        skin: 'layui-layer-rim', //加上边框
                        area: ['320px', '140px'], //宽高
                        content: '<div class="show_dool_password">门禁密码为：'+that.sixNumberPassword+'</div>'
                    });
                });
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

</style>