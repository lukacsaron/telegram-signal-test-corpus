'use strict'

const fs = require('node:fs')
const path = require('node:path')

const dir = path.join(__dirname, 'fixtures')

const fixtures = fs
  .readdirSync(dir)
  .filter((name) => name.endsWith('.json'))
  .sort()
  .map((name) => JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8')))

const schema = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'schema', 'fixture.schema.json'), 'utf8'),
)

module.exports = { fixtures, schema }
