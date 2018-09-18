import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import FaqItem from '../../common/FaqItem';

const localMessages = {
  title: { id: 'faq.title', defaultMessage: 'FAQ' },
  q1: { id: 'faq.q1', defaultMessage: 'What is Media Cloud?' },
  a1: { id: 'faq.a1', defaultMessage: 'Media Cloud is a totally free, open source, and open data platform for storing, retrieving, visualizing, and analyzing online news.' },
  q2: { id: 'faq.q2', defaultMessage: 'What type of data does Media Cloud collect?' },
  a2: { id: 'faq.a2', defaultMessage: 'The bulk of our data is news stories from media sites around the web. In order to allow for insightful analyses of media ecosystems we also optionally collect data such as hyperlinks, Facebook shares, and Twitter shares.' },
  q3: { id: 'faq.q3', defaultMessage: 'How does Media Cloud get the data?' },
  a3: { id: 'faq.a3', defaultMessage: 'Media Cloud collects most of its content through the RSS feeds of the media sources we follow. We only have data for a source from the time we started scraping its\' RSS feeds.' },
  q4: { id: 'faq.q4', defaultMessage: 'What tools exist so that I can explore this data?  ' },
  a4: { id: 'faq.a4', defaultMessage: 'At this moment, we support three main tools. Explorer is the tool that allows you to search our database, visualize the results of your search, and download a CSV file with the urls of the stories in our database that match your query. Topic Mapper is a tool that, taking the results of a Explorer query, crawls the Web in search of new relevant stories by following hyperlinks, and allows for different types of influence analysis and visualization. Source Manager is the tool with which to explore the different sources and media collections from which we collect data, and add new ones.' },
  q5: { id: 'faq.q5', defaultMessage: 'What data can I have access to?' },
  a5: { id: 'faq.a5', defaultMessage: 'We are committed to share as much data as we possibly can, so you can access all the data that we have and download it to your own computer. Due to copyright restrictions we cannot release the actual text of a story.' },
  q6: { id: 'faq.q6', defaultMessage: 'Can I download the content of the stories?' },
  a6: { id: 'faq.a6', defaultMessage: 'Due to copyright restrictions we cannot provide the actual news content, but we can give you a complete list of urls so you can check the content yourself.' },
  q7: { id: 'faq.q7', defaultMessage: 'What can I do with the Explorer tool?' },
  a7: { id: 'faq.a7', defaultMessage: 'You can find out how much the media have been talking about your subject of interest over time, which were the key events that drove coverage about it, which are the words most frequently used around the keywords you searched for, and which media sources have covered the issue—if you want to get into details, you can explore the list of stories. You can also draw comparisons among queries, since the tool is designed to make these easy.' },
  q8: { id: 'faq.q8', defaultMessage: 'What can I do with the Topic Mapper tool?' },
  a8: { id: 'faq.a8', defaultMessage: 'Topic Mapper allows you to answer deeper questions than Explorer, such as: Which are the most influential sources when covering a particular topic? Which were the most relevant stories about a specific issue? Which media form different linking communities? Are there groups of sources that use similar language when talking about an issue? Which stories have more social media traction? How does the structure of online news coverage about an issue evolve over time?' },
  q9: { id: 'faq.q9', defaultMessage: 'Can I run my own topic?' },
  a9: { id: 'faq.a9', defaultMessage: 'Yes, you can use the Topic Mapper tool to create new topics of your own.  These are limited in size (less than 100,000 total stories) to make sure our technical systems aren\'t overhwelmed.' },
  q10: { id: 'faq.q10', defaultMessage: 'Can I add sources to the database?' },
  a10: { id: 'faq.a10', defaultMessage: 'If a source or a set of sources is not already part of our database, you can suggest its addition through the Sources tool, and we will carefully consider your suggestion. Our first inclination is to say yes to suggestions.' },
  q11: { id: 'faq.q11', defaultMessage: 'How can I get more help?' },
  a11: { id: 'faq.a11', defaultMessage: 'Join our <a href="http://groups.io/g/mediacloud">mailing list</a> or send us an email to <a href="mailto:support@mediacloud.org">support@mediacloud.org</a>.' },
};

const NUM_ITEMS = 11;

const ToolsFaq = () => {
  const items = [];
  for (let i = 1; i <= NUM_ITEMS; i += 1) {
    items.push((
      <FaqItem key={i} question={localMessages[`q${i}`]} answer={localMessages[`a${i}`]} />
    ));
  }
  return (
    <div className="faq">
      <h2><FormattedMessage {...localMessages.title} /></h2>
      {items}
    </div>
  );
};

ToolsFaq.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
};

export default injectIntl(ToolsFaq);
