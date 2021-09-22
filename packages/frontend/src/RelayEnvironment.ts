import {
    FetchFunction,
    Environment,
    Network,
    RecordSource,
    Store,
} from 'relay-runtime';
import fetchGraphQL from './fetchGraphQL';

const fetchRelay: FetchFunction = (params: any) => {
    console.log(`fetching query ${params.name}`);
    return fetchGraphQL(params.text);
};

const recordSource = new RecordSource();
const store = new Store(recordSource);
const network = Network.create(fetchRelay);

const RelayEnvironment = new Environment({
    network,
    store,
});

export default RelayEnvironment;
