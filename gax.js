;(function(global,undefined){
	if(global.GaxQueue){
		return;
	}
	global.GaxQueue={};
	var _Gax;
	var PENDING=1,SUCCESS=2,ERROR=3;
	var _h=document.head||document.getElementsByTagName('head')[0];
	var Gax=function(url){
		if(!(this instanceof Gax)){
			return new Gax(url);
		}
		_Gax=this;
		_Gax.startTime=new Date();
		_Gax.objid=Math.ceil(_Gax.startTime);
		global.GaxQueue[_Gax.objid]=_Gax;
		this.url=url;
		_Gax.args={};
		_Gax.headerQueue={};
		_Gax.headerQueue["Content-Type"]="application/x-www-form-urlencoded";
		_Gax.status=PENDING;
		_Gax.successQueue=[];
		_Gax.errorQueue=[];
		_Gax.config={
			type:"text",
			timeout:0,
			ontimeout:function(){},
			com:"jsonp"
		}
		this.isOrigin=checkOrigin();
	}
	
	var checkOrigin=function(){
		var reg=new RegExp("^"+window.location.origin,"i");
		var notHttp=/^(?!http([s]?):\/\/)/i;
		return reg.test(_Gax.url)||notHttp.test(_Gax.url);
	}
	
	var crossOriginByJSONP=function(){
		var temScript=document.createElement("script");
		temScript.setAttribute("src",_Gax.url+"?"+_Gax.data);
		_h.appendChild(temScript);
		_Gax.jsonpNode=temScript;
	}
	var jsonpCallBack=function(objid,data){
		var _Gax=global.GaxQueue[objid];
		_Gax.jsonpNode.remove();
		delete _Gax.jsonpNode;
		_Gax.resData=data;
		_Gax.status=SUCCESS;
		finish(objid);
	}

	var dataToUrl=function(obj){
		var value=[];
		for(var key in obj){
			value.push(encodeURIComponent(key));
			value.push("=");
			value.push(encodeURIComponent(obj[key]));
			value.push("&");
		}
		if(!checkOrigin()&&_Gax.config.com.toLowerCase()==="jsonp"){
			value.push("gaxid");
			value.push("=");
			value.push(_Gax.objid);
		}else{
			value.pop();
		}
		return value.join("");
	}
	
	var baseAjaxRequestSetHeader=function(){
		for(var key in _Gax.headerQueue){
			_Gax.xhr.setRequestHeader(key,_Gax.headerQueue[key]);
		}
	}
	
	var baseAjaxRequestMain=function(Method){
		var Method=Method.toUpperCase(),url=_Gax.url,data=null,isLegal=false;
		switch(Method){
			case "GET":
				isLegal=true;
				url=_Gax.url+"?"+_Gax.data;
				break;
			case "POST":
				isLegal=true;
				data=_Gax.data;
				break;
			case "HEAD":
				isLegal=true;
				break;
		}
		_Gax.args.url = _Gax.url;
		_Gax.args.data = _Gax.data;
		_Gax.args.obj = _Gax;

		if(isLegal){
			if(window.fetch){
				fetch(url,{
					method:Method,
					headers:_Gax.headerQueue,
					body:data
				}).then(function(res){
					if(res.ok){
						res.text().then(function(_data){
							_Gax.resData=_data;
							if(_Gax.config.type.toLowerCase()==="json")_Gax.resData=JSON.parse(_Gax.resData);
							_Gax.status=SUCCESS;
							finish();
						});
					}else{
						_Gax.args.reason="Fetch Error:"+res.status+"!";
						_Gax.status=ERROR;
						finish();
					}
				},function(e){
					_Gax.args.reason="Fetch Error:"+e.toString()+"!";
					_Gax.status=ERROR;
					finish();
				});
				return true;
			}
			
			_Gax.baseAjaxRequest();
			_Gax.xhr.open(Method,url,true);
			baseAjaxRequestSetHeader();
			_Gax.xhr.send(data);
			_Gax.xhr.onreadystatechange=function(){

				if(_Gax.xhr.readyState==4){
					if(_Gax.xhr.status==200){
						_Gax.resData=JSON.stringify(_Gax.xhr.responseXML)==null?_Gax.xhr.responseText:_Gax.xhr.responseXML;
						if(_Gax.config.type.toLowerCase()==="json")_Gax.resData=JSON.parse(_Gax.resData);
						_Gax.status=SUCCESS;
						finish();
					}else{
						_Gax.args.reason="XMLHttpRequest Error:"+_Gax.xhr.status+"!";
						_Gax.status=ERROR;
						finish();
					}

				}
			}
			_Gax.xhr.onerror=function(){
				_Gax.args.reason="XMLHttpRequest Error!";
				_Gax.status=ERROR;
				finish();
			}
			_Gax.xhr.ontimeout=function(){
				_Gax.config.ontimeout.call(null);
				_Gax.args.reason="Timeout!";
				_Gax.status=ERROR;
				finish();
			}
			return true;
		}
		_Gax.status=ERROR;
		_Gax.args.reason="Does not support this method : "+Method+" !";
		return false;
	}

	var crossOrigin=function(){
		if(_Gax.config.com.toLowerCase()==="jsonp"){
			crossOriginByJSONP();
		}
	}
	
	var finish=function(){
		if(arguments.length>0)_Gax=global.GaxQueue[arguments[0]];
		_Gax.args.time=(new Date())-_Gax.startTime;
		if(_Gax.status===PENDING)return;
		if(_Gax.status===SUCCESS){
			while(fn=_Gax.successQueue.shift()){
				fn.call(null,_Gax.resData,_Gax.args);
			}
		}else{
			while(fn=_Gax.errorQueue.shift()){
				fn.call(null,_Gax.args);
			}
		}
	}
	
	Gax.prototype.baseAjaxRequest=function(){
		if(window.XMLHttpRequest){
			this.xhr=new XMLHttpRequest();
		}else{
			try{
				this.xhr=new ActiveXObject("Msxml2.XMLHTTP");
			}catch(e){
				try{
					this.xhr=new ActiveXObject("Microsoft.XMLHTTP");
				}catch(e){
					throw new TypeError('Unsupport XMLHttpRequest');
				}
			}
		}
		return this;
	}
	
	Gax.prototype.header=function(key,value){
		_Gax.headerQueue[key]=value;
		return this;
	}
	
	Gax.prototype.set=function(key,value){
		_Gax.config[key]=value;
		return this;
	}
	
	Gax.prototype.get=function(data){
		this.data=dataToUrl(data);
		this.method="GET";
		if(this.isOrigin){
			var res=baseAjaxRequestMain("GET");

			if(!res){
				finish();
			}
		}else{
			crossOrigin();
		}
		return this;
	}
	
	Gax.prototype.post=function(data){
		this.data=dataToUrl(data);
		this.method="POST";
		if(this.isOrigin){
			var res=baseAjaxRequestMain("POST");
			if(!res){
				finish();
			}
		}else{
			crossOrigin();
		}
		return this;
	}
	
	
	Gax.prototype.success=function(fn){
		if(_Gax.status===PENDING){
			_Gax.successQueue.push(fn);
		}else if(_Gax.status===SUCCESS){
			fn.call(null,_Gax.resData,_Gax.args);
		}
		return this;
	}
	
	Gax.prototype.error=function(fn){
		if(_Gax.status===PENDING){
			_Gax.errorQueue.push(fn);
		}else if(_Gax.status===ERROR){
			fn.call(null,_Gax.args);
		}
		return this;
	}
	global.Gax=Gax;
	global.GaxJsonp=jsonpCallBack;
})(this);