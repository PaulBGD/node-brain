import buble from 'rollup-plugin-buble';

export default {
    external: [ 'fs', 'path' ],

    entry: 'src/index.js',
    dest: 'lib/node-brain.js',
    format: 'cjs',
    plugins: [
        buble()
    ]
};