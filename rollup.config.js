import babel from '@rollup/plugin-babel'
import postcss from "rollup-plugin-postcss";

export default {
    input: './src/index.js',
    output: {
        file: './lib/bundle.js',
        format: 'cjs'
    },
    plugins: [
        babel(),
        postcss(/* {
            extract: true,
        } */),
    ],
    external: ['react', 'styled-components', 'rollup-plugin-postcss']
}