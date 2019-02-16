const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const pack = require("../package.json")

function resolve(dir) {
	return path.join(__dirname, '..', dir)
}

module.exports = {
	context: resolve('src'),
	entry: './index.ts',
	devtool: "inline-source-map",
	target: 'node',
	output: {
		filename: 'index.js',
		path: resolve('dist'),
		libraryTarget: 'umd'
	},
	externals: [...Object.keys(pack.dependencies)],
	module: {
		rules: [{
			test: /\.tsx?$/,
			use: 'ts-loader',
			exclude: /node_modules/
		}]
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.json'],
		plugins: [
			new TsconfigPathsPlugin()
		]
	},

}