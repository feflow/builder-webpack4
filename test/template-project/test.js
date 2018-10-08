const glob = require('glob-all');
describe('checking generated file exists', function() {
    it('should generate webserver including html files', function(done) {
        glob(['./public/webpack/index.html'], (err) => {
            if (!err) {
                done();
            } else {
              throw err
            }
        });
    });
    it('should generate category dirctory including js & css files', function(done) {
        glob(
            [
                './public/cdn/category/index_*.js',
                './public/cdn/category/idnex_*.css',
            ],
            (err) => {
                if (!err) {
                    done();
                } else {
                  throw err
                }
            }
        );
    });
    it('should generate zip for offline bundle', function(done) {
        glob('./public/offline/offline.zip', (err) => {
            if (!err) {
                done();
            } else {
              throw err
            }
        });
    });
});
