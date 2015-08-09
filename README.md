# SENG2021 Django App

### Running the app
In the app directory, run:
```
$ ./manage.py runserver
```

### Environment Setup Instructions (Ubuntu)

##### Install python 3 and pip 3
```
$ sudo apt-get install python3
$ sudo apt-get install python3-pip
```

##### Install Django
```
$ pip3 install django
```

##### Install MySQL and database connector for Python
Make the database root password 'password' (just for now). I wasn't able to get a custom added user to work with Django.
```
$ sudo apt-get install mysql-server
$ pip install mysql-python # Need to use pip instead of pip3 because it's not supported in pip3 yet
```
