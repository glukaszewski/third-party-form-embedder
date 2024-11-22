import babel from 'vite-plugin-babel'

const ReactCompilerConfig = {}

export default defineConfig({
    plugins: [
        remix({ /* ... */ }),
        babel({
            filter: /\.[jt]sx?$/,
            babelConfig: {
                presets: ['@babel/preset-typescript'],
                plugins: [
                    ["babel-plugin-react-compiler", ReactCompilerConfig]
                ]
            }
        })
    ]
})
