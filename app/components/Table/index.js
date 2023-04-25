/**
 *
 * Table
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TableMaterial from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});
function Table(props) {
  const classes = useStyles();

  const getRows = data => {
    if (Object.keys(data).length !== 0) {
      return Object.keys(data[0]).map(keyData => (
        <TableCell>{keyData}</TableCell>
      ));
    }
    return null;
  };

  return (
    <TableContainer component={Paper}>
      <TableMaterial className={classes.table} aria-label="caption table">
        <TableHead>
          <TableRow>{getRows(props.data)}</TableRow>
        </TableHead>
        <TableBody>
          {props.data.map(keyData => (
            <TableRow key="test">
              {Object.values(keyData).map(value => (
                <TableCell>{value}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TableMaterial>
    </TableContainer>
  );
}

Table.propTypes = {
  data: PropTypes.object,
};

export default Table;
