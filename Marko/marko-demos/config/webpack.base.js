/*
* @Author: 28906
* @Date:   2017-10-09 15:34:05
* @Last Modified by:   28906
* @Last Modified time: 2017-10-14 17:24:41
*/
let path = require('path'),
	src = path.join(__dirname, '../src'),
	HappyPack = require('happypack'),
	webpack = require('webpack'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	NyanProgressPlugin = require('nyan-progress-webpack-plugin');

module.exports = {
	devtool: "#cheap-source-map",
	entry: [
        "webpack-dev-server/client?http://localhost:9090",
        "webpack/hot/dev-server",
        "whatwg-fetch",
         "./src/index"
	],

	output: {
		path: path.join(__dirname, "../dist"),
        publicPath: "/",
        filename: "bundle.js"
	},

	resolve:{
		extensions:['.js', '.less', '.css', '.scss', '.json', '.marko']
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: [/node_modules/],
				loader: ['happypack/loader?id=js']
	        },
	        {
	        	test: /\.marko$/,
	        	exclude: [/node_modules/],
	        	loader: ['happypack/loader?id=marko']
	        },
			{
				test: /\.scss|css$/,
				use:[
					"style-loader",
					"css-loader",
					"postcss-loader",
					"resolve-url-loader",
					"sass-loader?sourceMap"
				]
			},
			{
				test: /\.less$/,
				use:[
					"style-loader",
					"css-loader",
					"less-loader",
					"resolve-url-loader",
					"postcss-loader"
				]
			},
			{
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
						loader: 'url-loader',
						options: {
						query: {
							  name:'[name].[hash].[ext]'
							}
						}
				    },
                    {
					    loader: 'image-webpack-loader',
					    options: {
					        progressive: true,
					        optipng: {
					            optimizationLevel: 7,
					        },
					        mozjpeg: {
					            quality: 65
					        },
					        gifsicle: {
					            interlaced: true,
					        },
					        pngquant: {
					            quality: '65-90',
					            speed: 4
					        }
					    }
					}
                ]
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: "file-loader"
            }
		]
	},

	plugins: [
		new NyanProgressPlugin(),
		new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new HappyPack({
			verbose: false,
			id: 'js',
			threads: 4,
			loaders: [ 'babel-loader' ]
		}),
		new HappyPack({
			verbose: false,
			id: 'marko',
			threads: 4,
			loaders: [ 'marko-loader' ]
		}),
		new HtmlWebpackPlugin({
        	hash: false,
        	template: path.join(src, 'index.html'),
        }),
	]
}
