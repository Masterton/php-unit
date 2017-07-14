var course = new Vue({
	el: "#body",
	data: {
		displayList: [],
		status: 0,// 所在的类型.
		page: 0, // 当前的页数.
		total: 0,  // 总的条数.
		showTextarea: false,
		opinion: {
			content: '',
			sub_flow: '',
			work_flow: '',
			work_num: ''
		},
		maxLength:300,//意见字数上限
		pending:'',//未完成的个数
		init:''//初始化加载动画
	},
	watch: {
		// 根据状态来获取到相应的对应的类型.
		status: function (newValue) {
			this.displayList = [];
		},
		// 来获取到相应的数据.
		displayList: function (newValue) {
			if (this.displayList.length == 0) {
				this.page = 0;
			} else {
				this.page++;
			}
		},
		opinion:{
			handler:function (val) {
				if(val.content.length>=this.maxLength){
					weui.alert('输入字数已达上限，无法继续输入',{title:'提示'})
				}
			},
			deep:true
		}
	},
	created:function () {
		window.onhashchange=function () {
			if(location.hash!=='#opinion'){this.showTextarea=false}
		}.bind(this);
		if(location.hash && location.hash==='#opinion'){location.hash=''}
		this.status=location.hash ? Number(location.hash.slice(1)) : 0;
		this.init=weui.loading('加载中')
	},
	mounted:function () {
		this.$refs.container.style.display='block';
		weui.tab('#nav',{defaultIndex:this.status})
	},
	methods: {
		onInfinite:function () {
			this.getPageData(this.status);
		},
		//检查是否为标签切换
		checkParam: function (status) {
			var current=true;
			if (this.status != status) {
				this.page = 0;
				this.total = 0;
				this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
				this.init=weui.loading('加载中');
				current=false
			}
			this.showTextarea = false;
			this.status = status;
			return current
		},
		//获取信息
		getPageData: function (status) {
			if(!this.checkParam(status)){return}//去除标签切换后重置下拉刷新带来的多次请求
			var api = '';
			switch (status) {
				case 0:
					api = 'api/workflow?page=' + this.page;
					break;
				case 1:
					api = 'api/workflow/?status=all&process=1&page=' + this.page;
					break;
				case 2:
					api = 'api/workflow/?status=0&page=' + this.page;
					break;
				case 3:
					api = 'api/workflow/?status=1&page=' + this.page;
					break;
			}
			if (this.displayList.length == 0 || this.displayList.length != this.total) {
				Vue.http.get(api).then(function (res) {
					if (res.body.error == 0) {
						var data = res.body;
						course.dataTrans(data);
						course.pending=res.data.data.pending||'';
						if(res.data.data.length==0){this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')}
						this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
					} else {
						this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
						weui.alert(res.body.desc, {
							title: '请求出错'
						})
					}
					this.init.hide()
				}.bind(this));
			} else {
				this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
				this.init.hide()
			}
		},
		getSearch: function (data) {
			//通过搜索 进入该页面
			course.displayList = [];
			var loading = weui.loading('加载中~');
			Vue.http.get(GLOBAL.SITE_BASE_URL + '/api/workflow/' + data).then(function (res) {
				if (res.body.error == 0) {
					var data = res.body;
					course.dataTrans(data);
					loading.hide()
				} else {
					loading.hide();
					weui.alert(res.body.desc, {
						title: '请求出错'
					})
				}
			})
		},
		dataTrans: function (info) {
			if (info.data.data !== undefined) {
				for (var i = 0; i < info.data.data.length; i++) {
					info.data.data[i].show = true;
				}
				this.displayList.push.apply(this.displayList, info.data.data);
				this.total = info.data.total;
			}
		},
		turnTo: function (num) {
			window.location.href = GLOBAL.SITE_BASE_URL + "/details/?q=" + num  //跳转到详情页面
		},
		showDetail: function (index) {
			this.displayList[index].show = !this.displayList[index].show;
		},
		//提交意见
		sub: function () {
			var comment = course.opinion;
			Vue.http.post('api/subflow/comment', comment).then(function (res) {
				weui.toast(res.body.msg, 1000);
				course.opinion.content = '';
				location.href=location.href.split('#')[0]
			}).catch(function (res) {
				weui.alert(res.body.desc, {
					title: '请求出错'
				})
			})
		},
		//添加意见
		addOpinion: function (sub_flow, work_flow, work_num) {
			course.opinion.sub_flow = sub_flow;
			course.opinion.work_flow = work_flow;
			course.opinion.work_num = work_num;
			course.showTextarea = true;
		},
		//催促提醒
		urgeManager: function (work_flow, sub_flow) {
			this.$http.post(GLOBAL.SITE_BASE_URL + '/sendmsg', {
				work_flow: work_flow,
				sub_flow: sub_flow
			}).then(function (res) {
				weui.toast('提醒成功!', 3000);
			}).catch(function (res) {
				weui.alert(res.body.desc, {
					title: '请求出错'
				})
			})
		}
	}
});



