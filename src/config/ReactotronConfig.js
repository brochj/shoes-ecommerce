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
