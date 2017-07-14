var index = new Vue({
	el:'#body',
	data:{
		name:'',
		manager:'',
		start:'',
		end:'',
		log:[

		]
	},
	methods:{
		getLog:function(data){

			Vue.http.get(GLOBAL.SITE_BASE_URL+'/api/course/log'+data).then(function(res){
				if (res.body.data.length !== 0 && res.body.error == 0) {
					weui.toast(res.body.desc,1500);
					index.name = res.body.data.chapter.value[0];
					index.manager = res.body.data.name;
					index.start = res.body.data.created_at;
					index.end = res.body.data.updated_at;
					index.log = res.body.data.page.data
				}else if(res.body.error == 0){
					weui.alert('暂无内容',{
						title:'请求出错'
					})
				}else{
					weui.alert(res.body.desc,{
						title:'请求出错'
					})
				}
			})
		}
	}		
});
var key = window.location.search;
index.getLog(key)