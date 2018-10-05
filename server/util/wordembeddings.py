import requests

from server import config

# Helpers for accessing data from the Media Cloud Word Embeddings server


def google_news_2d(words):
    results = _query_for_json("/api/v2/google-news/2d",
                              {'words[]': words})
    return results


def topic_2d(topics_id, snapshots_id, words):
    results = _query_for_json("/api/v2/topics/{}/snapshots/{}/2d".format(topics_id, snapshots_id),
                              {'words[]': words})
    return results


def topic_similar_words(topics_id, snapshots_id, words):
    results = _query_for_json("/api/v2/topics/{}/snapshots/{}/similar-words".format(topics_id, snapshots_id),
                              {'words[]': words})
    return results


def _query_for_json(endpoint, data):
    response = requests.post("{}{}".format(config.get('WORD_EMBEDDINGS_SERVER_URL'), endpoint), data=data)
    response_json = response.json()
    if 'results' in response_json:
        return response_json['results']
    return []
