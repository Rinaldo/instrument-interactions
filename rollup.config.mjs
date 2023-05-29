import terser from "@rollup/plugin-terser"
import typescript from "rollup-plugin-typescript2"
import pkg from './package.json' assert { type: 'json' };

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: pkg.browser,
                format: "umd",
                name: "instrument-interactions",
            },
            {
                file: pkg.main,
                format: "cjs",
            },
            {
                file: pkg.module,
                format: "es",
            },
        ],
        plugins: [typescript({ tsconfig: "tsconfig.build.json" })],
    },
    {
        input: "src/index.ts",
        output: [
            {
                file: `dist/${pkg.name}.min.mjs`,
                format: "es",
            },
            {
                file: pkg.unpkg,
                format: "umd",
                name: "instrument-interactions",
            },
        ],
        plugins: [typescript({ tsconfig: "tsconfig.build.json" }), terser()],
    },
]
