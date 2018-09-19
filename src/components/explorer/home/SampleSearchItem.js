import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import Link from 'react-router/lib/Link';
import { getUserRoles, hasPermissions, PERMISSION_LOGGED_IN } from '../../../lib/auth';
import { generateQueryParamString } from '../../../lib/explorerUtil';
import { assetUrl } from '../../../lib/assetUtil';

const SampleSearchItem = (props) => {
  const { search, user } = props;
  // dissect the search and put it into the url if logged in...
  // else just put in the id...
  const isNotLoggedInUser = !(hasPermissions(getUserRoles(user), PERMISSION_LOGGED_IN));
  let urlParamString = null;

  if (isNotLoggedInUser) {
    urlParamString = `demo/${search.id}`;
  } else {
    urlParamString = generateQueryParamString(search.queries);
    urlParamString = `search?q=${urlParamString}`;
  }
  const link = `/queries/${urlParamString}`;
  return (
    <div className="sample-search-item">
      <h2><Link to={link}>{search.name}</Link></h2>
      <Link to={link}><img width="340" src={assetUrl(`/static/img/sample-searches/${search.imageName}`)} alt={search.name} /></Link>
    </div>
  );
};

SampleSearchItem.propTypes = {
  // from parent
  search: PropTypes.object,
  // from composition
  intl: PropTypes.object.isRequired,
  user: PropTypes.object,
};

export default injectIntl(SampleSearchItem);
