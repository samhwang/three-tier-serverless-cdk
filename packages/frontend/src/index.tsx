import { StrictMode, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { RelayEnvironmentProvider } from 'react-relay';
import App from './App';
import reportWebVitals from './reportWebVitals';
import relayEnvironment from './relay/environment';

const render = async () => {
    if (process.env.NODE_ENV === 'development') {
        const { worker } = await import('./mocks/browser');
        worker.start();
    }

    const IndexComponent = (
        <StrictMode>
            <RelayEnvironmentProvider environment={relayEnvironment}>
                <Suspense fallback="loading...">
                    <App />
                </Suspense>
            </RelayEnvironmentProvider>
        </StrictMode>
    );

    const rootElement = document.getElementById('root');

    ReactDOM.render(IndexComponent, rootElement);

    // If you want to start measuring performance in your app, pass a function
    // to log results (for example: reportWebVitals(console.log))
    // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
    reportWebVitals();
};

render();
