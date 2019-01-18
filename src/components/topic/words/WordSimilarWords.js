import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, FormattedHTMLMessage, FormattedNumber, injectIntl } from 'react-intl';
import DataCard from '../../common/DataCard';
import messages from '../../../resources/messages';

const localMessages = {
  title: { id: 'topic.word.similar.title', defaultMessage: 'Similar Words' },
  description: { id: 'topic.word.similar.description', defaultMessage: '<p>This list includes words that have a high probablity of showing up in similar contexts to the word you are looking at (though not necessarily together with it). This is based on the word embeddings model we build as part of our "word space" chart. <a href="https://mediacloud.org/news/2018/5/23/word-spaces-visualizing-word2vec-to-support-media-analysis"Read our recent blog post for details</a>.</p>' },
};

const WordSimilarWords = props => (
  <DataCard>
    <h2>
      <FormattedMessage {...localMessages.title} />
    </h2>
    <FormattedHTMLMessage {...localMessages.description} />
    <div className="word-table">
      <table width="100%">
        <tbody>
          <tr>
            <th><FormattedMessage {...messages.word} /></th>
            <th className="numeric"><FormattedMessage {...messages.score} /></th>
          </tr>
          {props.similarWords.map((item, idx) => (
            <tr key={idx} className={(idx % 2 === 0) ? 'even' : 'odd'}>
              <td>{item.word}</td>
              <td className="numeric">
                <FormattedNumber value={item.score} minimumFractionDigits={3} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </DataCard>
);

WordSimilarWords.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
  // from parent
  similarWords: PropTypes.array.isRequired,
};

export default
injectIntl(
  WordSimilarWords
);
