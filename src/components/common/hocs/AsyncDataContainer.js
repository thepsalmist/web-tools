import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import ErrorTryAgain from '../ErrorTryAgain';
import LoadingSpinner from '../LoadingSpinner';
import * as fetchConstants from '../../../lib/fetchConstants';

// pass this in as the second arg to not show a spinner
export const NO_SPINNER = 0;

/**
 * Use this with the JS Composition pattern to make a Container do an async fetch for you.
 * The container MUST pass in a `fetchAsyncData` method that takes two args - `dispatch` and `props`.
 * You can optionally pass in an array of `propsToRefetchOn` - if properties in this array change then a refetch will be called for you.
 * Also pass in a loadingSpinnerSize of 0 to not display a spinner while it loads.
 */
const withAsyncData = (fetchAsyncData, propsToRefetchOn, loadingSpinnerSize) => {
  const withAsyncDataInner = (ChildComponent) => {
    const spinnerSize = (loadingSpinnerSize !== undefined) ? loadingSpinnerSize : null;
    class AsyncDataContainer extends React.Component {
      state = {
        hasShowResults: false,
      };

      componentDidMount() {
        this.handleRefetch();
      }

      componentWillReceiveProps(nextProps) {
        if (propsToRefetchOn) {
          const oneOfPropsChanged = propsToRefetchOn
            .map(propName => this.props[propName] !== nextProps[propName])
            .reduce((combined, item) => combined || item);
          if (oneOfPropsChanged) {
            fetchAsyncData(this.props.dispatch, nextProps);
          }
        }
        if (nextProps.fetchStatus === fetchConstants.FETCH_SUCCEEDED) {
          this.setState({ hasShowResults: true });
        }
      }

      handleRefetch() {
        const { dispatch } = this.props;
        fetchAsyncData(dispatch, this.props);
      }

      render() {
        const { fetchStatus } = this.props;
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
            content = <ChildComponent {...this.props} onFetchAyncData={this.handleRefetch} />;
            break;
          case fetchConstants.FETCH_FAILED:
            content = (
              <div className="async-loading">
                <ChildComponent {...this.props} />
                <div className="loading-overlay">
                  <div className="overlay-content">
                    <ErrorTryAgain onTryAgain={this.handleRefetch} />
                  </div>
                </div>
              </div>
            );
            break;
          default:
            break;
        }
        return content;
      }
    }

    AsyncDataContainer.propTypes = {
      // from child container
      fetchStatus: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
      // from compositional chain
      dispatch: PropTypes.func.isRequired,
    };

    return connect()(AsyncDataContainer);
  };

  return withAsyncDataInner;
};

export default withAsyncData;
