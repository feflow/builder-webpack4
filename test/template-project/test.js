const glob = require('glob-all');

describe('checking generated file exists', function() {
    it('should generate webserver including html files', function(done) {
        var file = glob.sync(
            [
                './public/webserver/category/index.html'
            ]
        );
        if (file.length > 0) {
            done();
        } else {
            throw new Error("No files found");
        }
    });
    it('should generate category dirctory including js & css files', function(done) {
        var file = glob.sync(
            [
                './public/cdn/category/index_*.js',
                './public/cdn/category/idnex_*.css',
            ]
        );
        if (file.length > 0) {
            done();
        } else {
            throw new Error("No files found");
        }
    });
    it('should generate zip for offline bundle', function(done) {
        var file = glob.sync(
            [
                './public/offline/offline.zip'
            ]
        );
        if (file.length > 0) {
            done();
        } else {
            throw new Error("No files found");
        }
    });
});