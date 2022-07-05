# Civilization App Frontend

### How to SETUP

1. Git Clone https://github.com/CivilizationCIV/fund-frontend
3. cd into the repository
4. Git pull
5. Change .env.example to .env and set the variables; API_HOST=http://localhost:3000 if you have node running locally, otherwise API_HOST=http://dev-api.civfund.org (for HOTJAR and GOOGLE_ANALYTICS any value will be ok for dev)
6. Run yarn install or npm install
7. Run yarn serve or start.bat to launch locally on http://localhost:8080 & after a couple minutes, will be available from browser at that address

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### How to DEPLOY on live

1. SSH 157.90.174.199
2. Git Clone https://github.com/CivilizationCIV/fund-frontend (first time only) or `cd /fund-frontend`
3. cd into the repository
4. Git pull
5. Run `docker-compose up --build -d`

### API instructions for FARM view

# GET  API
- Returns => All Farm Pools on the following format

farmPools: [
        {
          id: xx,
          first_coin: {
              id: xx,
              name: xx
          },
          second_coin: {
              id: xx,
              name: xx
          },
          is_nft: true, -> Type Boolean
          url: ["xx","xx"], -> Url of Icons (2 max)
          text: "CIV > ONE", -> Type String (if not possible to get coin 1 and coin 2)
          deposited_amount: "xx.x",
          deposited_converted_amount: "xx.x",
          deposited_currency: "CIV", -> currency example
          yield_amount: "xx.x",
          yield_currency: "ONE", -> currency example
          yield_converted_amount: "xx.x",
          tvl_amount: "xx.x",
          tvl_amount_currency: "$", -> currency example
          tvl_converted_amount: "xx.x",
          tvl_currency: "LP", -> currency example
          apr: "xx.x",
          wallet_civ: "xx.x",
          wallet_usd: "xx.x",
          other extra data needed for backend ...
        },
      ],

- Above I have included an JSON example about the api response I am supposed to get on the front-end.
- I have included only the data I need to make it functional according to front-end.