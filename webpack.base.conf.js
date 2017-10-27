const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	entry: __dirname + '/src/js/main.js', // 唯一入口文件

	// 相关的loader
	module: {
		rules: [
			{
				test: /\.js$/,
				// 编译js 转换es6/7 为es5
				// 排除	node_modules
				loader: 'babel-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.pug$/,
				// pug 加载器
				loader: 'pug-loader',
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				// 图片加载器 配置图片到img文件夹中
				// 其中 8KB以下的图片转成base64
				loader: 'url-loader?limit=8192&name=img/[name].[hash:7].[ext]',
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				// 字体加载 处理文件
				loader: 'file-loader?name=fonts/[name].[ext]',
			},
		],
	},
}
