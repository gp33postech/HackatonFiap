// babel.config.js

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // ADICIONE TODO O BLOCO 'plugins' ABAIXO
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            // Este é o alias que estamos configurando.
            '@': './src',
          },
        },
      ],
    ],
  };
};