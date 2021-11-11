import firebase from "firebase/compat/app"; //yarn add firebase

import "firebase/compat/auth"; //para a autenticação
import "firebase/compat/database"; //para o banco de dados

//configuração do firebase, que nós é mostrada quando criamos um projeto novo no próprio firebase. Estou usando process.env para que as credenciais não fiquem hard coded, e coloco o nome da variável de ambiente, que está vindo pelo meu .env.local, que não está disponível no gh justamente por segurança
const firebaseConfig = {
  apiKey: "AIzaSyCjiiK7qXmmCoCK3nP9o155kzYc8LG_fTo", // variaveis ambiente não estão funcionando para a autenticação
  authDomain: "letmeask-18502.firebaseapp.com",
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

const database = firebase.database();

export { firebase, auth, database };
