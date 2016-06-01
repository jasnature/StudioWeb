/*
 *  author: jasnature
 *  email : 276227015@qq.com
 *  last update : 2016-03-18
 *  desc : 定义常用的js操作方法
 * */

/*加载完成操作*/
(function() {

	/*//resize的操作
    var fn = function(){
            var w = document.documentElement ? document.documentElement.clientWidth : document.body.clientWidth
                    ,r = 1255
                    ,b = Element.extend(document.body)
                    ,classname = b.className;
            if(w < r){
                    //当窗体的宽度小于1255的时候执行相应的操作
            }else{
                    //当窗体的宽度大于1255的时候执行相应的操作
            }
    }
    if(window.addEventListener){
            window.addEventListener('resize', function(){ fn(); });
    }else if(window.attachEvent){
            window.attachEvent('onresize', function(){ fn(); });
    }
    fn();*/


})();



/**
  @description JS模拟JQuery选择器，q查询表达式 o父对象。
   <br/>已实现：
   <br/>$('#div1') ID选择器 
   <br/>$('.aCur') 类选择器
   <br/>$('div') 元素选择器
   <br/>$('#div1 li') 组合选择器
   <br/>$('input[type=text]:checked') 属性值选择器
   <br/>$('a', myDiv) 选择myDiv下的所有a元素
   <br/>提示：如果对象数量小于等于1，自动返回数组第一个对象

 * @param {String} q
 * @param {Object} o
 */
function g$(q, o) {
	//查询表达式必须为字符串，并且不能为空。
	if (typeof(q) !== 'string' || q == '') return [];

	//使用空格分割，只处理第一个表达式
	var ss = q.split(' ');

	//获取属性
	var attr = '';
	var s = ss[0].split(':')[0];
	if (s != ss[0])
		attr = ss[0].split(':')[1];

	var val = s.split('[')[0];
	if (val != s)
		val = s.split('[')[1].replace(/[",\]]/g, '');
	else
		val = '';
	s = s.split('[')[0];

	var obj = [];
	var sObj = null;
	//当父对象不存在时，使用document;
	o = o || document;
	switch (s.charAt(0)) {
		case '#':
			//ID选择器
			sObj = document.getElementById(s.substr(1));
			if (sObj) obj.push(sObj);
			break;
		case '.':
			//类选择器
			if (document.getElementsByClassName) {
				sObj = document.getElementsByClassName(s.substr(1));
				if (sObj) obj.push(sObj);
			} else {
				var l = o.getElementsByTagName('*');
				var c = s.substr(1);
				for (var i = 0; i < l.length; i++)
					if (l[i].className.search('\\b' + c + '\\b') != -1) obj.push(l[i]);
			}
			break;
		default:
			//根据tag获取元素
			obj = o.getElementsByTagName(s);
			break;
	}

	if (val) {
		//[t=val]筛选属性匹配
		var l = [];
		var a = val.split('=');
		for (var i = 0; i < obj.length; i++)
			if (a.length == 2 && obj[i][a[0]] == a[1]) l.push(obj[i]);
		obj = l;
	}

	if (attr) {
		//: 筛选属性匹配
		var l = [];
		for (var i = 0; i < obj.length; i++)
			if (obj[i][attr]) l.push(obj[i]);
		obj = l;
	}

	if (ss.length > 1) {
		//递归处理表达式后续内容
		//父元素为已获取的所有元素
		var l = [];
		for (var i = 0; i < obj.length; i++) {
			var ll = arguments.callee(q.substr(ss[0].length + 1), obj[i]);
			if (ll.tagName) l.push(ll);
			else
				for (var j = 0; j < ll.length; j++) l.push(ll[j]);
		}
		obj = l;
	}

	//当为ID选择器时，直接返回对象。
	if (sObj && ss.length == 1) {
		obj = sObj;
		//if (obj) obj.length = 1;
	} else {
		//去除数组中重复元素
		var l = [];
		for (var i = 0; i < obj.length; i++) obj[i].$isAdd = false;
		for (var i = 0; i < obj.length; i++) {
			if (!obj[i].$isAdd) {
				obj[i].$isAdd = true;
				l.push(obj[i]);
			}
		}
		obj = l;
	}

	if (obj.length == 1) {
		obj = obj[0];
	}

	return obj;
};


/**
 * @description 字符串长度截取
 * @param {String} str
 * @param {Number} len
 */
function cutstr(str, len) {
	var temp,
		icount = 0,
		patrn = /[^\x00-\xff]/,
		slen = str.length;
	strre = "";
	if (slen <= len) return str;
	if (!len || len <= 0) len = 10;
	for (var i = 0; i < slen; i++) {
		if (icount < len - 1) {
			temp = str.substr(i, 1);
			if (patrn.exec(temp) == null) {
				icount = icount + 1
			} else {
				icount = icount + 2
			}
			strre += temp
		} else {
			break;
		}
	}
	return strre + "..."
};

/*替换全部*/
String.prototype.replaceAll = function(s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2)
};

/*清除空格*/
String.prototype.trim = function() {
	var reExtraSpace = /^\s*(.*?)\s+$/;
	return this.replace(reExtraSpace, "$1")
};

/*清除左空格/右空格*/
function ltrim(s) {
	return s.replace(/^(\s*|　*)/, "");
};

function rtrim(s) {
	return s.replace(/(\s*|　*)$/, "");
};

/*判断是否以某个字符串开头*/
String.prototype.startWith = function(s) {
	return this.indexOf(s) == 0
};

/*判断是否以某个字符串结束*/
String.prototype.endWith = function(s) {
	var d = this.length - s.length;
	return (d >= 0 && this.lastIndexOf(s) == d)
};

/*数组Array去重*/
Array.prototype.unique = function() {
	var a = this.concat();
	for (var i = 0; i < a.length; ++i) {
		for (var j = i + 1; j < a.length; ++j) {
			if (a[i] === a[j])
				a.splice(j, 1);
		}
	}

	return a;
};

/*转义html标签*/
function htmlEncode(text) {
	return text.replace(/&/g, '&').replace(/\"/g, '"').replace(/</g, '<').replace(/>/g, '>')
};

/*时间日期格式转换*/
Date.prototype.cnFormat = function(formatStr) {
	var str = formatStr;
	var Week = ['日', '一', '二', '三', '四', '五', '六'];
	str = str.replace(/yyyy|YYYY/, this.getFullYear());
	str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));
	str = str.replace(/MM/, (this.getMonth() + 1) > 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
	str = str.replace(/M/g, (this.getMonth() + 1));
	str = str.replace(/w|W/g, Week[this.getDay()]);
	str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
	str = str.replace(/d|D/g, this.getDate());
	str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
	str = str.replace(/h|H/g, this.getHours());
	str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
	str = str.replace(/m/g, this.getMinutes());
	str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
	str = str.replace(/s|S/g, this.getSeconds());
	return str
};

/*日期格式化函数+调用方法*/
Date.prototype.format = function(format) {
	var o = {
		"M+": this.getMonth() + 1, //month
		"d+": this.getDate(), //day
		"h+": this.getHours(), //hour
		"m+": this.getMinutes(), //minute
		"s+": this.getSeconds(), //second
		"q+": Math.floor((this.getMonth() + 3) / 3), //quarter
		"S": this.getMilliseconds() //millisecond
	};
	if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(format))
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
	}
	return format;
};

