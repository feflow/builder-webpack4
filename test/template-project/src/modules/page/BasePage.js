import React, {
    Component
} from "react";
import ReactDOM from 'react-dom';
import {
    Provider,
    connect
} from "react-redux";
import pageStore from "../globalStore/Store";

export default class BasePage {

    static store;
    static conainerId = "container";
    static mapStateToProps = (state) => state;
    static reducer;
    static middlewares = [];

    static warning(condition, format) {
        if (!condition) {
            for (var l = arguments.length, args = Array(l > 2 ? l - 2 : 0), _key = 2; _key < l; _key++) {
                args[_key - 2] = arguments[_key];
            }
            this._printWarning.apply(undefined, [format].concat(args));
        }
    }
    static _printWarning(format) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }
        var argIndex = 0;
        var message = "Warning: " + format.replace(/%s/g, function() {
            return args[argIndex++];
        });
        if (typeof console !== "undefined") {
            console.log(message);
        };
    }
    static renderPage() {
        let reactRedux = this.providerConnect();
        let container = document.getElementById(this.conainerId);
        window._T.page_main_end = new Date();
        ReactDOM.render(reactRedux, container, (component) => {
            console.log('首屏渲染成功');
        });
    }

    static providerConnect() {
        let Children = connect(this.mapStateToProps,
            this.mapDispatchToProps,
            this.mergeProps,
            this.options
        )(this.component);
        let store = pageStore(this.reducer, this.middlewares);
        return <Provider store={store}><Children/></Provider>;
    }
}