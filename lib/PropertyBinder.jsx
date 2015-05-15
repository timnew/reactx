'use strict';

import React, {PropTypes} from 'react';
import _ from 'lodash';

import Component from './Component';

class PropertyBinder extends Component {
 constructor(props) {
   super(props, {
     childProps: {},
     listeners: {}
   });
 }

 get source() { return this.props.source; }
 get binding() { return this.props.binding; }
 get multiSource() { return this.props.multiSource; }
 get childProps() { return this.data.get('childProps'); }
 get listeners() { return this.data.get('listeners'); }

 onSourceChanged(name) {
   let source = this.multiSource ? this.source[name] : this.source;
   let binding = this.multiSource ? this.binding[name] : this.binding;

   let updatedValues = _.mapValues(binding, (valuePath) => _.get(source, valuePath));

   this.updateData(data => data.mergeIn(['childProps'], updatedValues));
 }

 componentDidMount() {
   if(this.multiSource) {
     _.forEach(this.source, (source, name) => {
       this.registerListener(name, source);
       this.onSourceChanged(name);
     });
   }else {
     this.registerListener('default', this.props.source);
     this.onSourceChanged();
   }
 }

 registerListener(name, source) {
   this.updateData(data => data.setIn(['listeners', name], source[this.props.listenerHook](this.onSourceChanged.bind(this, name))));
 }

 componentWillUnmount() {
   this.listeners.forEach((listener) => listener.dispose());
   this.updateData((data) => data.set('listeners', {}));
 }

 render() {
   let childElement = React.Children.only(this.props.children);
   return React.cloneElement(childElement, this.childProps.toJS());
 }
}
PropertyBinder.propTypes = {
 source: PropTypes.object.isRequired,
 binding: PropTypes.oneOfType([
   PropTypes.objectOf(PropTypes.string),
   PropTypes.objectOf(PropTypes.objectOf(PropTypes.string))
 ]).isRequired,
 listenerHook: PropTypes.string,
 multiSource: PropTypes.bool
};
PropertyBinder.defaultProps = {
 listenerHook: 'addChangeListener',
 multiSource: false
};

export default PropertyBinder;
