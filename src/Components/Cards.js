import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  }
}));

const Cards = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={6}>
        {props.children}
      </Grid>
    </div>
  )
}

export default Cards
