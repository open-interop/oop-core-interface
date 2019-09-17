import React from "react";

const AppContext = React.createContext("test");

const { ContextProvider, ContextConsumer } = AppContext.Provider;
export { ContextProvider, ContextConsumer };
export default AppContext;
