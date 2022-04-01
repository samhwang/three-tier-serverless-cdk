import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
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

    const root = createRoot(document.getElementById('root')!);
    root.render(RootComponent);
}

renderRoot();
