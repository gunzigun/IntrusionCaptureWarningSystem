var WSNCamera = function(myZCloudID, myZCloudKey) {
	this.uid = myZCloudID;
	this.key = myZCloudKey;
	var myCamera = new camera();
	
	this.setIdKey = function(uid, key) {
		this.uid = uid;
		this.key = key;		
	};
	//云服务初始化
	this.initZCloud = function(myZCloudID, myZCloudKey)
	{
		myCamera.initZCloud(myZCloudID, myZCloudKey);
	}
	//设置服务器地址
	this.setServerAddr = function(saddr)
	{
		myCamera.setServerAddr(saddr);
	}
	//摄像头初始化
	this.initCamera=function(myCameraIP, user, pwd,camtype){
		myCamera.initCamera(myCameraIP, user, pwd,camtype);
	}
	
	//将视频图像在指定标签id显示
	
	this.setDiv = function(divID){
		myCamera.setDiv(divID);
	}
	
	//检查是否在线
	this.checkOnline =function(cal)
	{
		myCamera.checkOnline(function(data){cal(data);})
	}
	
	//改变分辨率:F系列 val="160_120",160*120;val="320_240",320*240;val="640_480",640*480
	//           F3系列 val="320_240",320*240;val="640_480",640*480
	//           H3系列 val="320_176",320*176;val="640_352",640*352
	this.setResolution = function(val)
	{
		myCamera.setResolution(val);
	}
	//打开摄像头
	this.openVideo=function() 
	{
		myCamera.openVideo();
	}
	
	//关闭摄像头
	this.closeVideo=function() 
	{
		myCamera.closeVideo();
	}

	//摄像头控制
	this.control=function(cmd) 
	{	
		if(cmd=="UP") myCamera.ptzUpSubmit(); //向上
		if(cmd=="DOWN") myCamera.ptzDownSubmit(); //向下
		if(cmd=="LEFT") myCamera.ptzLeftSubmit();	//向左
		if(cmd=="RIGHT") myCamera.ptzRightSubmit();	//向右
		if(cmd=="HPATROL") myCamera.ptzHorizonSubmit();	//水平扫航
		if(cmd=="VPATROL") myCamera.ptzVerticalSubmit();	//垂直扫航
		if(cmd=="360PATROL") myCamera.ptzVHSubmit();	//360°扫航
	}
	
	//截屏
	this.snapshot=function()
	{
		myCamera.snapshot();
	}
}