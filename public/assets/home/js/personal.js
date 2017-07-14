define(['vue-resource'], function(vueResource) {
   'use strict';
      // personal/personal.js
var index = new Vue({
	el:'#body',
	data:{
		user:{},
		avator:'',
		config:false
	},
	mounted:function(){
		Vue.http.get('api/user').then(function(res){
			index.avator = 'wechat-cpfms/public'+res.body.data.photo
			index.user = res.body.data;
		})
	},
	methods:{
		doConfig:function(data){
			index.config = data
		},
		saveProfile:function(){
			var id = index.user.id;
			var phone = index.user.phone;
			var	email = index.user.email;
			var oname = index.user.oname;
			var major = index.user.major;
			var post = index.user.post;
			var Profile = Object.assign({id,phone,email,oname,major,post});
			Vue.http.post('api/user',Profile).then(function(res){
				var data = res.body;
				if (data.error==0) {
					weui.toast(data.desc, 2000);
				}else{
					weui.alert(data.desc, { title: '错误信息' });
				}
			})
			index.config = false
		}
	}
})
});