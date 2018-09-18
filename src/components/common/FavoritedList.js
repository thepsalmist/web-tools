import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import DataCard from './DataCard';
import { DownloadButton } from './IconButton';
import messages from '../../resources/messages';

const FavoritedList = (props) => {
  const { title, intro, favoritedItems, onDownload, helpButton } = props;
  const { formatMessage } = props.intl;
  let actions = null;
  if (onDownload) {
    actions = (
      <div className="actions">
        <DownloadButton tooltip={formatMessage(messages.download)} onClick={onDownload} />
      </div>
    );
  }
  return (
    <DataCard className="favorited-list">
      {actions}
      <h2>{title}{helpButton}</h2>
      <p>{intro}</p>
      <div className="">
        {favoritedItems.map(c => <div key={c.tags_id || c.media_id}>{c.name}</div>)}
      </div>
    </DataCard>
  );
};

FavoritedList.propTypes = {
  // from parent
  title: PropTypes.string.isRequired,
  intro: PropTypes.string,
  favoritedItems: PropTypes.array.isRequired,
  linkToFullUrl: PropTypes.bool,
  onDownload: PropTypes.func,
  helpButton: PropTypes.node,
  // from dispatch
  handleClick: PropTypes.func.isRequired,
  // from compositional chain
  intl: PropTypes.object.isRequired,
};

const mapDispatchToProps = () => ({
});

export default
injectIntl(
  connect(null, mapDispatchToProps)(
    FavoritedList
  )
);
