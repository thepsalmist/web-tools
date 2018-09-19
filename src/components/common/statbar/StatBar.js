import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import Stat from './Stat';

const StatBar = props => (
  <div className="stat-bar">
    <Row>
      {props.stats.map((stat, idx) => (
        <Col lg={props.columnWidth || 4} key={idx}>
          <Stat {...stat} />
        </Col>
      ))}
    </Row>
  </div>
);

StatBar.propTypes = {
  // from parent
  stats: PropTypes.array.isRequired,
  className: PropTypes.string,
  columnWidth: PropTypes.number,
  // from context
  intl: PropTypes.object.isRequired,
};

export default
injectIntl(
  StatBar
);
