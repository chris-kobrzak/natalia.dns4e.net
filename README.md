natalia.dns4e.net
=================

Source code for the new video and image gallery site of my little one.

This is a new version of the site that has not been released yet.

## Server-side configuration

### Web Server

The new Web site is intended to continue to run on a RaspberryPi and due to its hardware limitations it is critically important to choose solutions that are not too resource-hungry.  The Web server is no exception and we are going to stick to Lighttpd or pick another lightweight option.

#### Configuration

TODO (Depending on the solution chosen)

### Database

We are going to use CouchDB and synchronise and persist data from it within the browser using a JavaScript library called PouchDB.  The goal is to achieve a native app-like experience, without all the syncing headaches by delegating the hard work to PouchDB.

#### Requirements

- Apache CouchDB
- Either the ```add-cors-to-couchdb``` NodeJS module or manually adding CORS-related entries to the CouchDB's config file called ```local.ini```

#### Configuration

Most of the below configuration changes can be done either via the [Fauxton Web interface](url:http://127.0.0.1:5984/_utils/fauxton) or directly in the CouchDB configuration file: ```/usr/local/etc/couchdb/local.ini```

- Adding _server admin user_ to disable public access to the database which is the default setting.
- Adding a database user (after adding the user you should see a corresponding document in the system _users database).  Like all other operations in CouchDB, this can be done through their API:

```
curl -X PUT http://127.0.0.1:5984/_users/org.couchdb.user:jan \
     -H "Accept: application/json" \
     -H "Content-Type: application/json" \
     -d '{"name": "natalia_www", "password": "topSecret", "roles": [], "type": "user"}'

// To verify:
curl -X POST http://127.0.0.1:5984/_session -d 'name= natalia_www&password= topSecret'
```
- Leave ```WWW-Authenticate``` commented out
- Enabling CORS to make it possible for PouchDB to talk to the CouchDB database server:

```
enable_cors = true

require_valid_user = true

[cors]
headers = accept, authorization, content-type, origin, referer
methods = GET, PUT, POST, HEAD, DELETE
credentials = true
origins = [* for all hosts or a particular URL]
```

#### CouchDB database name
- Create a database called *natalie_gallery*

#### Makind a database read-only

Create the following document (it will be shown under ```design docs``` in Fauxton)

``` js
{     
  "_id": "_design/natalie_gallery",
  "language": "javascript",
  "validate_doc_update": "
  // The code below needs to be written in one line!
  function(newDoc, oldDoc, userCtx, secObj) {
  var ddoc = this;

  secObj.admins = secObj.admins || {};
  secObj.admins.names = secObj.admins.names || [];
  secObj.admins.roles = secObj.admins.roles || [];

  var isDbAdmin = false;
  if(~ userCtx.roles.indexOf(\"_admin\"))
    isDbAdmin = true;
  if(~ secObj.admins.names.indexOf(userCtx.name))
    isDbAdmin = true;
  for(var i = 0; i < userCtx.roles; i++)
    if(~ secObj.admins.roles.indexOf(userCtx.roles[i]))
      isDbAdmin = true;

  if(isDbAdmin)
    log(\"Admin change on read-only db: \" + newDoc._id);
  else
    throw({forbidden: \"This database is read-only\"});
}"
}
```

Please note, you might need to write the body of the JavaScript function above in one line, otherwise Fauxton might complain.

#### Data

A sample entry in the *natalie_gallery* database:

``` json
{
  "_id": "20130101232300",  // yyyymmddhhmmss
  "title_pl": "Image title in Polish",
  "title_en": "Image title in English",
  "file_name": "File-name.jpg",
  "gallery": "2013-01"  // yyyy-mm
}
```

## Front-end configuration

I am intending to use the following technologies:

- Yeoman with _webapp_ generator,
- Grunt,
- Bower,
- PouchDB,
- jQuery Template,
- jQuery Swipebox,
- Girder or Gridism (the latter is less Sass-friendly though),
- Vanilla JavaScript.