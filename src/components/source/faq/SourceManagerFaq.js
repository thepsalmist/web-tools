import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import FaqItem from '../../common/FaqItem';

const localMessages = {
  title: { id: 'faq.title', defaultMessage: 'FAQ' },
  q1: { id: 'faq.q1', defaultMessage: 'What is Source Manager?' },
  a1: { id: 'faq.a1', defaultMessage: 'Source manager is a tool that allows users to browse the media sources and collections in our database, and suggest more to add.' },
  q2: { id: 'faq.q2', defaultMessage: 'How are stories collected?' },
  a2: { id: 'faq.a2', defaultMessage: 'For the most part, MC collects stories through the RSS feeds of the sources we follow. That means that, overall, we only have content from the moment we start following a specific media source.' },
  q3: { id: 'faq.q3', defaultMessage: 'How far back in time does MC content go?' },
  a3: { id: 'faq.a3', defaultMessage: 'It really depends. We started following sources in 2010. They were mostly US sources. Over the years we have added thousands of sources at various points in time and from many different countries. In our Sources Manager tool you can check and see when we started collecting data from any particular source.' },
  q4: { id: 'faq.q4', defaultMessage: 'What types of sources does MC collect data from?' },
  a4: { id: 'faq.a4', defaultMessage: ' MC focuses on news media, in a broad sense. We follow the online version of offline media organizations (newspapers for the most part), online-only news sources, blogs, and even the websites of some relevant organizations—NGOs, foundations, etc. In general, any media source that is available online and publishes news content in text form is susceptible to be part of our database. Regarding broadcasting, we follow the sites of many radio and TV stations, but we only capture what they publish in text format.' },
  q5: { id: 'faq.q5', defaultMessage: 'How are the different media collections created?' },
  a5: { id: 'faq.a5', defaultMessage: 'Depending on the particular purpose, MC collections are usually created around three main criteria: geography, language, and topic—geography being the most prominent. That means we have collections for specific countries (such as Brazil or Germany), or collections that focus on one particular language regardless of the country (such as a collection that covers national news sources in English across the world), or collections that focus on a specific issue or topic (such as film or sexual and reproductive health and rights).' },
  q6: { id: 'faq.q6', defaultMessage: 'How representative of a media environment are the different collections?' },
  a6: { id: 'faq.a6', defaultMessage: 'When we want to understand a particular media environment we search for sources to produce a collection that can offer a picture as complete as possible of the media discourse in that environment. The issue is not easy. First, because media environments are not clearly delineated, specially online. Second, because in the very dynamic and fragmented networked public sphere it is difficult to find comprehensive listings of sources belonging to a particular environment.' },
  q7: { id: 'faq.q7', defaultMessage: 'Are all collections public and available to all users?' },
  a7: { id: 'faq.a7', defaultMessage: 'Almost all the collections we create are public and available to all users. We sometimes keep collections for internal use only while they are in the process of being created or when they serve specific purposes not relevant to other users—such as testing.' },
  q8: { id: 'faq.q8', defaultMessage: 'Why are there static and dynamic collections?' },
  a8: { id: 'faq.a8', defaultMessage: 'Static collections cannot be changed, while it is possible to add or remove sources from dynamiccollections. We freeze some collections so they can be used over time to compare or replicate research results. We allow some collections to be changed so they can adjust to the changing nature of the media environment they aim to represent and to our evolving knowledge of that environment—new sources may appear, or we may learn about new sources we had not discovered before.' },
};

const NUM_ITEMS = 8;

const SourceManagerFaq = () => {
  const items = [];
  for (let i = 1; i <= NUM_ITEMS; i += 1) {
    items.push((
      <FaqItem key={i} question={localMessages[`q${i}`]} answer={localMessages[`a${i}`]} expanded />
    ));
  }
  return (
    <div className="faq">
      <h2><FormattedMessage {...localMessages.title} /></h2>
      {items}
    </div>
  );
};

SourceManagerFaq.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
};

export default injectIntl(SourceManagerFaq);
