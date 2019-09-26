import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncData from '../../../common/hocs/AsyncDataContainer';
import withDescription from '../../../common/hocs/DescribedDataCard';
import OrderedWordCloud from '../../../vis/OrderedWordCloud';
import DataCard from '../../../common/DataCard';
import { fetchWordsByQuery } from '../../../../actions/topicActions';
import messages from '../../../../resources/messages';
import { formatTopicPreviewQuery } from '../../../util/topicUtil';

const localMessages = {
  descriptionIntro: { id: 'topic.summary.words.help.into',
    defaultMessage: "The words most used in the stories we have already have can give you some clues about what is being discussed. If this isn't the conversation you want to capture, then go back and edit your query to remove certain words.",
  },
};
const WORD_CLOUD_DOM_ID = 'topic-summary-word-cloud';

const TopicWordsPreview = (props) => {
  const { words } = props;
  const { formatMessage } = props.intl;
  return (
    <DataCard>
      <h2>
        <FormattedMessage {...messages.topWords} />
      </h2>
      <OrderedWordCloud
        words={words}
        title={formatMessage(messages.topWords)}
        domId={WORD_CLOUD_DOM_ID}
        width={700}
      />
    </DataCard>
  );
};

TopicWordsPreview.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  // passed in
  query: PropTypes.object.isRequired,
  // from parent
  width: PropTypes.number,
  height: PropTypes.number,
  maxFontSize: PropTypes.number,
  minFontSize: PropTypes.number,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  words: PropTypes.array,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.modify.preview.matchingWords.fetchStatus,
  words: state.topics.modify.preview.matchingWords.list,
});

const fetchAsyncData = (dispatch, { query }) => {
  const infoForQuery = formatTopicPreviewQuery(query);
  dispatch(fetchWordsByQuery(infoForQuery));
};

export default
injectIntl(
  connect(mapStateToProps)(
    withDescription(localMessages.descriptionIntro, [messages.wordcloudHelpText])(
      withAsyncData(fetchAsyncData, ['query'])(
        TopicWordsPreview
      )
    )
  )
);
