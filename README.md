NODE BUNNY CHALLENGE FRONTEND
=============

This is a simple jquery frontend APP that consumes a simple twitter API oauth 1.1 application, conuming its 2 routes: 

0. https://bunnybackend.herokuapp.com/get-feed?lat=[latitude]&lon=[longitude] 
0. https://bunnybackend.herokuapp.com/post-tweet?video=[video]&comment=[comment] 

and it was deployed for [the bunny challenge frontend app](http://www.seedfounder.com).

Stack
-------

The App makes use of simple assets compiling and deployment pipeline, such as the one made available by [cactus](https://github.com/koenbok/cactus)

* GIT was used for code versioning, gitflow was not used since it would have been overkill (one man short project).
* Angular was not used since the simplicity of the project would have made the application heavy, at no particular gains.
* SASS/LESS was not implied for the same reasons.
* A database (e.g., mongo) was not used not by this frontend code, nor by the backend. In order to store responses from the email contact information an hack was used in order to wrap the undocumented google form API into our custom code.
* Oauth 1.1. signin for twitter API is handled by the server. At form submission, a Bunny Inc. Logo is briefly showed, and the page is then refreshed through XHR and jQuery.
 
Installation
-----------

```
$ git clone [REPOSITORY]
```

```
$ install cactus
```

```
open project
```

```
Deploy on Amazon S3.
```

Hosting
-----

For ease of availability, the app is deployed on a bucket pointed by www.seedfounder.com