import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import messages from '../../../resources/messages';

const RecentNewsItem = props => (
  <div className="recent-news-item">
    <Row>
      <Col lg={1}>
        <span className={`news-type news-${props.item.type.toLowerCase()}`}>{props.item.type}</span>
      </Col>
      <Col lg={8}>
        <span dangerouslySetInnerHTML={{ __html: props.item.note }} />
        <small dangerouslySetInnerHTML={{ __html: props.item.details }} />
      </Col>
      <Col lg={1}>
        <span className="item-app-list">
          {props.item.apps.map(app => <span key={app}><FormattedMessage {...messages[`${app}ToolName`]} /> </span>)}
        </span>
      </Col>
    </Row>
  </div>
);

RecentNewsItem.propTypes = {
  // from parent
  item: PropTypes.object,
};

export default
injectIntl(
  RecentNewsItem
);
