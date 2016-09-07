var webpack = require("webpack");
module.exports = {
	entry:"./src/components/GalleryByReactApp.js",
	output: {
		path:__dirname,
		filename:"./src/dist/bundle.js",
		publicPath: '/dist/'
	},
	// require("../src/styles/main.css") ==> require("styles/main.css")
	// resolve: {
	// 	extensions: ['', '.js', '.jsx'],
	// 	alias: {
	// 		"styles":__dirname + "/src/styles",
	// 		"mixins": __dirname+"/src/mixins",
	// 		"components": __dirname+"/src/components"
	// 	}
	// },

	'devServer': {
    	contentBase:'./src'    	
    },

	module: {
		loaders:[
			{test:/\.css$/, loader:"style!css"},
			{test: /\.scss$/, loader: 'style!css!autoprefixer-loader?{browsers:["last 2 version", "firefox 15"]}!sass'},
			{test:/\.(js|jsx)$/, exclude:/(node_modules|bower_components)/, loader:"react-hot!babel?presets[]=es2015"}, 
			{test: /\.(png|jpg|woff|woff2|eot|ttf|svg)$/,loader: 'url-loader?limit=8192'},
			{test:/\.json$/, loader:"json-loader"}				
		]
	},
	plugins: [
		new webpack.BannerPlugin("This file is created by zhaoda")
	]
};