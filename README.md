Backend deployment

1. git clone git@github.com:scopic/interview-cake-project.git

2. cd interview-cake-project

3. Check your python version
type `python --version` or `python3 --version`
Make sure it is >=3.5.

If you don't have Python >=3.5, please follow instructions here to setup python:
https://realpython.com/installing-python/


4. Install pip3 if you don't already have it

https://automatetheboringstuff.com/appendixa/

Check your pip version like so: `pip3 --version`

5. Using pip3 install virtualenv

pip3 install virtualenv

Check out instructions on how to setup pip and virtualenv for linux machine:
https://gist.github.com/Geoyi/d9fab4f609e9f75941946be45000632b

6. Run `virtualenv -p python3 interview-cake-venv`

If virtualenv was installed with python 3 interpreter then `virtualenv interview-cake-venv`
will suffice. However, if you default interpreter is python 2, then you're going to need to
specify the python 3 interpreter `virtualenv -p python3 interview-cake-venv`

More details:
-p PYTHON_EXE, --python=PYTHON_EXE
    The Python interpreter to use, e.g.,
    --python=python3.5 will use the python3.5 interpreter
    to create the new environment.  The default is the
    interpreter that virtualenv was installed with (/Libra
    ry/Frameworks/Python.framework/Versions/3.6/bin/python
    3.6)

7. Run `source interview-cake-venv/bin/activate` to activate your isolated python
environment.

If activation was successful you should see `interview-cake-venv` in your terminal command
prompt.

8. Run `python3 manage.py migrate`

9. Run `python3 manage.py runserver 0.0.0.0:8000`

This will run the django app with local settings. For production you will need to use
gunicorn server with a command
`python3 manage.py runserver 0.0.0.0:8000 --settings=interview_cake.config.production`

10. Navigate to the localhost:8000 in the browser.


Frontend deployment:
Note: If you're only deployed the backend side of the app then
the static files served from the backend are well 'static'. In order to make changes to
the angular app, you need to deploy the frontend side separately.

1. Install npm, the node package manager.

https://docs.npmjs.com/getting-started/installing-node#install-npm--manage-npm-versions

2. `cd <path_to_the_project>/frontend`
Run `npm install` from this directory

If installing of node packages was successful running
`ng -version` should give you something like

```
Angular CLI: 6.2.5
Node: 10.0.0
OS: darwin x64
Angular: 6.1.10
... animations, common, compiler, compiler-cli, core, forms
... http, platform-browser, platform-browser-dynamic
... platform-server, router, upgrade
```

3. Run `ng serve` to start the local node server
It should say `...listening on localhost:4200`.

4. Navigate to localhost:4200 in the browser to see the running app.

Now if you make changes to angular components they should be immediately seen at
localhost:4200 without refreshing or collecting static data for the django app.







