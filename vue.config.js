const path = require("path");

module.exports = {
  productionSourceMap: false,
  assetsDir: 'public',

  pages: {
    index: "src/main.js"
  },

  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve("src")
      }
    }
  },

  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "@/styles/variables.scss";'
      }
    },
    extract: false
  },

  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();

    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'public/assets/[name].[hash:8].[ext]',
      });
  }
};
