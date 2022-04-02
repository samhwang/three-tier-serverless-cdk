import { useLazyLoadQuery, graphql } from 'react-relay';
import { AppQuery } from './__generated__/AppQuery.graphql';

const HelloQuery = graphql`
    query AppQuery {
        hello {
            message
            success
            errors
        }
    }
`;

function App() {
    const data = useLazyLoadQuery<AppQuery>(HelloQuery, {});
    const message = data.hello?.message;

    return (
        <div>
            <p>{message}</p>
        </div>
    );
}

export default App;
