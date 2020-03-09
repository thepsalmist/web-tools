import logging

from server.auth import user_mediacloud_key
from server.platforms.provider import ContentProvider
from server.platforms.reddit_pushshift import RedditPushshiftProvider
from server.platforms.twitter_pushshift import TwitterPushshiftProvider
from server.platforms.web_mediacloud import WebMediaCloudProvider


logger = logging.getLogger(__name__)

# static list matching topics/info results
PLATFORM_OPEN_WEB = 'web'
PLATFORM_TWITTER = 'twitter'
PLATFORM_REDDIT = 'reddit'
PLATFORM_GENERIC = 'generic_post'
PLATFORM_FACEBOOK = 'facebook'  # coming soon

# static list matching topics/info results
PLATFORM_SOURCE_CRIMSON_HEXAGON = 'crimson_hexagon'
PLATFOMR_SOURCE_CSV = 'csv'
PLATFORM_SOURCE_MEDIA_CLOUD = 'mediacloud'
PLATFORM_SOURCE_PUSHSHIFT = 'pushshift'
PLATFORM_SOURCE_CROWD_TANGLE = 'crowd_tangle'  # coming soon


def provider_for(platform: str, source: str) -> ContentProvider:
    if (platform == PLATFORM_OPEN_WEB) and (source == PLATFORM_SOURCE_MEDIA_CLOUD):
        return WebMediaCloudProvider(user_mediacloud_key())
    if (platform == PLATFORM_TWITTER) and (source == PLATFORM_SOURCE_PUSHSHIFT):
        return TwitterPushshiftProvider()
    if (platform == PLATFORM_REDDIT) and (source == PLATFORM_SOURCE_PUSHSHIFT):
        return RedditPushshiftProvider()
    raise UnknownProviderException(platform, source)


class UnknownProviderException(Exception):
    def __init__(self, platform, source):
        self.message = "Uknown provider {} from {}".format(platform, source)
