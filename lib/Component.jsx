'use strict';

import React from 'react';
import Immutable from 'immutable';

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
}

export default Component;
