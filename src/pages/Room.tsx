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
import { Question } from "../components/Question";
import { useRoom } from "../hooks/useRoom";

//tipagem do parametro que irei pegar
type RoomParams = {
  id: string;
};

export function Room() {
  //trazendo o usuário autenticado
  const { user } = useAuth();

  //aonde guardo o parametro que peguei da rota da minha página. como estou passano o id da sala no parametro, irei pegar esse id com o useParams. ele está pegando o parametro com a key id pois é o parametro que passamos na rota, lá no app, utilizando o route. Ele trás a rota dentro de um objeto
  const params = useParams<RoomParams>();

  const roomId = params.id;

  const [newQuestion, setNewQuestion] = useState("");

  //informações de dentro do hook que criei
  const { questions, title } = useRoom(roomId);

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
        <div className="question-list">
          {/* irei percorrer cada elemento de detro de questions e retornar um componente para cada um deles. question é um array de question, por isso a utilização do map */}
          {questions.map((question) => {
            return (
              <Question
                //Para entender melhor o motivo de utilização da propriedade key, leia a doc: https://pt-br.reactjs.org/docs/reconciliation.html
                key={question.id}
                content={question.content}
                author={question.author}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}
