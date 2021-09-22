import { FC, useState, useEffect } from 'react';
import fetchGraphQL from './fetchGraphQL';

const App: FC = () => {
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        let isMounted = true;
        fetchGraphQL(`
        query HelloQuery {
            hello {
                message
                success
                errors
            }
        }
        `)
            .then((response) => {
                if (!isMounted) {
                    return;
                }

                const { message } = response.data.hello;
                setMessage(message);
            })
            .catch((error) => {
                console.error(error);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div>
            <p>{message !== '' ? message : 'Loading...'}</p>
        </div>
    );
};

export default App;
