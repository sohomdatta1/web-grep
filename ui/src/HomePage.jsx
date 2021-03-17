import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import InputBase from '@material-ui/core/InputBase'
import Icon from '@material-ui/core/Icon'
import { makeStyles } from '@material-ui/core/styles'
import { IconButton } from '@material-ui/core'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {
    height: 'calc(100vh - 8em - 10px)',
    fontFamily: 'monospace',
    textAlign: 'center'
  },
  logo: {
    fontSize: '600%',
    paddingBottom: theme.spacing(2)
  },
  inputContainer: {
    marginTop: theme.spacing(2)
  },
  inputPaper: {
    padding: `2px ${theme.spacing(2)}px`,
    marginLeft: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '3em'
  },
  input: {
    marginLeft: theme.spacing(2)
  }
}))

export default function HomePage () {
  const classes = useStyles()
  const [url, setUrl] = useState('')

  return (
    <Grid
      container
      justify='center'
      alignContent='center'
      className={classes.root}
    >
      <Grid item className={classes.logo} xs={12}>
        {process.env.REACT_APP_NAME || 'web-grep'}
      </Grid>
      <Grid item xs={5} className={classes.inputContainer}>
        <Paper
          component='form'
          elevation={2}
          className={classes.inputPaper}
        >
          <InputBase
            fullWidth
            placeholder='Search for code, files or a repository'
            className={classes.input}
            onChange={(event) => setUrl(event.target.value)}
          />
          <IconButton component={Link} to={'/' + url}>
            <Icon>search</Icon>
          </IconButton>
        </Paper>
      </Grid>
    </Grid>
  )
}
