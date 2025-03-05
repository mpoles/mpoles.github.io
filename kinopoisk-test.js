async function fetchData(url) {
    const response = await fetch(url, {
        headers: { 'X-API-KEY': '16TN8FF-YN5M1NN-HZNRG1F-HAX3JE2' }
    });
    return response.json();
}

async function main() {
    const rawData = await fetchData('https://api.kinopoisk.dev/v1.4/movie?page=1&limit=250&selectFields=externalId&selectFields=name&selectFields=year&selectFields=rating&selectFields=poster&selectFields=lists&notNullFields=externalId.tmdb&sortField=rating.kp&sortType=-1&lists=top500');
    const movies1 = processItems(rawData.docs);

}

function processItems(items, type) {
    return items.map(item => ({
        title: item.name,
        year: item.year,
        rating: item.rating?.kp,
        poster: item.poster?.url,
        tmdb_id: item.externalId?.tmdb,
        type: 'movie'
    }));
}

main();
