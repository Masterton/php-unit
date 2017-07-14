define(['vue-resource'], function(vueResource) {
   'use strict';
      // mycourse/mycourse.js
var course = new Vue({
    el:"#body",
    data:{
        displayList:[],
        // allCourse:[],//所有课程
        // todo:[],//待处理课程  请求参数 status:all,process:1
        // doing:[],//正在进行中的课程 请求参数 status:1
        // complete:[],//已经完成的课程 请求参数 status:0
        //
        status:0,// 所在的类型.
        page:0, // 当前的页数.
        total:0,  // 总的条数.
        showAera:false,
        opinion:{
            content:'',
            sub_flow:'',
            work_flow:'',
            work_num:''
        },
    },
    methods:{
        getPageData:function(status){
            this.checkParam(status);
            var api = '';
            switch (status){
                case 0:
                    api = 'api/workflow?page='+this.page;
                    break;
                case 1:
                    api = 'api/workflow/?status=all&process=1&page=' + this.page;
                    break;
                case 2:
                    api = 'api/workflow/?status=0&page=' + this.page;
                    break;
                case 3:
                    api = 'api/workflow/?status=1&page='+this.page;
                    break;
            }
            if(this.displayList.length == 0 || this.displayList.length != this.total) {
                var loading = weui.loading('加载中~');
                Vue.http.get(api).then(function (res) {
                    if (res.body.error == 0) {
                        var data = res.body;
                        course.dataTrans(data);
                        loading.hide();
                    } else {
                        loading.hide();
                        weui.alert(res.body.desc, {
                            title: '请求出错'
                        })
                    }
                });
            }else{
                weui.toast('加载完毕');
            }
        },
        getSearch:function(data){
            //通过搜索 进入该页面
            course.displayList = [];
            var loading = weui.loading('加载中~');
            Vue.http.get(GLOBAL.SITE_BASE_URL+'/api/workflow/'+data).then(function(res){
                if(res.body.error==0){
                    var data = res.body;
                    course.dataTrans(data);
                    loading.hide()
                }else{
                    loading.hide();
                    weui.alert(res.body.desc,{
                        title:'请求出错'
                    })
                }
            })
        },
        dataTrans:function(info){
            if(info.data.data !== undefined){
                for(var i=0;i<info.data.data.length;i++){
                    info.data.data[i].show = true;
                }
                this.displayList.push.apply(this.displayList,info.data.data);
                this.total = info.data.total;
            }
        },
        turnTo:function(num){
            window.location.href = GLOBAL.SITE_BASE_URL + "/details/?q="+num  //跳转到详情页面
        },
        loading:function(){
            var vue = this;
            var Screen = window.innerHeight;//屏幕高度
            var scroll =    document.body.scrollTop;//滚动条 滚动的高度
            var plus = document.body.scrollHeight;// 文档总共的高度     当文档滚动到最下方时候,screen + scroll = plus
            var time= document.getElementsByClassName('list-time');//所有的时间
            if(Screen+scroll>=plus){
                removeEventListener('scroll',vue.loading);
                vue.getPageData(this.status);
                window.document.addEventListener('scroll',vue.loading)
            };
        },
        checkParam:function(status){
            if(this.status != status){
                this.page = 0;
                this.total = 0;
            }
            this.showAera = false;
            this.status = status;
        },
        showDetail:function(index){
            this.displayList[index].show =! this.displayList[index].show;
        },
        sub:function(){
            var comment = course.opinion;
            Vue.http.post('api/subflow/comment',comment).then(function(res){
                weui.toast(res.body.msg,1000)
            })
            course.opinion.content = '';
            course.showAera = false;
        },
        addOpinion:function(sub_flow,work_flow,work_num){
            course.opinion.sub_flow = sub_flow;
            course.opinion.work_flow = work_flow;
            course.opinion.work_num = work_num;
            course.showAera = true;
        },
        urgeManager:function (work_flow,sub_flow) {
            weui.toast('提醒成功!',3000);
            this.$http.post(GLOBAL.SITE_BASE_URL+'/sendmsg',{work_flow:work_flow,sub_flow:sub_flow}).then(function (res) {

            }).catch(function (res) {
                console.log(res)
            })
        }
    },
    watch:{
        // 根据状态来获取到相应的对应的类型.
        status:function(newValue){
            this.displayList = [];
        },
        // 来获取到相应的数据.
        displayList:function(newValue){
            if(this.displayList.length == 0){
                this.page = 0;
            }else{
                this.page++;
            }
        }
    }
});
window.document.addEventListener('scroll',course.loading);

var key = window.location.search;
if (key){
    course.getSearch(key)
}else{
    course.getPageData(0);
};


weui.tab('#nav',{
    defaultIndex: 0,
    onChange: function(index){

    }
});
});