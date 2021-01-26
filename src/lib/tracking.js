import ReactGA from 'react-ga';

// actions
export const CLICK_ACTION = 'clicked';

// categories - explorer
export const EXPLORER_SEARCH_CATEGORY = 'mc.bi.explorer.search';
export const EXPLORER_SEARCH_LOAD = 'mc.bi.explorer.load-search';
export const EXPLORER_SEARCH_SAVE = 'mc.bi.explorer.save-search';

export const EXPLORER_RESULTS_TAB_ATTENTION = 'mc.bi.explorer.results.tab.attention';
export const EXPLORER_RESULTS_TAB_LANGUAGE = 'mc.bi.explorer.results.tab.language';
export const EXPLORER_RESULTS_TAB_ENTITIES = 'mc.bi.explorer.results.tab.entities';

// categories - topics
export const TOPICS_SUMMARY_TAB_INFLUENCE = 'mc.bi.topics.summary.tab.influence';
export const TOPICS_SUMMARY_TAB_ATTENTION = 'mc.bi.topics.summary.tab.attention';
export const TOPICS_SUMMARY_TAB_LANGUAGE = 'mc.bi.topics.summary.tab.language';
export const TOPICS_SUMMARY_TAB_ENTITIES = 'mc.bi.topics.summary.tab.entities';
export const TOPICS_SUMMARY_TAB_STATS = 'mc.bi.topics.summary.tab.stats';
export const TOPICS_SUMMARY_TAB_EXPORT = 'mc.bi.topics.summary.tab.export';

export const TOPICS_WORD2VEC_TIMESPAN_PLAYER_PAUSE = 'mc.bi.topics.word2vec.timespan-player.pause';
export const TOPICS_WORD2VEC_TIMESPAN_PLAYER_PLAY = 'mc.bi.topics.word2vec.timespan-player.play';
export const TOPICS_WORD2VEC_TIMESPAN_PLAYER_PREVIOUS = 'mc.bi.topics.word2vec.timespan-player.previous';
export const TOPICS_WORD2VEC_TIMESPAN_PLAYER_NEXT = 'mc.bi.topics.word2vec.timespan-player.next';

/**
 * Custom tracking
 */
const TrackingEvent = (category, action, label) => {
    ReactGA.event({
        category,
        action,
        label,
    });
};

export default TrackingEvent;
