import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";

import { BrowserRouter, Route, Switch } from "react-router-dom";

import { AuthContextProvider } from "./contexts/AuthContext";
import { Room } from "./pages/Room";

//yarn add react-hot-toast
import { Toaster } from "react-hot-toast";

export function App() {
  return (
    //TODO Ver como fazer o redirecionamento com a nova versão do react-router-dom. essa maneira é com a versão 5.2.0 e a última lançada é a 6.0.1
    <BrowserRouter>
      <AuthContextProvider>
        {/* o swith serve para que quando o caminho de alguma rota for satisfeita, ele não procura mais alguma outra que também possa satisfazer,parando na primeira. aqui iria dar conflito com o new e o :id */}
        <Switch>
          <Route path="/" exact component={Home}></Route>
          <Route path="/rooms/new" exact component={NewRoom}></Route>
          <Route path="/rooms/:id" component={Room}></Route>
        </Switch>
        {/* para utilizar o toast, precisa passar o componente no app */}
        <Toaster />;
      </AuthContextProvider>
    </BrowserRouter>
  );
}
