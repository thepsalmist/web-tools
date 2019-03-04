Caching
=======

*"There are two hard problems in computer science - caching and naming things"*

We use [`dogpile.cache`](https://dogpilecache.readthedocs.io/en/latest/) for front-end caching of results returned from 
the back-end server.  Most function that we want to cache are are decorated like this:

```python
from server.cache import cache
from server.auth import user_mediacloud_client

@cache.cache_on_arguments()
def _cached_list_of_important_things(user_mc_key, arg1, arg2):
    mc = user_mediacloud_client()
    return mc.someEndpoint(arg1, arg2)

```

### Configuration

Dogpile allows for various backends.  We use Redis (>4) as our backend. You configure this by setting an environment 
variable like this: `CACHE_REDIS_URL = redis://localhost/1`.

Useful note - that means that if you want to empty your cache locally you should run `redis-cli FLUSHALL`. 

### Key Generation

We automatically generate cache keys based on the arguments to the function we want to cache.  We created our own method
to do this because we needed to support keyworded arguments (which dogpile.cache doesn't support out of the box).

### Permissions Concerns

Many results from the back-end API are permissions-based, so we have to make sure we don't expose the results of one 
user's call to another user (who might have different permissions).  Our approach to solving this can be seen above, 
where we pass in the user's API key as the first argument to any method we want to cache. This gaurantees that the 
cache for that method is user-local. 

### Modules and Such

In general each tool isolates the methods it needs to cache in an `apicache.py` module.  The idea is that the functions 
in that module follow a pattern like this:

```python
def list_of_important_things(user_mc_key, arg1, arg2):
    return _cached_list_of_important_things(user_mc_key, arg1, arg2)
    
from server.cache import cache
from server.auth import user_mediacloud_client

@cache.cache_on_arguments()
def _cached_list_of_important_things(user_mc_key, arg1, arg2):
    mc = user_mediacloud_client()
    return mc.someEndpoint(arg1, arg2)
```

And other modules in that app should import and use these methods like this:

```python
import apicache
from flask import jsonify
from server import app
import flask_login
from server.util.request import api_error_handler
from server.auth import user_mediacloud_key


@app.route('/api/things/<arg1>/important/<arg2>', methods=['GET'])
@flask_login.login_required
@api_error_handler
def list_important_things(arg1, arg2):
    results = apicache.list_of_important_things(user_mediacloud_key(), arg1, arg2)
    return jsonify(results)

```
