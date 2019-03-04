import json
import logging
import time
import os
from networkx.readwrite import json_graph
import networkx as nx
from collections import defaultdict
from deco import concurrent, synchronized

from server import TOOL_API_KEY
from server.auth import user_mediacloud_key, user_mediacloud_client
from server.views.topics.apicache import topic_media_list, cached_topic_word_counts

logger = logging.getLogger(__name__)


@concurrent
def _top_words_worker(topics_id, timespans_id, q, num_words):
    # use tool api key here because we're gonna cache it (don't penalize the first user)
    return cached_topic_word_counts(TOOL_API_KEY, topics_id, timespans_id=timespans_id, q=q, num_words=num_words)


@synchronized
def _get_all_top_words(media_jobs):
    top_words = defaultdict(dict)
    for m in media_jobs:
        top_words[m['media_id']] = _top_words_worker(m['topics_id'], m['timespans_id'],
                                                     "media_id:{}".format(m['media_id']), m['word_count'])
    return top_words


def _build_top_words(media_list, topics_id, timespans_id, remove_words=None, word_count=100):
    # TODO: Add parameters for wordCount resolution (sample size, etc.)
    # Output word count run statistics to file for metadata / paradata record
    logger.debug('Getting all words!')
    if remove_words is None:
        remove_words = []
    jobs = [{
        'topics_id': topics_id,
        'timespans_id': timespans_id,
        'word_count': word_count+len(remove_words),
        'media_id': ms['media_id']
    } for ms in media_list]
    top_words = _get_all_top_words(jobs)
    logger.debug('All Words Complete!')
    return top_words


def _clean_top_words(word_set, remove_words_list, word_limit=100):
    for media_source in word_set:
        # remove stopwords        
        word_set[media_source] = [w for w in word_set[media_source] if w['term'] not in remove_words_list]

        # trim any extra words above the word limit
        word_set[media_source] = word_set[media_source][:word_limit]
        
        # maybe output some summary data
        return word_set


def _build_network(top_words, sources, media_attribs=None):
    source_ids = [ms['media_id'] for ms in sources]
    media_sources = {ms['media_id']: ms['name'] for ms in sources}
    
    # Media Source / Word Network
    msw_network = nx.DiGraph()
    # msw_network = nx.Graph()

    # pairwise_sources = {}

    for m in source_ids:
        # pairwise_sources[m] = nx.DiGraph()
        
        if m in list(top_words.keys()):
            for w in top_words[m]:
                msw_network.add_node(w['term'], type='word',
                                     viz={'color': {'r': 77, 'g': 7, 'b': 0},
                                          'position': {'x': 1.0, 'y': 1.0, 'z': 0.0},
                                          'size': 42}
                                     )
                if media_attribs is None:
                    msw_network.add_node(media_sources[m], type='media_source')
                else:
                    msw_network.add_node(media_sources[m], type='media_source',
                                         category=media_attribs[m])
                        
                msw_network.add_edge(media_sources[m], w['term'], weight=w['count'])

                # pairwise_sources[m].add_node(w['term'], type='word')
                # pairwise_sources[m].add_node(media_sources[m], type='media_source')
                # pairwise_sources[m].add_edge(media_sources[m], w['term'], weight=w['count'])
        else:
            logger.debug('Skipping %s...' % media_sources[m])

    # for node in msw_network.nodes_iter():
    #     msw_network[node]['viz'] = {}
    #     msw_network[node]['viz']['position'] = {}
    #     msw_network[node]['viz']['position']['x'] = "1.0"
    #     msw_network[node]['viz']['position']['y'] = "1.0"
    #     msw_network[node]['viz']['position']['z'] = "0.0"
    #     msw_network[node]['viz']['color'] = {}
    #     msw_network[node]['viz']['color']['r'] = "100"
    #     msw_network[node]['viz']['color']['g'] = "100"
    #     msw_network[node]['viz']['color']['b'] = "100"
    #     msw_network[node]['viz']['size'] = "10"

    # logger.debug "== COMMUNITY DETECTION ==\n\n"
    # partition = community.best_partition(msw_network)
    # count = 0.
    # for com in set(partition.values()):
    #     count = count + 1.
    #     list_nodes = [nodes for nodes in partition.keys() if partition[nodes] == com]
    #     for node in list_nodes:
    #         logger.debug "- {0}\n".format(node)
    #         n = msw_network[node]
    #         n['modularity_class'] = str(count)

    return msw_network


def _export_gexf_network(network, filename):
    logger.debug('Writing %d nodes to network in %s.' % (network.number_of_nodes(), filename))
    nx.write_gexf(network, filename)


