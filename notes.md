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
export default function cart(state, action) {
  return [];
}
```

## Utilizando o Redux

### Fazer a conexao
- No componente/page que terá conexão com o reducer, fazer a conexao

```js
...
import { connect } from 'react-redux';
...

import { ProductList } from './styles';

class Home extends React.Component {
  ...
  }

  render() {
   ...
  }
}

export default connect()(Home);
```

- Quando utiliza-se o `dispatch()` todos os reducers são ativados, por isso que temos que realizar uma verificação das actions.
