import "/assets/global/global";
import indexPage from "./index";

/**
 * @noWrap
 */
(function() {
    window._T.page_js_ready = new Date();

    var isRetry = +(window.location.href.includes('_retry') || 0);

    function init() {
        try {
            window._T.page_main_start = new Date();
            try {
                indexPage.renderPage();
            } catch (err) {
                throw err;
            }
        } catch (err) {
            if (!isRetry) {
                // 非重试失败
                console.log('init failed: ' + (err && err.toString() || ''), true);
                // 重试一下
                setTimeout(function() {
                    location.replace(location.href + (location.href.match(/\?/) ? '&' : '?') + '_retry=1');
                }, 2000);
            } else {
                // 重试失败
                console.log('retry init failed: ' + (err && err.toString() || ''), true);
            }
            // stop
            throw err;
        }
        // 重试成功
        if (isRetry) {
            console.log('retry init success');
        }
    }
    init();
})();