module.exports = function(api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // React optimization - remove PropTypes in production
      ...(process.env.NODE_ENV === 'production' ? [
        ['transform-remove-console', { exclude: ['error', 'warn'] }],
      ] : []),

      // React optimization plugins
      [
        '@babel/plugin-transform-react-jsx',
        {
          runtime: 'automatic',
        },
      ],
    ],
  };
};
