module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  ignorePatterns: ["src/types/generated/**"],
  extends: ["airbnb-base", "airbnb-typescript/base", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["tsconfig.json", "examples/*/tsconfig.json"],
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    quotes: ["error", "double"],
    "no-restricted-syntax": ["error", "ForInStatement", "LabeledStatement", "WithStatement"],
    "max-len": ["error", 130],
    "import/extensions": ["error", "never"],
    "import/no-commonjs": ["error", { allowRequire: false, allowPrimitiveModules: false }],
    "import/no-extraneous-dependencies": [
      "error",
      { devDependencies: true, optionalDependencies: true, peerDependencies: true },
    ],
    "import/no-useless-path-segments": ["error", { noUselessIndex: true }],
    "max-classes-per-file": ["error", 10],
    "import/prefer-default-export": "off",
    "object-curly-newline": "off",
    "no-use-before-define": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "variable",
        format: ["camelCase", "UPPER_CASE", "PascalCase"],
        leadingUnderscore: "allow",
        trailingUnderscore: "allow",
      },
    ],
    "@typescript-eslint/no-use-before-define": ["error", { functions: false, classes: false }],
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};
