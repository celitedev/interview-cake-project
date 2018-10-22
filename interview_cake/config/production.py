from .base import *


DEBUG = False
ALLOWED_HOSTS = ['interview-cake-course.scopicdev.com']

STATIC_ROOT = os.path.join(BASE_DIR, '..', 'static')

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, '..', 'frontend', 'dist'),
    os.path.join(BASE_DIR, '..', 'frontend', 'src'),
)
