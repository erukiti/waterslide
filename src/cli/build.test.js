const test = require('ava')

const a = 1
const b = 'hoge'
test('foo', t=> t.true(a + b === 'fuga'))
