/**
 *
 * RiskAi
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Table from 'components/Table';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectRiskAi from './selectors';
import reducer from './reducer';
import saga from './saga';

const { Configuration, OpenAIApi } = require('openai');

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  toolbar: {
    minHeight: 60,
    alignItems: 'flex-start',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    alignSelf: 'flex-end',
  },
}));

export function RiskAi() {
  useInjectReducer({ key: 'riskAi', reducer });
  useInjectSaga({ key: 'riskAi', saga });

  const [text, setText] = React.useState('');
  const [query, setQuery] = React.useState('');
  const [dataTable, setDataTable] = React.useState('');

  const classes = useStyles();

  const configuration = new Configuration({
    apiKey: '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',
  });
  const openai = new OpenAIApi(configuration);

  const handleChange = event => {
    setText(event.target.value);
  };
  console.log(process.env.API_KEY_AI);
  return (
    <div>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h5" noWrap>
            RiskAI
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid container spacing={2} style={{ padding: '50px' }}>
        <Grid item xs={12} sm={12}>
          <Typography variant="title" gutterBottom>
            ### Postgres SQL tables, with their properties:
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Typography variant="title" gutterBottom>
            # # Employee(id, name, department_id, age)
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Typography variant="title" gutterBottom>
            # Department(id, name, address)
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Typography variant="title" gutterBottom>
            # Salary_Payments(id,employee_id, amount, date)
          </Typography>
        </Grid>
        <Grid container style={{ marginTop: '20px' }}>
          <Grid item xs={12} sm={12}>
            <Typography variant="title" gutterBottom>
              ### Modelo-inteligencia: code-davinci-002 (Translate natural
              language to SQL queries. ){' '}
            </Typography>
            <a
              href="https://beta.openai.com/examples/default-sql-translate"
              target="_blank"
            >
              Más información
            </a>
            <Grid style={{ marginTop: '10px' }}>
              <Typography
                variant="subtitle2"
                gutterBottom
                style={{ fontSize: '18px' }}
              >
                ### Es una versión beta, se tiene que estructurar la sentencia
                lo más correcto posible, para tener un resultado más acertado.
              </Typography>
            </Grid>
            <Grid style={{ marginTop: '20px' }}>
              <TextField
                fullWidth
                label="Text"
                id="fullWidth"
                variant="filled"
                onChange={handleChange}
              />
            </Grid>
            <Button
              variant="contained"
              style={{ marginTop: '20px' }}
              onClick={() => {
                setQuery('');
                setDataTable('');
                openai
                  .createCompletion({
                    model: 'text-davinci-003',
                    prompt: `### Postgres SQL tables, with their properties:\n#\n# Employee(id, name, department_id)\n# Department(id, name, address)\n# ${text}\nSELECT`,
                    temperature: 0,
                    max_tokens: 150,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                    stop: ['#', ';'],
                  })
                  .catch(error => {
                    console.log(error);
                  })
                  .then(response => {
                    setQuery(response.data.choices[0].text);
                  });
              }}
            >
              Enviar
            </Button>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Grid item>
              <br />
              {query !== '' ? (
                <Typography variant="title" gutterBottom>
                  Resultado :
                </Typography>
              ) : null}
            </Grid>
            <br />
            <Grid item>
              <Typography variant="h6" gutterBottom>
                SELECT {query}
              </Typography>
              <br />
              <br />
              <Grid item xs={12} sm={12} style={{ marginTop: '20px' }}>
                <Typography variant="title" gutterBottom>
                  ### Modelo-inteligencia: text-davinci-003 (Create simple SQL
                  queries. ){' '}
                </Typography>
                <a
                  href="https://beta.openai.com/examples/default-sql-request"
                  target="_blank"
                >
                  Más información
                </a>
              </Grid>
              <br />
              <Grid item>
                <Button
                  variant="contained"
                  onClick={() => {
                    openai
                      .createCompletion({
                        model: 'text-davinci-003',
                        prompt: `${query} dame el ejemplo de la tabla en json hasta 1 registros`,
                        temperature: 0.5,
                        max_tokens: 300,
                        top_p: 1,
                        frequency_penalty: 1,
                        presence_penalty: 1,
                      })
                      .catch(error => {
                        console.log(error);
                      })
                      .then(response => {
                        setDataTable(response.data.choices[0].text);
                      });
                  }}
                >
                  Vista preliminar
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item style={{ marginTop: '20px' }}>
            <Typography variant="h6" gutterBottom>
              {dataTable !== '' ? dataTable : ''}
            </Typography>
          </Grid>
          <Grid container justify="center" style={{ margin: '50px' }}>
            <Grid item xs={10} sm={10}>
              <Table />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

RiskAi.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  riskAi: makeSelectRiskAi(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(RiskAi);
