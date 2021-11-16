import { ReactNode } from "react";
import "../styles/question.scss";

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  //ao passar o reactnode na tipagem do children, podemos passar qualquer conteudo jsx para o children, html, div, algum componente, button e etc.
  children?: ReactNode;
};

//estou criando a pergunta em um componente pois a exibição das perguntas irá se repetir várias vezes, então, podemos fazer o reaproveitamento de código
export function Question({ content, author, children }: QuestionProps) {
  return (
    <div className="question">
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>{children}</div>
      </footer>
    </div>
  );
}
