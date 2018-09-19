import PropTypes from 'prop-types';
import React from 'react';
import { Row, Col } from 'react-flexbox-grid/lib';
import { injectIntl } from 'react-intl';
import RecentNewsItem from './RecentNewsItem';

const ReleaseNotes = props => (
  <div className="release-note">
    <div className="release-version">
      <Row>
        <Col lg={8}>
          <h2>{props.release.version}</h2>
        </Col>
        <Col lg={4}>
          <small>{props.release.date}</small>
        </Col>
      </Row>
    </div>
    {props.release.notes.map((item, idx) => <RecentNewsItem item={item} key={`item${idx}`} />)}
  </div>
);

ReleaseNotes.propTypes = {
  // from parent
  release: PropTypes.object,
};

export default
injectIntl(
  ReleaseNotes
);
