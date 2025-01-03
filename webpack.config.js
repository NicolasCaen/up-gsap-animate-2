const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
    ...defaultConfig,
    entry: {
        index: path.resolve(__dirname, 'blocks/animation-controls/index.js'),
        editor: path.resolve(__dirname, 'blocks/animation-controls/editor.scss')
    },
    output: {
        path: path.resolve(__dirname, 'blocks/animation-controls/build'),
        filename: '[name].js'
    }
}; 