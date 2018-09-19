import React from 'react';
import MarketingFeatureItem from '../../common/MarketingFeatureItem';

const localMessages = {

  globalCollectionsTitle: { id: 'marketing.globalCollections.title', defaultMessage: 'Global Coverage' },
  globalCollectionsDescription: { id: 'marketing.globalCollections.description', defaultMessage: '<p>Media Cloud includes a database of sources from around the world.. We have collections covering top media sources in over 100 countries, and add more all the time. Media Cloud also lets you search by language, including various levels of support for English, Spanish, Arabic, Japanese, and other languages. Use the Source Manager to explore our collections.</p>' },

  liveSourcesTitle: { id: 'marketing.liveSources.title', defaultMessage: 'Updating Data from Sources' },
  liveSourcesDescription: { id: 'marketing.liveSources.description', defaultMessage: '<p>Media Cloud imports stories from many of our sources daily (via their RSS feeds).  Stories are processed to split them into sentences and words, discover countries they discuss, and extract people and places they mention. You can download all of this metadata for any story.</p>' },

  metadataTitle: { id: 'marketing.metadata.title', defaultMessage: 'Rich Information About Sources' },
  metadataDescription: { id: 'marketing.metadata.description', defaultMessage: '<p>Media Cloud supports grouping media sources by information about them. Sources can be categorized by the country and state of publication, what type of media source they are, the language they most often write in, or the country they write about most.</p>' },

};

const SourcesMarketingFeatureList = () => (
  <div className="marketing-feature-list">
    <MarketingFeatureItem
      titleMsg={localMessages.globalCollectionsTitle}
      contentMsg={localMessages.globalCollectionsDescription}
      imageName="global-collections-2x.png"
      imageOnLeft
    />
    <MarketingFeatureItem
      titleMsg={localMessages.liveSourcesTitle}
      contentMsg={localMessages.liveSourcesDescription}
      imageName="live-sources-2x.png"
    />
    <MarketingFeatureItem
      titleMsg={localMessages.metadataTitle}
      contentMsg={localMessages.metadataDescription}
      imageName="metadata-2x.png"
      imageOnLeft
    />
  </div>
);

export default SourcesMarketingFeatureList;
