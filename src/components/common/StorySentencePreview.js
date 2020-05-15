import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { safeStoryDate } from './StoryTable';
import { googleFavIconUrl, storyDomainName } from '../../lib/urlUtil';

const localMessages = {
  undateable: { id: 'story.publishDate.undateable', defaultMessage: 'Undateable' },
  foci: { id: 'story.foci.list', defaultMessage: 'List of Subtopics {list}' },
  readArticle: { id: 'story.foci.viewArticle', defaultMessage: 'read article' },
};

const StorySentencePreview = ({ sentences, intl }) => (
  <div className="story-sentence-preview">
    {sentences.map((sentence, idx) => {
      const domainName = storyDomainName(sentence.story);
      return (
        <div key={idx} className="story-sentence-preview-item">
          <p>{`"...${sentence.sentence}..."`}</p>
          <h4>
            <a href={sentence.story.url} rel="noopener noreferrer" target="_blank">
              <img
                className="google-icon"
                src={googleFavIconUrl(domainName)}
                alt={intl.formatMessage(localMessages.readArticle)}
              />
              {sentence.story.medium_name || storyDomainName(sentence.story)}
              <small>{safeStoryDate(sentence.story, intl).text}</small>
            </a>
          </h4>
        </div>
      );
    })}
  </div>
);

StorySentencePreview.propTypes = {
  sentences: PropTypes.array.isRequired,
  intl: PropTypes.object.isRequired,
  onChangeFocusSelection: PropTypes.func,
  sortedBy: PropTypes.string,
  maxTitleLength: PropTypes.number,
};

export default injectIntl(StorySentencePreview);
