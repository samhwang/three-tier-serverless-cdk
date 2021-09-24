async function fetchGraphQL(query: string) {
    const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query,
        }),
    });

    return response.json();
}

export default fetchGraphQL;
