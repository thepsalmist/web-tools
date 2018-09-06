import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import DataCard from '../../common/DataCard';
import messages from '../../../resources/messages';
import withHelp from '../../common/hocs/HelpfulContainer';
import { DownloadButton } from '../../common/IconButton';
import MetadataCoverageItem from './MetadataCoverageItem';
import { TAG_SET_PUBLICATION_COUNTRY, TAG_SET_PUBLICATION_STATE, TAG_SET_PRIMARY_LANGUAGE, TAG_SET_COUNTRY_OF_FOCUS,
  TAG_SET_MEDIA_TYPE } from '../../../lib/tagUtil';

const localMessages = {
  chartTitle: { id: 'collection.summary.metadatacoverage.chart.title', defaultMessage: 'Metadata' },
  title: { id: 'collection.summary.metadatacoverage.title', defaultMessage: 'Metadata Coverage' },
  helpTitle: { id: 'collection.summary.metadatacoverage.help.title', defaultMessage: 'About Metadata Coverage' },
  helpText: { id: 'collection.summary.metadatacoverage.help.text',
    defaultMessage: '<p>These visualizations show you the percentage of sources in this collection that we have tagged with each type of metadata information.</p>',
  },
  cantShow: { id: 'collection.summary.metadatacoverage.cantShow', defaultMessage: 'This collection is empty.' },
  pubCountryTitle: { id: 'collection.summary.metadatacoverage.pubCountry.title', defaultMessage: 'Country of Publication' },
  pubCountryTagged: { id: 'collection.summary.metadatacoverage.pubCountry.tagged', defaultMessage: 'with a country' },
  pubCountryNotTagged: { id: 'collection.summary.metadatacoverage.pubCountry.notTagged', defaultMessage: 'unknown country' },
  pubStateTitle: { id: 'collection.summary.metadatacoverage.pubState.title', defaultMessage: 'State of Publication' },
  pubStateTagged: { id: 'collection.summary.metadatacoverage.pubState.tagged', defaultMessage: 'with a state' },
  pubStateNotTagged: { id: 'collection.summary.metadatacoverage.pubState.notTagged', defaultMessage: 'unknown state' },
  pLanguageTitle: { id: 'collection.summary.metadatacoverage.pLanguage.title', defaultMessage: 'Primary Language' },
  pLanguageTagged: { id: 'collection.summary.metadatacoverage.pLanguage.tagged', defaultMessage: 'with language' },
  pLanguageNotTagged: { id: 'collection.summary.metadatacoverage.pLanguage.notTagged', defaultMessage: 'unknown language' },
  pCountryOfFocusTitle: { id: 'collection.summary.metadatacoverage.pCountryOfFocus.title', defaultMessage: 'Country of Focus' },
  pCountryOfFocusTagged: { id: 'collection.summary.metadatacoverage.pCountryOfFocus.tagged', defaultMessage: 'with country of focus' },
  pCountryOfFocusNotTagged: { id: 'collection.summary.metadatacoverage.pCountryOfFocus.notTagged', defaultMessage: 'unknown country of focus' },
  mediaTypeTitle: { id: 'collection.summary.metadatacoverage.mediaType.title', defaultMessage: 'Media Type' },
  mediaTypeTagged: { id: 'collection.summary.metadatacoverage.mediaType.tagged', defaultMessage: 'with a media type' },
  mediaTypeNotTagged: { id: 'collection.summary.metadatacoverage.mediaType.notTagged', defaultMessage: 'with no media type' },
};

class CollectionMetadataCoverageSummaryContainer extends React.Component {
  downloadCsv = () => {
    const { collection } = this.props;
    const url = `/api/collections/${collection.tags_id}/metadatacoverage.csv`;
    window.location = url;
  }

  render() {
    const { helpButton, sources } = this.props;
    const { formatMessage } = this.props.intl;
    let content = null;
    if (sources.length === 0) {
      content = <p><FormattedMessage {...localMessages.cantShow} /></p>;
    } else {
      content = (
        <Row>
          <Col lg={6}>
            <MetadataCoverageItem
              title={formatMessage(localMessages.pubCountryTitle)}
              sources={sources}
              metadataId={TAG_SET_PUBLICATION_COUNTRY}
              taggedText={formatMessage(localMessages.pubCountryTagged)}
              notTaggedText={formatMessage(localMessages.pubCountryNotTagged)}
            />
          </Col>
          <Col lg={6}>
            <MetadataCoverageItem
              title={formatMessage(localMessages.pubStateTitle)}
              sources={sources}
              metadataId={TAG_SET_PUBLICATION_STATE}
              taggedText={formatMessage(localMessages.pubStateTagged)}
              notTaggedText={formatMessage(localMessages.pubStateNotTagged)}
            />
          </Col>
          <Col lg={6}>
            <MetadataCoverageItem
              title={formatMessage(localMessages.pLanguageTitle)}
              sources={sources}
              metadataId={TAG_SET_PRIMARY_LANGUAGE}
              taggedText={formatMessage(localMessages.pLanguageTagged)}
              notTaggedText={formatMessage(localMessages.pLanguageNotTagged)}
            />
          </Col>
          <Col lg={6}>
            <MetadataCoverageItem
              title={formatMessage(localMessages.pCountryOfFocusTitle)}
              sources={sources}
              metadataId={TAG_SET_COUNTRY_OF_FOCUS}
              taggedText={formatMessage(localMessages.pCountryOfFocusTagged)}
              notTaggedText={formatMessage(localMessages.pCountryOfFocusNotTagged)}
            />
          </Col>
          <Col lg={6}>
            <MetadataCoverageItem
              title={formatMessage(localMessages.mediaTypeTitle)}
              sources={sources}
              metadataId={TAG_SET_MEDIA_TYPE}
              taggedText={formatMessage(localMessages.mediaTypeTagged)}
              notTaggedText={formatMessage(localMessages.mediaTypeNotTagged)}
            />
          </Col>
        </Row>
      );
    }
    return (
      <DataCard>
        <Row>
          <Col lg={12}>
            <div className="actions">
              <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
            </div>
            <h2>
              <FormattedMessage {...localMessages.title} />
              {helpButton}
            </h2>
          </Col>
        </Row>
        {content}
      </DataCard>
    );
  }
}

CollectionMetadataCoverageSummaryContainer.propTypes = {
  // from state
  fetchStatus: PropTypes.string.isRequired,
  // from parent
  collection: PropTypes.object.isRequired,
  sources: PropTypes.array,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  // from composition
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.collections.selected.collectionSourceList.fetchStatus,
  sources: state.sources.collections.selected.collectionSourceList.sources,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
  },
  navToSource: (mediaId) => {
    dispatch(push(`/sources/${mediaId}`));
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withHelp(localMessages.helpTitle, [localMessages.helpText])(
      withAsyncFetch(
        CollectionMetadataCoverageSummaryContainer
      )
    )
  )
);
