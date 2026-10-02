'use strict'

// Checks the corpus against itself: unique ids, a resolvable replyTo, and
// levels on the correct side of the entry. No dependencies.

const assert = require('node:assert/strict')
const { fixtures } = require('..')

const ids = new Set()
for (const f of fixtures) {
  assert.ok(!ids.has(f.id), `duplicate id ${f.id}`)
  ids.add(f.id)
}

let checked = 0
for (const f of fixtures) {
  const e = f.expected
  if (f.replyTo && f.source === 'spec' && e.type === 'details') {
    assert.ok(ids.has(f.replyTo), `${f.id}: replyTo ${f.replyTo} is not a fixture`)
  }
  if (e.type === 'modification') continue

  assert.ok(e.takeProfits.length <= 6, `${f.id}: more than six targets`)
  if (e.entry.kind === 'zone') {
    assert.ok(e.entry.low < e.entry.high, `${f.id}: zone low must be below high`)
  }
  if (e.type !== 'new_trade' || e.entry.kind === 'market') continue

  const low = e.entry.kind === 'zone' ? e.entry.low : e.entry.price
  const high = e.entry.kind === 'zone' ? e.entry.high : e.entry.price
  if (e.direction === 'buy') {
    if (e.stopLoss !== null) assert.ok(e.stopLoss < low, `${f.id}: buy stop must sit below the entry`)
    for (const tp of e.takeProfits) assert.ok(tp > high, `${f.id}: buy target ${tp} must sit above the entry`)
  } else {
    if (e.stopLoss !== null) assert.ok(e.stopLoss > high, `${f.id}: sell stop must sit above the entry`)
    for (const tp of e.takeProfits) assert.ok(tp < low, `${f.id}: sell target ${tp} must sit below the entry`)
  }
  checked += 1
}

console.log(`${fixtures.length} fixtures loaded, ${checked} priced trades checked for level order`)
