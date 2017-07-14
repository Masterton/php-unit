/**
 * Created by liu on 17-6-16.
 */
new Vue({
    el:'#navBar',
    template:'#nav_tpl',
    data:function () {
      return {
        current:location.pathname
      }
    },
    methods:{
        home:function(){
            window.location.href = GLOBAL.SITE_BASE_URL + '/'
        },
        course:function(){
            window.location.href = GLOBAL.SITE_BASE_URL + '/mycourse'
        },
        tips:function(){
            window.location.href = GLOBAL.SITE_BASE_URL + '/tips'
        },
        personal:function(){
            window.location.href = GLOBAL.SITE_BASE_URL + '/person'
        }
    }
})