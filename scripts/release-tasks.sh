#!/bin/bash
python -m scripts.cache_tag_sets.py

# install googler tool
curl -o /usr/local/bin/googler https://raw.githubusercontent.com/jarun/googler/v4.0/googler && \
    chmod +x /usr/local/bin/googler && \
    true
