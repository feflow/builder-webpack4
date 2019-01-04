const glob = require('glob-all');
const outDir = require('./feflow.json').builderOptions.outDir;
describe('checking generated file exists', function() {
    it('should generate webserver including html files', function(done) {
        var file = glob.sync(
            [
                `./${outDir}/webserver/category/index.html`
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
                `./${outDir}//cdn/category/index_*.js`,
                `./${outDir}//cdn/category/idnex_*.css`,
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
                `./${outDir}//offline/offline.zip`
            ]
        );
        if (file.length > 0) {
            done();
        } else {
            throw new Error("No files found");
        }
    });
});