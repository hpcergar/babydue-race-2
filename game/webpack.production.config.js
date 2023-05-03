var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin");

// Phaser webpack config
var phaserModule = path.join(__dirname, '/node_modules/phaser-ce/')
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
var pixi = path.join(phaserModule, 'build/custom/pixi.js')
var p2 = path.join(phaserModule, 'build/custom/p2.js')
var phaserSlopes = path.join(__dirname, '/node_modules/phaser-arcade-slopes/dist/phaser-arcade-slopes.js')
var SAT = path.join(__dirname, '/node_modules/sat/SAT.js')

var definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false'))
})

module.exports = {
    mode: "production",
    entry: {
        app: [
            'babel-polyfill',
            path.resolve(__dirname, 'src/app.js')
        ],
        vendor: ['pixi', 'p2', 'phaser', 'webfontloader', 'SAT']

    },
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: './',
        filename: 'js/[name].js',
        clean: true
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                name: 'vendor'/* chunkName= */,
                filename: 'vendor.bundle.js'/* filename= */
            }
        },
        minimize: true,
        minimizer: [
            new TerserPlugin(),
        ],
    },
    plugins: [
        definePlugin,
        new webpack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment/,
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html', // path.resolve(__dirname, 'build', 'index.html'),
            template: './src/index.html',
            chunks: ['vendor', 'app'],
            chunksSortMode: 'manual',
            minify: {
                removeAttributeQuotes: true,
                collapseWhitespace: true,
                html5: true,
                minifyCSS: true,
                minifyJS: true,
                minifyURLs: true,
                removeComments: true,
                removeEmptyAttributes: true
            },
            hash: true
        }),
        new CopyWebpackPlugin([
            {from: 'assets', to: 'assets'}
        ]),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader'],
                include: path.join(__dirname, 'src')
            },
            {
                test: /pixi\.js/,
                loader: 'expose-loader',
                options: {
                    exposes: {
                        globalName: 'PIXI',
                        override: true
                    },
                }
            },
            {
                test: /phaser-split\.js$/,
                loader: 'expose-loader',
                options: {
                    exposes: {
                        globalName: 'Phaser',
                        override: true
                    },
                }
            },
            {
                test: /p2\.js/,
                loader: 'expose-loader',
                options: {
                    exposes: {
                        globalName: 'p2',
                        override: true
                    },
                }
            },
            {
                test: /lodash\.js/,
                loader: 'expose-loader',
                options: {
                    exposes: {
                        globalName: '_!lodash',
                        override: true
                    },
                }
            },
            {
                test: /jquery\.js/,
                loader: 'expose-loader',
                options: {
                    exposes: {
                        globalName: '$!jquery',
                        override: true
                    },
                }
            },
            {
                test: /SAT\.js$/,
                loader: 'expose-loader',
                options: {
                    exposes: {
                        globalName: 'SAT',
                        override: true
                    },
                }
            },
            {
                test: /phaser-arcade-slopes\.js$/,
                loader: 'expose-loader',
                options: {
                    exposes: {
                        globalName: 'phaserSlopes',
                        override: true
                    },
                }
            }
        ]
    },
    resolve: {
        alias: {
            'phaser': phaser,
            'pixi': pixi,
            'p2': p2,
            'phaserSlopes': phaserSlopes,
            'SAT': SAT,
        },
        fallback: {
            fs: false,
            net: false,
            tls: false,
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify")
        }
    }
}
