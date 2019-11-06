

// 定义本地存储参数
var localData = {
	ID : "12345678",
	KEY : "12345678",
	server : "12345678",
	infraredMAC : "",
	phoneNum_1 : "",
	phoneNum_2 : "",
	phoneNum_3 : "",
	phoneNum_4 : "",
	cameraServer : "",  
	cameraIP : "",
	cameraType : "",
	cameraUser : "",
	cameraPwd : ""
};

$(function (){
	// 初始化顶级导航和二级导航
	Nav.topNav($('.top-nav li'))
	$('.content:eq(0)').css('display', 'block');
	Nav.secondNav($('.side-nav:eq(0) li'),0);
	$('.content:eq(0) .main:eq(0)').css('display','block');
	// 顶级导航按钮
	Button.topNavBtn();

	// 获取本地存储的id key server
	get_localStorage();

	// id key 及标志位变量定义
	var connectFlag = 0, macFlag = 0;
	var rtc = 0;
	// 传感器参数定义
	var infraredData;
	var urgentPhone_1, urgentPhone_2, urgentPhone_3, urgentPhone_4;
	// 操作标志位
	var securityMode = 1;
	var urgentFlag;

	$("#idkeyInput").click(function() {
		localData.ID = $("#ID").val();
		localData.KEY = $("#KEY").val();
		localData.server = $("#server").val();
		console.log(localData.ID);
		console.log(localData.KEY);
		console.log(localData.server);

		// 本地存储id、key和server
		localStorage.invasionSnapshot = JSON.stringify(localData);

		// 创建数据连接服务对象
		rtc = new WSNRTConnect(localData.ID, localData.KEY); 
		rtc.setServerAddr(localData.server + ":28080");
		rtc.connect();

		// 连接成功回调函数
		rtc.onConnect = function () { 
			$("#ConnectState").text("数据服务连接成功！");
			connectFlag = 1;
			message_show("数据服务连接成功！");
		};

		//数据服务掉线回调函数
		rtc.onConnectLost = function () {
			$("#ConnectState").text("数据服务连接掉线！");
			connectFlag = 0;
			message_show("数据服务连接失败，检查网络或IDKEY");
			$("#infraredLink").text("在线").css("color", "#e75d59");
			$("#cameraLink").text("在线").css("color", "#e75d59");
		};

		// 消息处理回调函数
		rtc.onmessageArrive = function (mac, dat) { 
			if (mac == localData.infraredMAC) { 
				if (dat[0] == '{' && dat[dat.length - 1] == '}') { 
					dat = dat.substr(1, dat.length - 2); 
					var its = dat.split(','); 
					for (var x in its) {
						var t = its[x].split('='); 
						if (t.length != 2) continue;
						if (t[0] == "A0") { 
							infraredData = parseInt(t[1]);
							if(securityMode){
								if(infraredData){
									$("#infraredStatus").attr("src","img/Invasion.gif");
									message_show("人员入侵");
									playSound();
									if(urgentFlag){
										message_show("报警短信已发出！");
									}else{
										message_show("请录入紧急通知电话");
									}
									if(switch_cam){
										myipcamera.snapshot();
										message_show("抓拍成功！");
										
									}else{
										message_show("请打开网络摄像头，实施抓拍");
									}
								}else{
									$("#infraredStatus").attr("src","img/Invasion-off.png");
									message_show("一切正常");
								}
							}else{
								$("#infraredStatus").attr("src","img/infrared-close.png");
							}
							$("#infraredLink").text("在线").css("color", "#b9ba65");
							// 更新图表
							console.log("infraredData=" + infraredData);
						}
					}
				}
			}
		}
	});

	// mac地址输入确认
	$("#macInput").click(function(){
		console.log("flag" + connectFlag);
		localData.infraredMAC = $("#infraredMAC").val();
		// 本地存储mac地址
		localStorage.invasionSnapshot = JSON.stringify(localData);
		if (connectFlag) {
			rtc.sendMessage(localData.infraredMAC, "{A0=?}"); 
			console.log("infraredMac="+localData.infraredMAC);
			macFlag = 1;
			message_show("人体红外探测器设置成功");
		}else {
			macFlag = 0;
			message_show("请正确输入IDKEY连接智云数据中心");
		}
	});

	// 模式设置-普通模式
	$("#familyMode").click(function(){
		if (connectFlag) {
			securityMode = 0;
			rtc.sendMessage(localData.infraredMAC, "{A0=?}"); 
			message_show("普通模式设置成功");
			console.log("securityMode="+securityMode);
		}else {
			macFlag = 0;
			message_show("请正确输入IDKEY连接智云数据中心");
		}
	});

	// 模式设置-安防模式
	$("#safetyMode").click(function(){
		if (connectFlag) {
			securityMode = 1;
			rtc.sendMessage(localData.infraredMAC, "{A0=?}"); 
			message_show("安防模式设置成功");
			console.log("securityMode="+securityMode);
		}else {
			message_show("请正确输入IDKEY连接智云数据中心");
		}
	});

	// 短信报警确认按钮
	$("#urgentPhone_1").click(function(){
		localData.phoneNum_1= $("#phoneNum_1").val();
		// 本地存储mac地址
		localStorage.invasionSnapshot = JSON.stringify(localData);
		if (connectFlag) {
			message_show("紧急电话："+localData.phoneNum_1+"录入成功");
			console.log("urgentPhone_1="+localData.phoneNum_1);
			urgentFlag = 1;
		}else {
			message_show("请正确输入IDKEY连接智云数据中心");
		}
	});

	$("#urgentPhone_2").click(function(){
		localData.phoneNum_2 = $("#phoneNum_2").val();
		// 本地存储mac地址
		localStorage.invasionSnapshot = JSON.stringify(localData);
		if (connectFlag) {
			message_show("紧急电话："+localData.phoneNum_2+"录入成功");
			console.log("urgentPhone_2="+localData.phoneNum_2);
			urgentFlag = 1;
		}else {
			message_show("请正确输入IDKEY连接智云数据中心");
		}
	});

	$("#urgentPhone_3").click(function(){
		localData.phoneNum_3 = $("#phoneNum_3").val();
		// 本地存储mac地址
		localStorage.invasionSnapshot = JSON.stringify(localData);
		if (connectFlag) {
			message_show("紧急电话："+localData.phoneNum_3);
			urgentFlag = 1;
		}else {
			message_show("请正确输入IDKEY连接智云数据中心");
		}
	});

	$("#urgentPhone_4").click(function(){
		localData.phoneNum_4 = $("#phoneNum_4").val();
		// 本地存储mac地址
		localStorage.invasionSnapshot = JSON.stringify(localData);
		if (connectFlag) {
			message_show("紧急电话："+localData.phoneNum_4+"录入成功");
			console.log("urgentPhone_4="+localData.phoneNum_4);
			urgentFlag = 1;
		}else {
			message_show("请正确输入IDKEY连接智云数据中心");
		}
	});

	// 摄像头图像接口
	var cameraFlag = 0;
	// 初始化摄像头在线状态为在线
	var camState = 0;
	// 默认摄像头开关处于关闭状态
	var switch_cam = 0;
	// 创建myipcamera对象
	var myipcamera = new WSNCamera(localData.ID, localData.KEY);

	$("#cameraInput").click(function(){
		console.log("flag" + connectFlag);
		localData.cameraServer = $("#cameraServer").val();
		localData.cameraIP = $("#cameraIP").val();
		localData.cameraUser = $("#cameraUser").val();
		localData.cameraPwd = $("#cameraPwd").val();
		localData.cameraType = $("#cameraType").val();
		// 本地存储mac地址
		localStorage.invasionSnapshot = JSON.stringify(localData);
		if (connectFlag) {
			console.log(localData.cameraServer, localData.cameraIP, localData.cameraUser, localData.cameraPwd, localData.cameraType);
			cameraFlag = 1;
			message_show("IP摄像头设置成功");
		}else {
			cameraFlag = 0;
			message_show("请正确输入IDKEY连接智云数据中心");
		}
	});

	// 截屏
	$("#photo-btn").click(function(){
		if(camState == 1) {
			myipcamera.snapshot();
		}
	});

	// 初始化监视器开关 默认关
	$("#switch").click(function (){
		if (connectFlag){
			if (cameraFlag){
				if (!this.flag) {
					// 设置图像显示的位置
					myipcamera.setDiv("img1");
					switch_cam = 1;
					myipcamera.setServerAddr(localData.cameraServer);
					// 摄像头初始化
					myipcamera.initCamera(localData.cameraIP, localData.cameraUser, localData.cameraPwd,localData.cameraType);
					message_show("IP摄像头打开");
					myipcamera.checkOnline(function(state){
						console.log(state);
						if (state) {
							// 打开摄像头并显示
							myipcamera.openVideo();
							$("#switch").text("关");
							camState = 1;
							$("#cameraLink").text("在线");
							$("#cameraLink").css("color", "#6a5cba");
						}else {
							message_show("IP摄像头连接失败，请检查网络或设置");
						}
					});
				}
				else{
					switch_cam = 0;
					$("#switch").text("开");
					message_show("IP摄像头关闭");
					camState =0;
					// 关闭视频监控
					myipcamera.closeVideo();
				}
				this.flag = !this.flag;
			}else {
				message_show("请设置IP摄像头");
				$("#img1").attr("src", "img/camera.jpg");
			}
		}else {
			message_show("请正确输入IDKEY连接智云数据中心");
			$("#img1").attr("src", "img/camera.jpg");
		}
	});

	// 监视器控制器：上
	$("#ct_up").mousedown(function () {
		if (connectFlag) {
			if (cameraFlag){
				if((switch_cam ==1)&&(camState==1)) {
					// 向摄像头发送向上移动命令
					myipcamera.control("UP");
				}else {
					message_show("操作失败、检查网络或开关状态");
				}
			}else {
				message_show("请设置IP摄像头");
				$("#img1").attr("src", "img/camera.jpg");
			}
		}else {
			message_show("请正确输入IDKEY连接智云数据中心");
		}
	});

	//下
	$("#ct_down").mousedown(function () {
		if (connectFlag) {
			if (cameraFlag){
				if((switch_cam ==1)&&(camState==1)) {
					// 向摄像头发送向下移动命令
					myipcamera.control("DOWN");
				}else {
					message_show("操作失败、检查网络或开关状态");
				}
			}else {
				message_show("请设置IP摄像头");
				$("#img1").attr("src", "img/camera.jpg");
			}
		}else {
			message_show("请正确输入IDKEY连接智云数据中心");
		}
	});

	// 左
	$("#ct_left").mousedown(function () {
		if (connectFlag) {
			if (cameraFlag){
				if((switch_cam ==1)&&(camState==1)) {
					// 向摄像头发送向左移动命令
					myipcamera.control("LEFT");
				}else {
					message_show("操作失败、检查网络或开关状态");
				}
			}else {
				message_show("请设置IP摄像头");
				$("#img1").attr("src", "img/camera.jpg");
			}
		}else {
			message_show("请正确输入IDKEY连接智云数据中心");
		}
	});

	// 右
	$("#ct_right").mousedown(function () {
		if (connectFlag) {
			if (cameraFlag){
				if((switch_cam ==1)&&(camState==1)) {
					// 向摄像头发送向右移动命令
					myipcamera.control("RIGHT");
				}else {
					message_show("操作失败、检查网络或开关状态");
				}
			}else {
				message_show("请设置IP摄像头");
				$("#img1").attr("src", "img/camera.jpg");
			}
		}else {
			message_show("请正确输入IDKEY连接智云数据中心");
		}
	});

	// 水平巡航
	$("#ct_h").mousedown(function () {
		if (connectFlag) {
			if (cameraFlag){
				if((switch_cam ==1)&&(camState==1)) {
					// 向摄像头发送水平巡航命令
					myipcamera.control("HPATROL");
				}else{
					message_show("操作失败、检查网络或开关状态");
				}
			}else {
				message_show("请设置IP摄像头");
				$("#img1").attr("src", "img/camera.jpg");
			}
		}else {
			message_show("请正确输入IDKEY连接智云数据中心");
		}
	});

	// 垂直巡航
	$("#ct_v").mousedown(function () {
		if (connectFlag) {
			if (cameraFlag){
				if((switch_cam ==1)&&(camState==1)) {
					// 向摄像头发送垂直巡航命令
					myipcamera.control("VPATROL");
				}else {
					message_show("操作失败、检查网络或开关状态");
				}
			}else {
				message_show("请设置IP摄像头");
				$("#img1").attr("src", "img/camera.jpg");
			}
		}else {
			message_show("请正确输入IDKEY连接智云数据中心");
		}
	});

	// 360度巡航
	$("#ct_c").mousedown(function (){
		if (connectFlag) {
			if (cameraFlag){
				if((switch_cam ==1)&&(camState==1)) {
					// 向摄像头发送360度巡航命令
					myipcamera.control("360PATROL");
				}else {
					message_show("操作失败、检查网络或开关状态");
				}
			}else {
				message_show("请设置IP摄像头");
				$("#img1").attr("src", "img/camera.jpg");
			}
		}else {
			message_show("请正确输入IDKEY连接智云数据中心");
		}
	});

	// 升级按钮
	$("#setUp").click(function(){
		message_show("当前已是最新版本");
	});

    //  查看升级日志
    $("#showUpdateTxt").on("click", function () {
        if($(this).text()=="查看升级日志")
            $(this).text("收起升级日志");
        else
            $(this).text("查看升级日志");
    })

	// 扫描按钮
	$(".scan").on("click", function () {
		if (window.droid) {
			window.droid.requestScanQR("scanQR");
		}else{
			message_show("扫描只在安卓系统下可用！");
		}
	})

	// 定义二维码生成div
	var qrcode = new QRCode(document.getElementById("qrDiv"), {
		width : 200,
		height : 200
	});

	// 生成二维码
	function makeCode (txt) {
		qrcode.makeCode(txt);
	}

	// 分享按钮
	$(".share").on("click", function () {
		var txt="", title, input;
		if(this.id=="idShare"){
			txt = "ID:"+$("#ID").val()+",KEY:"+$("#KEY").val();
			title = "IDKey";
		}else{
			input = $(this).parents(".MAC").find("input");
			input.each(function(){
				txt+= $(this).val()+",";
			});
			if(txt.length > 0){
				txt = txt.substr(0, txt.length - 1);
			}
			title = "MAC设置";
		}
		makeCode(txt);
		$("#shareModalTitle").text(title);
	})

	// 重置按钮
	$("#cameraReset").on("click", function () {
		$(this).parents(".form-horizontal").find("input").val(" ");
		$("#cameraServer").focus();
	})

});

