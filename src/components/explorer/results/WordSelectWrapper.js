import PropTypes from 'prop-types';
import React from 'react';
import { Row, Col } from 'react-flexbox-grid/lib';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { getUidIndex } from '../../../lib/explorerUtil';

export const LEFT = 0;
export const RIGHT = 1;

class WordSelectWrapper extends React.Component {
/*  componentWillReceiveProps(nextProps) {
    const { selectComparativeWords, leftQuery, rightQuery } = this.props;
    if (nextProps.leftQuery !== leftQuery
      || nextProps.rightQuery !== rightQuery) {
      selectComparativeWords(nextProps.leftQuery, LEFT);
      selectComparativeWords(nextProps.rightQuery, RIGHT);
    }
  }
*/
  selectThisQuery = (targetIndex, uid) => {
    // get value and which menu (left or right) and then run comparison
    // get query out of queries at queries[targetIndex] and pass "q" to fetch
    // store choice of Select
    const { onQuerySelectionChange, queries } = this.props;
    let queryObj = {};
    queryObj = queries[getUidIndex(uid, queries)];
    onQuerySelectionChange(queryObj, targetIndex);
  }

  render() {
    const { queries, leftQuery, rightQuery } = this.props;
    const leftMenuItems = queries.map((q, idx) => <MenuItem key={idx} value={q.uid} disabled={q.uid === rightQuery.uid}>{q.label}</MenuItem>);
    const rightMenuItems = queries.map((q, idx) => <MenuItem key={idx} value={q.uid} disabled={q.uid === leftQuery.uid}>{q.label}</MenuItem>);
    let content = null;
    if (leftQuery !== null) {
      content = (
        <Row>
          <Col lg={3}>
            <Select
              label="Left Column"
              value={leftQuery.uid || queries[0].uid}
              onChange={event => this.selectThisQuery(LEFT, event.target.value)}
              fullWidth
            >
              {leftMenuItems}
            </Select>
          </Col>
          <Col>
            <Select
              label="Right Column"
              value={rightQuery ? rightQuery.uid : queries[1].uid}
              onChange={event => this.selectThisQuery(RIGHT, event.target.value)}
            >
              {rightMenuItems}
            </Select>
          </Col>
        </Row>
      );
    }
    return content;
  }
}

WordSelectWrapper.propTypes = {
  // from parent
  queries: PropTypes.array.isRequired,
  onQuerySelectionChange: PropTypes.func.isRequired,
  leftQuery: PropTypes.object,
  rightQuery: PropTypes.object,
};

export default WordSelectWrapper;
