import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        process: "readonly",
        console: "readonly",
      },
    },
    rules: {
      // Ignore undefined variable errors (since Node.js defines require, etc.)
      "no-undef": "off",
      // Warn instead of error for unused vars
      "no-unused-vars": "warn",
      // Optional: make lint less strict
      "no-console": "off",
    },
  },
];
