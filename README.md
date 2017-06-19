# oauth2 server

## Features
- Authorization  code grant
- Implicit grant
- Password Grnt
- client grant


## Management Features
- create and manage clients
- create and manage users


## Usage:

 Rename database.js.sample under config/ to database.js
 Set the mongo url for a mongo database under config/database.js 

 -  ` Change mongodb://<username>:<password>@mongohost:post/oauth-server-db`
 - Run the server with `node server.js`
