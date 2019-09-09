# Redux

```bash
yarn add redux react-redux
```
## Configurando o Redux

### Estrutura
```
├── store
│   │   ├── index.js
│   │   └── modules
│   │       ├── cart
│   │       │   └── reducer.js
            └── rootReducer.js
```

### Arquivos

- Em `src/store/index.js`
```js
import { createStore } from 'redux';

import rootReducer from './modules/rootReducer';

const store = createStore(rootReducer);

export default store;
```

- Em `rootReducer,js`

```js
import { combineReducers } from 'redux';

import cart from './cart/reducer';

export default combineReducers({
  cart,
});
```

- Em `src/app.js`

```js
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from "react-redux"; //ADD

import GlobalStyles from './styles/global';
import Header from './components/Header';
import Routes from './routes';

import store from './store' //ADD

function App() {
  return (
    <Provider store={store}> //ADD
      <BrowserRouter>
        <Header />
        <Routes />
        <GlobalStyles />
      </BrowserRouter>
    </Provider> //ADD
  );
}

export default App;
```
### Criando um reducer

-  Na pasta modules, criar uma pasta pro novo reducer e adicioná-lo no `rootReducer.js`

- Exemplo;
-
```js
// cart reducer
export default function cart(state = [], action) {
  switch (action.type) {
    case 'ADD_TO_CART':
      return [...state, action.product];

    default:
      return state;
  }
}
```

## Utilizando o Redux

### Fazer a conexao e disparar a action
- No componente/page que terá conexão com o reducer, fazer a conexao

```js
...
import { connect } from 'react-redux';
...
class Home extends React.Component {
  ...
  handleAddProduct = product => {
    const { dispatch } = this.props;

    dispatch({
      type: 'ADD_TO_CART',
      product,
    });
  };

  render() {...}
}

export default connect()(Home);
```

- Quando utiliza-se o `dispatch()` todos os reducers são ativados, por isso que temos que realizar uma verificação das action.type.

### Lendo arquivos dos states
- Fazer a conexao do o redux e passar qual state que ler.

```js
...
import { connect } from 'react-redux';
...
function Header({ cart }) {
  console.log(cart);
  return (...);
}

const mapStateToProps = state => ({
  cart: state.cart,
});
export default connect(mapStateToProps)(Cart);
```

# Debbug com Reactotron

```bash
yarn add reactotron-react-js reactotron-redux
```
- criar um arquivo em `src/config/ReactotronConfig.js`

```js
//ReactotronConfig.js
import Reactotron from 'reactotron-react-js';
import { reactotronRedux } from 'reactotron-redux';

// Quando utiliza-se o create react app, ele adiciona essa variavel NODE_ENV quando inicia um `yarn start`
if (process.env.NODE_ENV === 'development') {
  const tron = Reactotron.configure()
    .use(reactotronRedux())
    .connect();

  tron.clear();

  console.tron = tron;
}
```

- No arquivo `src/store/index.js` adicionar o enhancer
```js
import { createStore } from 'redux';

import rootReducer from './modules/rootReducer';

const enhancer =
  process.env.NODE_ENV === 'development' ? console.tron.createEnhancer() : null;

const store = createStore(rootReducer, enhancer);

export default store;
```

- No arquivo `src/app.js` importar as config do reactotron
> OBS: o import deve ser antes do import do store

```js
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import './config/ReactotronConfig'; //Antes do store!!

import GlobalStyles from './styles/global';
import Header from './components/Header';
import Routes from './routes';

import store from './store';
...
```

-  Nesse momento já deve ter aparecido a Connection no App do Reactotron

# Immer
É utilizado para facilitar na hora de manipular o `state` mantendo o conceito de imutabilidade. Ele faz uma cópia do `state` (draft), manipulamos esse `draft` e ele retorna o novo `state` de acordo as manipulacões que realizamos.

```bash
yarn add immer
```
- Exemplo do uso do `immer`
```js
import produce from 'immer';

export default function cart(state = [], action) {
  switch (action.type) {
    case '@cart/ADD':
      return produce(state, draft => {
        const productIndex = draft.findIndex(p => p.id === action.product.id);
        if (productIndex >= 0) {
          draft[productIndex].amount += 1;
        } else {
          draft.push({
            ...action.product,
            amount: 1,
          });
        }
      });
    case '@cart/REMOVE':
      return produce(state, draft => {
        const productIndex = draft.findIndex(p => p.id === action.id);

        if (productIndex >= 0) {
          draft.splice(productIndex, 1);
        }
      });
    default:
      return state;
  }
}
```

## Refatorando as Actions
- Criar um arquivo `actions.js` em `src/store/modules/cart/actions.js`

```js
// exemplo de uma action
export function addToCart(product) {
  return {
    type: '@cart/ADD',
    product,
  };
}

export function removeFromCart(id) {
  return {
    type: '@cart/REMOVE',
    id,
  };
}
```

