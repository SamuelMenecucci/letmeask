import { createContext, ReactNode, useState, useEffect } from "react";
import { auth, firebase } from "../services/firebase";

//criando tipagem do meu usuário, que será armazenado no estado
type User = {
  id: string;
  name: string;
  avatar: string;
};

//criando tipagem do que o meu contexto irá ter
type AuthContextType = {
  user: User | undefined;
  singInWithGoogle: () => Promise<void>;
};

//quando o children do meu componente for outro componente, colocamos o conteudo dele como reactNode
type AuthContextProviderProps = {
  children: ReactNode;
};

//criando contexto para o compartilhamento de informações
export const authContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
  //estado em que será armazenado o meu usuário logado
  const [user, setUser] = useState<User>();

  //caso o usuário já tenha sido logado anteriormente ele irá retornar o usuário. para que não seja preciso fazer a autenticação toda vez.
  useEffect(() => {
    // auth é o que vem de dentro do firebase. onAuthStateChanged é um eventListener que irá ficar ouvindo um evento. colocando em uma
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, photoURL, uid } = user;

        //se o usuário não tiver nome e foto, dispara um erro pq será permitido somente usuários com perfil completo
        if (!displayName || !photoURL) {
          throw new Error("Missing information from Google Account");
        }

        //caso esteja tudo certo, iremos setar as informações no estado
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  //função que será disparada para fazer a autenticação do usuário
  async function singInWithGoogle() {
    //instancia para utilizar o auth do google
    const provider = new firebase.auth.GoogleAuthProvider();

    //para abrir a tela de autenticação em um popup
    const result = await auth.signInWithPopup(provider);

    //pegando o resultado da autenticação, desestruturando e pegando as informações que eu quero.
    if (result.user) {
      const { displayName, photoURL, uid } = result.user;

      //se o usuário não tiver nome e foto, dispara um erro pq será permitido somente usuários com perfil completo
      if (!displayName || !photoURL) {
        throw new Error("Missing information from Google Account");
      }

      //caso esteja tudo certo, iremos setar as informações no estado
      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
      });
    }
  }
  return (
    <authContext.Provider value={{ user, singInWithGoogle }}>
      {props.children}
    </authContext.Provider>
  );
}
