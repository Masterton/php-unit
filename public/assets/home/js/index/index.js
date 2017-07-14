
var index = new Vue({
	el:'#container',
	data:{
		list:[],
		placeholder:'搜索课程/老师',
		input:'',
		searchItem:[],
		searchPreview:false,
		loading:false
	},
	mounted:function(){
		document.getElementById('container').style.display = '';
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
			}
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
		},
		trunToPersonal:function(){
			window.location.href = GLOBAL.SITE_BASE_URL + '/person';
		},
		toMycourse:function(){
			window.location.href = GLOBAL.SITE_BASE_URL + '/mycourse';
		},
		ToDo:function(){
			window.location.href = GLOBAL.SITE_BASE_URL + '/mycourse#1';
		},
		toTips:function(){
			window.location.href = GLOBAL.SITE_BASE_URL + '/tips';
		},
		//下拉加载
		onInfinite:function () {
			var page=this.list.current_page?(Number(this.list.current_page)+1):0;
			this.$http.get('project',{params:{page:page}}).then(function (res) {
				if(res.data.data.data){
					var buffer=this.list.data?this.list.data:[];
					this.list=res.data.data;
					this.list.data=buffer.concat(res.data.data.data);
					var last_page=Math.ceil(this.list.total / this.list.per_page);
					if(last_page>this.list.current_page){// 如果还有数据可以加载
						this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
					}else {
						this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
						this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
					}
				}else {
					this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
				}
				
			}).catch(function (res) {
				console.log(res);
				this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
				//weui.toast('获取数据异常')
			})
		}
	}
});

