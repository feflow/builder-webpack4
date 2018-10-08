import {
    createStore,
    combineReducers,
    bindActionCreators,
    applyMiddleware,
    compose
} from "redux";
import thunkMiddleware from "redux-thunk";
let globaleStore = false;
let baseMiddlewares = [thunkMiddleware];
export default (reducers, middlewares = [], initalState = {}) => {
    if (globaleStore) {
        return globaleStore;
    }
    middlewares = baseMiddlewares.concat(middlewares);
    globaleStore = createStore(combineReducers(reducers), initalState, applyMiddleware.apply(null, middlewares));
    return globaleStore;
}