// 获取本地localStorage缓存数据
function get_localStorage(){
	if(localStorage.invasionSnapshot){
		localData = JSON.parse(localStorage.invasionSnapshot);
		console.log("localData="+localData);
		for(var i in localData){
			if(localData[i]!=""){
				eval("$('#"+i+"').val(localData."+i+")");
				console.log("i="+i+";;  data1:"+localData[i]);
			}
		}
	}
}

// 扫描处理函数
function scanQR(scanData){
	var data0 = scanData.split(',');
	if(data0.length==2){
		$("#ID").val(data0[0].split(":")[1]);
		$("#KEY").val(data0[1].split(":")[1]);
	}else if(data0.length==1){
		for(var i=0;i<data0.length;i++){
			$(".MAC").find("input:eq("+i+")").val(data0[i]);
		}
	}
}

// 导航
var Nav = {
	// 顶级导航
	topNav : function (object) {
		object.click(function() {
			Active.navActive($(this));
			var num = $(this).index();
			$('.content').css('display','none');
			$('.content:eq(' + num + ')').css('display','block');
			$('.side-nav').css('display','none');
			$('.side-nav:eq(' + num + ')').css('display','block');
			//初始化二级导航
			Nav.secondNav($('.side-nav:eq(' + num + ') li'),num);
			$('.side-nav:eq(' + num + ') li').removeClass('active');
			$('.side-nav:eq(' + num + ') li:eq(0)').addClass('active');
			$('.content:eq(' + num + ') .main').css('display','none');
			$('.content:eq(' + num + ') .main:eq(0)').css('display','block');
		});
	},
	// 二级导航
	secondNav : function (object,topNum) {
		object.click(function() {
			Active.navActive($(this));
			var num = $(this).index();
			$('.content:eq(' + topNum + ') .main').css('display','none');
			$('.content:eq(' + topNum + ') .main:eq(' + num + ')').css('display','block');
		});
	}
}

