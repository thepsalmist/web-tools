import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import messages from '../../../resources/messages';
import ConfirmationDialog from '../ConfirmationDialog';
import { updateQuery } from '../../../actions/explorerActions';
import { notEmptyString } from '../../../lib/formValidators';

const localMessages = {
  updateDialogTitle: { id: 'updateQuery.update.title', defaultMessage: 'Add filter to all queries?' },
  updateDialogText: { id: 'updateQuery.update.text', defaultMessage: 'Would you like to filter for stories that are tagged with "{ type }"? Click ok to add a clause to all your queries.' },
};

const withUpdatingQuery = (ChildComponent) => {
  class UpdateQueryContainer extends React.Component {
    state = {
      open: false,
      updatedQueryClause: null,
      updatedDescription: '',
    };

    handleOk = () => {
      const { modifyQuery } = this.props;
      this.setState({ open: false });
      modifyQuery(this.state.updatedQueryClause);
    };

    render() {
      const { formatMessage } = this.props.intl;
      return (
        <span className="saveable">
          <ChildComponent
            {...this.props}
            openUpdateQueryDialog={(updatedQueryClause, updatedDescription) => this.setState({ open: true, updatedQueryClause, updatedDescription })}
          />
          <ConfirmationDialog
            open={this.state.open}
            title={formatMessage(localMessages.updateDialogTitle)}
            okText={formatMessage(messages.ok)}
            onOk={this.handleOk}
            onCancel={() => this.setState({ open: false })}
          >
            <p><FormattedMessage {...localMessages.updateDialogText} values={{ type: this.state.updatedDescription }} /></p>
          </ConfirmationDialog>
        </span>
      );
    }
  }
  UpdateQueryContainer.propTypes = {
    intl: PropTypes.object.isRequired,
    modifyQuery: PropTypes.func.isRequired,
    queries: PropTypes.array,
  };
  const mapStateToProps = state => ({
    queries: state.explorer.queries.queries,
  });
  const mapDispatchToProps = (dispatch, ownProps) => ({
  // call this to add a clause to every query when something is clicked on
    modifyQuery: (queryClauseToAdd) => {
      ownProps.queries.map((qry) => {
        const quryQ = notEmptyString(qry.q) ? `(${qry.q}) AND` : '';
        const updatedQry = {
          ...qry,
          q: `${quryQ} (${queryClauseToAdd})`,
        };
        return dispatch(updateQuery({ query: updatedQry, fieldName: 'q' }));
      });
    },
  });
  return injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      UpdateQueryContainer
    )
  );
};

export default withUpdatingQuery;
