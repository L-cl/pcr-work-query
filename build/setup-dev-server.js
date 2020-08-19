const fs = require('fs');
const path = require('path');
const MFS = require('memory-fs');
const chokidar = require('chokidar');
const webpack = require('webpack');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackDevMiddleware = require('webpack-dev-middleware');
const clientConfig = require('./webpack.client.config');
const serverConfig = require('./webpack.server.config');

module.exports = function setupDevServer(app, cb) {
  let bundle;
  let template;
  let clientManifest;
  let ready;
  const readyPromise = new Promise((r) => {
    ready = r;
  });

  // let renderer

  const update = () => {
    if (bundle && clientManifest) {
      ready();
      cb(bundle, { template, clientManifest });
    }
  };
  const templatePath = path.resolve(__dirname, '../src/index.template.html');

  // 初始化 template，并且 watch template，发生变化则进行更新
  template = fs.readFileSync(templatePath, 'utf-8');
  chokidar.watch(templatePath).on('change', () => {
    template = fs.readFileSync(templatePath, 'utf-8');
    update();
  });

  // 对客户端进行修改使能够进行热更新
  clientConfig.entry.app = [
    'webpack-hot-middleware/client?quiet=true',
    clientConfig.entry.app,
  ];
  clientConfig.output.filename = '[name].js';
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  );

  // 对 dev middleware 进行配置
  const clientCompiler = webpack(clientConfig);
  const devMiddleware = webpackDevMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    logLevel: 'silent',
  });

  app.use(devMiddleware);

  clientCompiler.hooks.done.tap('done', (stats) => {
    stats = stats.toJson();
    stats.errors.forEach((err) => console.log(err));
    stats.warnings.forEach((warning) => console.log(warning));
    if (stats.errors.length > 0) return;
    clientManifest = JSON.parse(
      devMiddleware.fileSystem.readFileSync(
        path.join(clientConfig.output.path, 'vue-ssr-client-manifest.json'),
        'utf-8'
      )
    );
    update();
  });

  app.use(webpackHotMiddleware(clientCompiler, { log: false }));

  // 对服务端配置进行修改
  const serverCompiler = webpack(serverConfig);
  const mfs = new MFS();
  serverCompiler.outputFileSystem = mfs;
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err;
    stats = stats.toJson();
    stats.errors.forEach((err) => console.log(err));
    stats.warnings.forEach((warning) => console.log(warning));
    if (stats.errors.length > 0) return;
    bundle = JSON.parse(
      mfs.readFileSync(
        path.join(serverConfig.output.path, 'vue-ssr-server-bundle.json'),
        'utf-8'
      )
    );
    update();
  });

  return readyPromise;
};
