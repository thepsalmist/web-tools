import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

const localMessages = {
  entityName: { id: 'story.tags.name', defaultMessage: 'Tag Name' },
  tagSetsId: { id: 'story.tags.tagsetsid', defaultMessage: 'Tag Sets Id' },
  tagsId: { id: 'story.tags.tagsid', defaultMessage: 'Tags Id' },
};

const TagsAndTagSetsTable = props => (
  <div className="story-tags-table">
    <table>
      <tbody>
        <tr>
          <th><FormattedMessage {...localMessages.entityName} /></th>
          <th className="numeric"><FormattedMessage {...localMessages.tagSetsId} /></th>
          <th className="numeric"><FormattedMessage {...localMessages.tagsId} /></th>
        </tr>
        {props.storyTags.map((tag, idx) => (
          <tr key={`tag-${idx}`} className={(idx % 2 === 0) ? 'even' : 'odd'}>
            <td>{tag.tag}</td>
            <td>{tag.tag_sets_id}</td>
            <td>{tag.tags_id}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

TagsAndTagSetsTable.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  storyTags: PropTypes.array.isRequired,
};

export default
injectIntl(
  TagsAndTagSetsTable
);
