/**
 * requirejs配置
 * @type {String}
 */
define(function() {
    'use strict';
    // 是否开启debug模式
    window.App = {
        debug: false,
        baseUrl: GLOBAL.SITE_BASE_URL + '/public/',
        min: '.min',
        /**
         * 路由匹配
         * @param {[type]}
         * @param {[type]}
         */
        routeMatch: function(path) {
            /* ===============================
             * 网站路径(路由获取)
             * Copyright 2016 kz, Inc.
             * =============================== */
            var route = window.location.pathname;
            var baseUrl = GLOBAL.SITE_BASE_URL.replace(/\/+$/, '');
            path = path.replace(/^\/+/, '');
            var url = baseUrl + '/' + path;
            url = url.replace(/\/\//g, '');
            url = url.replace(/\/\//g, '/');
            return new RegExp('^' + url + '$', 'i').test(route);
        },
        /**
         * 合并路径
         */
        mergePath: function(path) {
            var baseUrl = App.baseUrl.replace(/\/+$/, '');
            path = path.toString().replace(/^\/+/, '');
            var url = baseUrl + '/' + path;
            return url.replace(/\/\//g, '').replace(/\/\//g, '');
        }
    };
    require.config({
        baseUrl: App.baseUrl,
        paths: {
            /* ===============================
             * 项目公用库类文件
             * Copyright 2016 kz, Inc.
             * =============================== */
            'vconsole' : 'lib/vconsole/vconsole' + App.min,
            // vue.js
            'vue' : 'lib/vue/vue',
            // vue resource
            'vue-resource':'lib/vueResource/vue-resource',
            // weui
            'weui' : 'lib/weui/weui',
            // 登录首页
            'login': 'assets/home/js/login',
            //首页 js
            'index':'assets/home/js/index',
            //导航栏js
            'nav':'assets/home/js/nav',
            //个人资料js
            'personal':'assets/home/js/personal',
            //课程详情js
            'mycourse':'assets/home/js/mycourse',
            //章节详情
            'details':'assets/home/js/details',
            //公告
             'notice':'assets/home/js/notice',
            //章节日志详情
            'log':'assets/home/js/log',
            //滚动加载
            'vue-infinite-loading':'lib/vueInfiniteLoading/vue-infinite-loading'
        },
        shim: {
        },
        // 强制使用define函数来加载模块
        enforceDefine: true,
        // 设置请求超时
        // 为0时,关闭超时功能
        // 防止加载失败
        waitSeconds: 0,
        // 控制缓存
        urlArgs: App.debug ? 'debug=' + Math.random() : ''
    });

    var includes = [
        ['/login/?', ['login']],
        ['/?',['index','nav']],
        ['/person/?',['personal','nav']],
        ['/mycourse/?',['mycourse','nav']],
        ['/details/?',['details']],
        ['/log/?',['log']],
        ['/tips/?',['notice','nav']]
    ];
    // 全局调用 jquery, bootstrap
    require(['vue','weui','vconsole',], function(vue,weui) {
        // $.ajaxSetup({
        //     cache: false
        // });
        window.Vue = vue;
        window.weui = weui;
        for (var i = 0; i < includes.length; i++) {
            var item = includes[i];
            if(item && item.length >= 2) {
                if(App.routeMatch(item[0])) {
                    require(item[1], item[2]);
                    break;
                }
            }
            else {
                if(App.debug) {
                    console.log('route config error');
                    break;
                }
            }
        }
    });
});