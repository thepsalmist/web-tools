import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import { DeleteButton } from './IconButton';

const localMessages = {
  withSearch: { id: 'explorer.mediaPicker.search', defaultMessage: 'With Search<br /> {value}' },
};

const SourceOrCollectionOrSearchWidget = ({ object, onDelete, onClick, children, link }) => {
  const isSearch = object.addAllSearch === true;
  const isCollection = object.tags_id !== undefined;
  let typeClass = 'source';
  let objectId = object.media_id;
  let name = (object.name || object.label || object.url);
  let subSearch = '';
  if (isCollection) {
    typeClass = 'collection';
    objectId = object.tags_id;
    name = (object.name || object.label || object.tag);
  } else if (isSearch) {
    subSearch = Object.values(object.tags)
      .filter(t => Array.isArray(t) && t.length > 0)
      .map((i) => {
        const tags = i.map(a => (a.selected ? `<li key=${a.tags_id}>${a.label}</li>` : ''));
        return `<ul key=${i.tag_sets_id}>${tags}</ul>`;
      });
    subSearch = <FormattedHTMLMessage {...localMessages.withSearch} values={{ value: subSearch }} />;
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
      {subSearch}
      {children}
      {onDelete && <DeleteButton onClick={onDelete} />}
    </span>
  );
};

SourceOrCollectionOrSearchWidget.propTypes = {
  object: PropTypes.object.isRequired,
  onDelete: PropTypes.func,
  onClick: PropTypes.func,
  children: PropTypes.node,
  link: PropTypes.string,
};

export default SourceOrCollectionOrSearchWidget;
