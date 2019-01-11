import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
// import Button from '@material-ui/core/Button';
import AppButton from '../AppButton';
import messages from '../../../resources/messages';

/**
 * Use this with the JS Composition pattern to make a Container that has paging controls.
 *
 * Your container MUST expost a `links` property.
 *
 * Your container MUST do one of the following:
 * (a) expose `previousPage` and `nextPage` event handler methods.
 * (b) pass in a onPageChange handler function that accepts (dispatch, props, linkId)
 *
 * Your container receives two buttons:
 * - nextButton (if there is another page)
 * - prevButton (if there is previous page)
 */
function withPaging(ComposedContainer, onPageChange) {
  const PagedContainer = (props) => {
    const { links, nextPage, previousPage, dispatch } = props;
    const { formatMessage } = props.intl;
    let previousButton = null;
    if ((links !== undefined) && {}.hasOwnProperty.call(links, 'previous')) {
      const prevHandler = onPageChange || previousPage;
      previousButton = (
        <div className="paging-button paging-button-previous">
          <AppButton
            label={formatMessage(messages.previousPage)}
            onClick={() => prevHandler(dispatch, props, links.previous)}
          >
            <FormattedMessage {...messages.previousPage} />
          </AppButton>
        </div>
      );
    }
    let nextButton = null;
    if ((links !== undefined) && {}.hasOwnProperty.call(links, 'next')) {
      const nextHandler = onPageChange || nextPage;
      nextButton = (
        <div className="paging-button paging-button-previous">
          <AppButton
            primary
            label={formatMessage(messages.nextPage)}
            onClick={() => nextHandler(dispatch, props, links.next)}
          >
            <FormattedMessage {...messages.nextPage} />
          </AppButton>
        </div>
      );
    }
    return <ComposedContainer {...props} nextButton={nextButton} previousButton={previousButton} />;
  };
  PagedContainer.propTypes = {
    // from compositional chain
    intl: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    // from child
    links: PropTypes.object.isRequired,
    nextPage: PropTypes.func,
    previousPage: PropTypes.func,
  };
  return connect()(PagedContainer);
}

export default withPaging;
