import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import { FieldArray, Field } from 'redux-form';
import withIntlForm from '../../common/hocs/IntlForm';
import SourceSearchContainer from '../../source/controlbar/SourceSearchContainer';
import SourceOrCollectionChip from '../../common/SourceOrCollectionChip';

const localMessages = {
  add: { id: 'source.add.collections.add', defaultMessage: 'You can search for Sources and Collections to add to this topic:' },
};

const renderCollectionSelector = ({ intro, allowRemoval, maxSources, maxCollections, fields, meta: { error } }) => (
  <div>
    <Row>
      <Col sm={2}>
        <span className="label chip-label">{intro}</span>
      </Col>
      <Col lg={8}>
        {fields.map((name, index) => (
          <Field
            key={name}
            name={name}
            component={(info) => {
              const handleDelete = (allowRemoval || info.meta.dirty) ? () => { fields.remove(index); } : undefined;
              return (
                <SourceOrCollectionChip object={info.input.value} onDelete={handleDelete} />
              );
            }}
          />
        ))}
      </Col>
    </Row>
    <Row>
      <Col lg={12}>&nbsp;</Col>
    </Row>
    <Row>
      <Col lg={2}>
        <span className="label field-label"><FormattedMessage {...localMessages.add} /></span>
      </Col>
      <Col lg={8} className="form-field-text">
        <SourceSearchContainer
          searchSources
          searchStaticCollections
          onCollectionSelected={item => fields.push(item)}
          onMediaSourceSelected={item => fields.push(item)}
          maxSources={maxSources}
          maxCollections={maxCollections}
        />
        {error && <span className="error">{error}</span>}
      </Col>
    </Row>
  </div>
);

renderCollectionSelector.propTypes = {
  fields: PropTypes.object,
  meta: PropTypes.object,
  intro: PropTypes.string.isRequired,
  allowRemoval: PropTypes.bool,
  maxSources: PropTypes.number,
  maxCollections: PropTypes.number,
  validate: PropTypes.func,
};

const SourceCollectionsForm = (props) => {
  const { title, intro, initialValues, allowRemoval, maxSources, maxCollections } = props;
  return (
    <div className="form-section source-collection-form">
      <Row>
        <Col lg={12} md={12} sm={12}>
          <h2>{title}</h2>
        </Col>
      </Row>
      <FieldArray
        name="sourcesAndCollections"
        intro={intro}
        allowRemoval={allowRemoval}
        component={renderCollectionSelector}
        initialValues={initialValues}
        maxSources={maxSources}
        maxCollections={maxCollections}
      />
    </div>
  );
};

SourceCollectionsForm.propTypes = {
  // from parent
  intl: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  intro: PropTypes.string.isRequired,
  initialValues: PropTypes.object,
  allowRemoval: PropTypes.bool,
  maxSources: PropTypes.number,
  maxCollections: PropTypes.number,
};

export default
injectIntl(
  withIntlForm(
    SourceCollectionsForm
  )
);
