import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../resources/messages';
import LinkWithFilters from '../LinkWithFilters';

class InfluentialStories extends React.Component {

  sortBySocial = () => {
    const { onChangeSort } = this.props;
    onChangeSort('social');
  }

  sortByInlinks = () => {
    const { onChangeSort } = this.props;
    onChangeSort('inlink');
  }

  render() {
    const { stories, topicId } = this.props;
    return (
      <table className="small">
        <tbody>
          <tr>
            <th><FormattedMessage {...messages.storyTitle} /></th>
            <th><FormattedMessage {...messages.media} /></th>
            <th><FormattedMessage {...messages.storyDate} /></th>
            <th><a href="#" onClick={ e => {e.preventDefault(); this.sortByInlinks();}}>
              <FormattedMessage {...messages.inlinks} /></a>
            </th>
            <th><FormattedMessage {...messages.outlinks} /></th>
            <th><a href="#" onClick={ e => {e.preventDefault(); this.sortBySocial();}}>
              <FormattedMessage {...messages.clicks} /></a>
            </th>
          </tr>
          {stories.map((story, idx) =>
            (<tr key={story.stories_id} className={ (idx % 2 === 0) ? 'even' : 'odd'}>
              <td>
                <LinkWithFilters to={`/topics/${topicId}/stories/${story.stories_id}`}>
                  {story.title}
                </LinkWithFilters>
              </td>
              <td><a href={story.media_url}>{story.media_name}</a></td>
              <td>{story.publish_date}</td>
              <td>{story.inlink_count}</td>
              <td>{story.outlink_count}</td>
              <td>{story.bitly_click_count}</td>
            </tr>)
          )}
        </tbody>
      </table>
    );
  }

}

InfluentialStories.propTypes = {
  stories: React.PropTypes.array.isRequired,
  topicId: React.PropTypes.string.isRequired,
  intl: React.PropTypes.object.isRequired,
  onChangeSort: React.PropTypes.func.isRequired,
  sortedBy: React.PropTypes.string.isRequired,
};

export default injectIntl(InfluentialStories);