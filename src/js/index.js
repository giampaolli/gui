/* global document */
import React from 'react';
import { render } from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import App from './App';

render(
    <I18nextProvider i18n={i18n}>
        <App />
    </I18nextProvider>,
    document.getElementById('app'),
);
