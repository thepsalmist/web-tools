import logging
import dateutil

logger = logging.getLogger(__name__)


def ids_from_comma_separated_str(comma_separated_string):
    id_list = []
    if len(comma_separated_string) > 0:
        id_list = [int(cid) for cid in comma_separated_string.split(",") if len(cid) > 0]
    return id_list


def trim_solr_date(date_str):
    return dateutil.parser.parse(date_str).strftime("%Y-%m-%d")
