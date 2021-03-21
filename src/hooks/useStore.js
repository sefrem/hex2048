import React from "react";
import store from "../store/store";

const storeContext = React.createContext(store);

export const useStore = () => React.useContext(storeContext);
