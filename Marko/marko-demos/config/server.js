/*
* @Author: 28906
* @Date:   2017-10-09 15:59:56
* @Last Modified by:   28906
* @Last Modified time: 2017-10-09 17:53:38
*/
var webpack = require('webpack'),
	WebpackDevServer = require('webpack-dev-server'),
	path = require('path'),
	config = require('./webpack.base.js');


new WebpackDevServer(webpack(config), {
	hot: true,
    port: 9090,
    publicPath: "/",
    historyApiFallback: true
}).listen(9090, 'localhost', function(err, re){
	if(err){
		console.log('webpack-dev-server start error: ', err);
	}

	console.info('welcome to start marko demos on localhost:9090');
})