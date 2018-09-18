import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Link from 'react-router/lib/Link';
import SourceControlBar from './controlbar/SourceControlBar';
import Permissioned from '../common/Permissioned';
import { PERMISSION_MEDIA_EDIT, PERMISSION_LOGGED_IN } from '../../lib/auth';
import { AddButton } from '../common/IconButton';

const localMessages = {
  addCollection: { id: 'source.controlbar.addCollection', defaultMessage: 'Create a Collection' },
  addSource: { id: 'source.controlbar.addSource', defaultMessage: 'Add a Source' },
};

const PageWrapper = (props) => {
  const { children } = props;
  return (
    <div>
      <Permissioned onlyRole={PERMISSION_LOGGED_IN}>
        <SourceControlBar showSearch>
          <Permissioned onlyRole={PERMISSION_MEDIA_EDIT}>
            <Link to="collections/create">
              <AddButton />
              <FormattedMessage {...localMessages.addCollection} />
            </Link>
            &nbsp; &nbsp;
            <Link to="sources/create">
              <AddButton />
              <FormattedMessage {...localMessages.addSource} />
            </Link>
          </Permissioned>
        </SourceControlBar>
      </Permissioned>
      {children}
    </div>
  );
};

PageWrapper.propTypes = {
  // from parent
  children: PropTypes.node,
};

export default injectIntl(PageWrapper);