// 高亮
var Active = {
	// 导航栏高亮
	navActive : function (object) {
		object.siblings().removeClass('active')
		if (object.attr('class') != 'active') {
			object.addClass('active')
		}
	}
}

// 按钮
var Button = {
	// 顶级导航按钮
	topNavBtn: function () {
		$('.top-nav-btn').click(function(event) {
			$('.top-nav').fadeToggle();
		});
	},
	// 模式设置按钮
	modelBtn: function (object) {
		var name = object.attr('name');
		$('button[name="' + name + '"]').removeClass('btn-primary').addClass('btn-default');
		object.addClass('btn-primary');
	}
}

// 消息弹出框
var message_timer = null;
function message_show(t) {
	if (message_timer) {
		clearTimeout(message_timer);
	}
	message_timer = setTimeout(function () {
		$("#toast").hide();
	}, 3000);
	$("#toast_txt").text(t);
	$("#toast").show();
}

function playSound()
{	
    var borswer = window.navigator.userAgent.toLowerCase();
    if ( borswer.indexOf( "ie" ) >= 0 )
    {
        //IE内核浏览器
		var strEmbed = '<embed name="embedPlay" src="voicealert.wav" autostart="true" hidden="true" loop="false"></embed>';
		if ( $( "body" ).find( "embed" ).length <= 0 )
			$( "body" ).append( strEmbed );
		var embed = document.embedPlay;

		//浏览器不支持 audion，则使用 embed 播放
		embed.volume = 100;
		//embed.play();
    } 
	else
    {
		
        //非IE内核浏览器
        var strAudio = "<audio id='audioPlay' src='voicealert.wav' hidden='true'>";
        if ( $( "body" ).find( "audio" ).length <= 0 )
          $( "body" ).append( strAudio );
        var audio = document.getElementById( "audioPlay" );

        //浏览器支持 audion
        audio.play();
    }
}
