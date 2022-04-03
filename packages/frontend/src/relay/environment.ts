import {
  Environment,
  Network,
  RecordSource,
  Store,
  Variables,
  RequestParameters,
} from 'relay-runtime';
import fetchGraphQL from './fetchGraphQL';

const fetchRelay = (params: RequestParameters, variables: Variables) => {
  console.log(
    `fetching query ${params.name} with ${JSON.stringify(variables)}`
  );
  return fetchGraphQL(params.text, variables);
};

const recordSource = new RecordSource();
const store = new Store(recordSource);
const network = Network.create(fetchRelay);

const environment = new Environment({
  network,
  store,
});

export default environment;
