import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { push } from 'react-router-redux';
import SimpleSourceSearchContainer from '../../common/SimpleSourceSearchContainer';

const MediaSearchContainer = props => (
  <div className="controlbar controlbar-sources">
    <div className="topic-media-search">
      <Grid>
        <Row>
          {props.children}
          <Col lg={6} xs={12} className="right">
            {(props.showSearch === true) && (
              <SimpleSourceSearchContainer
                onMediaSourceSelected={props.handleMediaSourceSelected}
              />
            )}
          </Col>
        </Row>
      </Grid>
    </div>
  </div>
);

MediaSearchContainer.propTypes = {
  // from parent
  children: PropTypes.node,
  showSearch: PropTypes.bool,
  topicId: PropTypes.number.isRequired,
  // from context
  intl: PropTypes.object.isRequired,
  // from dispatch
  handleMediaSourceSelected: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleMediaSourceSelected: mediaId => dispatch(push(`topics/${ownProps.topicId}/media/${mediaId}`)),
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    MediaSearchContainer
  )
);
