import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { push } from 'react-router-redux';
import SimpleSourceSearchContainer from '../../common/SimpleSourceSearchContainer';

const TopicSourceSearchContainer = props => (
  <div className="controlbar controlbar-sources">
    <div className="main">
      <Grid>
        <Row>
          {props.children}
          <Col lg={6} xs={12} className="right">
            {(props.showSearch === true) && (
              <SimpleSourceSearchContainer
                searchSources
                maxSources={12}
                onMediaSourceSelected={props.handleMediaSourceSelected}
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
  // from context
  intl: PropTypes.object.isRequired,
  // from dispatch
  handleMediaSourceSelected: PropTypes.func.isRequired,
  handleCollectionSelected: PropTypes.func.isRequired,
  handleAdvancedSearchSelected: PropTypes.func.isRequired,
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
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      TopicSourceSearchContainer
    )
  );

