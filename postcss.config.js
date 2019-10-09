module.exports = (env, argv) => {
  if (env.webpack.mode === 'production') {
    return {
      plugins: [
        require('autoprefixer')({
          browsers: ['ie >= 8', 'last 4 version']
        }),
        require('cssnano')
      ]
    }
  }
  if (env.webpack.mode === 'development') {
    return {};
  }
};