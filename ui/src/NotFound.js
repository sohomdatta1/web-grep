import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
	root: {
		height: '100vh',
		padding: '10vh',
	},
	explain: {
		fontSize: '5vh',
		textAlign: 'center',
	},
}));

export default function NotFound() {
	const classes = useStyles();
	return (
		<>
			<Grid
				container
				className={classes.root}
				alignItems="center"
				justify="center"
			>
				<Grid item xs={12} className={classes.explain}>
					The repo, code, or file that you are searching for could not
					be found.
					<br />
					<br />
					<Button
						size="large"
						variant="outlined"
						startIcon={<Icon>send</Icon>}
					>
						Report a issue
					</Button>
					&nbsp;&nbsp;
					<Button
						component={Link}
						size="large"
						variant="outlined"
						startIcon={<Icon>cached</Icon>}
						to="/"
					>
						Go to home page
					</Button>
				</Grid>
			</Grid>
		</>
	);
}
