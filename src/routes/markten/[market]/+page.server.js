export async function load({ params }) {
    let { market } = params;
    market = await fetch(`http://localhost:3010/markets/market/${market}`).then(async res => await res.json());
    return { market };
}