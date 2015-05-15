'use strict';

import {
  Children,
  DOM,
  // Component is ignored
  PropTypes,
  initializeTouchEvents,
  createClass,
  createElement,
  cloneElement,
  createFactory,
  createMixin,
  constructAndRenderComponent,
  constructAndRenderComponentByID,
  findDOMNode,
  render,
  renderToString,
  renderToStaticMarkup,
  unmountComponentAtNode,
  isValidElement,
  withContext,
  __spread,
  version
} from 'react';

import Component from './lib/Component';
import shouldComponentUpdate from 'react-pure-render/function';
import PropertyBinder from './lib/PropertyBinder';

export default {
  //React Members, Component is not included
  Children,
  DOM,
  PropTypes,
  initializeTouchEvents,
  createClass,
  createElement,
  cloneElement,
  createFactory,
  createMixin,
  constructAndRenderComponent,
  constructAndRenderComponentByID,
  findDOMNode,
  render,
  renderToString,
  renderToStaticMarkup,
  unmountComponentAtNode,
  isValidElement,
  withContext,
  __spread,
  version,
  // ReactX Members
  Component,
  PropertyBinder,
  shouldComponentUpdate
};
