import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import messages from '../../../resources/messages';

/**
 * Use this with the JS Composition pattern to make a Container that has paging controls.
 * Your container MUST expose `previousPage` and `nextPage` event handler methods.
 * Most likely those methods will call out to a fetchData property that loads the previous or
 * next page.
 * Your container receives:
 * - nextButton (if there is another page)
 * - prevButton (if there is previous page)
 */
function withPaging(ComposedContainer) {
  const PagedContainer = (props) => {
    const { links, nextPage, previousPage } = props;
    const { formatMessage } = props.intl;
    let previousButton = null;
    if ((links !== undefined) && {}.hasOwnProperty.call(links, 'previous')) {
      previousButton = <Button variant="outlined" label={formatMessage(messages.previousPage)} color="primary" onClick={previousPage}><FormattedMessage {...messages.previousPage} /></Button>;
    }
    let nextButton = null;
    if ((links !== undefined) && {}.hasOwnProperty.call(links, 'next')) {
      nextButton = <Button variant="contained" label={formatMessage(messages.nextPage)} color="primary" onClick={nextPage}><FormattedMessage {...messages.nextPage} /></Button>;
    }
    return <ComposedContainer {...props} nextButton={nextButton} previousButton={previousButton} />;
  };
  PagedContainer.propTypes = {
    intl: PropTypes.object.isRequired,
    links: PropTypes.object.isRequired,
    nextPage: PropTypes.func.isRequired,
    previousPage: PropTypes.func.isRequired,
  };
  return PagedContainer;
}

export default withPaging;
