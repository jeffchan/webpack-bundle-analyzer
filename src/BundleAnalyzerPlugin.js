const viewer = require('./viewer');

class BundleAnalyzerPlugin {

  constructor(opts) {
    this.opts = {
      openAnalyzer: true,
      analyzerPort: 8888,
      generateStatsFile: false,
      statsFilename: 'stats.json',
      ...opts
    };
  }

  apply(compiler) {
    compiler.plugin('emit', (curCompiler, callback) => {
      const stats = curCompiler
        .getStats()
        .toJson({
          source: false,
          warnings: false,
          errors: false,
          errorDetails: false
        });

      if (this.opts.generateStatsFile) {
        const statsStr = JSON.stringify(stats, null, 2);

        curCompiler.assets[this.opts.statsFilename] = {
          source: () => statsStr,
          size: () => statsStr.length
        };
      }

      if (this.opts.openAnalyzer) {
        // Making analyzer logs to be after all webpack warnings in the console
        setTimeout(() => {
          console.log('');

          viewer.start(stats, {
            port: this.opts.analyzerPort,
            bundleDir: compiler.outputPath
          });
        }, 500);
      }

      callback();
    });
  }

}

module.exports = BundleAnalyzerPlugin;
