tunia.duckdns.org
=================

Source code for the new video and image gallery site of my little one.

## Server-side configuration

### Web Server

The Web site is intended to run on a RaspberryPi and due to its hardware limitations it is critically important to pick solutions that are not too resource-hungry.  For this reason we have opted for [nginx](http://nginx.org).

#### Configuration

File: `/etc/nginx/sites-available/tunia.duckdns.org`

```
server {
  listen 80; ## listen for ipv4; this line is default and implied

  root /srv/WebRoot/tunia.duckdns.org/html;
  index index.html;

  server_name tunia.duckdns.org;

  location / {
    # First attempt to serve request as file, then
    # as directory, then fall back to displaying a 404.
    try_files $uri $uri/ /index.html;
  }

  location /photo/ {
    alias /srv/Shared/Media/Pictures/Natalia/;
  }

  location /thumbnail/ {
    alias "/srv/Shared/Media/Pictures/Natalia - low res/";
  }

  location /video/ {
    alias /srv/Shared/Media/Video/Natalia/;
  }

  rewrite ^/videos/?$ /videos.html break;
}
```
### Database

We are going to use [CouchDB](http://couchdb.apache.org) and synchronise and persist data from it within the browser using a JavaScript library called [PouchDB](http://pouchdb.com).  The goal is to achieve a native app-like experience, without all the syncing headaches by delegating the hard work to PouchDB.

#### Requirements

- Apache CouchDB
- Either the `add-cors-to-couchdb` [Node.js](http://nodejs.org) module or manually adding CORS-related entries to the CouchDB's config file called `local.ini`

#### Configuration

Most of the below configuration changes can be done either via the [Fauxton Web interface](url:http://127.0.0.1:5984/_utils/fauxton) or directly in the CouchDB configuration file: `/usr/local/etc/couchdb/local.ini`

- Adding _server admin user_ to disable public access to the database which is the default setting.
- Adding a database user (after adding the user you should see a corresponding document in the system _users database).  Like all other operations in CouchDB, this can be done through their API:

```
curl -X PUT http://127.0.0.1:5984/_users/org.couchdb.user:natalie_www \
     -H "Accept: application/json" \
     -H "Content-Type: application/json" \
     -d '{"name": "natalie_www", "password": "topSecret", "roles": [], "type": "user"}'

// To verify:
curl -X POST http://127.0.0.1:5984/_session -d 'name=natalie_www&password=topSecret'
```
- Leave `WWW-Authenticate` commented out
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

#### Making the database read-only

Create the following document (it will be shown under `design docs` in Fauxton)

```js
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

#### Bulk import of data

```
$ curl -d @<JSON file path> \
  -X POST \
  -H "Content-Type: application/json" \
  http://<CouchDB host name>:5984/natalie_gallery/_bulk_docs
```

The format of the JSON file being imported is an object containing the `docs` key which holds an array of JSON documents.

## Front-end configuration

I am intending to use the following technologies:

- [Yeoman](http://yeoman.io) with _webapp_ generator,
- [Grunt](http://gruntjs.com),
- [Bower](http://bower.io),
- PouchDB,
- [jQuery Template](https://github.com/thangchung/jquery-template),
- [jQuery Swipebox](https://github.com/brutaldesign/swipebox),
- Girder or Gridism (the latter is less Sass-friendly though),
- Vanilla JavaScript.

### Initial set-up

``` bash
$ yo webapp // with Sass ticked
$ npm install
$ bower install
$ grunt build
$ grunt serve // for development purposes
```

## Running site as Docker containers

You can build the Web server and CouchDB Docker containers with Docker Compose.
Please note, the current Nginx configuration file doesn't have a concept
of image file storage - it merely proxies image and video file requests
to the production URLs.

``` bash
cd <application root directory>
docker-compose up -d
docker ps # Note down CouchDB Docker contained ID
docker exec <CouchDB container Docker ID> replicate_couchdb
docker exec <CouchDB container Docker ID> create_couchdb_reader
```