/*
alert(new Date().format("yyyy-MM-dd hh:mm:ss"));
时间个性化输出功能
1、< 60s, 显示为“刚刚”
2、>= 1min && < 60 min, 显示与当前时间差“XX分钟前”
3、>= 60min && < 1day, 显示与当前时间差“今天 XX:XX”
4、>= 1day && < 1year, 显示日期“XX月XX日 XX:XX”
5、>= 1year, 显示具体日期“XXXX年XX月XX日 XX:XX”
*/
function timeFormat(time) {
	var date = new Date(time),
		curDate = new Date(),
		year = date.getFullYear(),
		month = date.getMonth() + 10,
		day = date.getDate(),
		hour = date.getHours(),
		minute = date.getMinutes(),
		curYear = curDate.getFullYear(),
		curHour = curDate.getHours(),
		timeStr;

	if (year < curYear) {
		timeStr = year + '年' + month + '月' + day + '日 ' + hour + ':' + minute;
	} else {
		var pastTime = curDate - date,
			pastH = pastTime / 3600000;

		if (pastH > curHour) {
			timeStr = month + '月' + day + '日 ' + hour + ':' + minute;
		} else if (pastH >= 1) {
			timeStr = '今天 ' + hour + ':' + minute + '分';
		} else {
			var pastM = curDate.getMinutes() - minute;
			if (pastM > 1) {
				timeStr = pastM + '分钟前';
			} else {
				timeStr = '刚刚';
			}
		}
	}
	return timeStr;
};

/*判断是否为数字类型*/
function isDigit(value) {
	var patrn = /^[0-9]*$/;
	if (patrn.exec(value) == null || value == "") {
		return false
	} else {
		return true
	}
};

/*设置cookie值*/
function setCookie(name, value, Hours) {
	var d = new Date();
	var offset = 8;
	var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
	var nd = utc + (3600000 * offset);
	var exp = new Date(nd);
	exp.setTime(exp.getTime() + Hours * 60 * 60 * 1000);
	document.cookie = name + "=" + escape(value) + ";path=/;expires=" + exp.toGMTString() + ";domain=360doc.com;"
};

/*获取cookie值*/
function getCookie(name) {
	var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
	if (arr != null) return unescape(arr[2]);
	return null
};

/*加入收藏夹*/
function addFavorite(sURL, sTitle) {
	try {
		window.external.addFavorite(sURL, sTitle)
	} catch (e) {
		try {
			window.sidebar.addPanel(sTitle, sURL, "")
		} catch (e) {
			alert("加入收藏失败，请使用Ctrl+D进行添加")
		}
	}
};

