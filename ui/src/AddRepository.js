import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Alert from '@material-ui/lab/Alert';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
	root: {
		height: 'calc(100vh - 7em - 9px)',
		padding: '10vh',
	},
	container: {
		padding: theme.spacing(3),
	},
	formContainer: {
		padding: theme.spacing(2),
		'& > *': {
			marginTop: theme.spacing(2),
		},
	},
}));

export default function AddRepository() {
	const classes = useStyles();

	const [formData, setFormData] = useState({
		name: '',
		url: '',
		blurb: '',
		reIndexInterval: 14400,
	});

	const [submitted, setSubmitted] = useState(false);

	const [response, setResponse] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitted(true);

		fetch('/api/add_repo', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(formData),
		})
			.then((data) => data.json())
			.then((response) => {
				console.log(response);
				if (response.status) {
					setResponse(response.message);
				} else {
					setResponse(response.error);
				}
			});
	};

	const updateValue = (field, value) => {
		setFormData((values) => ({
			...values,
			[field]: value,
		}));
	};

	return (
		<Grid container justify="center" className={classes.root}>
			<Grid item xs={7}>
				<Paper elevation={0} className={classes.container}>
					<Grid
						component="form"
						container
						className={classes.formContainer}
						onSubmit={handleSubmit}
					>
						<h2>Add repository</h2>
						<Grid items xs={12}>
							{submitted && response ? (
								<Alert variant="outlined" severity="info">
									{response}
								</Alert>
							) : (
								''
							)}
						</Grid>
						<Grid items xs={12}>
							<TextField
								label="Repository name"
								required
								fullWidth
								variant="filled"
								className={classes.formElem}
								color="primary"
								value={formData.name}
								onChange={(e) =>
									updateValue('name', e.target.value)
								}
								disabled={submitted}
							/>
						</Grid>
						<Grid items xs={12}>
							<TextField
								label="Repository url"
								required
								fullWidth
								variant="filled"
								className={classes.formElem}
								value={formData.url}
								onChange={(e) =>
									updateValue('url', e.target.value)
								}
								disabled={submitted}
							/>
						</Grid>
						<Grid items xs={12}>
							<TextField
								label="Blurb"
								multiline
								fullWidth
								variant="filled"
								className={classes.formElem}
								value={formData.blurb}
								onChange={(e) =>
									updateValue('blurb', e.target.value)
								}
								disabled={submitted}
							/>
						</Grid>
						<Grid items xs={12}>
							<TextField
								label="Re index interval (defaults to 4 hours)"
								defaultValue={14400}
								fullWidth
								variant="filled"
								className={classes.formElem}
								value={String(formData.reIndexInterval)}
								onChange={(e) =>
									updateValue(
										'reIndexInterval',
										parseInt(e.target.value)
									)
								}
								disabled={submitted}
							/>
						</Grid>
						<Grid items xs={12}>
							<Button
								type="submit"
								startIcon={<Icon>poll</Icon>}
								size="large"
								variant="outlined"
								disabled={submitted}
							>
								Request indexing
							</Button>
						</Grid>
					</Grid>
				</Paper>
			</Grid>
		</Grid>
	);
}
