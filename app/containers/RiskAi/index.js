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
  const [varification, checkQuery] = React.useState('');
  const [dataTable, setDataTable] = React.useState('');

  const classes = useStyles();

  const configuration = new Configuration({
    apiKey: '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',
  });
  const openai = new OpenAIApi(configuration);

  const handleChange = event => {
    setText(event.target.value);
  };

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
          <Typography variant="h5" gutterBottom>
            Buscar información en la base de datos
          </Typography>
        </Grid>
        <Grid container style={{ marginTop: '20px' }}>
          <Grid item xs={12} sm={12}>
            <Grid style={{ marginTop: '20px' }}>
              <TextField
                fullWidth
                label=""
                id="fullWidth"
                variant="filled"
                onChange={handleChange}
              />
            </Grid>
            <Grid container justify="flex-end">
              <Button
                variant="contained"
                style={{ marginTop: '20px' }}
                onClick={() => {
                  setQuery('');
                  setDataTable('');
                  openai
                    .createCompletion({
                      model: 'text-davinci-003',
                      prompt: `"### Postgres SQL tables, with their properties:\n#\n
                      #customer (id, login, password, created, updated, email, email_activated, phone_activated, conekta_id, two_factor, kyc_token, kyc_verified, customer_state_code, account_id, merchant_id, defaulted, comments, banned, can_use_vc, is_replenishment, created_at, updated_at, updated_by_dbuser)\n# 
                      customer_info(id, customer_id, date_birth, address, state, curp, created, updated, name, last_name, second_last_name, city, date_of_birth, gender, post_code, neighbourhood, state_birth, rfc, created_at, updated_at, updated_by_dbuser  )\n# 
                      loan(id, discount_title, discount_price, total_price, success_url, error_url, status, installments, merchant_id, customer_id, shop_id, cart_id, shipping_title, shipping_price, taxes_title, taxes_price, creation_date, cart_url, discount_aplazo, web_hook_url, fee_merchant, fee_tax_merchant, total_settlement, total_loan_amount, installment_amount, first_installment_extra_amount, attempted_payments, interest_loan_amount, external_order_id, updated, is_paid_on_time, amount_to_replenishment, created_at, updated_at, updated_by_dbuser, interest_rate, is_nextquincena, warned_partner)\n# 
                      buyer(id, loan_id, first_name, last_name, address_line, email, phone, postal_code, created_at, updated_at, updated_by_dbuser)\n# 
                      transaction (id, loan_id, status, scheduled_payment_date, amount, payment_date, firstpaymentby, updated, created_at, updated_at , installment_hash)\n#\n##${text}}"`,
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
                      openai
                        .createCompletion({
                          model: 'text-davinci-003',
                          prompt: `""Explicame este query: ${
                            response.data.choices[0].text
                          }"`,
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
                        .then(responseQuery => {
                          checkQuery(responseQuery.data.choices[0].text);
                        });
                    });
                }}
              >
                Buscar
              </Button>
            </Grid>
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
                Query: {query} <br />
                <br /> Explicación:{' '}
                {varification.replace('Este query', 'Esta busqueda')}
              </Typography>
              <Grid item>
                <Button
                  variant="contained"
                  onClick={() => {
                    const requestOptions = {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        query: query.replace('\n\n', ''),
                      }),
                    };
                    fetch(
                      'https://d3gwjc2ohl.execute-api.us-west-1.amazonaws.com',
                      requestOptions,
                    )
                      .then(response => response.json())
                      .then(data => {
                        const rows = data.map(row =>
                          row.reduce((previous, current, idx) => {
                            const newValue = {};
                            newValue[`header_${idx}`] = current;
                            return { ...previous, ...newValue };
                          }, {}),
                        );
                        setDataTable(JSON.stringify(rows));
                      });
                  }}
                >
                  Vista preliminar
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item style={{ marginTop: '20px' }}>
            {/* <Typography variant="h6" gutterBottom>
              {dataTable !== '' ? dataTable : ''}
            </Typography> */}
          </Grid>
          <Grid container justify="center" style={{ margin: '50px' }}>
            <Grid item xs={10} sm={10}>
              <Table data={dataTable !== '' ? JSON.parse(dataTable) : []} />
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
