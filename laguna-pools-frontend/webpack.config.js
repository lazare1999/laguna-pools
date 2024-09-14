const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
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
        new HtmlWebpackPlugin({
            template: './public/index.html', // Your HTML template
        }),
    ],
    mode: 'production',
};