/*设为首页*/
function setHomepage() {
	if (document.all) {
		document.body.style.behavior = 'url(#default#homepage)';
		document.body.setHomePage('http://w3cboy.com')
	} else if (window.sidebar) {
		if (window.netscape) {
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect")
			} catch (e) {
				alert("该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入 about:config,然后将项 signed.applets.codebase_principal_support 值该为true")
			}
		}
		var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
		prefs.setCharPref('browser.startup.homepage', 'http://w3cboy.com')
	}
};

/*加载样式文件*/
function loadStyle(url) {
	try {
		document.createStyleSheet(url)
	} catch (e) {
		var cssLink = document.createElement('link');
		cssLink.rel = 'stylesheet';
		cssLink.type = 'text/css';
		cssLink.href = url;
		var head = document.getElementsByTagName('head')[0];
		head.appendChild(cssLink)
	}
};

/*返回脚本内容*/
function evalscript(s) {
	if (s.indexOf('<script') == -1) return s;
	var p = /<script[^\>]*?>([^\x00]*?)<\/script>/ig;
	var arr = [];
	while (arr = p.exec(s)) {
		var p1 = /<script[^\>]*?src=\"([^\>]*?)\"[^\>]*?(reload=\"1\")?(?:charset=\"([\w\-]+?)\")?><\/script>/i;
		var arr1 = [];
		arr1 = p1.exec(arr[0]);
		if (arr1) {
			appendscript(arr1[1], '', arr1[2], arr1[3]);
		} else {
			p1 = /<script(.*?)>([^\x00]+?)<\/script>/i;
			arr1 = p1.exec(arr[0]);
			appendscript('', arr1[2], arr1[1].indexOf('reload=') != -1);
		}
	}
	return s;
};

/*清除脚本内容*/
function stripscript(s) {
	return s.replace(/<script.*?>.*?<\/script>/ig, '');
};

/*动态加载脚本文件*/
function appendscript(src, text, reload, charset) {
	var id = hash(src + text);
	if (!reload && in_array(id, evalscripts)) return;
	if (reload && g$("#" + id)) {
		g$("#" + id).parentNode.removeChild(g$("#" + id));
	}

	evalscripts.push(id);
	var scriptNode = document.createElement("script");
	scriptNode.type = "text/javascript";
	scriptNode.id = id;
	scriptNode.charset = charset ? charset : (BROWSER.firefox ? document.characterSet : document.charset);
	try {
		if (src) {
			scriptNode.src = src;
			scriptNode.onloadDone = false;
			scriptNode.onload = function() {
				scriptNode.onloadDone = true;
				JSLOADED[src] = 1;
			};
			scriptNode.onreadystatechange = function() {
				if ((scriptNode.readyState == 'loaded' || scriptNode.readyState == 'complete') && !scriptNode.onloadDone) {
					scriptNode.onloadDone = true;
					JSLOADED[src] = 1;
				}
			};
		} else if (text) {
			scriptNode.text = text;
		}
		document.getElementsByTagName('head')[0].appendChild(scriptNode);
	} catch (e) {}
};

/*跨浏览器绑定事件*/
function addEventHandler(oTarget, sEventType, fnHandler) {
	if (oTarget.addEventListener) {
		oTarget.addEventListener(sEventType, fnHandler, false);
	} else if (oTarget.attachEvent) {
		oTarget.attachEvent("on" + sEventType, function() {
			return fnHandler.call(oTarget, window.event);
		});
	} else {
		oTarget["on" + sEventType] = fnHandler;
	}
}

/*跨浏览器删除事件*/
function delEventHandler(obj, evt, fn) {
	if (!obj) {
		return;
	}
	if (obj.addEventListener) {
		obj.addEventListener(evt, fn, false);
	} else if (oTarget.attachEvent) {
		obj.attachEvent("on" + evt, fn);
	} else {
		obj["on" + evt] = fn;
	}
};

/* 判断对象是否为指定类型名称 调用：isType("String", "abc") true*/
function isType(type, obj) {
    var clas = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== undefined && obj !== null && clas === type;
}

/*检验URL链接是否有效*/
function getUrlState(URL) {
	var xmlhttp = new ActiveXObject("microsoft.xmlhttp");
	xmlhttp.Open("GET", URL, false);
	try {
		xmlhttp.Send();
	} catch (e) {} finally {
		var result = xmlhttp.responseText;
		if (result) {
			if (xmlhttp.Status == 200) {
				return (true);
			} else {
				return (false);
			}
		} else {
			return (false);
		}
	}
};

