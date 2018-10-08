import BasePage from '/modules/page/BasePage';
import pageComponent from "./pageComponent";
export default class Page extends BasePage {
    static component = pageComponent;

    /**
     * 自定义监控、上报等模块
     */

    static reducer = {
        "default": () => ({})
    };
}