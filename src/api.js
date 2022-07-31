const API_KEY =
    "09931619833507a99106a9f4d34788abdb7b2421e61fc907092fc9bfa5bd0aab";

const tickersHandlers = new Map();

const loadTickers = () => {
    if (tickersHandlers.size === 0) {
        return;
    }

    fetch(
        `https://min-api.cryptocompare.com/data/pricemulti?fsym=${[...tickersHandlers.keys()].join(",")}&tsyms=USD&api_key=${API_KEY}`
    )
        .then(r => r.json())
        .then(rawData => {
            const updatedPrices = Object.fromEntries(
                Object.entries(rawData).map(([key, value]) => [key, value.USD])
            );
            Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
                const handler = tickersHandlers.get(currency) ?? [];
                handler.forEach(fn => fn(newPrice));
            });
        });
};

export const subscribeToTicker = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || [];
    tickersHandlers.set(ticker, [...subscribers, cb]);
};

export const unsubscribeFromTicker = ticker => {
    tickersHandlers.delete(ticker);
};

setInterval(loadTickers, 5000)
window.tickersHandlers = tickersHandlers