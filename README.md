# Mercadly - Lista de Compras Compartilhada

&#x20;&#x20;

## 📚 Sobre o Projeto

Mercadly é um aplicativo mobile multiplataforma (iOS/Web/Android) desenvolvido com React Native (Expo) e Firebase. Ele permite que uma família ou grupo compartilhe uma única lista de compras com atualização em tempo real. Todos os participantes acessam a mesma conta (login compartilhado) e podem visualizar, adicionar, editar ou remover itens simultaneamente.

Ideal para compras colaborativas entre familiares ou colegas de casa.

## 📖 Tabela de Conteúdo

- [Instalação](#instalação)
- [Como Usar](#como-usar)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Próximos Passos](#próximos-passos)

---

## ⚙️ Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/mercadly-app.git
cd mercadly-app
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o Firebase:

- Crie um projeto no [Firebase Console](https://console.firebase.google.com)
- Ative Authentication (Email/Senha)
- Ative Firestore Database
- Pegue as credenciais Web e configure no arquivo `config/firebase.ts`

4. Inicie a aplicação:

```bash
npx expo start --web
```

Você pode também rodar no celular usando o app [Expo Go](https://expo.dev/client).

---

## 🚀 Como Usar

1. Acesse `/register` para criar a conta compartilhada
2. Compartilhe email/senha com o grupo
3. Acesse `/login` e entre com a mesma conta em vários dispositivos
4. Acesse `/list` para visualizar e manipular os itens da lista

---

## ✨ Funcionalidades

- Login e cadastro com Firebase Authentication
- Lista de compras em tempo real com Firestore
- Adição de novos itens (nome + quantidade)
- Edição e remoção de itens
- Logout
- Proteção de rotas: apenas usuários logados acessam a lista
- Layout mobile-friendly com `expo-router`

---

## 🛠️ Tecnologias Utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Firebase Authentication](https://firebase.google.com/products/auth)
- [Firebase Firestore](https://firebase.google.com/products/firestore)
- [expo-router](https://expo.github.io/router)
- TypeScript

---

## 🔗 Próximos Passos

- Adicionar múltiplas listas (ex: lista da casa, lista da empresa)
- Compartilhamento via link de convite
- Modo offline/cache
- Notificações push
- Tema escuro/tema claro

---

> Desenvolvido com ❤️ para facilitar compras em grupo de forma prática e sincronizada.
