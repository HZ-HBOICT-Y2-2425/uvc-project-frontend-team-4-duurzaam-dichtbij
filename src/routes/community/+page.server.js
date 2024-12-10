export async function load() {
    const events = await fetch('http://localhost:3010/events/events').then(res => res.json());
    return { events };
}
