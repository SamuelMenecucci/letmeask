import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import googleIconImg from "../assets/images/google-icon.svg";
import { useHistory } from "react-router-dom";

import "../styles/auth.scss";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { FormEvent, useState } from "react";
import { database } from "../services/firebase";
import toast from "react-hot-toast";

export function Home() {
  //para fazer o redirecionamento para outra página
  const history = useHistory();

  //importando o meu contexto
  const { user, singInWithGoogle } = useAuth();

  //estado para armazenar o código da sala que o usuário está tentando acessar.
  const [roomCode, setRoomCode] = useState("");

  async function handleCreateRoom() {
    //se o usuário não estiver autenticado quando clicar no botão de entrar com o google, será chamado o método singInWithGoogle
    if (!user) {
      await singInWithGoogle();
    }

    //para redirecionar o usuário para a tela de criação de uma sala.
    history.push("/rooms/new");
  }

  //função para ingressar em uma sala existente
  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === "") {
      return;
    }

    //busco dentro de rooms o id que o usuário digitou, e dou um .get para me retornar os dados.
    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    //TODO Não está entrando nessa condição
    //se a room não existir
    if (!roomRef.exists()) {
      toast.error("Room does not exists.");
      return;
    }

    //passando o id da sala que existe como parametro na rota.
    history.push(`/rooms/${roomCode}`);
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
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="logo do google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              onChange={(event) => setRoomCode(event.target.value)}
              value={roomCode}
              placeholder="Digite o código da sala"
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
