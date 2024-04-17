import config from '../config';

import { objectToQueryString } from './general.js';
import { removeAuthenticated } from './localStorage.js';

const options = {
    cache: 'no-cache',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
    },
    referrerPolicy: 'no-referrer',
};

const needLogout = ({ meta, navigate, location }) => {
    const { pathname, search, hash } = location;

    const unauthorizedCodes = [4011, 4012, 4013];
    if (unauthorizedCodes.includes(meta.code) && pathname !== '/login') {
        removeAuthenticated();
        navigate(`/login?path=${pathname + search + hash}`, { replace: true });
        return;
    }
};

export const get = async ({ uri, query, navigate, location }) => {
    let queryString = '';

    if (query && Object.keys(query).length !== 0) {
        queryString = objectToQueryString(query);
    }

    try {
        const response = await fetch(`${config.api}${uri}${queryString}`, {
            ...options,
            method: 'GET',
        });

        const jsonResponse = await response.json();
        needLogout({
            meta: jsonResponse.meta,
            navigate,
            location,
        });

        return jsonResponse;
    } catch (error) {
        console.error(error);
    }
};

export const post = async ({ uri, query, body={}, navigate, location }) => {
    let queryString = '';
    
    if (query && Object.keys(query).length !== 0) {
        queryString = objectToQueryString(query);
    }

    try {
        const response = await fetch(`${config.api}${uri}${queryString}`, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body),
        });
    
        const jsonResponse = await response.json();
        needLogout({
            meta: jsonResponse.meta,
            navigate,
            location,
        });

        return jsonResponse;
    } catch (error) {
        console.error(error);
    }
};

export const patch = async ({ uri, query, body={}, navigate, location }) => {
    let queryString = '';
    
    if (query && Object.keys(query).length !== 0) {
        queryString = objectToQueryString(query);
    }

    try {
        const response = await fetch(`${config.api}${uri}${queryString}`, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(body),
        });
    
        const jsonResponse = await response.json();
        needLogout({
            meta: jsonResponse.meta,
            navigate,
            location,
        });

        return jsonResponse;
    } catch (error) {
        console.error(error);
    }
};

export const del = async ({ uri, navigate, location }) => {
    try {
        const response = await fetch(`${config.api}${uri}`, {
            ...options,
            method: 'DELETE',
        });

        const jsonResponse = await response.json();
        needLogout({
            meta: jsonResponse.meta,
            navigate,
            location,
        });

        return jsonResponse;
    } catch (error) {
        console.error(error);
    }
};