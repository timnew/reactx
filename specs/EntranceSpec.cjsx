describe 'ReactX', ->
  ReactX = require('../reactx')

  it 'should export react members', ->
    ReactX.DOM.should.be.ok
    ReactX.PropTypes.should.be.ok
    ReactX.Children.should.be.ok

  it 'should export Component', ->
    ReactX.Component.should.be.ok
    # Make sure Component is a ReactX Component
    Object.getOwnPropertyNames(ReactX.Component.prototype).should.include.members ['data', 'initData', 'updateData']

  it 'should export PropertyBinder', ->
    ReactX.PropertyBinder.should.be.ok

  it 'should export shouldComponentUpdate', ->
    ReactX.shouldComponentUpdate.should.be.a.function
