import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import messages from '../../resources/messages';
import StatBar from './statbar/StatBar';

/*
 * This requies `tagUtil.mediaSourceMetadataProps(source)` to have been called in the reducer to fill
 * in the named metadata properties on the source object.
 */
const SourceMetadataStatBar = (props) => {
  const { columnWidth, source } = props;
  if (source && source.metadata) {
    return (
      <div className="source-metadata-stat-bar">
        <StatBar
          columnWidth={columnWidth || 3}
          stats={[
            { message: messages.pubCountry, data: source.metadata.pub_country ? source.metadata.pub_country.label : '?' },
            { message: messages.pubState, data: source.metadata.pub_state ? source.metadata.pub_state.label : '?' },
            { message: messages.primaryLanguage,
              data: source.language ? source.metadata.language.label : '?',
              helpTitleMsg: messages.primaryLanguage,
              helpContentMsg: messages.languageHelpContent,
            },
            { message: messages.countryOfFocus,
              data: source.metadata.about_country ? source.metadata.about_country.label : '?',
              helpTitleMsg: messages.entityHelpTitle,
              helpContentMsg: [messages.geoHelpDetailedContent, messages.entityHelpContent],
            },
            { message: messages.mediaType,
              data: source.metadata.media_type ? source.metadata.media_type.label : '?',
              helpTitleMsg: messages.mediaTypeHelpTitle,
              helpContentMsg: messages.mediaTypeHelpContent,
            },
          ]}
        />
      </div>
    );
  }
  return <div />;
};

SourceMetadataStatBar.propTypes = {
  // from parent
  source: PropTypes.object.isRequired,
  columnWidth: PropTypes.number, // optional override - defaults to 3 so it looks good in a 12 wide container
  // from context
  intl: PropTypes.object.isRequired,
};

export default
injectIntl(
  SourceMetadataStatBar
);
