/*
 * 开发环境的配置
 * @Author: 56 
 * @Date: 2017-10-27 10:42:11 
 * @Last Modified by: 56
 * @Last Modified time: 2017-10-27 10:55:55
 */
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(baseWebpackConfig, {
	devtool: 'cheap-module-eval-source-map', // 开发过程中加入到js中的 sourcemap 编译速度最快

	// 使用的 loader 加载器
	module: {
		rules: [
			{
				test: /\.css$/,
				// 配置css的抽取器、加载器。
				loader: 'style-loader!css-loader',
			},
			{
				test: /(\.sass|\.scss)$/,
				// 配置sass的抽取器 加载器
				// 从右向左提取 !可表示右边输出做左边输入
				loader: 'css-loader!sass-loader',
			},
		],
	},

	// 插件配置
	plugins: [
		new webpack.HotModuleReplacementPlugin(), // 热加载
		new HtmlWebpackPlugin({
			filename: 'index.html', // 输出的html名
			template: 'index.pug', // 指定的html模板
		}),
	],

	// 开发服务器
	devServer: {
		// contentBase: './', // 本地服务器所加载的页面所在的目录
		port: 8080, // 端口号
		historyApiFallback: true, // 不跳转
		inline: true, // 实时刷新
		// hot: true, // 开启热更新
		// proxy: {}, // 做路径映射
	},
})
