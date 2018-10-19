# interview-cake-project

Technologies: Python 3.6, Django 2.1.2

See frontend folder for frontend details

To deploy locally
```
cd interview-cake-project
virtualenv -p python3 interview-cake-venv
source interview-cake-venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```
