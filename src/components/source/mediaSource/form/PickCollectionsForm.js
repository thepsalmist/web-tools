import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import { reduxForm, FieldArray, Field, propTypes } from 'redux-form';
import withIntlForm from '../../../common/hocs/IntlForm';
import SourceOrCollectionChip from '../../../common/SourceOrCollectionChip';
import SourceSearchContainer from '../../controlbar/SourceSearchContainer';

const localMessages = {
  title: { id: 'source.add.collections.title', defaultMessage: 'Collections' },
  existing: { id: 'source.add.collections.existing', defaultMessage: 'This source is in the following collections:' },
  add: { id: 'source.add.collections.add', defaultMessage: 'Add it to another collection:' },
};

const renderCollectionSelector = ({ fields, meta: { error } }) => (
  <div>
    <Row>
      <Col sm={4} xs={12}>
        <span className="label chip-label"><FormattedMessage {...localMessages.existing} /></span>
      </Col>
      <Col sm={6} xs={12}>
        {fields.map((collection, index) => (
          <Field
            key={collection}
            name={collection}
            component={info => (
              <SourceOrCollectionChip object={info.input.value} onDelete={() => fields.remove(index)} />
            )}
          />
        ))}
        {error && <div className="error">{error}</div>}
      </Col>
    </Row>
    <Row>
      <Col xs={12}>&nbsp;</Col>
    </Row>
    <Row>
      <Col sm={4} xs={6}>
        <span className="label field-label"><FormattedMessage {...localMessages.add} /></span>
      </Col>
      <Col sm={6} xs={6}>
        <SourceSearchContainer
          disableStaticCollections
          searchSources={false}
          searchStaticCollections={false}
          onCollectionSelected={item => fields.push(item)}
        />
      </Col>
    </Row>
  </div>
);
renderCollectionSelector.propTypes = {
  fields: PropTypes.object,
  meta: PropTypes.object,
};

const PickCollectionsForm = () => (
  <div className="form-section source-collection-form">
    <Row>
      <Col lg={12} md={12} sm={12}>
        <h2><FormattedMessage {...localMessages.title} /></h2>
      </Col>
    </Row>
    <FieldArray name="collections" component={renderCollectionSelector} />
  </div>
);


PickCollectionsForm.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
};

export default
injectIntl(
  withIntlForm(
    reduxForm({ propTypes })(
      PickCollectionsForm
    )
  )
);
