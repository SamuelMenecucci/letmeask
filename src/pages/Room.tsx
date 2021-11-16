import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import toast from "react-hot-toast";

//função do router para pegar os parametros da rota
import { useParams } from "react-router-dom";
import "../styles/room.scss";
import { FormEvent, useState } from "react";
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

  //para fazer a funcionalidade de like da pergunta
  async function handleLikeQuestion(
    questionId: string,
    likeId: string | undefined
  ) {
    if (likeId) {
      //se o usuário já tiver dado like, ele remove o likes
      await database
        .ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`)
        .remove();
    } else {
      //adicionando o like e passando o caminho dentro do firebase da pergunta
      await database
        .ref(`rooms/${roomId}/questions/${questionId}/likes`)
        .push({ authorId: user?.id }); //.push irá colocar os dados do id do autor
    }
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
              >
                <button
                  className={`like-button ${question.likeId ? "liked" : ""}`}
                  type="button"
                  arial-label="marcar como gostei"
                  //quando vou chamar uma função no onClick que vá receber algum parametro, preciso passar sempre com a arrow function dessa forma. se eu apensar chamar a função direta passando o parametro, eu estou passando a execução da função.
                  onClick={() =>
                    handleLikeQuestion(question.id, question.likeId)
                  }
                >
                  {/*  ps: para a exibição de qualquer conteudo dentro de um componente, é necessário declarar o children no arquivo do mesmo.  */}

                  {question.likeCount > 0 && (
                    <span> {question.likeCount} </span>
                  )}

                  {/* jogo diretamente o código svg do like dentro do html, pois dessa forma eu consigo manipular a cor dele, coisa que não seria possível se estivessemos utilizando uma tag img para a exibição do mesmo. a cor é a propriedade stroke.  */}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
                      stroke="#737380"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
