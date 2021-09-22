import { FC } from 'react';
import { graphql } from 'babel-plugin-relay/macro';
import { useLazyLoadQuery } from 'react-relay/hooks';
import { AppHelloQuery } from './__generated__/AppHelloQuery.graphql';

const HelloQuery = graphql`
    query AppHelloQuery {
        hello {
            message
            success
            errors
        }
    }
`;

const App: FC = () => {
    const data = useLazyLoadQuery<AppHelloQuery>(HelloQuery, {});
    const message = data.hello?.message;

    return (
        <div>
            <p>{message}</p>
        </div>
    );
};

export default App;
