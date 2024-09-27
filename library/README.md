# Aptos Account Value

[![NPM Package Downloads][npm-image-downloads]][npm-url]

> **This library is experimental**.

This library provides a way to calculate the total value of an Aptos account.

## Installation

```bash
pnpm install @banool/aptos-account-value
```

Install TS SDK v2:
```bash
pnpm install @aptos-labs/ts-sdk@1.27.0
```

## Usage

Create a client:

```ts
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const config = new AptosConfig({ network: Network.MAINNET });
const client = new Aptos(config);
```

Use the library:
```ts
import { getAccountValueMany, OutputCurrency } from "@banool/aptos-account-value";

await getAccountValueMany({
  client: client,
  accountAddresses: ["0x1", "0x2"],
  outputCurrency: OutputCurrency.USD,
});
```

[npm-url]: https://npmjs.org/package/@banool/aptos-account-value
