import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../../resources/messages';
import DataCard from '../../DataCard';
import { DownloadButton } from '../../IconButton';
import TagsAndTagSetsTable from '../TagsAndTagSetsTable';

const localMessages = {
  title: { id: 'story.entities.title', defaultMessage: 'Tags on Stories' },
  otherStoryTagTitle: { id: 'admin.story.details.otherTags', defaultMessage: 'Other Tags' },
};

const TagListContainer = (props) => {
  const { story, tagToShow } = props;
  const { formatMessage } = props.intl;
  return (
    <DataCard className="other-tags">
      <div className="actions">
        <DownloadButton
          tooltip={formatMessage(messages.download)}
          onClick={() => {
            window.location = `/api/stories/${story.stories_id}/tags.csv`;
          }}
        />
      </div>
      <h2>
        <FormattedMessage {...localMessages.otherStoryTagTitle} />
      </h2>
      <TagsAndTagSetsTable storyTags={story.story_tags ? story.story_tags.filter(t => tagToShow(t)) : []} />
    </DataCard>
  );
};

TagListContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  story: PropTypes.object,
  tagToShow: PropTypes.func.isRequired,
};

export default
injectIntl(
  TagListContainer
);
