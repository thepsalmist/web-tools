import logging
import dateutil
import re

logger = logging.getLogger(__name__)

UNDERSCORE_REG = r"(.*?)_([a-zA-Z])"

def ids_from_comma_separated_str(comma_separated_string):
    id_list = []
    if len(comma_separated_string) > 0:
        id_list = [int(cid) for cid in comma_separated_string.split(",") if len(cid) > 0]
    return id_list


def trim_solr_date(date_str):
    return dateutil.parser.parse(date_str).strftime("%Y-%m-%d")


pattern = re.compile(r'(?<!^)(?=[A-Z])')


def camel_to_snake(camel_case: str) -> str:
    return pattern.sub('_', camel_case).lower()


def _camel(match):
    return match.group(1) + match.group(2).upper()


def snake_to_camel(snake: str) -> str:
    return re.sub(UNDERSCORE_REG, _camel, snake, 0)


def as_tag_name(user_label):
    formatted_name = re.sub(r'\W|^(?=\d)', '_', user_label)
    return formatted_name
