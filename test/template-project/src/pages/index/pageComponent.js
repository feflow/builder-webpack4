'use strict'
import './index.scss'
import './index.less'
import React, {
    Component
} from 'react';
import 'react-fastclick';
import Button from '@material-ui/core/Button';

export default class pageComponent extends Component {
    constructor(props, context) {
        super(props, context)
    }
    render() {
        return  (<div className="now-hybrid">
                    <Button variant="raised" color="primary">123</Button>
                </div>);
       
    }
}

