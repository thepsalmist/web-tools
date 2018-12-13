import PropTypes from 'prop-types';
import React from 'react';
import * as d3 from 'd3';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import OrderedWordCloud from './OrderedWordCloud';

const WORDS_TO_SHOW = 100;
const WORD_CLOUD_WIDTH = 375;

const ComparativeOrderedWordCloud = (props) => {
  const { leftWords, rightWords, leftTitleMsg, centerTitleMsg, rightTitleMsg, leftTextColor, rightTextColor, onWordClick } = props;
  const leftSum = d3.sum(leftWords, d => d.count);
  const rightSum = d3.sum(rightWords, d => d.count);
  let topLeft = leftWords.slice(0, WORDS_TO_SHOW);
  let topRight = rightWords.slice(0, WORDS_TO_SHOW);
  // add normalized count
  topLeft = topLeft.map(d => ({ ...d, tfnorm: d.count / leftSum }));
  topRight = topRight.map(d => ({ ...d, tfnorm: d.count / rightSum }));
  // Find L - R, L int R, R - L
  const terms = {};
  topLeft.forEach((d) => { terms[d.stem] = { ...d, left: true }; });
  topRight.forEach((d) => {
    if (!(d.stem in terms)) { // doesn't exist so just add it
      terms[d.stem] = d;
    } else { // on the left side so we gotta normalize it
      terms[d.stem].tfnorm = (terms[d.stem].count + d.count) / (leftSum + rightSum);
    }
    terms[d.stem].right = true;
  });
  const allTerms = Object.keys(terms).map(key => terms[key]);
  const left = allTerms.filter(d => d.left && !d.right);
  const center = allTerms.filter(d => d.left && d.right);
  const right = allTerms.filter(d => !d.left && d.right);
  center.sort((a, b) => b.tfnorm - a.tfnorm);
  const all = left.concat(right).concat(center);
  const fullExtent = d3.extent(all, d => d.tfnorm);
  return (
    <div className="comparative-ordered-word-cloud">
      <Row>
        <Col lg={4}>
          <h3>{leftTitleMsg}</h3>
          <OrderedWordCloud
            words={left}
            alreadyNormalized
            fullExtent={fullExtent}
            width={WORD_CLOUD_WIDTH}
            textColor={leftTextColor}
            onWordClick={onWordClick}
          />
        </Col>
        <Col lg={4}>
          <h3>{centerTitleMsg}</h3>
          <OrderedWordCloud
            words={center}
            alreadyNormalized
            fullExtent={fullExtent}
            width={WORD_CLOUD_WIDTH}
            onWordClick={onWordClick}
          />
        </Col>
        <Col lg={4}>
          <h3>{rightTitleMsg}</h3>
          <OrderedWordCloud
            words={right}
            alreadyNormalized
            fullExtent={fullExtent}
            width={WORD_CLOUD_WIDTH}
            textColor={rightTextColor}
            onWordClick={onWordClick}
          />
        </Col>
      </Row>
    </div>
  );
};

ComparativeOrderedWordCloud.propTypes = {
  leftWords: PropTypes.array, // array of { count, stem, term }
  rightWords: PropTypes.array, // array of { count, stem, term }
  leftTitleMsg: PropTypes.object,
  centerTitleMsg: PropTypes.object,
  rightTitleMsg: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
  maxFontSize: PropTypes.number,
  minFontSize: PropTypes.number,
  leftTextColor: PropTypes.string,
  rightTextColor: PropTypes.string,
  onWordClick: PropTypes.func,
  linkColor: PropTypes.string,
  showTooltips: PropTypes.bool,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(ComparativeOrderedWordCloud);
