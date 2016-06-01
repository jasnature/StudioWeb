require.config({
	//根路径
	baseUrl: 'js',
	//模块尾部追加字符串，上线后要移出
	urlArgs: "n=" + (new Date()).getTime(),
	paths: {
		//路径别名配置
		b: ['app/b'],
		a: ['app/a'],
		c: ['app/c'],
		abc: ['app/d/ggg/1123']
	},
	map: {
		/*对于给定的模块前缀，使用一个不同的模块ID来加载该模块。
		模块不同版本文件映射
		*/
		'b': {
			'jquery': 'js/lib/jquery-1.8.0.min.js'
		},
		'c': {
			'jquery': 'js/lib/jquery-2.1.0.js'
		}

	},
	config: {
		/*
		 * 常常需要将配置信息传给一个模块
		 * 每个模块额外的一些配置
		 */
		'b': {
			size: 'large'
		},
		'c': {
			color: 'blue'
		}
	},
	shim: {
		/*为那些没有使用define()来声明依赖关系、
		设置模块的"浏览器全局变量注入"型脚本做依赖和导出配置
		比如：简单点说，就是unslider还依赖jquery插件，但是又没有定义
		*/
		'unslider': {
			deps: ['lib/jquery-1.8.0.min']
		}

	},
	bundles: {
		/*模块打包之模块实际文件配置,比如'main', 'util', 'text'都在primary.js文件中
		 */
		'app/pack': ['app/jqload', 'a', 'b', 'c', 'd', 'ugg'],
		'secondary': ['secondary.html']
	}

});

require(['app/jqload'], function(a) {

	console.log('jqload');

});

//require(['require', 'b'], function(require, b) {
//
//	console.log(b.add(1, 2));
//
//	//console.log("\o",a);
//});

require(['ugg'], function() {

});

//require(['secondary.html'], function(util, text) {
//	//The script for module ID 'primary' was loaded,
//	//and that script included the define()'d
//	//modules for 'util' and 'text'
//});

//require(['abc/require'], function() {
//
//	console.log("13123123");
//
//});

//
//require(['c'], function(gg) {
//
//	gg.show();
//});
//
//require(['d'], function(data) {
//
//	console.log("%o", data);
//});