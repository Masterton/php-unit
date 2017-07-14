define(['vue-resource'], function(vueResource) {
   'use strict';
      // index/index.js

var index = new Vue({
	el:'#container',
	data:{
		list:[],
		placeholder:'搜索课程/老师',
		input:'',
		searchItem:[],
		searchPreview:false,

	},
	mounted:function(){
		document.getElementById('container').style.display = '';
		Vue.http.get('project').then(function(res){
			index.list = res.body.data;
		})
	},
	methods:{
		showPreview:function(data){
			if(index.searchItem.length == 0){
				Vue.http.get('search').then(function(res){
					var list = [];
					var res = res.body.data;
					res.forEach(function(item){
						list.push(item.key);
					});
					index.searchItem = list
				})
			};
			index.searchPreview = data;
		},
		changeSearchholder:function(data){
			index.input = data;
		},
		doSearch:function(){
			var data = index.input;
			index.input = '';
			index.searchPreview = false;
			window.location.href = GLOBAL.SITE_BASE_URL + '/mycourse/?q='+data
			// Vue.http.post('search',data).then(function(res){
			// 	var res = res.body;
			// 	if(res.error == 0){
			// 		weui.toast(res.desc, 2000)
			// 	}else{
			// 		weui.alert(res.desc, { title: '搜索结果' });
			// 	}
			// });

		},
		trunToPersonal:function(){
			window.location.href = GLOBAL.SITE_BASE_URL + '/person';
		},
		toMycourse:function(){
			window.location.href = GLOBAL.SITE_BASE_URL + '/mycourse';
		},
        ToDo:function(){
			window.location.href = GLOBAL.SITE_BASE_URL + '/mycourse';
		},
		toTips:function(){
        	window.location.href = GLOBAL.SITE_BASE_URL + '/tips';
		}
	}
});


});