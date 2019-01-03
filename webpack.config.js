const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const srcPath = path.resolve(__dirname, 'src');
const uiPath = path.resolve(srcPath, 'ui');

module.exports = {
	entry: path.resolve(uiPath, 'index.tsx'),
	devtool: 'source-map',
	optimization: {
		splitChunks: {
			chunks: 'all'
		}
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: {
					loader: 'ts-loader',
					options: {
						transpileOnly: true
					}
				},
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				use: [
					// {
					// 	loader: MiniCssExtractPlugin.loader
					// },
					'style-loader',
					{
						loader: "css-loader",
						options: {
							modules: true,
							sourceMap: false,
							importLoaders: 1,
							localIdentName: "[name]--[local]--[hash:base64:8]"
						}
					},
					"postcss-loader" // has separate config, see postcss.config.js nearby
				]
			},
			{ test: /\.(png|jpg|jpeg)$/, loader: '/file-loader' },
			{ test: /\.(woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
			{ test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
			{ test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader' }
		]
	},
	resolve: {
		modules: [srcPath, 'node_modules'],
		extensions: ['.tsx', '.ts', '.js', '.jsx', 'css']
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(srcPath, 'public', 'static')
	},
	// plugins: [
	// 	new MiniCssExtractPlugin({ filename: 'styles.css' })
	// ]
};