import { RequestParameters, Variables } from 'relay-runtime';

const fetchGraphQL = async (
    query: RequestParameters['text'],
    variables: Variables
) => {
    const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    });

    return response.json();
};

export default fetchGraphQL;
