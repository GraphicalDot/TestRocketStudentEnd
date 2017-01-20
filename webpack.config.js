//Its a javascript file, Webpack by default uses javascript but we are using typescript thats why we need ts-loader
//uses common.js format
var webpack = require("webpack")

module.exports = {
	entry: './src/main.ts', //entry point for our application
	output: {

		path: './dist',
		filename: 'app.bundle.js'
	},

	module: {
		loaders: [
			{test: /\.ts$/, loader: 'ts-loader'} //any files that ends with ts should be loaded using ts-loader
		]

	},

	resolve: {
		extensions: ['*', '.js', ".ts"]

	},

	plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
    ]

};