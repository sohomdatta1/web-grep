import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
	palette: {
		type: 'dark',
	},
});

ReactDOM.render(
	<React.StrictMode>
		<MuiThemeProvider theme={theme}>
			<App />
		</MuiThemeProvider>
	</React.StrictMode>,
	document.getElementById('root')
);
