import { useEffect, useState } from 'react'
import { Grid, Icon } from "@material-ui/core";
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CardActions from '@material-ui/core/CardActions'
import Prism from 'prismjs';
import "prismjs/themes/prism-tomorrow.css";
import RepoEditForm from './RepoEditForm'
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'

const useStyles = makeStyles( ( theme ) => ({
    root: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2)
    },
    code: {
    }
}) )

export default function RepoListing(props) {
    const classes = useStyles();
    const [loadEditingForm, setLoadEditingForm] = useState( false );
    const [open, setOpen] = useState(false);
    const [response, setResponse] = useState('');

    useEffect(() => {
        Prism.highlightAll();
        setResponse( '' );
        setLoadEditingForm( false );
        setOpen( false );
      }, [loadEditingForm, props.repo]);

    const handleClickOpen = () => {
    setOpen(true);
    };

    const handleClose = () => {
    setOpen(false);
    };

    const deleteRepo = () => {
        setOpen( false );
        fetch('/api/remove_repo', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: props.repo.name })
            })
            .then((data) => data.json())
            .then((response) => {
                console.log(response)
                if (response.status) {
                    props.reload();
                } else {
                    setResponse( response.error );
                }
            })
    }
      
    const text = { name: props.repo.name, blurb: props.repo.blurb, url: props.repo.url, updateInterval: props.repo.updateInterval };

    return (
        <Card component={Grid} className={classes.root} variant="outlined" item xs={12}>
            { response ? (
            <Alert variant='outlined' severity='error'>
                {response}
            </Alert>
            ) : (
                ''
            )}
            { !loadEditingForm ? 
            <>
                <pre className={classes.code}>
                    <code className="language-javascript">
                        {JSON.stringify(text, null, '\t')}
                    </code>
                </pre>
                <CardActions>
                    <Button size="small" startIcon={<Icon>edit</Icon>} variant="outlined" onClick={()=> setLoadEditingForm( true )}>Edit</Button>
                    <Button size="small" startIcon={<Icon>delete</Icon>} variant="outlined" onClick={()=> handleClickOpen()}>Delete</Button>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">Delete a repo?</DialogTitle>
                        <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete a repository.
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={deleteRepo} color="primary">
                            Delete
                        </Button>
                        <Button onClick={handleClose} color="primary" autoFocus>
                            Cancel
                        </Button>
                        </DialogActions>
                    </Dialog>
                </CardActions>
            </> : <RepoEditForm repo={props.repo} onCancel={()=>setLoadEditingForm( false )} reload={props.reload}/> }
        </Card>
    );
}