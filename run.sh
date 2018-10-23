source venv/bin/activate

# Workers might stall for a while on slower API requests
WORKER_TIMEOUT=60

gunicorn --timeout=$WORKER_TIMEOUT server:app

