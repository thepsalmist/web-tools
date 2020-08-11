Required Tags and Tag Sets
==========================

The front-end expects the back-end to have a number of tags and tag-sets defined already. Each install will have these
encoded as different ids in the database, so we use "well known" tag and tag-set names as the way we find them on any
individual install of Media Cloud.  

Tag Sets
--------

A tag-set holds a bunch of tags. Here are the ones the front-end needs.

 * nyt_labels - This stores the top 600 themes we tag stories with from our NYT-News-Labeler engine 
 * nyt_labels_version - This holds one tag for each version of the NYT theme engine we have used (stories are tagged with the version used to process them) 
 * geocoder_version - This holds one tag for each version of the CLIFF entity/geolocation engine we have used (stories are tagged with the version used to process them)
 * cliff_organizations - This has one tag for each org entity the CLIFF engine finds in a story (stories are tagged with these)
 * cliff_people - This has one tag for each person entity the CLIFF engine finds in a story (stories are tagged with these)
 * pub_country - One tag for each country (media sources tagged with these manually)
 * pub_state - One tag for each state/province (media sources tagged with these manually)
 * primary_language - One tag for each language (media sources tagged with these automatically)
 * subject_country - One tag for each country (media sources tagged with these automatically)
 * media_format - One tag for each our of taxonomy of media types (media sources tagged with these manually)
 * collection - Holds all the regular collections you see in Source Mgr (and new collections get made in here)
 * geographic_collection - Holds our maintained geographic collections
 * twitter_partisanship - Berkman Klein Twitter Partisanship quintiles from 2019
 * retweet_partisanship_2016_count_10 - Berkman Klein Twitter Partisanship quintiles from 2016
      
Tags
----

We also use specific tags throughout the UI. Here is a list of those (in the format of "tag-set:tag").

* spidered:spidered - applied to any story discovered while spidering
* date_invalid:undateable - applied to any story that we couldn't find a publication date for automatically
