# Telegram signal test corpus

Fixtures for software that reads Telegram trading signals. Each fixture is one message as a channel would post it, paired with the reading this corpus proposes for it: direction, symbol, entry, stop loss, take-profit levels, and whether a target was left open.

There is no standard for how a trading signal is written, so every parser is tested against whatever its author happened to see. This corpus is a shared starting point. It accompanies [telegram-signal-format](https://github.com/lukacsaron/telegram-signal-format), the written specification, and is published by the team behind [TTMT – Telegram to MetaTrader](https://telegramtometatrader.com/?utm_source=github&utm_medium=owned&utm_campaign=signal-test-corpus).

## What is in it

| Path | Contents |
|---|---|
| `fixtures/*.json` | 16 fixtures, one message each |
| `schema/fixture.schema.json` | JSON Schema (draft 2020-12) for a fixture |
| `index.js` | loads the fixtures and the schema for Node |
| `test/check.js` | checks the corpus against itself |
| `huggingface/` | the same fixtures as one JSONL file, with a dataset card |

Eleven fixtures are message shapes quoted in the specification (`"source": "spec"`), which were taken from live channels. Five are written for this corpus to exercise one tolerance rule each (`"source": "synthetic"`), and say so.

## A fixture

```json
{
  "id": "named-zone-with-runner",
  "source": "spec",
  "layout": "named zone on its own line",
  "message": "GOLD BUY SETUP\n\nGold Buy Zone 4438 - 4433\n\nSL: 4428\n\nTP1: 4443\nTP2: 4448\nTP3: 4453\nTP4: Hold",
  "expected": {
    "type": "new_trade",
    "direction": "buy",
    "symbol": "XAUUSD",
    "entry": { "kind": "zone", "low": 4433, "high": 4438 },
    "stopLoss": 4428,
    "takeProfits": [4443, 4448, 4453],
    "runner": true
  }
}
```

`expected.type` is one of:

- `new_trade`: a message that opens a trade. `entry.kind` is `market`, `price`, or `zone`. `stopLoss` is `null` when the message writes no stop.
- `details`: the second half of an alert-then-details pair. It carries no direction or symbol; both come from the message named in `replyTo`.
- `modification`: an instruction about a trade that is already open, such as moving the stop to breakeven.

## Use it

```bash
git clone https://github.com/lukacsaron/telegram-signal-test-corpus.git
cd telegram-signal-test-corpus
npm test
```

In a Node test suite:

```js
const { fixtures } = require('telegram-signal-test-corpus')

for (const fixture of fixtures) {
  test(fixture.id, () => {
    expect(parse(fixture.message)).toEqual(fixture.expected)
  })
}
```

Any other language can read the JSON files directly, or the single `huggingface/fixtures.jsonl`.

## What the expected values are, and are not

The expected values were written by hand from the specification. They are not the output of TTMT's parser, and passing this corpus does not mean a parser behaves as TTMT does.

One fixture, `bare-inline-repeated-tp`, is ambiguous on purpose: the line `TP 4350 OPEN` can be read as a fourth target plus a runner, or as a runner alone. Its `note` field says which reading the corpus chose and that the other is defensible. Disagreeing with a fixture is a reasonable thing to open an issue about.

## Contributing

Pull requests with new message shapes are welcome. Three rules:

- Remove the channel name and anything that identifies it.
- No screenshots of private channels and no performance claims about any channel.
- `npm test` passes, and the fixture validates against the schema.

## Licence and publisher

MIT. Published by jazzrabbit OÜ (registry code 16489902, Estonia), the company that operates TTMT – Telegram to MetaTrader. Nothing here is financial advice.
