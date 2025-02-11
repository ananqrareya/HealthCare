import React from "react";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import UserContextProvider from "./context/UserContextProvider";
import RealTimeContextProvider from "./context/RealTimeContext";
 
 
function App() {
  return (
    <UserContextProvider>
       <RealTimeContextProvider> 
          <RouterProvider router={router}>
          </RouterProvider>
           </RealTimeContextProvider>
    </UserContextProvider>
  );
}

export default App;
