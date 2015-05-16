ReactX [![NPM version][npm-image]][npm-url] [![Build Status][ci-image]][ci-url] [![Dependency Status][depstat-image]][depstat-url]
================

> ReactX is a [React.js] extension library, add missing features form React.js

## Install

Install using [npm][npm-url].

    $ npm install reactx --save

## React Compatibility

ReactX is designed to be fully backward compatible with React, which can be used as drop in replacement of React without any code change.

All neat features are included automatically.

```js
// import React from 'react';
import React from 'reactx';

// No code need to be updated
class MyComponent extends React.Component {
  ...
}
```

## ReactX.Component

`ReactX.Component` is a ES6 style Component base class, bundled with wanted features.

```js
import React from 'reactx';

class MyComponent extends React.Component {
  render() {
    return <span>ReactX Component is cool</span>;
  }
}
```

### Immutable state `this.data`

ReactX componet built in some methods to make it easier to use [immutable.js] as state in `Component`.

It follows the [approach](https://github.com/facebook/immutable-js/wiki/Immutable-as-React-state) that recommended by Facebook.

To distinguish the immutable state from normal ReactX state, the new property is called `data`.

```js
render() {
  return <span>{this.data.get('text')}</span>;
}
```
**CAUTION**  
Unlike `this.state`, `this.data` is not readonly, following code cause error.
```js
this.data = {text: 'new Text'};
```

**HINT**  
Data and its children are immutable objects, which might not be accepted by other components or libraries. You might need to call `this.data.toJS()` to convert it to normal object.

```js
render() {
  return <ChildComponent {...this.data.toJS()} className={this.data.cssClasses.toJS()} />;
}
```

#### Initialize data with constructor

The data can be initialized by calling super's constructor.

The value provided will be converted into immutable object automatically.

```js
import React from 'reactx';

class MyComponent extends React.Component {
  constructor(props) {
    super(props, {
      text: 'Text initialized'
    });
  }

  render() {
    return <span>{this.data.get('text');}</span>;
    // renders <span>Text initialized</span>
  }
}
```

**HINT**  
The second parameter is optional, `this.data` will be initialized with `{}` if nothing provided.
```js
import React from 'reactx';

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <span>{JSON.stringify(this.data.toJS())}</span>;
    // renders <span>{}</span>
  }
}
```

**CAUTION**  
If build your own abstract component based on `ReactX.Component`, make sure you constructor keep the following signature.

```js
import React from 'reactx';

class BaseComponent extends React.Component {
  constructor(props, initData={}) {
  }
}
```

#### Initialize data with `initData`

Besides the constructor, the data can also by initialized by calling `initData` method.

The value provided will be converted into immutable object automatically.

```js
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.initData({
      text: 'Text initialized'
    });
  }

  render() {
    return <span>{this.data.get('text');}</span>;
    // renders <span>Text initialized</span>
  }
}
```

**CAUTION**  
Do not swap usage of `this.updateData` with `this.initData`, although they behaves similar but the actually have quite different implementation. [Here](https://facebook.github.io/react/docs/component-specs.html#updating-shouldcomponentupdate) explains why.

#### Update Data

Similar to `setState`, `ReactX.Component` provides `updateData` to manipulate data.

**CAUTION**  
Always update data or state by `updateData` or `setState` methods, or you might break React's life cycle management.

```js
// this.data = {}
this.updateData({ name: 'Tim', hobbies: ['coding', 'coding', 'coding'] }); // Set a whole new value
// this.data = { name: 'Tim', hobbies: ['coding', 'coding', 'coding'] }
this.updateData({ name: 'Suca' }); // Replace previous value with new one
// this.data = { name: 'Suca' }
this.updateData(data=>data.set('hobbies', ['relics'])); // Quick update previous
// this.data = { name: 'Suca', 'hobby', 'relics' };
this.updateData((data, props) => { // A complex update
  let totalScore = props.scores.reduce((sum, score)=>sum+score, 0);
  return data.withMutations(d=>d.mergeIn(['hobbies'], props.newHobbies).set('averageScore', totalScore/props.scores.length));
});
```
For more available methods, check [immutable.js official document](http://facebook.github.io/immutable-js/docs/#/).

### State Link

When dealing with form inputs, React provides [State Link], but it is provides as Mixin, which isn't supported by ES6 syntax.

So `ReactX.Component` provides `createStateLink` to create state link.

```js
import React from 'reactx';

class MyComponent extends React.Component {
  render() {
    return (
      <div>
        <input type='checkbox' checkedLink={this.createStateLink('featureEnabled', this.toggleFeature)} />
        <input type='text' valueLink={this.createStateLink('name', this.nameChanged)}
      </div>
    );
  }

  get featureEnabled() {
    return this.data.get('featureEnabled');
  }
  toggleFeature(value) {
    this.updateData(data=>data.set('featureEnabled', value));
  }

  get name() {
    return this.data.get('name');
  }
  nameChanged(name) {
    this.updateData(data=>data.set('name', name));
  }
}
```

**HINT** `createStateLink` binds `this` for you automatically. So you don't need to worry about the `this`.

#### Deal with value group

When deal with input group, usually it shares same change handler across inputs.
So in the `handler`, it is important to know which input triggers the event.

By specify the 3rd parameter of `createStateLink` to true, enable `ReactX.Component` to pass `property name` to callback.

```js
import React from 'reactx';

class MyComponent extends React.Component {
  render() {
    return (
      <div>
        <input type='checkbox' checkedLink={this.createStateLink('featureA', this.toggleFeature, true)} />
        <input type='checkbox' checkedLink={this.createStateLink('featureB', this.toggleFeature, true)} />
        <input type='checkbox' checkedLink={this.createStateLink('featureC', this.toggleFeature, true)} />
        <input type='checkbox' checkedLink={this.createStateLink('featureD', this.toggleFeature, true)} />
      </div>
    );
  }

  toggleFeature(featureName, value) {
    // featureName corresponding to the first value passed to createStateLink.
    this.updateData(data=>data.setIn(['features', featureName], name));
  }
}
```

### Pure Render Component

[Pure Render] component usually means:

* Clean design
* Testability
* Performance Boost

But to make a component Pure Render isn't that easy in ES6 style syntax. So `ReactX.Component` provides `enablePureRender` static method.

```js
import React from 'reactx';

class MyPureRenderComponent extends React.Component {
  ...
}
MyPureRenderComponent.enablePureRender();
```
Under the hood, `enablePureRender` method wraps up [react-pure-render], make it more accessible without relaying on ES7 draft syntax and mixin.

### React Router integration

Again, [react-router] is a popular router solution, which provides clean syntax to add routing mechanism to react app.
But some of its feature heavily depends on Mixin, which is not available in ES6 syntax.

So `ReactX.Component` provides `enableReactRouter` utility method to solve the issue. It expose `router` property to access `react-router` instance.

```js
import React from 'reactx';

class MyComponent extends React.Component {
  onLogOutButtonClicked() {
    this.router.transitionTo('logout');
  }
}
MyComponent.enableReactRouter();
```

**HINT**  
If you have already declared `router` property on your Component, you can ask `ReactX.Component` to expose `react-router` with a different property.

```js
import React from 'reactx';

class MyComponent extends React.Component {
  get router() {
    return this.data.get('serverRouter');
  }

  onLogOutButtonClicked() {
    this.reactRouter.transitionTo('logout'); // Access react-router via reactRouter instead of default router
  }
}
MyComponent.enableReactRouter('reactRouter');
```

### MixIn

Although MixIn is not supported by ES6 syntax, and which can be replace with High Order Component. But due to a lot of existing libraries are strongly depends on Mixin. So it is import to have it.

`ReactX.Component` provides `includeSimpleMixIn` to enable developer mount existing mixin onto ES6 style Component with some limitation.

#### Simple MixIn

The major criticism on Mixin focused on it messing up the life-cycle callbacks and state/property initialization. Except that, mixin is still the most convenient way to abstract concerns.

`ReactX.Component` support mixin with some tradeoff. It doesn't merge the state/property initialization automatically. It also doesn't dispatch life cycle to multiple method automatically. It leaves all these stuff to developer, enable developer to have a better control on the code.

```js
import React from 'reactx';

const SimpleMixIn = {
  get averageScore() {
    return this.scores.reduce((sum, score) => sum + score, 0) / this.scores.length;
  }
}

class MyComponent extends React.Component {
  get scores() {
    return this.data.get('scores');
  }

  render() {
    return <span>{this.averageScore()}</span>;
  }
}

MyComponent.includeSimpleMixIn('SimpleMixIn');
```

#### getInitialState, getDefaultProps, propTypes, contextTypes

TODO

#### Prefix and Lifecycle callbacks

TODO

#### Name Conflict

TODO

## ReactX.PropertyBinder

In Flux architecture application, to consume `Store` data in `Component` isn't a straightforward as it sounds. Different Flux Implementations provides different approaches.

When you try to apply these solutions, you might quickly find:

* They require modifications to my Component
* They depend on MixIns, which is not supported by ES6 style Component
* They creates wrapper class
* The connection between Component and Store are hidden
* They add additional dependencies to my Component
* They add external state to my Component, which makes it not a [Pure Render] any more.
* They make my Component hard to test
* They make my Component hard to reuse
* They just don't feel right to me!

If you feel disappointed about the solutions, `PropertyBinder` might be what you're looking for.

### Property Binding

Suppose I have a `RoleList` component that renders a list of roles, and which is a pure render component.
So I can easily using [React Dev Tools] play with it.

```html
<RoleList playerCount={RoleConfigStore.playerCount}
          roleCount={RoleConfigStore.roleCount}
          roleSchema={RoleConfigStore.roleSchema}
          error={RoleConfigStore.validationError} />
```

When finished the Component, to connect it to `RoleConfigStore`, it can be done as following code describes

```html
<PropertyBinder source={RoleConfigStore}
                binding={{
                  playerCount: 'playerCount',
                  roleCount: 'roleCount',
                  roleSchema: 'roleSchema',
                  error: 'validationError'
              }}>
  <RoleList/>
</PropertyBinder>
```
It bounds `RoleConfigStore` state to RoleList's property lists. And the binding relation can be express in HTML syntax.
When `RoleConfigStore` updated, the RoleList proper will updated correspondingly.

### Binding to all kind of sources

`PropertyBinder` doesn't require the type of source, theoretically it works with all kind of source/stores. It even works with plain objects without auto-refresh.

`PropertyBindiner` will try to hook `addChangeListener` on object on source, but this behavior can be overrode by specify `listenerHook` on `PropertyBinder`.

```html
// Bound to RoleConfigStore with listenTo method
<PropertyBinder listenerHook="listenTo"
                source={RoleConfigStore}
                binding={{
                  playerCount: 'playerCount',
                  roleCount: 'roleCount',
                  roleSchema: 'roleSchema',
                  error: 'validationError'
                }}>
  <RoleList/>
</PropertyBinder>
```
```html
// Disable Property Update, and bind to plain object
<PropertyBinder listenerHook={false}
                source={{
                  playerCount: 1,
                  roleCount: 1,
                  roleSchema: { name: 'Admin' },
                  validationError: null
                }}
                binding={{
                  playerCount: 'playerCount',
                  roleCount: 'roleCount',
                  roleSchema: 'roleSchema',
                  error: 'validationError'
                }}>
  <RoleList/>
</PropertyBinder>
```

### Bind to multiple source

`PropertyBinder` also support multiple sources, when you specify `multiSource`

```html
<PropertyBinder multiSource
                source={{UserStore, RoleConfigStore}}
                binding={{
                  UserStore: { isUsersValid: 'isValid' },
                  RoleConfigStore: { isRoleConfigValid: 'isValid' }
                }}>
  <ControlPanel />
</PropertyBinder>

// Previous code applies following binding to ControlPanel

<ControlPanel isUsersValid={UserStore.isValid}
              isRoleConfigValid={RoleConfigStore.isValid} />
```

## License
MIT

[![NPM downloads][npm-downloads]][npm-url]

[homepage]: https://github.com/timnew/reactx

[npm-url]: https://npmjs.org/package/reactx
[npm-image]: http://img.shields.io/npm/v/reactx.svg?style=flat
[npm-downloads]: http://img.shields.io/npm/dm/reactx.svg?style=flat

[ci-url]: https://drone.io/github.com/timnew/reactx/latest
[ci-image]: https://drone.io/github.com/timnew/reactx/status.png

[depstat-url]: https://gemnasium.com/timnew/reactx
[depstat-image]: http://img.shields.io/gemnasium/timnew/reactx.svg?style=flat

[React.js]: https://facebook.github.io/react/index.html
[immutable.js]: http://facebook.github.io/immutable-js/
[Pure Render]: https://facebook.github.io/react/docs/pure-render-mixin.html
[react-pure-render]: https://github.com/gaearon/react-pure-render
[React Dev Tools]: https://github.com/facebook/react-devtools
[react-router]: https://github.com/rackt/react-router
