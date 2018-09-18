import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import withHelp from '../../common/hocs/HelpfulContainer';
import DataCard from '../../common/DataCard';
import messages from '../../../resources/messages';

const localMessages = {
  title: { id: 'story.places.title', defaultMessage: 'Thematic Focus' },
  intro: { id: 'story.places.intro', defaultMessage: 'We think this story is about the following themes:' },
  notParsed: { id: 'story.places.notParsed', defaultMessage: 'We have not parsed this story for thematic focus.' },
  noThemes: { id: 'story.places.noThemes', defaultMessage: 'We did not identify any themes within this story.' },
};

const StoryThemes = (props) => {
  const { tags, helpButton, nytThemesVersion } = props;
  let content = null;
  if (nytThemesVersion) {
    // it has been parsed
    if (tags.length > 0) {
      content = (
        <span>
          <p><FormattedMessage {...localMessages.intro} /></p>
          <ul>
            {tags.map((t, idx) => (<li key={idx}>{t.tag}</li>))}
          </ul>
        </span>
      );
    } else {
      content = (
        <p><i><FormattedMessage {...localMessages.noThemes} /></i></p>
      );
    }
  } else {
    // not geoparsed
    content = (
      <p><i><FormattedMessage {...localMessages.notParsed} /></i></p>
    );
  }
  return (
    <DataCard>
      <h2><FormattedMessage {...localMessages.title} />{helpButton}</h2>
      {content}
    </DataCard>
  );
};

StoryThemes.propTypes = {
  // from parent
  tags: PropTypes.array.isRequired,
  nytThemesVersion: PropTypes.string,
  // from context
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
};

export default
injectIntl(
  withHelp(messages.themeHelpTitle, messages.themeHelpContent)(
    StoryThemes
  )
);
