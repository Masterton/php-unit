define (['vue-resource','vue-infinite-loading'],function (vueResource) {
	new Vue({
		el:'#notice',
		template:'#template',
		data:function () {
			return{
				list:[],
				page:0,
				content:'',
				showDetails:false,
				scrollPos:0
			}
		},
		created:function () {
			location.hash='';
			window.onhashchange=function () {
				if(location.hash){
					this.showDetails=true
				}else {
					this.showDetails=false;
					this.content='';
					if(this.scrollPos){
						setTimeout(function () {
							window.scrollTo(0,this.scrollPos)
						}.bind(this),0)
					}
				}
			}.bind(this)
		},
		methods:{
			//下拉加载
			onInfinite:function () {
				this.$http.get(GLOBAL.SITE_BASE_URL+'/api/notice/list',{params:{page:Number(this.page) + 1}}).then(function (res) {
					if(res.data.data.data.length){
						this.list=this.list.concat(res.data.data.data);
						this.page=res.data.data.current_page;
						if(res.data.data.last_page > res.data.data.current_page){
							this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
						}else {
							this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
						}
					}else {
						this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
						this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
					}
				}).catch(function (res) {
					console.log(res);
					this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
					//weui.toast('获取数据异常')
				})
			},
			//获取类型
			getType:function (val) {
				return val==1?'公告':'资讯'
			},
			//获取时间
			getTime:function (val) {
				return val.split(' ')[0]
			},
			//查看详情
			details:function (item) {
				this.scrollPos=window.scrollY;
				this.content=item;
				this.$http.get(GLOBAL.SITE_BASE_URL+'/api/notice/view',{params:{id:this.content.id}}).then(function (res) {
					this.content.see_total++
				}).catch(function (res) {
					console.log(res);
				})
			}
		}
	})
});