
# constants related to NYT labels (ie. tags on stories indicating what they are about)
NYT_LABELER_1_0_0_TAG_ID = 9360669  # the tag that indicates a story was tagged by the NYT labeller version 1
NYT_LABELS_TAG_SET_ID = 1963        # the tag set all the descriptor tags are in
NYT_LABELS_SAMPLE_SIZE = 10000      # the sample size to use for looking at NYT descriptor tags

# constants related to the CLIFF-based geotagging (ie. tags on stories indicating places they are about)
CLIFF_CLAVIN_2_3_0_TAG_ID = 9353691  # the tag that indicates a story was tagged by the CLIFF version 2.3.0
GEO_TAG_SET = 1011                   # the tag set all the geo tags are in
GEO_SAMPLE_SIZE = 10000              # the sample size to use for looking at geo tags

# Source collection tags sets
COLLECTIONS_TAG_SET_ID = 5  # holds all the Media Cloud collections
GV_TAG_SET_ID = 556         # holds country collections made from scraping GlobalVoices outlinks
EMM_TAG_SET_ID = 597        # holds country collections made from scraping European Media Monitor source list

# Source metadata tag sets
TAG_SETS_ID_PUBLICATION_COUNTRY = 1935  # holds the country of publication of a source
TAG_SETS_ID_PUBLICATION_STATE = 1962    # holds the state of publication of a source (only US and India right now)

METADATA_PUB_COUNTRY_NAME = 'pub_country'
METADATA_PUB_STATE_NAME = 'pub_state'

# map from metadata category name, to metadata tag set id
VALID_METADATA_IDS = [
    {METADATA_PUB_COUNTRY_NAME: TAG_SETS_ID_PUBLICATION_COUNTRY},
    {METADATA_PUB_STATE_NAME: TAG_SETS_ID_PUBLICATION_STATE}
]


def is_metadata_tag_set(tag_sets_id):
    '''
    Find out if a tag set is one used to hold metadata on a Source.
    :param tag_sets_id: the id of tag set 
    :return: True if it is a valid metadata tag set, False if it is not
    '''
    for name_to_tags_sets_id in VALID_METADATA_IDS:
        if int(tag_sets_id) in name_to_tags_sets_id.values():
            return True
    return False