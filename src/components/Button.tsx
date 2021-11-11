//como o nosso button irá receber as propriedades próprias de um button, podemos tipar ele com uma importação do próprio react, que irá tipar o button com todas as propriedades q um button do próprio html tem
import { ButtonHTMLAttributes } from "react";

import "../styles/button.scss";

//crio uma tipagem que recebe o ButtonHTMLAttributes e passo entre os sinais o elemento do botão. a tipagem do elemento do botão é global, então coloco o HTMlButtonElement
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: ButtonProps) {
  //colocamos as propriedades com o spread pois iremos passar as propriedades que vierem para o nosso componentes dentro do nosso button
  return <button className="button" {...props} />;
}