### Utilizando o arquivo de actions

```js
...
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
...
import * as CartActions from '../../store/modules/cart/actions';

function Cart({ cart, removeFromCart }) {
  return (
    <Container>
      <button
        type="button"
        onClick={() => removeFromCart(product.id)}
      >
    </Container>
  );
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);

const mapStateToProps = state => ({
  cart: state.cart,
});

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
```

# Redux Saga

```bash
yarn add redux-saga
```

- O Saga vai funcionar como um middleware. O fluxo será o seguinte:
1. O usuário dispara uma action que está sendo ouvida pelo saga em `store/modules/cart/sagas.js` (exemplo)
2. A action do saga faz o que precisa fazer, tipo um requisição.
3. Quando termina a action do saga, o próprio saga dispara uma action
4. E essa action está sendo ouvida pelo reducer.
5. Reducer faz as alterações de estados necessárias.

```js
// Sem Redux-saga
dispara a action 1 -> Reducer

// Com Redux-saga
dispara a action -> (action-saga executada) -> dispara action 1 -> Reducer
```
### Exemplo
#### Actions
- Como agora tem uma action a mais, mudar no arquivo `store/modules/cart/actions.js`

```js
// Sem redux saga
export function addToCartRequest(product) {
  return {
    type: '@cart/ADD',
    id,
  };
}
...
```
Para

```js
// Com redux saga
export function addToCartRequest(id) {
  return {
    type: '@cart/ADD_REQUEST',
    id,
  };
}
export function addToCartSuccess(product) {
  return {
    type: '@cart/ADD_SUCCESS',
    product,
  };
}
...
```

- `addToCartRequest()` é a action disparada pelo usuário lá no front-end e ouvida pelo redux-saga
- `addToCartSuccess()` é a action disparada pelo redux-saga e ouvida pelo reducer

#### Reducer
- No reducer mudar o tipo de action que está sendo ouvida, no caso de `@cart/ADD` para `@cart/ADD_SUCCESS`
```js
...
switch (action.type) {
    case '@cart/ADD_SUCCESS':
      return produce(state, draft =>
...
```

#### Sagas
- Em `store/modules/cart/sagas.js`

```js
import { call, put, all, takeLatest } from 'redux-saga/effects';
import api from '../../../services/api';

import { addToCartSuccess } from './actions';

function* addToCart({ id }) {
  const response = yield call(api.get, `/products/${id}`);

  // put é para disparar actions
  yield put(addToCartSuccess(response.data));
}

// all é pra ficar ouvindo as actions
export default all([takeLatest('@cart/ADD_REQUEST', addToCart)]);
```

#### rootSaga
- Fazer o load de todos os sagas `store/modules/rootSaga.js`

```js
import { all } from 'redux-saga/effects';

import cart from './cart/sagas';

export default function* rootSaga() {
  return yield all([cart]);
}
```

#### Carregando o redux-saga
- Em `store/index.js` fazer a configuração do redux-saga

```js
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './modules/rootReducer';
import rootSaga from './modules/rootSaga';

const sagaMiddleware = createSagaMiddleware();

const enhancer =
  process.env.NODE_ENV === 'development'
    ? compose(
        console.tron.createEnhancer(),
        applyMiddleware(sagaMiddleware)
      )
    : applyMiddleware(sagaMiddleware);

const store = createStore(rootReducer, enhancer);

sagaMiddleware.run(rootSaga);

export default store;
```

## Reactotron + Saga
```bash
yarn add reactotron-redux-saga
```

### Configurando o Reactotron

```js
import Reactotron from 'reactotron-react-js';
import { reactotronRedux } from 'reactotron-redux';
import reactotronSaga from 'reactotron-redux-saga';

if (process.env.NODE_ENV === 'development') {
  const tron = Reactotron.configure()
    .use(reactotronRedux())
    .use(reactotronSaga())
    .connect();

  tron.clear();

  console.tron = tron;
}
```

### Criando o saga monitor
- Em `store/index.js`  fazer as alterações

```js
...
const sagaMonitor =
  process.env.NODE_ENV === 'development'
    ? console.tron.createSagaMonitor()
    : null;

const sagaMiddleware = createSagaMiddleware({
  sagaMonitor,
});
...
```


# React Tostify
```bash
yarn add react-toastify
```

### app.js

```js
...
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
...
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Header />
        <Routes />
        <GlobalStyles />
        <ToastContainer autoClose={3000} />
      </BrowserRouter>
    </Provider>
..
```

### Nos estilos globais `global.js`
```js
import 'react-toastify/dist/ReactToastify.css';
```

### Utilizando

```js
import { toast } from 'react-toastify';

function foo() {
    toast.error('Some error');
}
```
