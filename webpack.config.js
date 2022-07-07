const path = require('path');

module.exports = {
    mode: "production",
    entry: './src/index.ts',
    target: ['webworker'],

    output: {
        filename: "extension.js",
        path: path.resolve(process.cwd(), 'dist'),
        library: { type: "commonjs2", },
    },
    resolve: {
        extensions: [".ts", ".js"],
        alias: {
            '@utils': path.resolve(__dirname, 'utils'),
        }
    },
    module: {
        rules: [
            // json files are also handled by typescript
            {
                test: /\.ts$/,
                use: {
                    loader: "ts-loader",
                    options: {
                        configFile: "tsconfig.build.json"
                    }
                },
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [{
                    loader: 'file-loader',
                },],
            },
        ]
    }
};