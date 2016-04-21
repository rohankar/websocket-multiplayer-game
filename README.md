# sails-app

A sails.js real time multiplayer game using websockets..

  - Allows user to create gamerooms
  - Invite min 1 friend and max 3 more friends
  - Join into a publicly visible list of games
  - Game is in waiting until all the invited players are joined
  - Play

### About the game itself:
  - Its a simple click contest in real time
  - You have 60 seconds to click the given button as many times as possbile
  - You will be able to see who is leading with how many clicks in real time as well
  - After the game is complete, the winner will be announced and the game ends, thats it.


### Version
1.0.0

### Installation

Clone, download, whatever:

```
cd sails-app
npm update
npm install
```
To run the app make sure an instance of mongodb is running, open your command prompt
```
mongod
```

```
sails lift
```
If for some reason sails lift doesn't work
```
node app.js
```

### Swagger Docs 

Check out the full list of API endpoints:
goto http://localhost:1337/swagger/docs

### Scaling the application

> I originally created this game with scalability in mind.
> Working with sails.js made it that much easier
> because they have so many adapters, configurations etc.
> So essentially its a simple multiplayer game and
> multiple concurrent socket requests seem to be the major pain point.
> So here are just my thoughts on scaling 
> sails.js and socket servers in general...

- It's all about number of messages sent per second with sockets. Concurrency is key.
- In fact if you really want to make the socket server distributed (principle of horizontal scaling) people seem to like Redis Store which will replace the default Memory Store that socket.io has and allow IPC between the workers that handle multiple socket connections. Sound complicated? Yup. I'm trying to figure this out myself. 
- Using Nginx as a load balancer with stick load balancing seems like a good idea
- Try to reverseproxy as well, maybe with HAproxy
- If we had a leaderboard of some sort, then using memcachced to probably cache that to reduce load on the core db which should be busy doing other stuff.
   

### References
Project References:
Auth
- https://github.com/kasperisager/sails-generate-auth
- https://github.com/jaredhanson/passport-http-bearer
- http://blog.cendekiapp.com/2015/04/02/add-authentication-in-sailsjs-api

Sails.js and Sockets
 - http://sailsjs.org/documentation/concepts/
 - https://www.youtube.com/user/ponzicoder
 - https://medium.com/@3rdeden/cluster-fucks-when-scaling-socket-io-2c8ad1153332#.fugxf4loo
 - http://blog.mixu.net/2011/11/22/performance-benchmarking-socket-io-0-8-7-0-7-11-and-0-6-17-and-nodes-native-tcp/
 
License
----

MIT
