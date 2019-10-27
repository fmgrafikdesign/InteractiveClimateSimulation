import m from 'mithril';
import Nav from './Nav';

const App: m.Component = {
  view: () => m('.page',
    m(Nav),
    m('h1', "About"),
    m('p', "This is the about page, isn't it pretty? Yes it is not pretty")
  )
};

export default App;
