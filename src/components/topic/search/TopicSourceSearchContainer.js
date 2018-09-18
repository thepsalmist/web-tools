import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { push } from 'react-router-redux';
import SimpleSourceSearchContainer from '../../common/SimpleSourceSearchContainer';
import { urlToTopicMapper } from '../../../lib/urlUtil';

const TopicSourceSearchContainer = props => (
  <div className="controlbar controlbar-sources">
    <div className="topic-search">
      <Grid>
        <Row>
          {props.children}
          <Col lg={6} xs={12} className="right">
            {(props.showSearch === true) && (
              <SimpleSourceSearchContainer
                searchSources
                maxSources={12}
                onMediaSourceSelected={props.handleMediaSourceSelected}
                goToThisUrl={mediaItem => props.handleUrlCallback(props.topicId, mediaItem)}
              />
            )}
          </Col>
        </Row>
      </Grid>
    </div>
  </div>
);

TopicSourceSearchContainer.propTypes = {
  // from parent
  children: PropTypes.node,
  showSearch: PropTypes.bool,
  topicId: PropTypes.number.isRequired,
  // from context
  intl: PropTypes.object.isRequired,
  // from dispatch
  handleMediaSourceSelected: PropTypes.func.isRequired,
  handleCollectionSelected: PropTypes.func.isRequired,
  handleAdvancedSearchSelected: PropTypes.func.isRequired,
  handleUrlCallback: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = dispatch => ({
  handleMediaSourceSelected: (item) => {
    dispatch(push(`/media/${item.id}`));
  },
  handleCollectionSelected: (item) => {
    dispatch(push(`/media/${item.id}`));
  },
  handleAdvancedSearchSelected: (item) => {
    dispatch(push(`/media/${item.id}`));
  },
  handleUrlCallback: (topicId, mediaItem) => {
    window.location = urlToTopicMapper(`topics/${topicId}/media/${mediaItem}`);
  }, // this may or may not work depending if the source is within the topic
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    TopicSourceSearchContainer
  )
);
