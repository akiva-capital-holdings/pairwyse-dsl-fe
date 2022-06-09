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
    "import/no-named-as-default": 0
  }
}

// module.exports = {
//   env: {
//     browser: true,
//     es2021: true,
//   },
//   extends: ['plugin:react/recommended', 'airbnb'],
//   parser: '@typescript-eslint/parser',
//   parserOptions: {
//     ecmaFeatures: {
//       jsx: true,
//     },
//     ecmaVersion: 13,
//     sourceType: 'module',
//   },
//   plugins: ['react', '@typescript-eslint'],
//   rules: {
//     'arrow-body-style': ['error', 'always'],
//     // note you must disable the base rule as it can report incorrect errors
//     'no-use-before-define': 0,
//     // '@typescript-eslint/no-use-before-define': ['error'],
//     'max-len': ['warn', { code: 180 }],
//     'linebreak-style': [
//       'error',
//       process.platform === 'win32' ? 'windows' : 'unix',
//     ],
//     'react/jsx-filename-extension': 0,
//     'react/react-in-jsx-scope': 0,
//     'import/extensions': 0,
//     'import/no-unresolved': 0,
//     'import/prefer-default-export': 0,
//     'no-empty-pattern': 1,
//     'react/no-unescaped-entities': 0,
//     'import/no-extraneous-dependencies': 0,
//   },
// };