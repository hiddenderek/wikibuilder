const path = require('path');
const options = {
    cache: true,        
}
const config = {
  resolve: {
    modules: [path.resolve('./src'), path.resolve('./node_modules')],
  },
  entry: {
    main: ['./src/renderers/dom.tsx'],
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {test: /\.(ts|tsx)$/, exclude: [/node_modules/,/public/, /src\/__tests__/, /cypress/], use: ['ts-loader']}
    ]
  },
  watchOptions: {
    aggregateTimeout: 500,
    poll: 1000
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.tsx', '.ts']
  }
};
module.exports = config