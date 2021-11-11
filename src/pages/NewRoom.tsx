import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { Link } from "react-router-dom";

import "../styles/auth.scss";

export function NewRoom() {
  // const { user } = useContext(authContext);

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

          <form action="">
            <input type="text" placeholder="Nome da sala " />
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
