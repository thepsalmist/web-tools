import PropTypes from 'prop-types';
import React from 'react';
import ErrorTryAgain from '../ErrorTryAgain';
import LoadingSpinner from '../LoadingSpinner';
import * as fetchConstants from '../../../lib/fetchConstants';

// pass this in as the second arg to not show a spinner
export const NO_SPINNER = 0;

/**
 * Use this with the JS Composition pattern to make a Container do an async fetch for you.
 * The container MUST pass in a `fetchAsyncData` method that takes two args - `dispatch` and `props`.
 * Pass in a loadingSpinnerSize of 0 to not display it at all.
 */
const withAsyncData = (fetchAsyncData, loadingSpinnerSize) => {
  const withAsyncDataInner = (ChildComponent) => {
    const spinnerSize = (loadingSpinnerSize !== undefined) ? loadingSpinnerSize : null;
    class AsyncDataContainer extends React.Component {
      state = {
        asyncFetchResult: undefined,
        hasShowResults: false,
      };

      componentDidMount() {
        const { dispatch } = this.props;
        const asyncFetchResult = fetchAsyncData(dispatch, this.props);
        this.state = { asyncFetchResult };
      }

      componentWillReceiveProps(nextProps) {
        if (nextProps.fetchStatus === fetchConstants.FETCH_SUCCEEDED) {
          this.setState({ hasShowResults: true });
        }
      }

      render() {
        const { fetchStatus, dispatch } = this.props;
        if (fetchStatus === undefined) {
          const error = { message: `AsyncDataContainer: No fetchStatus defined for your ${ChildComponent.displayName || ChildComponent.name} container`, child: ChildComponent };
          throw error;
        }
        if (fetchAsyncData === undefined) {
          const error = { message: `AsyncDataContainer: No fetchAsyncData defined for your ${ChildComponent.displayName || ChildComponent.name} container!`, child: ChildComponent };
          throw error;
        }
        // support single fetchStatus or an array of them
        const fetchStatusToUse = (typeof fetchStatus === 'string') ? fetchStatus : fetchConstants.combineFetchStatuses(fetchStatus);
        let content = null;
        if (this.state.asyncFetchResult === 'hide') {
          content = null;
        } else {
          switch (fetchStatusToUse) {
            case fetchConstants.FETCH_ONGOING:
              if (this.state.hasShowResults) {
                content = (
                  <div className="async-loading">
                    <ChildComponent {...this.props} />
                    <div className="loading-overlay">
                      <div className="overlay-content">
                        <LoadingSpinner size={spinnerSize} />
                      </div>
                    </div>
                  </div>
                );
              } else if (loadingSpinnerSize !== 0) {
                content = <LoadingSpinner size={spinnerSize} />;
              }
              break;
            case fetchConstants.FETCH_SUCCEEDED:
              content = <ChildComponent {...this.props} />;
              break;
            case fetchConstants.FETCH_FAILED:
              content = (
                <div className="async-loading">
                  <ChildComponent {...this.props} />
                  <div className="loading-overlay">
                    <div className="overlay-content">
                      <ErrorTryAgain onTryAgain={() => fetchAsyncData(dispatch, this.props)} />
                    </div>
                  </div>
                </div>
              );
              break;
            default:
              break;
          }
        }
        return content;
      }
    }

    AsyncDataContainer.propTypes = {
      // from store
      fetchStatus: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
      // from component chain
      dispatch: PropTypes.func.isRequired,
    };

    return AsyncDataContainer;
  };

  return withAsyncDataInner;
};

export default withAsyncData;
