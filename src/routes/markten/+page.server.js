export async function load() {
    const markets = await fetch('http://localhost:3010/markets/markets').then(res => res.json());
    return { markets };
}
