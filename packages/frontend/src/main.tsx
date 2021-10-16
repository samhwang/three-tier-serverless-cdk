import { StrictMode, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { RelayEnvironmentProvider } from 'react-relay';
import relayEnvironment from './relay/environment';
import App from './components/App';

async function renderRoot() {
    if (import.meta.env.DEV) {
        const { worker } = await import('./mocks/browser');
        worker.start();
    }

    const RootComponent = (
        <StrictMode>
            <Suspense fallback="loading...">
                <RelayEnvironmentProvider environment={relayEnvironment}>
                    <App />
                </RelayEnvironmentProvider>
            </Suspense>
        </StrictMode>
    );

    ReactDOM.render(RootComponent, document.getElementById('root'));
}

renderRoot();
