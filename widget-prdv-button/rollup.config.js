import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import injectProcessEnv from "rollup-plugin-inject-process-env";

/**
 * @description To save repeating ourselves, we can create a config file containing all the options we need.
 A config file is written in JavaScript and is more flexible than the raw CLI.
 */
export default {
  input: "src/main.js",
  output: [
    {
      file: "../ui/public/assets/bundle.js",
      format: "cjs",
    },
    {
      file: "./dist/bundle.min.js",
      format: "iife",
      name: "version",
      plugins: [terser()],
    },
  ],
  plugins: [
    json(),
    babel({
      exclude: "node_modules/**",
    }),
    commonjs(),
    injectProcessEnv({
      PRDV_MNA_ENV: process.env.BUNDLE_ENV || 'https://rdv-cfa.apprentissage.beta.gouv.fr',
    }),
  ],
};
