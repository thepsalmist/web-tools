import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

const localMessages = {
  tagsId: { id: 'story.tags.tagsid', defaultMessage: 'Tags Id' },
  tagSetName: { id: 'story.tags.tagsid', defaultMessage: 'Tag Set' },
  tagName: { id: 'story.tags.name', defaultMessage: 'Tag' },
};

const TagsAndTagSetsTable = props => (
  <div className="story-tags-table">
    <table>
      <tbody>
        <tr>
          <th><FormattedMessage {...localMessages.tagSetName} /></th>
          <th><FormattedMessage {...localMessages.tagName} /></th>
          <th><FormattedMessage {...localMessages.tagsId} /></th>
        </tr>
        {props.storyTags.map((tag, idx) => (
          <tr key={`tag-${idx}`} className={(idx % 2 === 0) ? 'even' : 'odd'}>
            <td>{tag.tag_set}</td>
            <td>{tag.tag}</td>
            <td className="numeric">{tag.tags_id}</td>
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
