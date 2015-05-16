'use strict';

import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import shouldComponentUpdate from 'react-pure-render/function';

class Component extends React.Component {
  constructor(props, data = {}) {
    super(props);

    this.initData(data);
  }

  initData(data = {}) {
    this.state = {
      data: Immutable.fromJS(data)
    };
  }
  get data() { return this.state.data; }
  updateData(updates) {
    if(typeof updates === 'function') {
      this.setState((prev, props) => {
        return { data: updates(prev.data, props) };
      });
    } else {
      this.setState({ data: Immutable.fromJS(updates) });
    }
  }

  createStateLink(field, onChangedCallback, withField = false) {
    return {
      value: Array.isArray(field) ? this.data.getIn(field) : this.data.get(field),
      requestChange: withField ? onChangedCallback.bind(this, field) : onChangedCallback.bind(this)
    };
  }

  static enableReactRouter(propName = 'router') {
    this.contextTypes = this.contextTypes || {};
    this.contextTypes.router = PropTypes.func;

    Object.defineProperty(this.prototype, propName, {
      configurable: true,
      enumerable: false,
      get: function router() { return this.context.router; }
    });
  }

  static enablePureRender() {
    Object.defineProperty(this.prototype, 'shouldComponentUpdate', {
      configurable: true,
      enumerable: false,
      writable: true,
      value: shouldComponentUpdate
    });
  }

}

export default Component;
