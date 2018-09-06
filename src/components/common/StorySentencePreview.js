import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { storyPubDateToTimestamp } from '../../lib/dateUtil';
import { googleFavIconUrl, storyDomainName } from '../../lib/urlUtil';

const localMessages = {
  undateable: { id: 'story.publishDate.undateable', defaultMessage: 'Undateable' },
  foci: { id: 'story.foci.list', defaultMessage: 'List of Subtopics {list}' },
  readArticle: { id: 'story.foci.viewArticle', defaultMessage: 'read article' },
};

const StorySentencePreview = (props) => {
  const { sentences } = props;
  const { formatMessage, formatDate } = props.intl;
  return (
    <div className="story-sentence-preview">
      {sentences.map((sentence, idx) => {
        let dateToShow = null; // need to handle undateable sentences
        if (sentence.story.publish_date === 'undateable') {
          dateToShow = formatMessage(localMessages.undateable);
        } else {
          dateToShow = formatDate(storyPubDateToTimestamp(sentence.story.publish_date));
          if (sentence.story.date_is_reliable === 0) {
            dateToShow += '?';
          }
        }
        const domainName = storyDomainName(sentence.story);
        return (
          <div key={idx} className="story-sentence-preview-item">
            <p>{`"...${sentence.sentence}..."`}</p>
            <h4>
              <a href={sentence.story.url} rel="noopener noreferrer" target="_blank">
                <img
                  className="google-icon"
                  src={googleFavIconUrl(domainName)}
                  alt={formatMessage(localMessages.readArticle)}
                />
                {sentence.story.medium_name || storyDomainName(sentence.story)}
                <small>{dateToShow}</small>
              </a>
            </h4>
          </div>
        );
      })}
    </div>
  );
};

StorySentencePreview.propTypes = {
  sentences: PropTypes.array.isRequired,
  intl: PropTypes.object.isRequired,
  onChangeFocusSelection: PropTypes.func,
  sortedBy: PropTypes.string,
  maxTitleLength: PropTypes.number,
};

export default injectIntl(StorySentencePreview);
