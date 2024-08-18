# Aptos Account Value

This repo primarily provides a library for determining the total value of an account. You can find that in [library/](library/).

I have built a simple UI on top of this library in [frontend/](frontend/). See it live at https://value.dport.me.

To make it possible to use this library from other languages I've made an API wrapping the library in [api/](api/).

## How does the library work?
1. You provide a list of addresses.
1. Per address, we look up assets on that account. See [library/src/fetchers/](library/src/fetchers/).
1. Once we have all the assets, we look up their value. Currently we just use CoinGecko. See [library/src/appraisers](library/src/appraisers).
1. Convert to the output currency.
1. Bingo bango bongo!

## An asset type is missing, how can I add it?
If it is a coin / fungible asset you can most likely just add an entry for it in [library/src/appraisers/gecko/lookup.ts](library/src/appraisers/gecko/lookup.ts). PRs are welcome! 🤠

If it's something more complicated than that you might need to add a new fetcher.

## Anything else I should know?
- We just support coins / fungible assets and staking right now.
- As usual I don't log anything, include any telemetry, etc. in any of this code.

## How do I contrinbute?
See [CONTRIBUTING.md](CONTRIBUTING.md).
