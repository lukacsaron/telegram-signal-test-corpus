---
license: mit
language:
  - en
pretty_name: Telegram signal test corpus
size_categories:
  - n<1K
task_categories:
  - token-classification
  - text-classification
tags:
  - finance
  - trading
  - telegram
  - information-extraction
  - parsing
configs:
  - config_name: default
    data_files:
      - split: test
        path: fixtures.jsonl
---

# Telegram signal test corpus

16 Telegram trading-signal messages, each paired with a proposed structured reading: direction, symbol, entry, stop loss, take-profit levels, and whether a target was left open. It is a test set for extraction, far too small to train on.

Eleven messages are shapes quoted in the [Telegram signal format specification](https://github.com/lukacsaron/telegram-signal-format), taken from live channels with the channel removed. Five are synthetic, written to exercise one tolerance rule each, and are marked `source: synthetic`.

## Fields

| Field | Type | Meaning |
|---|---|---|
| `id` | string | fixture id |
| `source` | string | `spec` or `synthetic` |
| `layout` | string | which layout or rule the message illustrates |
| `message` | string | the message text, newlines preserved |
| `reply_to` | string or null | the message this one replies to |
| `note` | string or null | why the reading is what it is, where that is not obvious |
| `expected` | string | the proposed reading, JSON-encoded |

`expected` is JSON-encoded because its shape differs by message type (`new_trade`, `details`, `modification`). The JSON Schema is in the [source repository](https://github.com/lukacsaron/telegram-signal-test-corpus).

## Limits

The expected values were written by hand from the specification. They are not the output of any production parser. All price examples are gold (XAUUSD), because that is what the source channels post. One fixture is ambiguous on purpose and says so in its `note`.

## Source and publisher

Maintained at [github.com/lukacsaron/telegram-signal-test-corpus](https://github.com/lukacsaron/telegram-signal-test-corpus). Published by jazzrabbit OÜ (registry code 16489902, Estonia), the company that operates [TTMT – Telegram to MetaTrader](https://telegramtometatrader.com/?utm_source=huggingface&utm_medium=owned&utm_campaign=signal-test-corpus). Nothing here is financial advice.
