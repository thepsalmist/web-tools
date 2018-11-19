import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import messages from '../../../resources/messages';
import ConfirmationDialog from '../ConfirmationDialog';
import { updateQuery } from '../../../actions/explorerActions';
import { notEmptyString } from '../../../lib/formValidators';

const localMessages = {
  updateDialogTitle: { id: 'updateQuery.update.title', defaultMessage: 'Update queries with selection' },
  updateDialogText: { id: 'updateQuery.update.text', defaultMessage: 'Update all queries and re-run queries with \'{ type }?\'' },
};

/**
 * Exposes two things to childen:
 * 1) setDataCallback: call this with a function that returns the data to save
 * 1) savedFeedback: a div with info about whether this has been saved or not
 * 2) saveToNotebookButton: a button that can be displayed to request this content be saved
 */
const withUpdatingQuery = (ChildComponent) => {
  class UpdateQueryContainer extends React.Component {
    state = {
      open: false,
      updatedQueryString: null,
      updatedDescription: '',
    };

    handleWidgetClick = (updatedQueryString, updatedDescription) => this.setState({ open: true, updatedQueryString, updatedDescription });

    handleSave = () => {
      const { handleQueryModificationRequested } = this.props;
      this.setState({ open: false });
      handleQueryModificationRequested(this.state.updatedQueryString);
    };

    render() {
      const { formatMessage } = this.props.intl;
      return (
        <span className="saveable">
          <ChildComponent
            {...this.props}
            handleItemSelected={this.handleWidgetClick}
            setDataToSave={this.setDataToSave}
          />
          <ConfirmationDialog
            open={this.state.open}
            title={formatMessage(localMessages.updateDialogTitle)}
            okText={formatMessage(messages.ok)}
            onOk={this.handleSave}
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
    handleQueryModificationRequested: PropTypes.func.isRequired,
    fetchStatus: PropTypes.string.isRequired,
  };
  const mapStateToProps = state => ({
    fetchStatus: state.notebook.current.fetchStatus,
  });
  const mapDispatchToProps = (dispatch, ownProps) => ({
  // call this to add a clause to every query when something is clicked on
    handleQueryModificationRequested: (queryClauseToAdd) => {
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
