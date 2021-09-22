import { StrictMode, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { RelayEnvironmentProvider } from 'react-relay';
import App from './App';
import reportWebVitals from './reportWebVitals';
import RelayEnvironment from './RelayEnvironment';

ReactDOM.render(
    <StrictMode>
        <RelayEnvironmentProvider environment={RelayEnvironment}>
            <Suspense fallback="loading...">
                <App />
            </Suspense>
        </RelayEnvironmentProvider>
    </StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
