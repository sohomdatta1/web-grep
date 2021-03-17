import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Icon from '@material-ui/core/Icon'
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(2),
    borderRadius: 0
  },
  rows: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  flexItems: {
    flexGrow: 0
  },
  button: {
    borderRadius: 50,
    margin: theme.spacing(2)
  },
  sourceButton: {
    '& .MuiButton-label': {
      paddingLeft: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5)
    }
  }
}))

function Footer () {
  const classes = useStyles()
  return (
    <>
      <Paper elevation={0} className={classes.root}>
        <Grid container justify='center' className={classes.rows}>
          <Grid item xs className={classes.flexItems}>
            <Button
              component={Link}
              to='/'
              className={classes.button}
            >
              Home
            </Button>
          </Grid>
          <Grid item xs className={classes.flexItems}>
            <Button
              component={Link}
              to='/about'
              className={classes.button}
            >
              About
            </Button>
          </Grid>
          <Grid item xs className={classes.flexItems}>
            <Button
              component='a'
              href=''
              endIcon={<Icon>launch</Icon>}
              className={
								classes.button + ' ' + classes.sourceButton
							}
            >
              Source
            </Button>
          </Grid>
        </Grid>
        <Grid container justify='center' className={classes.rows}>
          <Grid item className={classes.flexItems}>
            <b>{new Date().getFullYear()} - Soda</b>
          </Grid>
        </Grid>
      </Paper>
    </>
  )
}

export default Footer
