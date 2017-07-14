var course = new Vue({
		el:"#body",
		data:{
			displayList:{},
			showAera:false,
			opinion:{
				content:'',
				sub_flow:'',
				work_flow:'',
				work_num:''
			},
			// allCourse:[],//所有课程
			// todo:[],//待处理课程  请求参数 status:all,process:1
			// doing:[],//正在进行中的课程 请求参数 status:0
			// complete:[],//已经完成的课程 请求参数 status:1
			//
		status:0,// 所在的类型.
		page:0, // 当前的页数.
		total:null	// 总的条数.
		},
		methods:{
			getCourse:function(status,page){
				var api = '';
				switch(status){
					case 0:
						api = 'api/workflow?page=';break; // 获取全部课程
					case 1:
						api = 'api/workflow/?status=all&process=1&page=';break; // 获取待处理课程
					case 2:
						api = 'api/workflow/?status=0&page='; break;// 获取当前进行中的课程
					case 3:
						api = 'api/workflow/?status=1&page=';break; //获取已经完成的课程
				};
				if(page == 0){
					course.displayList = {};
				};
				var loading = weui.loading('加载中')
				Vue.http.get(api+page).then(function(res){
					var res = res.body;
					if (res.error == 0){
						if(res.data.length !== 0 ){
							course.dataTrans(res)
						}else{
							weui.alert('未查到数据',{
								title:res.desc,
								buttons:[{
									label:'确定',
									type:'primary',
									onClick:function(){
									}
								}]
							})
						};
						loading.hide()
					}else{
						loading.hide();
						weui.alert('未获取数据',{
							title:res.desc,
							buttons:[{
								label:ok,
								type:'primary',
								onClick:function(){
								}
							}]
						})
					}
				});
				this.status = status;		
			},
			getSearch:function(data){
				//通过搜索 进入该页面 
				course.displayList = [];
				var loading = weui.loading('加载中~');
				Vue.http.get(GLOBAL.SITE_BASE_URL+'/api/workflow/'+data).then(function(res){
					if(res.body.error==0){
						var data = res.body;
						if(data.data.length !== 0){
							course.dataTrans(data)
						}else{
							weui.alert('未查到数据',{
						    title:res.body.desc,
						    buttons: [{
						        label: 'OK',
						        type: 'primary',
						        onClick: function(){ console.log('ok') }
						    }]
						})
						}
						loading.hide()
					}else{
						loading.hide();
						weui.alert('未获取数据',{
						    title:res.body.desc,
						    buttons: [{
						        label: 'OK',
						        type: 'primary',
						        onClick: function(){ console.log('ok') }
						    }]
						});
					}
				})
			}
			,
			dataTrans:function(info){
	          //将获取的数据转换进行渲染
				info.data.data.forEach(function(lim){
					if(lim.son_subject){
						lim['show'] = true; 
					}else{
						lim['show'] = false;
					}
				});
				if (this.page == 0) {
                    this.displayList=info.data.data;
				}else{
					// 更新数据.
                    // course.displayList.data.push(info.data.data);
					[].push.apply(this.displayList,info.data.data);
					// course.displayList.data.concat(info.data.data);
					console.dir(this.displayList);
				};
				this.total = info.data.total ;
			},
			showCourse:function(i){
				console.dir(1);
				course.displayList[i].show =! course.displayList[i].show
			},
			turnTo:function(num){
				window.location.href = GLOBAL.SITE_BASE_URL + "/details/?q="+num  //跳转到详情页面
			},
			loading:function(){
				var vue = this;
	            var Screen = window.innerHeight;//屏幕高度
	            var scroll =    document.body.scrollTop;//滚动条 滚动的高度
	            var plus = document.body.scrollHeight;// 文档总共的高度     当文档滚动到最下方时候,screen + scroll = plus
	            if(vue.page<vue.total){
					if(Screen+scroll>=plus){
						removeEventListener('scroll',vue.loading);
						vue.page+=1;
						vue.getCourse(vue.status,vue.page);
		            };
					window.document.addEventListener('scroll',vue.loading)
	            }
			},
			urgeManager:function (j,i) {
				weui.toast('提醒成功!',3000);
				var tmp = course.displayList.data;
				var work = tmp[j].work_flow;
				var sub = tmp[j].son_subject[i].sub_flow;
				this.$http.post(GLOBAL.SITE_BASE_URL+'/sendmsg',{work_flow:work,sub_flow:sub}).then(function (res) {
					
				}).catch(function (res) {
						console.log(res)
				})
			},
			addOpinion:function(a,b,c){
				course.opinion.sub_flow = a ;
				course.opinion.work_flow = b ;	
				course.opinion.work_num = c ;
				course.showAera = true;
			},
			sub:function(){
				var comment = course.opinion;
				Vue.http.post('api/subflow/comment',comment).then(function(res){
					weui.toast(res.body.msg,1000)
				})
				course.opinion.content = '';
				course.showAera = false;
			},
			checkParam:function(status){
				if(this.status != status){
					this.page = 0;
					this.total = 0;
				}
				this.status = status;
			}
		}
	});
	window.document.addEventListener('scroll',course.loading);

	var key = window.location.search;
	if (key){
		course.getSearch(key)
	}else{
		course.getCourse(0,0);
	};


	weui.tab('#nav',{
	    	defaultIndex: 0,
		    onChange: function(index){
	    }
	});