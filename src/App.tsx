import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";

import { BrowserRouter, Route } from "react-router-dom";

import { AuthContextProvider } from "./contexts/AuthContext";

export function App() {
  return (
    //TODO Ver como fazer o redirecionamento com a nova versão do react-router-dom. essa maneira é com a versão 5.2.0 e a última lançada é a 6.0.1
    <BrowserRouter>
      <AuthContextProvider>
        <Route path="/" exact component={Home}></Route>
        <Route path="/rooms/new" component={NewRoom}></Route>
      </AuthContextProvider>
    </BrowserRouter>
  );
}
