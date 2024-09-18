const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
    optimization: {
        usedExports: true,
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    entry: './src/index.tsx', // Your main TypeScript entry point
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js', // Output file
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.svg$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 8192, // Inline files smaller than 8kb
                        name: '[name].[ext]',
                        outputPath: 'assets/svg',
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new BundleAnalyzerPlugin(),
        new HtmlWebpackPlugin({
            template: './public/index.html', // Your HTML template
            patterns: [
                {from: 'public/favicon.ico', to: 'favicon.ico'},
                {from: 'public/manifest.json', to: 'manifest.json'},
                // Add other patterns if needed
            ],
        }),
    ],
    mode: 'production',
};
