define (['vue-resource'],function (vueResource) {
	'use strict';
	new Vue({
		name:'details',
		el:'#details-box',
		template:'#template',
		data:function () {
			return{
				title:{//最新日志内容
					title:'这里是标题这里是标题这里是标题这里是标题这里是标题这里是标题',
					time:'1956-03-24 17:24:35'
				},
				icons:[//各类文件图标配置
					{
						icon:'icon-tt',
						color:'#03D4A0'
					},
					{
						icon:'icon-ppt',
						color:'#FEC387'
					},
					{
						icon:'icon-shot',
						color:'#FF656F'
					},
					{
						icon:'icon-shipin',
						color:'#3CC5F7'
					}
				],
				files:[//文件信息
					{
						file:'/public/assets/home/img/logo@2x.png',
						name:'策划脚本',
						ctr:'201705220000023341350039'
					},
					{
						file:'/public/assets/home/img/logo@2x.png',
						name:'PPT',
						ctr:'201705220000023341700002'
					},
					{
						file:'/public/assets/home/img/logo@2x.png',
						name:'视频模板',
						ctr:'201705220000023341940004'
					},
					{
						file:'/public/assets/home/img/logo@2x.png',
						name:'定稿视频',
						ctr:'201705220000021203320023'
					}
				],
				details:[
					{
						title:'开始时间',
						time:'1956-03-24'
					},
					{
						title:'结束时间',
						time:'1956-03-24'
					},
					{
						title:'项目经理',
						time:'没到底'
					}
				],
				sub_flow:'',
				work_flow:'',
				work_num:'',
				hide_opinion:true,//不显示提交意见
				preview:false,//视频预览控制
				opinion:false,//控制提交意见
				content:'',//提交意见的内容
				sum:'0',//已经输入文字的个数
				maxLength:300,//最大输入字数限制
				ajaxLocked:false,
				step_name:''//当前提交意见的步骤名
			}
		},
		watch:{
			content:function (val) {
				this.sum=val.length;
				if(val.length>=this.maxLength){
					weui.alert('输入字数已达上限，无法继续输入',{title:'提示'})
				}
			}
		},
		created:function () {
			window.onhashchange=function () {
				if(!location.hash){this.preview=this.opinion=false}
			}.bind(this);
			this.sub_flow=location.search.split('=')[1];
			var loading=weui.loading('加载中');
			this.$http.get(GLOBAL.SITE_BASE_URL+'/api/subflow',{params:{'sub_flow':this.sub_flow}}).then(function (res) {
				this.details[0].time=res.data.data.start_time;
				this.details[1].time=res.data.data.status?res.data.data.end_time:'';
				this.details[2].time=res.data.data.manager.toString();
				this.title.title=res.data.data.operation_log.content;
				this.title.time=res.data.data.operation_log.add_time;
				this.work_flow=res.data.data.work_flow;
				if(res.data.data.operation_step.length){
					this.hide_opinion=false;
					this.step_name=res.data.data.operation_step[0].node_name;
					this.work_num=res.data.data.operation_step[0].work_num
				}else {
					this.hide_opinion=true
				}
				var data={
					'201705220000023341350039':'策划脚本',
					'201705220000023341700002':'PPT文件',
					'201705220000023341940004':'视频模板',
					'201705220000021203320023':'定稿视频'
				};
				res.data.data.see.forEach(function (item) {
					if(item.name in data){
						data[item.name]=item.value
					}
				});
				this.files.forEach(function (item) { //将文件信息写入文件中
					item.file=data[item.ctr]
				});
				loading.hide()
			}).catch(function (res) {
				loading.hide();
				weui.alert('获取数据异常');
				console.log(res)
			})
		},
		methods:{
			//催促提醒
			urgeManager:function () {
				if(this.ajaxLocked){
					weui.alert('正在处理，请稍后')
				}else {
					this.ajaxLocked=true;
					this.$http.post(GLOBAL.SITE_BASE_URL+'/sendmsg',{sub_flow:this.sub_flow,work_flow:this.work_flow}).then(function (res) {
						weui.toast('提醒成功', 1000);
						this.ajaxLocked=false;
					}).catch(function (res) {
						this.ajaxLocked=false;
						weui.alert(res.body.desc, {
							title: '请求出错'
						});
					})
				}
			},
			//预览文件
			previewFile:function (file) {
				if(typeof file==='object' && file.length){
					this.preview='https://cpfms.kzdemo.cn/file/raw/?file='+file[file.length-1].toString().split('&&')[0];
				}else {
					weui.toast('没有文件',1000)
				}
			},
			//提交意见
			submitOpinion:function () {
				this.$http.post(GLOBAL.SITE_BASE_URL+'/api/subflow/comment',{sub_flow:this.sub_flow,work_flow:this.work_flow,content:this.content,work_num:this.work_num}).then(function (res) {
					weui.toast(res.data.msg,1000);
					location.href=location.href.split('#')[0]
				}).catch(function (res) {
					weui.alert(res.body.desc, {
						title: '请求出错'
					})
				})
			}
		}
	})
});
