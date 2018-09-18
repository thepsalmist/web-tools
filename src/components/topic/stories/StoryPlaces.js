import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import withHelp from '../../common/hocs/HelpfulContainer';
import DataCard from '../../common/DataCard';

const localMessages = {
  title: { id: 'story.places.title', defaultMessage: 'Geographic Focus' },
  intro: { id: 'story.places.intro', defaultMessage: 'We think this story is about the following places:' },
  notParsed: { id: 'story.places.notParsed', defaultMessage: 'We have not parsed this story for geographic focus.' },
  noPlaces: { id: 'story.places.noPlaces', defaultMessage: 'We did not identify any geographic places this story was about.' },
  helpTitle: { id: 'story.places.help.title', defaultMessage: 'About Geographic Focus' },
  helpText: { id: 'story.places.help.text', defaultMessage: 'This story has been processed with the <a href="https://cliff.mediacloud.org">CLIFF-CLAVIN</a> geocoder.  This finds any geographic places mentioned in the text of the story and tries to determine where they are.  This is based on a set of heuristics we have tested and validated to work at industry-standard levels.  We have listed the most frequently mentioned places in the story here, as the places the story is "about".' },
  unknownPlace: { id: 'story.places.unknownPlace', defaultMessage: 'Unknown place' },
};

const StoryPlaces = (props) => {
  const { tags, helpButton, geocoderVersion } = props;
  let content = null;
  if (geocoderVersion) {
    // it has been geoparsed
    if (tags.length > 0) {
      content = (
        <span>
          <p><FormattedMessage {...localMessages.intro} /></p>
          <ul>
            {tags.map((t) => {
              // might be empty if CLIFF geonames lookup failed
              if (Object.keys(t.geoname).length === 0 && t.geoname.constructor === Object) {
                return (<li key={t.geoname.id}><FormattedMessage {...localMessages.unknownPlace} /></li>);
              }
              return (<li key={t.geoname.id}>{t.geoname.name}{t.geoname.parent ? `, ${t.geoname.parent.name}` : ''}</li>);
            })}
          </ul>
        </span>
      );
    } else {
      content = (
        <p><i><FormattedMessage {...localMessages.noPlaces} /></i></p>
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

StoryPlaces.propTypes = {
  // from parent
  tags: PropTypes.array.isRequired,
  geocoderVersion: PropTypes.string,
  // from context
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
};

export default
injectIntl(
  withHelp(localMessages.helpTitle, localMessages.helpText)(
    StoryPlaces
  )
);
