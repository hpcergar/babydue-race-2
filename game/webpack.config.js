var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')

// Phaser webpack config
var phaserModule = path.join(__dirname, '/node_modules/phaser-ce/')
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
var pixi = path.join(phaserModule, 'build/custom/pixi.js')
var p2 = path.join(phaserModule, 'build/custom/p2.js')
var phaserSlopes = path.join(__dirname, '/node_modules/phaser-arcade-slopes/dist/phaser-arcade-slopes.js')
var debugArcade = path.join(__dirname, '/node_modules/phaser-plugin-debug-arcade-physics/dist/DebugArcadePhysics.js')
var SAT = path.join(__dirname, '/node_modules/sat/SAT.js')

var definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
})

module.exports = {
    mode: "development",
    entry: {
        app: [
            'babel-polyfill',
            path.resolve(__dirname, 'src/app.js')
        ],
        vendor: ['pixi', 'p2', 'phaser', 'webfontloader', 'SAT']
    },
    devtool: 'cheap-source-map',
    output: {
        pathinfo: true,
        path: path.resolve(__dirname, 'dist'),
        publicPath: './dist/',
        // filename: 'bundle.js'
        filename: '[name].js'
    },
    watch: true,
    watchOptions: {
        poll: 1500
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                name: 'vendor'/* chunkName= */,
                filename: 'vendor.bundle.js'/* filename= */
            }
        }
    },
    plugins: [
        definePlugin,
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendor'/* chunkName= */,
        //     filename: 'vendor.bundle.js'/* filename= */
        // }),
        new HtmlWebpackPlugin({
            filename: '../index.html',
            template: './src/index.html',
            chunks: ['vendor', 'app'],
            chunksSortMode: 'manual',
            minify: {
                removeAttributeQuotes: false,
                collapseWhitespace: false,
                html5: false,
                minifyCSS: false,
                minifyJS: false,
                minifyURLs: false,
                removeComments: false,
                removeEmptyAttributes: false
            },
            hash: false
        }),
        new BrowserSyncPlugin({
            host: process.env.IP || '0.0.0.0',
            port: process.env.PORT || 3000,
            // proxy: 'http://localhost:3100/'
            server: {
                baseDir: ['./', './build']
            }
        }),
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
            },
            {
                test: /DebugArcadePhysics\.js$/,
                loader: 'expose-loader',
                options: {
                    exposes: {
                        globalName: 'DebugArcadePhysics',
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
            'DebugArcadePhysics': debugArcade,
            'SAT': SAT
        },
        fallback: {
            fs: false,
            net: false,
            tls: false,
            crypto: false
        }
    }
}
