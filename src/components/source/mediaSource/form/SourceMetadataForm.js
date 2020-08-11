import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import MetadataPickerContainer from '../../../common/MetadataPickerContainer';
import messages from '../../../../resources/messages';

const localMessages = {
  title: { id: 'source.add.metadata.title', defaultMessage: 'Source Metadata' },
};

const SourceMetadataForm = props => (
  <div className="form-section source-metadata-form">
    <Row>
      <Col lg={12}>
        <h2><FormattedMessage {...localMessages.title} /></h2>
      </Col>
    </Row>
    <Row>
      <Col lg={4} xs={12}>
        <MetadataPickerContainer
          id={props.mediaMetadataSetsByName.mediaPubCountrySet}
          name="publicationCountry"
          form="sourceForm"
          initialValues={props.initialValues.metadata ? props.initialValues.metadata.pub_country : null}
          label={props.intl.formatMessage(messages.pubCountry)}
          async
        />
      </Col>
      <Col lg={4} xs={12}>
        <MetadataPickerContainer
          id={props.mediaMetadataSetsByName.mediaPubStateSet}
          name="publicationState"
          form="sourceForm"
          initialValues={props.initialValues.metadata ? props.initialValues.metadata.pub_state : null}
          label={props.intl.formatMessage(messages.pubState)}
          async
        />
      </Col>
      <Col lg={4} xs={12}>
        <MetadataPickerContainer
          id={props.mediaMetadataSetsByName.mediaTypeSet}
          name="mediaType"
          form="sourceForm"
          showDescription
          initialValues={props.initialValues.metadata ? props.initialValues.metadata.media_type : null}
          label={props.intl.formatMessage(messages.mediaType)}
        />
      </Col>
    </Row>
    <Row>
      <Col lg={4} xs={12}>
        <MetadataPickerContainer
          id={props.mediaMetadataSetsByName.mediaSubjectCountrySet}
          name="countryOfFocus"
          form="sourceForm"
          disabled
          initialValues={props.initialValues.metadata ? props.initialValues.metadata.about_country : null}
          label={props.intl.formatMessage(messages.countryOfFocus)}
          async
        />
      </Col>
      <Col lg={4} xs={12}>
        <MetadataPickerContainer
          id={props.mediaMetadataSetsByName.mediaPrimaryLanguageSet}
          name="primaryLanguage"
          form="sourceForm"
          disabled
          initialValues={props.initialValues.metadata ? props.initialValues.metadata.language : null}
          label={props.intl.formatMessage(messages.language)}
        />
      </Col>
    </Row>
  </div>
);

SourceMetadataForm.propTypes = {
  // from compositional chain
  initialValues: PropTypes.object,
  intl: PropTypes.object.isRequired,
  mediaMetadataSetsByName: PropTypes.object.isRequired,
};

export default
injectIntl(
  SourceMetadataForm
);
