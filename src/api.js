const API_KEY =
    "444e219b9ab566cb08816218971dd62b24e68c4f824f8ffd78ddcbdddbced0b2";

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