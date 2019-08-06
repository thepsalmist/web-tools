import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import { DeleteButton } from './IconButton';
import { stringifyTags } from '../../lib/explorerUtil';

const localMessages = {
  withSearch: { id: 'explorer.mediaPicker.search', defaultMessage: 'Custom Collection<br /> &nbsp;Name: "{keyword}" <br />&nbsp;{value}' },
};

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
    subSearch = stringifyTags(object.tags, formatMessage);
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
