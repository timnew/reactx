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

  static includeSimpleMixIn(mixin, options = {}) {
    let names = Object.getOwnPropertyNames(mixin);
    let {omits, prefix} = options;
    for(let name in names) {
      if(omits && name in omits) {
        continue;
      }
      let newName = name;
      if(name in ['getInitialState', 'getDefaultProps', 'propTypes', 'contextTypes']) {
        console.warn(`Spec ${name} in mixin is not suppored by ES6 style component ignored.`);
        continue;
      }

      if(name in ['componentWillMount', 'componentDidMount', 'componentWillReceiveProps', 'componentWillUpdate', 'componentDidUpdate', 'componentWillUnmount']) {
        if(prefix) {
          newName = prefix + name;
        } else {
          console.error(`Life cycle hook ${name} is found, but prefix isn't provided, ignored`);
          continue;
        }
      }
      if(Object.getOwnPropertyDescriptor(this.prototype, newName)) {
        console.error(`Class member ${newName} has been declared`);
      }
      let desciptor = Object.getOwnPropertyDescriptor(mixin, name);
      Object.defineProperty(this.prototype, newName, desciptor);
    }
  }
}

export default Component;
