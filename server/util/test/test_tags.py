import unittest

from server.util.tags import TagDiscoverer, TagSetDiscoverer

# in the "official" instance of Media Cloud
TAG_SPIDERED_STORY = 8875452
STORY_UNDATEABLE_TAG = 8877812
NYT_LABELS_TAG_SET_ID = 1963
NYT_LABELER_1_0_0_TAG_ID = 9360669
TAG_SET_GEOCODER_VERSION = 1937
TAG_SET_NYT_LABELS_VERSION = 1964
GEO_TAG_SET = 1011
CLIFF_ORGS = 2388
CLIFF_PEOPLE = 2389
TAG_SETS_ID_PUBLICATION_COUNTRY = 1935
TAG_SETS_ID_PUBLICATION_STATE = 1962
TAG_SETS_ID_PRIMARY_LANGUAGE = 1969
TAG_SETS_ID_COUNTRY_OF_FOCUS = 1970
TAG_SETS_ID_MEDIA_TYPE = 1972
TAG_SETS_ID_COLLECTIONS = 5
TAG_SET_ABYZ_GEO_COLLECTIONS = 15765102
TAG_SETS_ID_PARTISANSHIP_2019 = 15765109
TAG_SETS_ID_PARTISANSHIP_2016 = 1959


class TagDiscovererTest(unittest.TestCase):

    def testDiscovery(self):
        discoverer = TagDiscoverer()
        assert discoverer.is_spidered_story_tag == TAG_SPIDERED_STORY
        assert discoverer.is_undateable_story_tag == STORY_UNDATEABLE_TAG
        assert 9360669 in discoverer.nyt_themes_version_tags
        assert len(discoverer.cliff_version_tags) > 0
        assert len(discoverer.nyt_themes_version_tags) > 0
        assert discoverer.default_collection_tag is not None
        assert len(discoverer.featured_collection_tags) > 0


class TagSetDiscovererTest(unittest.TestCase):

    def testDiscovery(self):
        discoverer = TagSetDiscoverer()
        assert discoverer.nyt_themes_set == NYT_LABELS_TAG_SET_ID
        assert discoverer.cliff_versions_set == TAG_SET_GEOCODER_VERSION
        assert discoverer.nyt_themes_versions_set == TAG_SET_NYT_LABELS_VERSION
        assert discoverer.cliff_places_set == GEO_TAG_SET
        assert discoverer.cliff_people_set == CLIFF_PEOPLE
        assert discoverer.cliff_orgs_set == CLIFF_ORGS
        assert discoverer.media_pub_country_set == TAG_SETS_ID_PUBLICATION_COUNTRY
        assert discoverer.media_pub_state_set == TAG_SETS_ID_PUBLICATION_STATE
        assert discoverer.media_primary_language_set == TAG_SETS_ID_PRIMARY_LANGUAGE
        assert discoverer.media_subject_country_set == TAG_SETS_ID_COUNTRY_OF_FOCUS
        assert discoverer.media_type_set == TAG_SETS_ID_MEDIA_TYPE
        assert discoverer.collections_set == TAG_SETS_ID_COLLECTIONS
        assert discoverer.geo_collections_set == TAG_SET_ABYZ_GEO_COLLECTIONS
        assert discoverer.partisan_2019_collections_set == TAG_SETS_ID_PARTISANSHIP_2019
        assert discoverer.partisan_2016_collections_set == TAG_SETS_ID_PARTISANSHIP_2016


if __name__ == "__main__":
    unittest.main()
