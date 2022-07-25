# Staked Celo Web App

### Development

Installation: `yarn install`
Running local server: `yarn dev`

### Build

In order to build for specific environment run:
```bash
NODE_ENV=production|development yarn build
```

Production environment uses Celo Mainnet while development uses Celo Alfajores.

Env variables for each environment are defined in `.env.{environment}` files:
- **NEXT_PUBLIC_MANAGER_ADDRESS** - address of Manager contract
- **NEXT_PUBLIC_STAKED_CELO_ADDRESS** - address of StakedCelo contract
- **NEXT_PUBLIC_ACCOUNT_ADDRESS** - address of Account contract
- **NEXT_PUBLIC_API_URL** - URL of API for triggering withdrawal and claiming

## License

This project is licensed under [Apache 2.0](LICENSE).
