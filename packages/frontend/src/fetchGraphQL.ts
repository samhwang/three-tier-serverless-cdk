async function fetchGraphQL(query: string) {
    const response = await fetch('http://localhost:5000/graphql', {
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
