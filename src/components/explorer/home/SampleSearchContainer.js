import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import withAsyncData from '../../common/hocs/AsyncDataContainer';
import ItemSlider from '../../common/ItemSlider';
import SampleSearchItem from './SampleSearchItem';
import { fetchSampleSearches } from '../../../actions/explorerActions';

const localMessages = {
  intro: { id: 'explorer.featured.intro', defaultMessage: 'Try one of our sample searches' },
  trySample: { id: 'explorer.featured.trySample', defaultMessage: 'Try one of our sample searches!' },
};

const SampleSearchContainer = (props) => {
  const { samples, user } = props;
  const { formatMessage } = props.intl;
  let content = null;
  let fixedSearchSlides = null;
  // const initialValues = { keyword: 'Search for' };

  if (samples && samples.length > 0) {
    fixedSearchSlides = samples.map((search, index) => (
      <div key={index}><SampleSearchItem search={search} user={user} /></div>
    ));

    content = (
      <ItemSlider
        title={formatMessage(localMessages.intro)}
        slides={fixedSearchSlides}
        settings={{
          height: 60,
          dots: false,
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
          arrows: fixedSearchSlides.length > 3,
        }}
      />
    );
  }

  return (
    <div className="sample-searches">
      <Grid>
        <Row>
          <Col lg={12}>
            <span className="invitation"><FormattedMessage {...localMessages.trySample} /></span>
            {content}
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

SampleSearchContainer.propTypes = {
  // from compositional chan
  intl: PropTypes.object.isRequired,
  // from store
  samples: PropTypes.array,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  samples: state.explorer.samples.list,
  fetchStatus: state.explorer.samples.fetchStatus,
  user: state.user,
});

const fetchAsyncData = dispatch => dispatch(fetchSampleSearches());

export default
injectIntl(
  connect(mapStateToProps)(
    withAsyncData(fetchAsyncData)(
      SampleSearchContainer
    )
  )
);
