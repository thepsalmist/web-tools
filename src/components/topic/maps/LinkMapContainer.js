import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import LinkMapForm from './LinkMapForm';
import { selectTopic, filterBySnapshot, filterByFocus, filterByTimespan } from '../../../actions/topicActions';
import { generateParamStr } from '../../../lib/apiUtil';

const localMessages = {
  title: { id: 'topic.maps.link.title', defaultMessage: 'Link Map' },
  intro: { id: 'topic.maps.link.title', defaultMessage: 'Generate a network graph showing how the media sources linked to each other.' },
  downloadButton: { id: 'topic.maps.downloadbutton', defaultMessage: 'Download network map' },
  viewButton: { id: 'topic.maps.viewbutton', defaultMessage: 'View network map' },
};

class LinkMapContainer extends React.Component {
  state = {
    viewMap: false,
  }

  componentWillReceiveProps(nextProps) {
    const { fetchData, filters } = this.props;
    if (nextProps.filters.snapshotId !== filters.snapshotId
      || nextProps.filters.timespanId !== filters.timespanId
      || nextProps.filters.focusId !== filters.focusId) {
      fetchData(nextProps);
    }
  }

  enableViewMap = () => {
    this.setState({
      viewMap: true,
    });
  }

  render() {
    const { handleFetchMapData, filters, topicId } = this.props;
    const { formatMessage } = this.props.intl;
    const titleHandler = parentTitle => `${formatMessage(localMessages.title)} | ${parentTitle}`;
    const initialValues = { color_field: 'media_type', num_media: 500, include_weights: false };

    return (
      <Grid>
        <Helmet><title>{titleHandler()}</title></Helmet>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <h1><FormattedMessage {...localMessages.title} /></h1>
            <p><FormattedMessage {...localMessages.intro} /></p>
          </Col>
        </Row>
        <LinkMapForm
          initialValues={initialValues}
          filters={filters}
          topicId={topicId}
          showMap={this.state.viewMap}
          onGetMapData={handleFetchMapData}
          onViewMapData={this.enableViewMap}
          viewLabel={formatMessage(localMessages.viewButton)}
          downloadLabel={formatMessage(localMessages.downloadButton)}
        />
      </Grid>
    );
  }
}

LinkMapContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  // from state
  topicId: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  // from parent
  handleFetchMapData: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  filters: state.topics.selected.filters,
  topicId: state.topics.selected.id,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleFetchMapData: (values) => {
    // try to save it
    const params = generateParamStr({ ...ownProps.location.query, ...values });
    const url = `/api/topics/${ownProps.params.topicId}/map-files/fetchCustomMap?${params}`;

    window.location = url;
  },
  fetchData: () => {
    dispatch(selectTopic(ownProps.params.topicId));
    // select any filters that are there
    const { query } = ownProps.location;
    if (ownProps.location.query.snapshotId) {
      dispatch(filterBySnapshot(query.snapshotId));
    }
    if (ownProps.location.query.focusId) {
      dispatch(filterByFocus(query.focusId));
    }
    if (ownProps.location.query.timespanId) {
      dispatch(filterByTimespan(query.timespanId));
    }
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    LinkMapContainer
  )
);
