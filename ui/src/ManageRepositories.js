import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { useEffect, useState } from 'react'
import AddRepository from './AddRepository'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Icon } from '@material-ui/core'
import RepoListing from './RepoListing'

const useStyle = makeStyles( ( theme ) => ({
    root: {
        minHeight: 'calc(100vh - 7em - 9px)',
        padding: "5vh"
    },
    container: {
        padding: theme.spacing(3)
    },
}) )

export default function ManageRepositories() {
    const [isLoading, setLoading] = useState( true );
    const [loadAddRepoForm, setLoadAddRepoForm] = useState( false );
    const [repoList, setRepoList] = useState( [] );
    const [trigger, setTrigger] = useState( false );
    const classes = useStyle();
    useEffect ( () => {
        async function fetchData() {
            const response = await fetch( '/api/list_repos', { headers: { 'Accept': 'application/json' } } )
            const fetchedRepoList = await response.json()
            setLoading( false );
            setTrigger( false );
            setRepoList( fetchedRepoList.list );
        }
        fetchData();
     }, [trigger] )
    return (
    <>
        <Grid container justify='center' className={classes.root}>
            <Grid item xs={7}>
                <Paper elevation={0} className={classes.container}>
                    <h1>Manage repositories</h1>
                    { !isLoading ? (
                    <>
                        {!loadAddRepoForm ? <Button startIcon={<Icon>add</Icon>} size="large" variant="outlined" onClick={ ( ) => { setLoadAddRepoForm( true ) }}>Add repository</Button> : ''}
                        { loadAddRepoForm ?
                            <AddRepository onCancel={()=> {
                                setLoadAddRepoForm(false);
                                setTrigger( !trigger );
                            } } />
                        : ''  }
                        <Grid container>
                            { !loadAddRepoForm && repoList && repoList.map( ( repo ) => <RepoListing repo={repo} reload={() => setTrigger( !trigger )} /> ) }
                        </Grid>
                    </>) : 'Loading...' }
                </Paper>
            </Grid>
        </Grid>
    </>)
}