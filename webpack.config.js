const path = require('path');

const webpack = require('webpack')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackBar = require("webpackbar");
const UnusedWebpackPlugin = require('unused-webpack-plugin');

// const PATHS = {
//     root: path.join(__dirname, ''),
//     app: path.join(__dirname, 'app'),
//     scripts: path.join(__dirname, 'app/scripts'),
//     dist: path.join(__dirname, 'dist'),
// };

const config = (env) => {
    env = env || {}
    mode = 'development'
    const isProd = String(mode).toLowerCase() === 'production'
    return {
        entry: {
            'popup.js': ['./app/scripts/popup.js'],
            'background.js': ['./app/scripts/background.js'],
            'options.js': './app/scripts/options.js',
        },
        output: {
            clean: true,
            path: path.resolve("./dist"),
            filename: '[name]',
            publicPath: '/',
            cssFilename: '[name].css',
            cssChunkFilename: '[name].[contenthash].css',
            assetModuleFilename: '[name][ext]',
            devtoolModuleFilenameTemplate: (info) => 'file://' + path.resolve(info.absoluteResourcePath)
        },
        experiments: {
            asyncWebAssembly: true,
            syncWebAssembly: true,
            // css: true,
        },
        performance: {
            hints: "warning", // "error" or false are valid too
            maxEntrypointSize: 50000, // in bytes, default 250k
            maxAssetSize: 100000, // in bytes
        },
        mode: mode,
        devtool: "source-map",
        // watch: true,
        watchOptions: {
          ignored: "/node_modules/",
        },
        resolve: {
            extensions: ['.js', '.jsx'],
            fullySpecified: false
        },
        module: {
            rules: [
                {
                    exclude: /(node_modules)/,
                    test: /\.m?js$/,
                    loader: "swc-loader"
                },
                {
                    test: /\.jsx$/,
                    loader: "swc-loader",
                    // fullySpecified: false
                },
                {
                    test: /\.css$/i,
                    use: [
                        {
                            loader: mode ? 'style-loader' : MiniCssExtractPlugin.loader,
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    auto: true,
                                },
                            },
                        },
                        'postcss-loader',
                    ],
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset',
                    parser: {
                        dataUrlCondition: {
                            maxSize: 1 * 1024 // 1kb - a file with size less than 1kb will be treated as a inline module type and resource module type otherwise.
                        }
                    }
                },
                {
                    test: /\.svg$/,
                    type: 'asset'
                },
                { // return raw file if we request it
                    resourceQuery: /raw/,
                    type: 'asset/source',
                },
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                IS_PRODUCTION: isProd,
                // VERSION: JSON.stringify(build_version),
                INSTALL_URL: 'url#app_version',
                UNINSTALL_URL: 'url#app_version',
                SURVEY_URL: 'https://my.example.com/survey#app_version',
                APP_INTERNAL_URL: 'chrome-extension://__MSG_@@extension_id__'
            }),
            new webpack.HotModuleReplacementPlugin(),
            new HtmlWebpackPlugin({
                template: path.join(__dirname, 'app', 'popup.html'),
                filename: 'popup.html',
                inject: 'body',
                chunks: ['vendors.js', 'popup.js'],
                chunksSortMode: 'manual',
                minify: isProd? true: false
            }),
            new CopyPlugin({
                patterns: [
                    {
                        from: "./app/manifest.json",
                        to: "./manifest.json",
                        // transform(content, path) {
                        //     return modify(content)
                        // }
                    },
                    {
                        from: "./app/_locales/",
                        to: "./_locales/",
                    },
                    {
                        context: "./app/",
                        from: "./images/icon*",
                        to: "./",
                    },
                ]
            }),

            new WebpackBar({
                profile: true,
            }),
            new UnusedWebpackPlugin({
                directories: [path.join(__dirname, 'app')],
                exclude: ['*.test.js'],
                root: __dirname,
              }),
            new BundleAnalyzerPlugin(),
        ]
    }
}

module.exports = config;