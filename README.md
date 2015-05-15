ReactX [![NPM version][npm-image]][npm-url] [![Build Status][ci-image]][ci-url] [![Dependency Status][depstat-image]][depstat-url]
================

> ReactX is a React.js extension library, add missing features form React.js

## Install

Install using [npm][npm-url].

    $ npm install reactx --save

## Usage

### ReactX.Component

React Component with Immutable style state

### Reactx.PropertyBinder

Binding store data to React Component as properties, and get updated with values changed in store.

```jsx
<PropertyBinder source={RoleConfigStore}
                binding={{
                  playerCount: 'playerCount',
                  roleCount: 'roleCount',
                  roleSchema: 'roleSchema',
                  error: 'validationError'
              }}>
  <RoleTable/>
</PropertyBinder>
/*
<RoleTable playerCount={RoleConfigStore.playerCount}
           roleCount={RoleConfigStore.roleCount}
           roleSchema={RoleConfigStore.roleSchema}
           error={RoleConfigStore.validationError} />
*/
```

#### MultiSource
```jsx
<PropertyBinder multiSource
                source={{UserStore, RoleConfigStore}}
                binding={{
                  UserStore: { isUsersValid: 'isValid' },
                  RoleConfigStore: { isRoleConfigValid: 'isValid' }
                }}>
  <ControlPanel />
</PropertyBinder>
/*
<ControlPanel isUsersValid={UserStore.isValid}
              isRoleConfigValid={RoleConfigStore.isValid} />
*/
```

### shouldComponentUpdate
```jsx
import React from 'react';
import {shouldComponentUpdate} from 'reactx';

class PureRenderComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  shouldComponentUpdate = shouldComponentUpdate;
}
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
[Immutable.js]: http://facebook.github.io/immutable-js/
[react-pure-render]: https://github.com/gaearon/react-pure-render
