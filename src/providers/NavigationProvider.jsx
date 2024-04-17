import { createContext } from 'react';

export const NavigationContext = createContext(null);

const NavigationProvider = ({ value, children }) => {
    return (
        <NavigationContext.Provider value={value}>
            {children}
        </NavigationContext.Provider>
    );
};

export default NavigationProvider;