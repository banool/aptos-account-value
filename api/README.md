# API

This is a basic server to provide an API to use the library. It uses tsoa (for OpenAPI) and express.

## Usage
Generate the code:
```
pnpm tsoa-generate
```

Run the API:
```
pnpm start
```

Query the API:
```
curl \
  'http://127.0.0.1:3002/accounts/value' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "network": "mainnet",
  "accountAddresses": [
    "0x1"
  ],
  "outputCurrency": "USD"
}'
```

You can explore the spec here: http://127.0.0.1:3002/spec.
