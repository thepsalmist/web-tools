from server.util.tags import COLLECTION_SET_PARTISANSHIP_QUINTILES_2019
from server.util.csv import SOURCE_LIST_CSV_METADATA_PROPS

SOURCE_LIST_CSV_EDIT_PROPS = ['media_id', 'url', 'name'] + \
                             SOURCE_LIST_CSV_METADATA_PROPS + \
                             ['public_notes', 'editor_notes', 'stories_per_day', 'first_story']


SOURCE_FEED_LIST_CSV_PROPS = ['media_id', 'url', 'name'] + \
                             ['public_notes', 'editor_notes', 'stories_per_day', 'first_story', 'active_feed_count',
                              'num_stories_90', 'latest_scrape_job', 'num_stories_last_year']
