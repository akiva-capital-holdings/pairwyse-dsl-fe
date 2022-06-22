module.exports = {
  "settings": {
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
    ],
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  ignorePatterns: ['.eslintrc.js'],
  env: {
    browser: false,
    es2021: true,
    mocha: true,
    node: true
  },
   "plugins": ['react', '@typescript-eslint'],
   "extends": ["airbnb-base", "airbnb-typescript/base", "prettier"],
   "parser": "@typescript-eslint/parser",
   "parserOptions": {
   "ecmaVersion": 12,
   "project": "./tsconfig.json",
   "sourceType": "module"
  }, 
  rules : {
    "quotes": ["error", "single"],
    "no-restricted-syntax": ["off"],
    "no-await-in-loop": ["off"],
    "max-len": ["error", 180],
    "no-plusplus": ["off"],
    "no-param-reassign": [2, { "props": false }],
    "arrow-body-style": ['error', 'always'],
    "import/no-named-as-default": 0,
    "no-console": "off"
  }
}
