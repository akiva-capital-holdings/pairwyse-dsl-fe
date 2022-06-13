const CracoAlias = require('craco-alias');
const { ESLINT_MODES } = require('@craco/craco');
const customESLintConfig = require('./.eslintrc.js');

module.exports = {
  eslint: {
    enable: ESLINT_MODES.extends,
    configure: customESLintConfig,
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        // baseUrl SHOULD be specified
        // plugin does not take it from tsconfig
        baseUrl: '.',
        /* tsConfigPath should point to the file where "baseUrl" and "paths"
            are specified */
        tsConfigPath: './tsconfig.paths.json',
      },
    },
  ],
};