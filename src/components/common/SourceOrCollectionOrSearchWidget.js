import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import { DeleteButton } from './IconButton';
import { metadataQueryFields } from '../../lib/explorerUtil';
import messages from '../../resources/messages';
import { PUBLICATION_COUNTRY, PUBLICATION_STATE, COUNTRY_OF_FOCUS, PRIMARY_LANGUAGE, MEDIA_TYPE } from '../../lib/tagUtil';

const localMessages = {
  withSearch: { id: 'explorer.mediaPicker.search', defaultMessage: 'Custom Collection<br /> &nbsp;Name: \'{keyword}\'<br />&nbsp;{value}' },
};

function getShortName(tagName, formatMessage) {
  switch (tagName) {
    case PUBLICATION_COUNTRY:
      return formatMessage(messages.pubCountryShort);
    case PUBLICATION_STATE:
      return formatMessage(messages.pubStateShort);
    case PRIMARY_LANGUAGE:
      return formatMessage(messages.languageShort);
    case COUNTRY_OF_FOCUS:
      return formatMessage(messages.countryShort);
    case MEDIA_TYPE:
      return formatMessage(messages.mediaTypeShort);
    default:
      return null;
  }
}

const SourceOrCollectionOrSearchWidget = ({ object, onDelete, onClick, link, formatMessage }) => {
  const isSearch = object.customColl === true;
  const isCollection = object.tags_id !== undefined;
  if (!isSearch && !object.selected) return null;

  let typeClass = 'source';
  let objectId = object.media_id;
  let name = (object.name || object.label || object.url);
  let subSearch = '';
  if (isCollection) {
    typeClass = 'collection';
    objectId = object.tags_id;
    name = (object.name || object.label || object.tag);
  } else if (isSearch) {
    typeClass = 'search';
    subSearch = Object.keys(object.tags)
      .filter(t => metadataQueryFields.has(t) > 0 && Array.isArray(object.tags[t]) && object.tags[t].length > 0)
      .map((i) => {
        const obj = object.tags[i];
        const metadataName = getShortName((obj.map(a => a.name).reduce(l => l)), formatMessage);
        const tags = obj.map(a => (a.selected ? a.label : ''));
        if (tags.length > 0) {
          return `&nbsp;<span key=${obj.tag_sets_id}>${metadataName}: ${tags}</span><br />`;
        }
        return [];
      });
    if (subSearch.length > 0) {
      subSearch = <FormattedHTMLMessage {...localMessages.withSearch} values={{ keyword: object.mediaKeyword, value: subSearch }} />;
    }
  }
  // link the text if there is a click handler defined
  let text;
  if (link) {
    text = (<a href={link} target="_blank" rel="noopener noreferrer">{name}</a>);
  } else if (onClick) {
    text = (<a href="#" onClick={onClick}>{name}</a>);
  } else {
    text = name;
  }
  return (
    <span
      className={`media-widget ${typeClass}`}
      key={`media-widget${objectId}`}
    >
      {text}
      {onDelete && <DeleteButton onClick={onDelete} />}
      {subSearch}
    </span>
  );
};

SourceOrCollectionOrSearchWidget.propTypes = {
  object: PropTypes.object.isRequired,
  onDelete: PropTypes.func,
  onClick: PropTypes.func,
  children: PropTypes.node,
  formatMessage: PropTypes.func.isRequired,
  link: PropTypes.string,
};

export default SourceOrCollectionOrSearchWidget;
