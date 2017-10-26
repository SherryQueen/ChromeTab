const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
	entry: __dirname + '/src/js/main.js', // 唯一入口文件

	// 输出配置
	// devtool: 'source-map', // 生成单独 sourcemap
	// devtool: 'eval-source-map', // 开发过程中加入到js中的 sourcemap
	output: {
		path: path.join(__dirname, '/dist'), //打包后的文件存放的地方
		filename: 'bundle.js', //打包后输出文件的文件名
	},

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
				test: /\.css$/,
				// 配置css的抽取器、加载器。'-loader'可以省去
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader'),
			},
			{
				test: /(\.sass|\.scss)$/,
				// 配置sass的抽取器 加载器
				// 从右向左提取 !可表示右边输出做左边输入
				loader: ExtractTextPlugin.extract('css!sass-loader'),
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

	// 相关插件
	plugins: [
		new webpack.HotModuleReplacementPlugin(), // 热加载
		new ExtractTextPlugin('css/[name].css'), // 给每个css 单独生成对应的路径
		new HtmlWebpackPlugin({
			filename: 'index.html', // 输出的html名
			template: 'index.pug', // 指定的html模板
			inject: true, // 允许注入
		}),
	],

	// 开发服务器
	devServer: {
		// contentBase: './', // 本地服务器所加载的页面所在的目录
		port: 8080, // 端口号
		historyApiFallback: true, // 不跳转
		inline: true, // 实时刷新
		hot: true, // 开启热更新
		// proxy: {}, // 做路径映射
	},
}
