import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import Alert from '@material-ui/lab/Alert'
import { useState } from 'react'

const useStyles = makeStyles((theme) => ({
  formContainer: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    '& > *': {
      marginTop: theme.spacing(2)
    }
  },
  alert: {
    margin: 0
  }
}))

export default function AddRepository (props) {
  const classes = useStyles()

  const [formData, setFormData] = useState({
    name: props.repo.name,
    url: props.repo.url,
    blurb: props.repo.blurb,
    updateInterval: 14400
  })

  const [submitted, setSubmitted] = useState(false)
  const [isError, setIsError] = useState( false )
  const [response, setResponse] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(true)

    fetch('/api/repos/edit_repo', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then((data) => data.json())
      .then((response) => {
        console.log(response)
        if (response.status) {
          setResponse(response.message)
          setSubmitted( false )
        } else {
          setResponse(response.error)
          setIsError(true)
          setSubmitted(false)
        }
      })
  }

  const updateValue = (field, value) => {
    setFormData((values) => ({
      ...values,
      [field]: value
    }))
  }

  return (
    <Grid
      component='form'
      className={classes.formContainer}
      onSubmit={handleSubmit}
    >
      <Grid item xs={12} className={!submitted ? classes.alert : ''}>
        { response ? (
          <Alert variant='outlined' severity={ isError ? 'error' : 'success' }>
            {response}
          </Alert>
        ) : (
          ''
        )}
      </Grid>
      <Grid item xs={12}>
        <TextField
          label='Repository name'
          required
          fullWidth
          variant='filled'
          className={classes.formElem}
          color='primary'
          value={formData.name}
          onChange={(e) =>
            updateValue('name', e.target.value)}
          disabled={submitted}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label='Repository url'
          required
          fullWidth
          variant='filled'
          className={classes.formElem}
          value={formData.url}
          onChange={(e) =>
            updateValue('url', e.target.value)}
          disabled={submitted}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label='Blurb'
          multiline
          fullWidth
          variant='filled'
          className={classes.formElem}
          value={formData.blurb}
          onChange={(e) =>
            updateValue('blurb', e.target.value)}
          disabled={submitted}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label='Re index interval (defaults to 4 hours)'
          fullWidth
          variant='filled'
          className={classes.formElem}
          value={String(formData.updateInterval)}
          onChange={(e) =>
            updateValue(
              'updateInterval',
              parseInt(e.target.value)
            )}
          disabled={submitted}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          type='submit'
          startIcon={<Icon>poll</Icon>}
          size='large'
          variant='outlined'
          disabled={submitted}
        >
          Save changes
        </Button>&nbsp;&nbsp;
        <Button
          size='large'
          variant='outlined'
          disabled={submitted}
          onClick={props.onCancel}
        >
          Cancel
        </Button>
      </Grid>
    </Grid>
  )
}
