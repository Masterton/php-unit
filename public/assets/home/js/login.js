define(['vue-resource'], function(vueResource) {
   'use strict';
      // login/__call__.js
/**
 * Created by adolph on 17-6-15.
 */

// var Ajax =  window.Vue.use('vue-resource');
var login = new Vue({
        el:'#body',
        data:{
                username:'',
                password:'',
        },
        methods:{
            doAjax:function () {
                if(login.username&&login.password){
                    login.$http.post(
                        GLOBAL.SITE_BASE_URL+'/login',{username:login.username,password:login.password}
                    ).then(function (res) {
                        var data = res.body;
                        if(data.error === 0){
                            weui.toast('绑定成功', 2000);
                            location.href = GLOBAL.SITE_BASE_URL + '/';
                        }else{
                            weui.alert(data.desc, { title: '登录信息' });
                        }
                    })
                }
            }
        }
    });

});