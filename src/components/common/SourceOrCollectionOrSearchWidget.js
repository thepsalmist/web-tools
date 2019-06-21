import PropTypes from 'prop-types';
import React from 'react';
import { DeleteButton } from './IconButton';

const SourceOrCollectionOrSearchWidget = ({ object, onDelete, onClick, children, link }) => {
  const isSearch = object.tags !== undefined;
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
    typeClass = object.name;
    objectId = object.tag_sets_id;
    name = object.label;
    subSearch = object.tags.map(t => t.label);
  }
  // link the text if there is a click handler defined
  let text;
  if (link) {
    text = (<a href={link} target="_blank" rel="noopener noreferrer">{name}</a>);
  } else if (onClick) {
    text = (<a href="#" onClick={onClick}>{name}</a>);
  } else if (isSearch) {
    text = name;
    subSearch = `<span><br />with ${subSearch}</span>`;
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
