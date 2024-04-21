import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';

import App from './App.jsx';
import './index.css';

const colorPrimary = '#463aa2';
const colorWhite = '#FFFFFF';
const colorSider = '#f2f7ff';
const colorNeutral = '#021431';

const theme = {
    token: {
        colorPrimary,
        colorNeutral,

        // Custom Colors
        colorWhite,
        colorSider,
    },
    components: {
        Layout: {
            lightSiderBg: colorSider,
            lightTriggerBg: colorSider,
            headerBg: colorSider,
        },
        Menu: {
            itemHeight: 59,
            itemBg: colorSider,
            fontSize: 15,
        },
    },
};


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ConfigProvider theme={theme}>
            <App />
        </ConfigProvider>
    </React.StrictMode>,
);
