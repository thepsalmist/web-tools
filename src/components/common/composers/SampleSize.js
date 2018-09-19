import PropTypes from 'prop-types';
import React from 'react';
import { VIEW_1K } from '../../../lib/topicFilterUtil';

/**
 * Wrap any component that wants to display an EditableWordCloud. This passes
 * a `fetchData` helper to the child component,.
 */
const withSampleSize = (ChildComponent) => {
  class SampleSize extends React.Component {
    state = {
      sampleSize: VIEW_1K,
    };

    setSampleSize = (nextSize) => {
      const { fetchData, filters } = this.props;
      this.setState({ sampleSize: nextSize });
      fetchData({ filters, sample_size: nextSize });
    }

    render() {
      const { sampleSize } = this.state; // must instantiate here and pass as props to child component - this.state.sampleSize doesn't work
      return (
        <div className="sample-size">
          <ChildComponent
            {...this.props}
            initSampleSize={sampleSize}
            onViewSampleSizeClick={ss => this.setSampleSize(ss)}
          />
        </div>
      );
    }
  }
  SampleSize.propTypes = {
    // from compositional chain
    fetchData: PropTypes.func.isRequired,
    filters: PropTypes.object,
  };
  return SampleSize;
};

export default withSampleSize;
