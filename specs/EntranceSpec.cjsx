describe 'reactx', ->
  reactx = require('../reactx')

  it 'should export Component', ->
    reactx.Component.should.be.ok

  it 'should export PropertyBinder', ->
    reactx.PropertyBinder.should.be.ok

  it 'should export shouldComponentUpdate', ->
    reactx.shouldComponentUpdate.should.be.a.function
