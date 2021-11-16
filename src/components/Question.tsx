import { ReactNode } from "react";
import "../styles/question.scss";

import cn from "classnames"; //yarn add classnames

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  //ao passar o reactnode na tipagem do children, podemos passar qualquer conteudo jsx para o children, html, div, algum componente, button e etc.
  children?: ReactNode;
  isAnswered?: boolean;
  isHighlighted?: boolean;
};

//estou criando a pergunta em um componente pois a exibição das perguntas irá se repetir várias vezes, então, podemos fazer o reaproveitamento de código
export function Question({
  content,
  author,
  children,
  isAnswered,
  isHighlighted,
}: QuestionProps) {
  return (
    <div
      // pacote classnames que instalo com o yarn para facilitar a escrita das classes que possuem alguma condição.
      className={cn(
        "question",
        { answered: isAnswered },
        { highlighted: isHighlighted && !isAnswered }
      )}

      // className={`question ${isAnswered ? "answered" : ""} ${
      //   isHighlighted ? "highlighted" : ""
      // }  }`}
    >
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