/*格式化CSS样式代码*/
function formatCss(s) { //格式化代码
	s = s.replace(/\s*([\{\}\:\;\,])\s*/g, "$1");
	s = s.replace(/;\s*;/g, ";"); //清除连续分号
	s = s.replace(/\,[\s\.\#\d]*{/g, "{");
	s = s.replace(/([^\s])\{([^\s])/g, "$1 {\n\t$2");
	s = s.replace(/([^\s])\}([^\n]*)/g, "$1\n}\n$2");
	s = s.replace(/([^\s]);([^\s\}])/g, "$1;\n\t$2");
	return s;
};

/*压缩CSS样式代码*/
function compressCss(s) { //压缩代码
	s = s.replace(/\/\*(.|\n)*?\*\//g, ""); //删除注释
	s = s.replace(/\s*([\{\}\:\;\,])\s*/g, "$1");
	s = s.replace(/\,[\s\.\#\d]*\{/g, "{"); //容错处理
	s = s.replace(/;\s*;/g, ";"); //清除连续分号
	s = s.match(/^\s*(\S+(\s+\S+)*)\s*$/); //去掉首尾空白
	return (s == null) ? "" : s[1];
};

/*判断是否移动设备*/
function isMobile() {
	if (typeof this._isMobile === 'boolean') {
		return this._isMobile;
	}
	var screenWidth = this.getScreenWidth();
	var fixViewPortsExperiment = rendererModel.runningExperiments.FixViewport || rendererModel.runningExperiments.fixviewport;
	var fixViewPortsExperimentRunning = fixViewPortsExperiment && (fixViewPortsExperiment.toLowerCase() === "new");
	if (!fixViewPortsExperiment) {
		if (!this.isAppleMobileDevice()) {
			screenWidth = screenWidth / window.devicePixelRatio;
		}
	}
	var isMobileScreenSize = screenWidth < 600;
	var isMobileUserAgent = false;
	this._isMobile = isMobileScreenSize && this.isTouchScreen();
	return this._isMobile;
};

/*判断是否移动设备访问*/
function isMobileUserAgent() {
	return (/iphone|ipod|android.*mobile|windows.*phone|blackberry.*mobile/i.test(window.navigator.userAgent.toLowerCase()));
};

/*判断是否苹果移动设备访问*/
function isAppleMobileDevice() {
	return (/iphone|ipod|ipad|Macintosh/i.test(navigator.userAgent.toLowerCase()));
};

/*判断是否安卓移动设备访问*/
function isAndroidMobileDevice() {
	return (/android/i.test(navigator.userAgent.toLowerCase()));
};

/*判断是否Touch屏幕*/
function isTouchScreen() {
	return (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
};

/*判断是否打开视窗*/
function isViewportOpen() {
	return !!document.getElementById('wixMobileViewport');
};

/*获取移动设备初始化大小*/
function getInitZoom() {
	if (!this._initZoom) {
		var screenWidth = Math.min(screen.height, screen.width);
		if (this.isAndroidMobileDevice() && !this.isNewChromeOnAndroid()) {
			screenWidth = screenWidth / window.devicePixelRatio;
		}
		this._initZoom = screenWidth / document.body.offsetWidth;
	}
	return this._initZoom;
};

/*获取移动设备最大化大小*/
function getZoom() {
	var screenWidth = (Math.abs(window.orientation) === 90) ? Math.max(screen.height, screen.width) : Math.min(screen.height, screen.width);
	if (this.isAndroidMobileDevice() && !this.isNewChromeOnAndroid()) {
		screenWidth = screenWidth / window.devicePixelRatio;
	}
	var FixViewPortsExperiment = rendererModel.runningExperiments.FixViewport || rendererModel.runningExperiments.fixviewport;
	var FixViewPortsExperimentRunning = FixViewPortsExperiment && (FixViewPortsExperiment === "New" || FixViewPortsExperiment === "new");
	if (FixViewPortsExperimentRunning) {
		return screenWidth / window.innerWidth;
	} else {
		return screenWidth / document.body.offsetWidth;
	}
};

/*获取移动设备屏幕宽度*/
function getScreenWidth() {
	var smallerSide = Math.min(screen.width, screen.height);
	var fixViewPortsExperiment = rendererModel.runningExperiments.FixViewport || rendererModel.runningExperiments.fixviewport;
	var fixViewPortsExperimentRunning = fixViewPortsExperiment && (fixViewPortsExperiment.toLowerCase() === "new");
	if (fixViewPortsExperiment) {
		if (this.isAndroidMobileDevice() && !this.isNewChromeOnAndroid()) {
			smallerSide = smallerSide / window.devicePixelRatio;
		}
	}
	return smallerSide;
};

/*完美判断是否为网址*/
function isURL(strUrl) {
	var regular = /^\b(((https?|ftp):\/\/)?[-a-z0-9]+(\.[-a-z0-9]+)*\.(?:com|edu|gov|int|mil|net|org|biz|info|name|museum|asia|coop|aero|[a-z][a-z]|((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))\b(\/[-a-z0-9_:\@&?=+,.!\/~%\$]*)?)$/i
	if (regular.test(strUrl)) {
		return true;
	} else {
		return false;
	}
};

/*获取页面高度*/
function getPageHeight() {
	var g = document,
		a = g.body,
		f = g.documentElement,
		d = g.compatMode == "BackCompat" ? a : g.documentElement;
	return Math.max(f.scrollHeight, a.scrollHeight, d.clientHeight);
};

/*获取页面scrollLeft*/
function getPageScrollLeft() {
	var a = document;
	return a.documentElement.scrollLeft || a.body.scrollLeft;
};

/*获取页面可视宽度*/
function getPageViewWidth() {
	var d = document,
		a = d.compatMode == "BackCompat" ? d.body : d.documentElement;
	return a.clientWidth;
};

/*获取页面宽度*/
function getPageWidth() {
	var g = document,
		a = g.body,
		f = g.documentElement,
		d = g.compatMode == "BackCompat" ? a : g.documentElement;
	return Math.max(f.scrollWidth, a.scrollWidth, d.clientWidth);
};

/*获取页面scrollTop*/
function getPageScrollTop() {
	var a = document;
	return a.documentElement.scrollTop || a.body.scrollTop;
};

/*获取页面可视高度*/
function getPageViewHeight() {
	var d = document,
		a = d.compatMode == "BackCompat" ? d.body : d.documentElement;
	return a.clientHeight;
};

/*去掉url前缀*/
function removeUrlPrefix(a) {
	a = a.replace(/：/g, ":").replace(/．/g, ".").replace(/／/g, "/");
	while (trim(a).toLowerCase().indexOf("http://") == 0) {
		a = trim(a.replace(/http:\/\//i, ""));
	}
	return a;
};

/*随机数时间戳*/
function uniqueId() {
	var a = Math.random,
		b = parseInt;
	return Number(new Date()).toString() + b(10 * a()) + b(10 * a()) + b(10 * a());
};

/*全角半角转换 iCase: 0全到半，1半到全，其他不转化*/
function chgCase(sStr, iCase) {
	if (typeof sStr != "string" || sStr.length <= 0 || !(iCase === 0 || iCase == 1)) {
		return sStr;
	}
	var i, oRs = [],
		iCode;
	if (iCase) { /*半->全*/
		for (i = 0; i < sStr.length; i += 1) {
			iCode = sStr.charCodeAt(i);
			if (iCode == 32) {
				iCode = 12288;
			} else if (iCode < 127) {
				iCode += 65248;
			}
			oRs.push(String.fromCharCode(iCode));
		}
	} else { /*全->半*/
		for (i = 0; i < sStr.length; i += 1) {
			iCode = sStr.charCodeAt(i);
			if (iCode == 12288) {
				iCode = 32;
			} else if (iCode > 65280 && iCode < 65375) {
				iCode -= 65248;
			}
			oRs.push(String.fromCharCode(iCode));
		}
	}
	return oRs.join("");
};

/*确认是否键盘有效输入值*/
function checkKey(iKey) {
	if (iKey == 32 || iKey == 229) {
		return true;
	} /*空格和异常*/
	if (iKey > 47 && iKey < 58) {
		return true;
	} /*数字*/
	if (iKey > 64 && iKey < 91) {
		return true;
	} /*字母*/
	if (iKey > 95 && iKey < 108) {
		return true;
	} /*数字键盘1*/
	if (iKey > 108 && iKey < 112) {
		return true;
	} /*数字键盘2*/
	if (iKey > 185 && iKey < 193) {
		return true;
	} /*符号1*/
	if (iKey > 218 && iKey < 223) {
		return true;
	} /*符号2*/
	return false;
};

/*获取网页被卷去的位置*/
function getScrollXY() {
	return document.body.scrollTop ? {
		x: document.body.scrollLeft,
		y: document.body.scrollTop
	} : {
		x: document.documentElement.scrollLeft,
		y: document.documentElement.scrollTop
	}
};



/*
 * 解决offsetX兼容性问题
 * 针对火狐不支持offsetX/Y
 */
function getOffset(e) {
	var target = e.target, // 当前触发的目标对象
		eventCoord,
		pageCoord,
		offsetCoord;

	// 计算当前触发元素到文档的距离
	pageCoord = getPageCoord(target);

	// 计算光标到文档的距离
	eventCoord = {
		X: window.pageXOffset + e.clientX,
		Y: window.pageYOffset + e.clientY
	};

	// 相减获取光标到第一个定位的父元素的坐标
	offsetCoord = {
		X: eventCoord.X - pageCoord.X,
		Y: eventCoord.Y - pageCoord.Y
	};
	return offsetCoord;
};

function getPageCoord(element) {
	var coord = {
		X: 0,
		Y: 0
	};
	// 计算从当前触发元素到根节点为止，
	// 各级 offsetParent 元素的 offsetLeft 或 offsetTop 值之和
	while (element) {
		coord.X += element.offsetLeft;
		coord.Y += element.offsetTop;
		element = element.offsetParent;
	}
	return coord;
};

/*返回顶部的通用方法*/
function backTop(btnId) {
	var btn = document.getElementById(btnId);
	var d = document.documentElement;
	var b = document.body;
	window.onscroll = set;
	btn.style.display = "none";
	btn.onclick = function() {
		btn.style.display = "none";
		window.onscroll = null;
		this.timer = setInterval(function() {
			d.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1);
			b.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1);
			if ((d.scrollTop + b.scrollTop) == 0) clearInterval(btn.timer, window.onscroll = set);
		}, 10);
	};

	function set() {
		btn.style.display = (d.scrollTop + b.scrollTop > 100) ? 'block' : "none"
	}
};

/*获得URL中GET参数值
用法：如果地址是 test.htm?t1=1&t2=2&t3=3, 那么能取得：GET["t1"], GET["t2"], GET["t3"]
*/
function queryString() {
	var result = {},
		queryString = location.search.substring(1),
		re = /([^&=]+)=([^&]*)/g,
		m;

	while (m = re.exec(queryString)) {
		result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
	}

	return result;
}


/*打开一个窗体通用方法*/
function openWindow(url, windowName, width, height) {
	var x = parseInt(screen.width / 2.0) - (width / 2.0);
	var y = parseInt(screen.height / 2.0) - (height / 2.0);
	var isMSIE = (navigator.appName == "Microsoft Internet Explorer");
	if (isMSIE) {
		var p = "resizable=1,location=no,scrollbars=no,width=";
		p = p + width;
		p = p + ",height=";
		p = p + height;
		p = p + ",left=";
		p = p + x;
		p = p + ",top=";
		p = p + y;
		retval = window.open(url, windowName, p);
	} else {
		var win = window.open(url, "ZyiisPopup", "top=" + y + ",left=" + x + ",scrollbars=" + scrollbars + ",dialog=yes,modal=yes,width=" + width + ",height=" + height + ",resizable=no");
		eval("try { win.resizeTo(width, height); } catch(e) { }");
		win.focus();
	}
};


/*清除相同的数组*/
String.prototype.unique = function() {
	var x = this.split(/[\r\n]+/);
	var y = '';
	for (var i = 0; i < x.length; i++) {
		if (!new RegExp("^" + x.replace(/([^\w])/ig, "\\$1") + "$", "igm").test(y)) {
			y += x + "\r\n"
		}
	}
	return y
};


/*字符串反序*/
function isReverse(text) {
	return text.split('').reverse().join('');
};

/*清除html代码中的脚本*/
function clear_script(content) {
	return content.replace(/<script.*?>[\s\S]*?<\/script>|\s+on[a-zA-Z]{3,16}\s?=\s?"[\s\S]*?"|\s+on[a-zA-Z]{3,16}\s?=\s?'[\s\S]*?'|\s+on[a-zA-Z]{3,16}\s?=[^ >]+/ig, "");
};


/*金额大写转换函数*/
function moneyTransform(tranvalue) {
	try {
		var i = 1;
		var dw2 = new Array("", "万", "亿"); //大单位
		var dw1 = new Array("拾", "佰", "仟"); //小单位
		var dw = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //整数部分用
		//以下是小写转换成大写显示在合计大写的文本框中     
		//分离整数与小数
		var source = moneySplits(tranvalue);
		var num = source[0];
		var dig = source[1];
		//转换整数部分
		var k1 = 0; //计小单位
		var k2 = 0; //计大单位
		var sum = 0;
		var str = "";
		var len = source[0].length; //整数的长度
		for (i = 1; i <= len; i++) {
			var n = source[0].charAt(len - i); //取得某个位数上的数字
			var bn = 0;
			if (len - i - 1 >= 0) {
				bn = source[0].charAt(len - i - 1); //取得某个位数前一位上的数字
			}
			sum = sum + Number(n);
			if (sum != 0) {
				str = dw[Number(n)].concat(str); //取得该数字对应的大写数字，并插入到str字符串的前面
				if (n == '0') sum = 0;
			}
			if (len - i - 1 >= 0) { //在数字范围内
				if (k1 != 3) { //加小单位
					if (bn != 0) {
						str = dw1[k1].concat(str);
					}
					k1++;
				} else { //不加小单位，加大单位
					k1 = 0;
					var temp = str.charAt(0);
					if (temp == "万" || temp == "亿") //若大单位前没有数字则舍去大单位
						str = str.substr(1, str.length - 1);
					str = dw2[k2].concat(str);
					sum = 0;
				}
			}
			if (k1 == 3) { //小单位到千则大单位进一
				k2++;
			}
		}
		//转换小数部分
		var strdig = "";
		if (typeof(dig) != 'undefined' && dig != "") {
			var n = dig.charAt(0);
			if (n != 0) {
				strdig += dw[Number(n)] + "角"; //加数字
			}
			var n = dig.charAt(1);
			if (n != 0) {
				strdig += dw[Number(n)] + "分"; //加数字
			}
		}
		str += "元" + strdig;
	} catch (e) {
		return "转换[" + tranvalue + "]异常";
	}
	return str;
};

/*拆分整数与小数*/
function moneySplits(tranvalue) {
	var value = new Array('', '');
	temp = tranvalue.split(".");
	for (var i = 0; i < temp.length; i++) {
		value = temp;
	}
	return value;
};

/*实现base64解码*/
function base64_decode(data) {
	var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
		ac = 0,
		dec = "",
		tmp_arr = [];
	if (!data) {
		return data;
	}
	data += '';
	do {
		h1 = b64.indexOf(data.charAt(i++));
		h2 = b64.indexOf(data.charAt(i++));
		h3 = b64.indexOf(data.charAt(i++));
		h4 = b64.indexOf(data.charAt(i++));
		bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
		o1 = bits >> 16 & 0xff;
		o2 = bits >> 8 & 0xff;
		o3 = bits & 0xff;
		if (h3 == 64) {
			tmp_arr[ac++] = String.fromCharCode(o1);
		} else if (h4 == 64) {
			tmp_arr[ac++] = String.fromCharCode(o1, o2);
		} else {
			tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
		}
	} while (i < data.length);
	dec = tmp_arr.join('');
	dec = utf8_decode(dec);
	return dec;
};

/*实现utf8解码*/
function utf8_decode(str_data) {
	var tmp_arr = [],
		i = 0,
		ac = 0,
		c1 = 0,
		c2 = 0,
		c3 = 0;
	str_data += '';
	while (i < str_data.length) {
		c1 = str_data.charCodeAt(i);
		if (c1 < 128) {
			tmp_arr[ac++] = String.fromCharCode(c1);
			i++;
		} else if (c1 > 191 && c1 < 224) {
			c2 = str_data.charCodeAt(i + 1);
			tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
			i += 2;
		} else {
			c2 = str_data.charCodeAt(i + 1);
			c3 = str_data.charCodeAt(i + 2);
			tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
			i += 3;
		}
	}
	return tmp_arr.join('');
};

/*获取窗体可见范围的宽与高*/
function getViewSize() {
	var de = document.documentElement;
	var db = document.body;
	var viewW = de.clientWidth == 0 ? db.clientWidth : de.clientWidth;
	var viewH = de.clientHeight == 0 ? db.clientHeight : de.clientHeight;
	return Array(viewW, viewH);
};

/*断鼠标是否移出事件*/
function isMouseOut(e, handler) {
	if (e.type !== 'mouseout') {
		return false;
	}
	var reltg = e.relatedTarget ? e.relatedTarget : e.type === 'mouseout' ? e.toElement : e.fromElement;
	while (reltg && reltg !== handler) {
		reltg = reltg.parentNode;
	}
	return (reltg !== handler);
};

/*半角转换为全角函数*/
function toDBC(str) {
	var result = '';
	for (var i = 0; i < str.length; i++) {
		code = str.charCodeAt(i);
		if (code >= 33 && code <= 126) {
			result += String.fromCharCode(str.charCodeAt(i) + 65248);
		} else if (code == 32) {
			result += String.fromCharCode(str.charCodeAt(i) + 12288 - 32);
		} else {
			result += str.charAt(i);
		}
	}
	return result;
};

/*全角转换为半角函数*/
function toCDB(str) {
	var result = '';
	for (var i = 0; i < str.length; i++) {
		code = str.charCodeAt(i);
		if (code >= 65281 && code <= 65374) {
			result += String.fromCharCode(str.charCodeAt(i) - 65248);
		} else if (code == 12288) {
			result += String.fromCharCode(str.charCodeAt(i) - 12288 + 32);
		} else {
			result += str.charAt(i);
		}
	}
	return result;
};

/*格式化数字，格式化金额
 * 参数说明：
 * number：要格式化的数字
 * decimals：保留几位小数
 * dec_point：小数点符号
 * thousands_sep：千分位符号
 * */
function number_format(number, decimals, dec_point, thousands_sep) {

	number = (number + '').replace(/[^0-9+-Ee.]/g, '');
	var n = !isFinite(+number) ? 0 : +number,
		prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
		sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
		dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
		s = '',
		toFixedFix = function(n, prec) {
			var k = Math.pow(10, prec);
			return '' + Math.ceil(n * k) / k;
		};

	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
	var re = /(-?\d+)(\d{3})/;
	while (re.test(s[0])) {
		s[0] = s[0].replace(re, "$1" + sep + "$2");
	}

	if ((s[1] || '').length < prec) {
		s[1] = s[1] || '';
		s[1] += new Array(prec - s[1].length + 1).join('0');
	}
	return s.join(dec);
};

/*判断浏览器类型及主版本*/
function getBrowserInfo() {
	var Sys = {};
	var ua = navigator.userAgent.toLowerCase();
	if (window.ActiveXObject) {
		Sys.b = "ie";
		Sys.v = parseInt(ua.match(/msie ([\d.]+)/)[1]);
	} else if (document.getBoxObjectFor) {
		Sys.b = "firefox";
		Sys.v = parseInt(ua.match(/firefox\/([\d.]+)/)[1]);
	} else if (window.MessageEvent && !document.getBoxObjectFor) {
		Sys.b = "chrome";
		Sys.v == parseInt(ua.match(/chrome\/([\d.]+)/)[1]);
	} else if (window.opera) {
		Sys.b = "opera";
		Sys.v == parseInt(ua.match(/opera.([\d.]+)/)[1]);
	} else if (window.openDatabase) {
		Sys.b = "safari";
		Sys.v == parseInt(ua.match(/version\/([\d.]+)/)[1]);
	}
	return Sys;
}

/*预加载一些图片，建议放入页面加载完成事件内*/
function preLoadImg(imgUrls, timelazy) {
	if(isNaN(timelazy)){
		timelazy=1000;
	}
	setTimeout(function() {

		for (var i = 0; i < imgUrls.length; i++) {
			new Image().src = imgUrls[i];
		}

	}, timelazy);
}

/*检测浏览器引擎，浏览器类型，浏览器所在平台*/
var browserTest = function() {
	//呈现引擎
	var engine = {
		ie: 0,
		gecko: 0,
		webkit: 0,
		khtml: 0,
		opera: 0,
		//完整的版本号
		ver: null
	};
	//浏览器
	var browser = {
		//主要浏览器
		ie: 0,
		firefox: 0,
		safari: 0,
		konq: 0,
		opera: 0,
		chrome: 0,
		//具体的版本号
		ver: null
	};
	//平台、设备和操作系统
	var system = {
		win: false,
		mac: false,
		x11: false,
		//移动设备
		iphone: false,
		ipod: false,
		ipad: false,
		ios: false,
		android: false,
		nokiaN: false,
		winMobile: false,
		//游戏系统
		wii: false,
		ps: false
	};
	//检测呈现引擎和浏览器
	var ua = navigator.userAgent;
	if (window.opera) {
		engine.ver = browser.ver = window.opera.version();
		engine.opera = browser.opera = parseFloat(engine.ver);
	} else if (/AppleWebKit\/(\S+)/.test(ua)) {
		engine.ver = RegExp["$1"];
		engine.webkit = parseFloat(engine.ver);
		//确定是Chrome 还是Safari
		if (/Chrome\/(\S+)/.test(ua)) {
			browser.ver = RegExp["$1"];
			browser.chrome = parseFloat(browser.ver);
		} else if (/Version\/(\S+)/.test(ua)) {
			browser.ver = RegExp["$1"];
			browser.safari = parseFloat(browser.ver);
		} else {
			//近似地确定版本号
			var safariVersion = 1;
			if (engine.webkit < 100) {
				safariVersion = 1;
			} else if (engine.webkit < 312) {
				safariVersion = 1.2;
			} else if (engine.webkit < 412) {
				safariVersion = 1.3;
			} else {
				safariVersion = 2;
			}
			browser.safari = browser.ver = safariVersion;
		}

	} else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)) {
		engine.ver = browser.ver = RegExp["$1"];
		engine.khtml = browser.konq = parseFloat(engine.ver);
	} else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
		engine.ver = RegExp["$1"];
		engine.gecko = parseFloat(engine.ver);
		//确定是不是Firefox
		if (/Firefox\/(\S+)/.test(ua)) {
			browser.ver = RegExp["$1"];
			browser.firefox = parseFloat(browser.ver);
		}
	} else if (/MSIE ([^;]+)/.test(ua)) {
		engine.ver = browser.ver = RegExp["$1"];
		engine.ie = browser.ie = parseFloat(engine.ver);
	}
	//检测浏览器
	browser.ie = engine.ie;
	browser.opera = engine.opera;
	//检测平台
	var p = navigator.platform;
	system.win = p.indexOf("Win") == 0;
	system.mac = p.indexOf("Mac") == 0;
	system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
	//检测Windows 操作系统
	if (system.win) {
		if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
			if (RegExp["$1"] == "NT") {
				switch (RegExp["$2"]) {
					case "5.0":
						system.win = "2000";
						break;
					case "5.1":
						system.win = "XP";
						break;
					case "6.0":
						system.win = "Vista";
						break;
					case "6.1":
						system.win = "7";
						break;
					default:
						system.win = "NT";
						break;
				}
			} else if (RegExp["$1"] == "9x") {
				system.win = "ME";
			} else {
				system.win = RegExp["$1"];
			}
		}
	}
	//移动设备
	system.iphone = ua.indexOf("iPhone") > -1;
	system.ipod = ua.indexOf("iPod") > -1;
	system.ipad = ua.indexOf("iPad") > -1;
	system.nokiaN = ua.indexOf("NokiaN") > -1;
	//windows mobile
	if (system.win == "CE") {
		system.winMobile = system.win;
	} else if (system.win == "Ph") {
		if (/Windows Phone OS (\d+.\d+)/.test(ua)) {;
			system.win = "Phone";
			system.winMobile = parseFloat(RegExp["$1"]);
		}
	}
	//检测iOS 版本
	if (system.mac && ua.indexOf("Mobile") > -1) {
		if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)) {
			system.ios = parseFloat(RegExp.$1.replace("_", "."));
		} else {
			system.ios = 2; //不能真正检测出来，所以只能猜测
		}
	}
	//检测Android 版本
	if (/Android (\d+\.\d+)/.test(ua)) {
		system.android = parseFloat(RegExp.$1);
	}
	//游戏系统
	system.wii = ua.indexOf("Wii") > -1;
	system.ps = /playstation/i.test(ua);
	//返回这些对象
	return {
		engine: engine,
		browser: browser,
		system: system
	};
};