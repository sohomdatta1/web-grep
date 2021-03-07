import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Footer from './Footer';
import HomePage from './HomePage';
import NotFound from './NotFound';
import CodeBrowser from './CodeBrowser';
import './App.css';
import AddRepository from './AddRepository';

function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/">
					<HomePage />
					<Footer />
				</Route>
				<Route exact path="/add_repo">
					<AddRepository />
					<Footer />
				</Route>
				{/*  <Route path="/:repo/:branch/">
          <CodeBrowser />
  </Route> */}
				<Route path="/" component={NotFound} />
				<Route path="*" component={NotFound} />
			</Switch>
		</BrowserRouter>
	);
}

export default App;
