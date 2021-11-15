import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import toast from "react-hot-toast";

//função do router para pegar os parametros da rota
import { useParams } from "react-router-dom";
import "../styles/room.scss";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";

//tipagem do parametro que irei pegar
type RoomParams = {
  id: string;
};

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
    isHithlighted: boolean;
  }
>;

//tipagem para o estado que irá armazenar a pergunta
type Question = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
};

export function Room() {
  //trazendo o usuário autenticado
  const { user } = useAuth();

  //aonde guardo o parametro que peguei da rota da minha página. como estou passano o id da sala no parametro, irei pegar esse id com o useParams. ele está pegando o parametro com a key id pois é o parametro que passamos na rota, lá no app, utilizando o route. Ele trás a rota dentro de um objeto
  const params = useParams<RoomParams>();

  const roomId = params.id;

  const [newQuestion, setNewQuestion] = useState("");

  //o estado será um array de questions
  const [questions, setQuestions] = useState<Question[]>([]);

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
            isHighlighted: value.isHithlighted,
            isAnswered: value.isAnswered,
          };
        }
      );
      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    });
  }, [roomId]);

  async function handleSendNewQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === "") {
      return;
    }

    if (!user) {
      toast.error("You must be logged in");
    }

    //objeto que vai ter todas as informações da pergunta que será criada
    const question = {
      content: newQuestion, //estado que armazena a pergunta, pegando do input do form
      author: {
        name: user?.name,
        avatar: user?.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    //salvo dentro do firebase, no id da sala, criando uma nova informação chamada questions
    await database.ref(`rooms/${roomId}/questions`).push(question);

    //para setar o input como vazio após ela ser feita
    setNewQuestion("");
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={params.id} />
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s) </span>}
        </div>

        <form onSubmit={handleSendNewQuestion}>
          <textarea
            placeholder="O que você quer perguntar ?"
            onChange={(event) => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            {/* Dentro do react, para fazer um if, utilizo o operador ternário. aqui, faço condições de exibição para caso o usuário esteja logado ou não. se estiver, mostro o avatar e o nome, caso não, mostro a frase para ele fazer login */}
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span> {user.name} </span>
              </div>
            ) : (
              <span>
                {" "}
                Para enviar uma pergunta, <button>faça seu login</button>
              </span>
            )}
            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>

        {JSON.stringify(questions)}
      </main>
    </div>
  );
}
