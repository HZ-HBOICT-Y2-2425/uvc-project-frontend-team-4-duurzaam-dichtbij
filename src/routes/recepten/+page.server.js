export const load = async (/** @type {{ fetch: any; }} */ serverLoadEvent) => {
    try {
        const { fetch } = serverLoadEvent;
        const res = await fetch(`http://localhost:3011/recipes`);
        const items = await res.json();
        return { items };
    } catch (error) {
        return {
            error,
        };
    }
};
