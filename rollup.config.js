const buble = require('rollup-plugin-buble');

export default {
    entry: 'src/Brain.js',
    dest: 'lib/node-brain.js',
    format: 'cjs',
    plugins: [buble()]
};