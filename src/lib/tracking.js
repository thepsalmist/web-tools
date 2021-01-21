import ReactGA from 'react-ga';

// actions
export const CLICK_ACTION = 'clicked';

// categories
export const EXPLORER_SEARCH_CATEGORY = 'mc.bi.explorer.search';
export const EXPLORER_SEARCH_LOAD = 'mc.bi.explorer.load-search';
export const EXPLORER_SEARCH_SAVE = 'mc.bi.explorer.save-search';

export const EXPLORER_RESULTS_TAB_ATTENTION = 'mc.bi.explorer.tab-attention';
export const EXPLORER_RESULTS_TAB_LANGUAGE = 'mc.bi.explorer.tab-language';
export const EXPLORER_RESULTS_TAB_ENTITIES = 'mc.bi.explorer.tab-entities';


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
