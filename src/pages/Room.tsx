import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import toast from "react-hot-toast";

//função do router para pegar os parametros da rota
import { useParams } from "react-router-dom";
import "../styles/room.scss";
import { FormEvent, useState } from "react";
import { useAuth } from "../hooks/useAuth";

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

  function handleSendNewQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === "") {
      return;
    }

    if (!user) {
      toast.error("You must be logged in");
    }
  }

  console.log(params);
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
          <h1>Sala React</h1>
          <span>4 perguntas</span>
        </div>

        <form onSubmit={handleSendNewQuestion}>
          <textarea
            placeholder="O que você quer perguntar ?"
            onChange={(event) => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            <span>
              Para enviar uma pergunta, <button>faça seu login</button>
            </span>
            <Button type="submit">Enviar pergunta</Button>
          </div>
        </form>
      </main>
    </div>
  );
}
