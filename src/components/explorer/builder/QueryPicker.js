import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid } from 'react-flexbox-grid/lib';
import * as d3 from 'd3';
import QueryForm from './QueryForm';
import ItemSlider from '../../common/ItemSlider';
import QueryPickerItem from './QueryPickerItem';
import { selectQuery, updateQuery, addCustomQuery } from '../../../actions/explorerActions';
import { AddQueryButton } from '../../common/IconButton';
import { getPastTwoWeeksDateRange } from '../../../lib/dateUtil';
import { DEFAULT_COLLECTION_OBJECT } from '../../../lib/explorerUtil';

const localMessages = {
  mainTitle: { id: 'explorer.querypicker.mainTitle', defaultMessage: 'Query List' },
  intro: { id: 'explorer.querypicker.intro', defaultMessage: 'Here are all available queries' },
  addQuery: { id: 'explorer.querypicker.addQuery', defaultMessage: 'Add query' },
  querySearch: { id: 'explorer.queryBuilder.advanced', defaultMessage: 'Search' },
  searchHint: { id: 'explorer.queryBuilder.hint', defaultMessage: 'Search' },
};

const MAX_COLORS = 20;

class QueryPicker extends React.Component {

  addAQuery(newQueryObj) {
    const { addAQuery } = this.props;
    addAQuery(newQueryObj);
  }

  updateQuery(newInfo) {
    const { updateCurrentQuery, selected } = this.props;
    // TODO handle duplicates
    const updateObject = selected;
    if (newInfo.length) { // assume it's an array
      newInfo.forEach((obj) => {
        if (obj.type === 'source') {
          if (!updateObject.sources.some(s => parseInt(s.id, 10) === parseInt(obj.id, 10))) {
            updateObject.sources.push(obj);
          }
        } else if (obj.type === 'collection') {
          if (!updateObject.collections.some(s => parseInt(s.id, 10) === parseInt(obj.id, 10))) {
            updateObject.collections.push(obj);
          }
        }
      });
    } else {
      const fieldName = newInfo.target ? newInfo.target.name : newInfo.name;
      const fieldValue = newInfo.target ? newInfo.target.value : newInfo.value;
      updateObject[fieldName] = fieldValue;
    }
    updateCurrentQuery(updateObject);
  }

  render() {
    const { selected, queries, setSelectedQuery, isEditable, handleSearch } = this.props;
    const { formatMessage } = this.props.intl;
    let content = null;
    let fixedQuerySlides = null;

    // if DEMO_MODE isEditable = true
    if (queries && queries.length > 0 && selected) {
      fixedQuerySlides = queries.map((query, index) => (
        <div key={index} className={selected.index === index ? 'query-picker-item-selected' : ''}>
          <QueryPickerItem
            key={index}
            query={query}
            selected={selected}
            isEditable={isEditable} // if custom, true for either mode, else if logged in no
            displayLabel={false}
            selectThisQuery={() => setSelectedQuery(query, index)}
            updateQuery={q => this.updateQuery(q)}
          />
        </div>
      ));

      // provide the add Query button, load with default values when Added is clicked
      if (isEditable) {
        const colorPallette = idx => d3.schemeCategory20[idx < MAX_COLORS ? idx : 0];
        const dateObj = getPastTwoWeeksDateRange();
        const newIndex = queries.length; // effectively a +1
        const genDefColor = colorPallette(newIndex);
        const defaultQuery = { index: newIndex, label: 'enter query', q: '', description: 'new', startDate: dateObj.start, endDate: dateObj.end, collections: DEFAULT_COLLECTION_OBJECT, sources: [], color: genDefColor, custom: true };

        const emptyQuerySlide = (
          <div key={fixedQuerySlides.length}>
            <div className="query-picker-item">
              <div className="add-query-item">
                <AddQueryButton
                  key={fixedQuerySlides.length} // this isn't working
                  tooltip={formatMessage(localMessages.addQuery)}
                  onClick={() => this.addAQuery(defaultQuery)}
                />
                <FormattedMessage {...localMessages.addQuery} />
              </div>
            </div>
          </div>
        );

        fixedQuerySlides.push(emptyQuerySlide);
      }
      content = (
        <div className="query-picker">
          <Grid>
            <ItemSlider
              title={formatMessage(localMessages.intro)}
              slides={fixedQuerySlides}
              settings={{ height: 60, dots: false, slidesToShow: 4, slidesToScroll: 1, infinite: false, arrows: fixedQuerySlides.length > 4 }}
            />
          </Grid>
        </div>
      );

      // indicate which queryPickerItem is selected -
      const selectedWithSandCLabels = queries.find(q => q.index === selected.index);
      const sourcesAndCollections = selectedWithSandCLabels.sources.concat(selectedWithSandCLabels.collections);
      const initialValues = sourcesAndCollections ? { ...selectedWithSandCLabels, media: sourcesAndCollections } : {};
      return (
        <div>
          {content}
          <QueryForm
            initialValues={initialValues}
            selected={selectedWithSandCLabels}
            form="queryForm"
            enableReinitialize
            destroyOnUnmount={false}
            buttonLabel={formatMessage(localMessages.querySearch)}
            onSave={handleSearch}
            onChange={event => this.updateQuery(event)}
            isEditable
          />
        </div>
      );
    }
    return ('error - no queries ');
  }
}

QueryPicker.propTypes = {
  queries: React.PropTypes.array,
  sourcesResults: React.PropTypes.array,
  collectionsResults: React.PropTypes.array,
  fetchStatus: React.PropTypes.string.isRequired,
  selected: React.PropTypes.object,
  intl: React.PropTypes.object.isRequired,
  setSelectedQuery: React.PropTypes.func.isRequired,
  isEditable: React.PropTypes.bool.isRequired,
  handleSearch: React.PropTypes.func.isRequired,
  // formData: React.PropTypes.object,
  updateCurrentQuery: React.PropTypes.func.isRequired,
  addAQuery: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  selected: state.explorer.selected,
  queries: state.explorer.queries.queries,
  sourcesResults: state.explorer.queries.sources.results ? state.explorer.queries.sources.results : null,
  collectionsResults: state.explorer.queries.collections.results ? state.explorer.queries.collections.results : null,
  fetchStatus: state.explorer.queries.collections.fetchStatus,
  // formData: formSelector(state, 'q', 'start_date', 'end_date', 'color'),
});


const mapDispatchToProps = (dispatch, ownProps) => ({
  setSelectedQuery: (query, index) => {
    const queryWithIndex = Object.assign({}, query, { index });
    dispatch(selectQuery(queryWithIndex));
  },
  updateCurrentQuery: (query) => {
    if (query) {
      dispatch(updateQuery(query));
    } else {
      dispatch(updateQuery(ownProps.selected)); // this won't e right
    }
  },
  addAQuery: (query) => {
    if (query) {
      dispatch(addCustomQuery(query));
      dispatch(selectQuery(query));
    }
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      QueryPicker
    )
  );
