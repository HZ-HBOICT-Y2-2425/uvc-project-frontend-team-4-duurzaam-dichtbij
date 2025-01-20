export async function load({ params }) {
    let { event } = params;
    event = await fetch(`http://localhost:3010/events/event/${event}`).then(async res => await res.json());
    return { event };
}