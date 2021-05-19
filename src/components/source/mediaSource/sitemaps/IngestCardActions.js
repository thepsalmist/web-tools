import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import AppButton from '../../../common/AppButton';


export default function IngestCardActions({ onClickA, labelA, onClickB, labelB }) {
  return (
    <Grid container spacing={1}>
      <Grid item xs={onClickB ? 6 : 12}>
        <AppButton onClick={onClickA} fullWidth>{ labelA }</AppButton>
      </Grid>
      { onClickB && (
        <Grid item xs={6}>
          <AppButton onClick={onClickB} fullWidth>{ labelB }</AppButton>
        </Grid>
      )}
    </Grid>
  );
}

IngestCardActions.propTypes = {
  labelA: PropTypes.string.isRequired,
  onClickA: PropTypes.func.isRequired,
  labelB: PropTypes.string,
  onClickB: PropTypes.func,
};
