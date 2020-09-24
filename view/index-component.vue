<template>
    <div>
        <div class="table-search-fieldset">
            <span class="search_box_number">搜索门牌号</span>
            <div class="fromSearch">
                <form class="form-horizontal row">
                    <div class="form-group col-sm-3">
                        <label class="col-sm-4 control-label padding_left_right">楼栋</label>
                        <div class="col-sm-8">
                            <select name="tung_id" @change="findItemNameBYClass" v-model="searchObj.currentId" class="col-sm-8 form-control">
                                <option v-for="(item) in listTung" :value="item.id">{{item.name}}</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group col-xs-3">
                        <label class="col-sm-4 control-label padding_left_right">单元门</label>
                        <div class="col-sm-8">
                            <select name="unit_id" v-model="searchObj.currentUnit" id="element_tung" class="form-control">
                                <option v-for="(item,index) in listSearchUnit" :selected="index==0?'true':''"  :value="item.id">{{item.name}}</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group col-xs-4">
                        <label class="col-sm-3 control-label padding_left_right">门牌号</label>
                        <div class="col-sm-9">
                            <input type="text" v-model="searchObj.currentHouse" name="home_number" autocomplete="off" class="form-control"
                                   placeholder="请按照‘1001’格式进行搜索。">
                        </div>
                    </div>
                    <div class="form-group btn_block_box_submit col-xs-2">
                        <button type="button" @click="searchResult" class="layui-btn">搜索</button>
                    </div>
                </form>
            </div>
        </div>
        <div class="row placeholders">
            <div class="col-xs-12 col-sm-12 placeholder">
                <!--楼栋-->
                <div class="title_row_style clearfix">
                    <div class="floor_title">
                        <i class="iconfont icon-icon_loudong_dingkong-01"></i>
                        <span class="title_index">楼栋</span>
                    </div>
                    <ul class="clearfix list_all_item" id="select_tung_all">
                        <li @click="showUnit" v-for="(item,index) in listTung" :id="item.id" :class="index==0?'active':''">{{item.name}}</li>
                    </ul>
                </div>
                <!--单元门-->
                <div class="title_row_style clearfix">
                    <div class="floor_title">
                        <i class="iconfont icon-8"></i>
                        <span class="title_index">单元门</span>
                    </div>
                    <ul class="clearfix list_all_item" id="select_unit_all">
                        <li @click="showHouse" v-for="(item,index) in listUnit" :id="item.id" :class="index==0?'active':''">{{item.name}}</li>
                    </ul>
                </div>
                <!--门牌号-->
                <div class="title_row_style clearfix">
                    <div class="floor_title">
                        <i class="iconfont icon-fl-jia"></i>
                        <span class="title_index">门牌号</span>
                    </div>
                    <ul class="clearfix list_all_item scroll_ul" id="house_list">
                        <li v-for="(item,index) in listHouse">
                                    <span @click="navigatorDetail(item.id)">
                                        {{item.alias_name}}
                                    </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    module.exports = {
        data: function() {
            return {
                listTung:[],    //楼栋数组
                listUnit:[],    //单元数组
                listHouse:[],   //门牌号数组
                listSearchUnit:[], //单元下拉框动态数组
                baseURLS:"http://localhost:43839", //全局网址
                searchObj:{
                    currentId:null,     //当前选中的楼栋
                    currentUnit:null,   //当前选中的单元
                    currentHouse:null,  //当前选中的门牌号
                },
                TungId:null,    //选中的楼栋id
                unitId:null,    //选中的单元id
            }
        },
        created(){
            axios.get(this.baseURLS+"/").then(res => {
                let obj = res.data;
                if(obj.code == 0){
                    this.listTung = obj.data.listTung;
                    this.listUnit = obj.data.listUnit;
                    this.listSearchUnit = obj.data.listUnit;
                    console.log(this.listSearchUnit);
                    this.listHouse = obj.data.listHouse;
                    this.searchObj.currentId = this.listTung[0].id;
                    this.searchObj.currentUnit = this.listSearchUnit[0].id;
                }
            });
        },
        methods:{
            navigatorDetail(id){
                var index = layer.open({
                    title: '住户详情',
                    type: 2,
                    shade: 0.2,
                    maxmin:true,
                    shadeClose: true,
                    area: ['100%', '100%'],
                    content:"./view/userdetail.html?id="+id,
                });
            },
            searchResult(){
                if(this.searchObj.currentHouse != null){
                    let obj = {
                        tung_id:this.searchObj.currentId,
                        unit_id:this.searchObj.currentUnit,
                        home_number:this.searchObj.currentHouse
                    };
                    axios.post(this.baseURLS+"/searchHouse?",obj).then(res => {
                        let obj = res.data;
                        console.log(obj);
                        if(obj.code == 0){
                            this.listHouse = obj.houseList;
                        }
                    });
                }else{
                    layer.msg("门牌号不能为空！", {
                        icon: 5, time: 2000, anim: 6
                    })
                }
            },
            findItemNameBYClass(){
                axios.get(this.baseURLS+"/selectGetUnit?tung_id="+this.searchObj.currentId,).then(res => {
                    let obj = res.data;
                    this.listSearchUnit = obj.unitList;
                    this.searchObj.currentUnit = this.listSearchUnit[0].id;
                });
            },
            showUnit(event){
                let liEl = $(event.currentTarget);
                this.Tungid = liEl.attr("id");
                axios.get(this.baseURLS+"/selectGetUnit?tung_id="+this.Tungid).then(res => {
                    let obj = res.data;
                    if(obj.code == 0){
                        liEl.parent().find(".active").removeClass('active');
                        liEl.addClass('active');
                        this.listUnit = obj.unitList;
                        this.listHouse = [];
                    }else {
                        layer.msg("暂未获取到数据...", {
                            icon: 5, time: 2000, anim: 6
                        })
                    }
                });
            },
            showHouse(event){
                let liEL = $(event.currentTarget);
                this.unitId = liEL.attr("id");
                if(!this.Tungid){
                    this.Tungid = $("#select_tung_all").find(".active").attr("id");
                }
                axios.get(this.baseURLS+"/getHouseAll?tung_id="+this.Tungid+"&unit_id="+this.unitId).then(res => {
                    let obj = res.data;
                    if(obj.code == 0){
                        liEL.parent().find(".active").removeClass('active');
                        liEL.addClass('active');
                        this.listHouse = obj.houseAllList;
                    }else{
                        layer.msg("暂未获取到数据...", {
                            icon: 5, time: 2000, anim: 6
                        })
                    }
                });
            }
        },
    }
</script>

<style>
    .fromSearch{
        width:100%;
        position: relative;
        margin:20px 0;
    }

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

    .scroll_ul{
        height:400px;
        overflow: hidden;
        overflow-y: scroll;
    }

    .scroll_height{
        height:600px;
    }

    .table-search-fieldset{
        margin-bottom: 30px;
        border: 1px solid #e6e6e6;
        padding: 10px 20px 5px 20px;
        color: #6b6b6b;
        position:relative;
    }

    .search_box_number{
        position:absolute;
        padding:3px 10px;
        background:#fff;
        z-index:2;
        top:-15px;
        left:15px;
        font-size:16px;
    }

    .layui-select-title{
        display: flex;
    }

    .btn_block_box_submit{
        position: relative;
        top:-4px;
    }

    .padding_left_right{
        padding-left:5px;
        padding-right:5px;
    }
</style>