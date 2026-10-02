'use strict'

// Writes huggingface/fixtures.jsonl, one fixture per line, for dataset hosts
// that want a single flat file.

const fs = require('node:fs')
const path = require('node:path')
const { fixtures } = require('..')

const out = path.join(__dirname, '..', 'huggingface', 'fixtures.jsonl')
const lines = fixtures.map((f) =>
  JSON.stringify({
    id: f.id,
    source: f.source,
    layout: f.layout,
    message: f.message,
    reply_to: f.replyTo ?? null,
    note: f.note ?? null,
    expected: JSON.stringify(f.expected),
  }),
)
fs.writeFileSync(out, lines.join('\n') + '\n')
console.log(`wrote ${lines.length} lines to ${path.relative(process.cwd(), out)}`)
