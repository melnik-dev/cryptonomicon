const API_KEY =
    "09931619833507a99106a9f4d34788abdb7b2421e61fc907092fc9bfa5bd0aab";

export const loadTicker = tickers =>
    fetch(
        `https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${tickers.join(",")}&api_key=${API_KEY}`
    ).then(r => r.json());