def _export_d3_network(network, filename):
    logger.debug('Writing %d nodes to network as D3 JSON graph.' % (network.number_of_nodes()))
    data = json_graph.node_link_data(network)
    with open(filename + '.json', 'w') as f:
        f.write(json.dumps(data))


# Remove Media Source from Network 
def _remove_word_source_from_network(ms_name, word_list):
    user_mc = user_mediacloud_client()
    ms = user_mc.mediaList(name_like=ms_name)
    if len(ms) == 1:
        try:
            del word_list[ms[0]['media_id']]
        except KeyError:
            logger.debug('Media Source not present in list.')
    elif len(ms) == 0:
        logger.debug('No match for %s.' % ms_name)
    else:
        logger.debug('Multiple matches for Media Source. No action taken.')


# Remove Media Source from Media Source List
def _remove_media_source(remove_name, media_sources):
    for idx, ms in enumerate(media_sources):
        if ms['name'] == remove_name:
            logger.debug('Deleting %s (%d)' % (ms['name'], ms['media_id']))
            del media_sources[idx]
            return media_sources
    logger.debug('Media Source %s Not Present.' % remove_name)
    return media_sources


# TODO: Enable media source range based on significanc
def _generate_network_of_frames(topics_id, timespans_id, num_of_sources, out_name, top_media_sort,
                                remove_media_list=None, remove_word_list=[], generate_word_lists=False,
                                include_media_list=None, media_attribs=None, num_words=None):
    
    if remove_media_list is None:
        remove_media_list = []

# use this specify attributes on the media source that should be added to the node as attributes        
#     if(media_attribs == None):
#         media_attribs = {}
        
    if include_media_list is None:
        media_sources_md = topic_media_list(user_mediacloud_key(), topics_id, timespans_id=timespans_id,
                                 limit=num_of_sources + len(remove_media_list), sort=top_media_sort)['media']
    else:
        media_sources_md = include_media_list

    if remove_media_list is not None:
        for r in remove_media_list:
            media_sources_md = _remove_media_source(r, media_sources_md)

    top_words = _build_top_words(media_sources_md, topics_id, timespans_id, remove_word_list, num_words)
    if remove_word_list is not None:
        top_words = _clean_top_words(top_words, remove_word_list)

    frame_network = _build_network(top_words, media_sources_md, media_attribs)

    _export_gexf_network(frame_network, '%s.gexf' % out_name)
    _export_d3_network(frame_network, '%s' % out_name)
    
    if generate_word_lists:
        with open('%s.txt' % out_name, 'w', encoding="utf-8") as wl:
            all_words = []
            media_sources = {ms['media_id']: ms['name'] for ms in media_sources_md}
            # counts = {}
            for ms in top_words:
                # wl.write("\n\n%s (media id: %d):\n" % (media_sources[ms].encode('ascii', 'ignore'), ms))
                wl.write("\n\n{} (media id: {}):\n".format(media_sources[ms], ms))
                for w in top_words[ms]:
                    all_words.append(w['term'])

                    # increment count to see how many media source include each word
                    # counts[ms]

                    # wl.write("- %s (%d)\n" % (w['term'].encode('ascii', 'ignore'), w['count']))
                    wl.write("- {} ({})\n".format(w['term'], w['count']))
                wl.write("\n")
    
    linefeed = chr(10)  # linefeed=\n
    s = linefeed.join(nx.generate_gexf(frame_network))  # doctest: +SKIP
    # for line in nx.generate_gexf(frame_network):  # doctest: +SKIP
    #     logger.debug line

    return s


def create_word_map_files(topics_id, timespans_id, filepath, top_media_sort='inlink'):
    start = time.time()
    # create a lock file for inter-process comms
    lock_filename = filepath+'.lock'
    with open(lock_filename, 'a'):
        os.utime(lock_filename, None)
    # Defaults
    num_of_sources = 50
    # remove_media_sources = ['digg.com', 'delicious.com', 'en-gb.facebook', 'newsvine.com', 'nationalservice.gov',
    # 'nobelprize.org', 'Twitter', 'YouTube', 'selmamovie.com', 'hollywoodreporter.com', 'variety.com', 'imdb.com']
    remove_media_sources = []
    remove_words = []
    _generate_network_of_frames(topics_id, timespans_id, num_of_sources, filepath, top_media_sort,
                                remove_media_sources, remove_words, generate_word_lists=True, num_words=100)
    end = time.time()
    duration_secs = end - start
    logger.info("Generated word map for {}/{} in {:.2f}s".format(topics_id, timespans_id, duration_secs))
    # kill the lock file to indicate we are done
    os.remove(lock_filename)

