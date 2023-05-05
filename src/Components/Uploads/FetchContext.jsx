import { createContext, useState, useContext } from 'react';

const FetchContext = createContext();

export const useFetch = () => {
  return useContext(FetchContext);
};

export const FetchProvider = ({ children }) => {
  const [fetch, setFetch] = 
    useState(
      {
        toppings: [],
        size: [],
        state: null
      });

  return (
    <FetchContext.Provider value={{ fetch, setFetch }}>
      {children}
    </FetchContext.Provider>
  );
};
