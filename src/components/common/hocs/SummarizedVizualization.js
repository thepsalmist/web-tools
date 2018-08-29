import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import AppButton from '../AppButton';
import messages from '../../../resources/messages';

const localMessage = {
  showDetails: { id: 'summarizedContainer.description.show', defaultMessage: 'learn more' },
  hideDescription: { id: 'summarizedContainer.description.hide', defaultMessage: 'hide details' },
};

function withSummary(titleMessage, introMessage, detailedMessage, wide) {
  return (ChildComponent) => {
    class SummarizedVisualization extends React.Component {
      state = {
        showingDetails: false,
        extraContent: null,
      };
      toggleShowingDetails = () => {
        this.setState({ showingDetails: !this.state.showingDetails });
      }
      handleExtraContent = (extraContent) => {
        this.setState({ extraContent });
      }
      render() {
        const { handleExplore } = this.props;
        const { formatMessage } = this.props.intl;
        let detailsContent;
        let showDetailsButton;

        if (detailedMessage) {  // only toggle extra text if there is any
          if (this.state.showingDetails) {
            if (Array.isArray(detailedMessage)) {
              detailsContent = detailedMessage.map(msgId => <FormattedHTMLMessage key={msgId.id} {...msgId} />);
            } else {
              detailsContent = <FormattedHTMLMessage {...detailedMessage} />;
            }
            detailsContent = (
              <span className="summary-details">
                {detailsContent}
                <p>
                  <a onTouchTap={this.toggleShowingDetails}>
                    <FormattedHTMLMessage {...localMessage.hideDescription} />
                  </a>
                </p>
              </span>
            );
          } else {
            showDetailsButton = (
              <a onTouchTap={this.toggleShowingDetails}>
                <FormattedHTMLMessage {...localMessage.showDetails} />
              </a>
            );
          }
        }

        return (
          <div className={`summarized-viz ${wide ? 'wide' : ''}`}>
            <Row>
              <Col lg={wide ? 3 : 4}>
                <div className="summary">
                  { titleMessage && <h2><FormattedHTMLMessage {...titleMessage} /></h2> }
                  { handleExplore && (
                    <AppButton
                      label={formatMessage(messages.details)}
                      onClick={handleExplore}
                    />
                  )}
                  <div className="summary-intro">
                    <FormattedHTMLMessage {...introMessage} />
                    {showDetailsButton}
                  </div>
                  {detailsContent}
                </div>
              </Col>
              {!wide && <Col lg={1} />}
              <Col lg={wide ? 9 : 7}>
                <div className="content">
                  <ChildComponent {...this.props} showingDetails={this.state.showingDetails} handleExtraContent={this.handleExtraContent} />
                </div>
              </Col>
            </Row>
            {this.state.extraContent}
          </div>
        );
      }
    }

    SummarizedVisualization.propTypes = {
      intl: PropTypes.object.isRequired,
      // from child:
      handleExplore: PropTypes.func,
    };

    return injectIntl(SummarizedVisualization);
  };
}

export default withSummary;
