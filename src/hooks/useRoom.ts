import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

//para declarar a tipagem de um objeto no typescript, utilizo o Record.a primeira posição é a chave e a segunda é o value
type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<
      string,
      {
        authorId: string;
      }
    >;
  }
>;

//tipagem para o estado que irá armazenar a pergunta
type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
};

//criação de um hook para a reutilização de suas funcionalidades em outras partes da aplicação.
//hook para pegar as questões existentes no banco de dados.
export function useRoom(roomId: string) {
  const { user } = useAuth();

  //o estado será um array de questions
  const [questions, setQuestions] = useState<QuestionType[]>([]);

  const [title, setTitle] = useState("");

  //o useEffect é uma função (hook) que dispara um evento sempre que alguma informação mudar. mas se eu passo o array de dependencia como vazio, essa função vai executar uma única vez assim que o componente for exibido em tela.
  //utilizo o useEffect para ir dentro do firebase e buscar as perguntas já existentes.
  useEffect(() => {
    //buscando a referencia para a minha sala dentro do firebase
    const roomRef = database.ref(`rooms/${roomId}`);

    //buscar os dados das perguntas.
    //o once irá buscar os dados apenas uma vez, o on irá fazer mais de uma. como primeiro parametro
    ///doc https://firebase.google.com/docs/database/web/read-and-write#web_value_events
    //doc sobre parametros possiveis para serem ouvidos. https://firebase.google.com/docs/database/admin/retrieve-data#section-event-types
    roomRef.on("value", (room) => {
      //
      const databaseRoom = room.val();

      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      //o retorno que eu tenho do .once é um objeto, mas eu preciso de um array para poder fazer a iteração e a exibição, por isso utilizo o Objetc.entries(), que irá que retornar uma matriz com a key/value em cada posição.
      //DOC: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
      const parsedQuestions = Object.entries(firebaseQuestions).map(
        //como utilizei o entries, eu tenho duas posições. faço a desestruturação aqui para conseguir fazer a iteração da forma que eu preciso.
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighlighted: value.isHighlighted,
            isAnswered: value.isAnswered,

            //para ver a quantidade de likes que a pergunta possui.
            likeCount: Object.values(value.likes ?? {}).length,

            // par ver se o usuário já deu like na pergunta ou não.
            likeId: Object.entries(value.likes ?? {}).find(
              ([key, like]) => like.authorId === user?.id
            )?.[0],
          };
        }
      );
      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    });

    //para desativar os listeners que eu possuo utilizando uma funcionalidade do próprio firebase
    return () => roomRef.off("value");
  }, [roomId, user?.id]);

  return { questions, title };
}
