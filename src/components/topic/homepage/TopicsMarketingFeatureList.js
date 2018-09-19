import React from 'react';
import MarketingFeatureItem from '../../common/MarketingFeatureItem';

const localMessages = {

  moreContentTitle: { id: 'marketing.globalCollections.title', defaultMessage: 'Discover More Content' },
  moreContentDescription: { id: 'marketing.globalCollections.description', defaultMessage: '<p>A topic is seeded with the stories we already have in our database.  Then it follows the links in those stories to find more reporting that matches your queries, so you get a better picture of coverage across the media ecosystem.  This process, called "spidering", is repeated 15 times to create a bigger corpus for researching. We also apply more rigorous de-duplication of stories that appeared at multiple URLs.</p>' },

  influenceTitle: { id: 'marketing.influence.title', defaultMessage: 'Measure Influence' },
  influenceDescription: { id: 'marketing.influence.description', defaultMessage: '<p>Stories added to a topic get processed for additional information, primarily related to measuring influence. We pull in inlinks and outlinks so you can measure citation and cross-linking within a network of media sources. We collect the number of facebook shares for each story in a topic, so you can measure influence by social sharing patterns. You can also download network maps to further analysis in tools like Gephi.</p>' },

  sliceAndDiceTitle: { id: 'marketing.sliceAndDice.title', defaultMessage: 'Slice and Dice with Subtopics' },
  sliceAndDiceDescription: { id: 'marketing.sliceAndDice.description', defaultMessage: '<p>You can slice and dice your topic into subtopics to support comparative analysis.  We automatically let you group stories by week or month, to support time-based or key-event driven analysis.  You can also create subtopics with a growing list of techniques; allowing you to group stories by simple boolean queries, the country of focus on, the themes they include, and more.</p>' },

};

const TopicsMarketingFeatureList = () => (
  <div className="marketing-feature-list">

    <MarketingFeatureItem
      titleMsg={localMessages.moreContentTitle}
      contentMsg={localMessages.moreContentDescription}
      imageName="discover-content-2x.png"
      imageOnLeft
    />

    <MarketingFeatureItem
      titleMsg={localMessages.influenceTitle}
      contentMsg={localMessages.influenceDescription}
      imageName="influence-2x.png"
    />

    <MarketingFeatureItem
      titleMsg={localMessages.sliceAndDiceTitle}
      contentMsg={localMessages.sliceAndDiceDescription}
      imageName="slide-and-dice-2x.png"
      imageOnLeft
    />

  </div>
);

export default TopicsMarketingFeatureList;
