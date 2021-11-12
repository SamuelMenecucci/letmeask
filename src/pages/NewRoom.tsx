import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { Link, useHistory } from "react-router-dom";

//chamo o formEvent para passar ele como o que eu iria utilizar para tipar o evento que estou recebendo na minha função.
import { FormEvent, useState } from "react";

import "../styles/auth.scss";
import { database } from "../services/firebase";
import { useAuth } from "../hooks/useAuth";

export function NewRoom() {
  //crio um estado que será utilizado para armazenar as informações do meu input, no formulário
  const [newRoom, setNewRoom] = useState("");
  const { user } = useAuth();

  //para redirecionarmos a rota e renderizarmos outro componente.
  const history = useHistory();

  //função para pegar o evento de enviar do meu formulário, o onSubmit.
  async function handleCreateNewRoom(event: FormEvent) {
    // const { user } = useContext(authContext);
    event.preventDefault();

    //verifico o conteudo do newRoom, que está recebendo o valor do input. dou um trim() para retirar os espaços vazios no inicio e no fim de um texto e verifico se tem algum conteudo, para evitar que o usuário tenha colocado apenas espaços dentro do input, e não deixo ele criar uma sala sem nome
    if (newRoom.trim() === "") {
      return;
    }
    //crio dentro do firebase uma referencia, que será uma entidade chamada rooms
    const roomRef = database.ref("rooms");

    //dentro dessa referencia, eu adiciono os dados que eu quero que sejam gravados no banco de dados.
    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });

    //passando como parametro da rota o id que foi criado com a adição da sala dentro do nosso banco de dados. esse será o id que iremos utilizar para a criação das salas.
    history.push(`/rooms/${firebaseRoom.key}`);
  }

  return (
    <div id="page-auth">
      {/* Parte lateral esquerda roxa com as informações apenas */}
      <aside>
        <img
          src={illustrationImg}
          alt="ilustração simbolizando perguntas e respostas "
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>

      {/* parte  lateral direita com os inputs e opções de entrada*/}
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <h2>Criar uma nova sala</h2>

          <form onSubmit={handleCreateNewRoom}>
            <input
              type="text"
              onChange={(event) => setNewRoom(event.target.value)}
              value={newRoom}
              placeholder="Nome da sala "
            />
            <Button type="submit">Criar sala</Button>
          </form>
          <p>
            {/* Utilizamos o link para fazer o redirecionamento no lugar da tag a  */}
            Quer entrar em uma sala existente ? <Link to="/">clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
