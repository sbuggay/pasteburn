# pasteburn

Simple pastebin clone that supports "burn after reading" expiries.

Built with the purpose to learn some scalable design patterns:

- load balancing (w/ nginx)
- data sharding
- caching (w/ Redis)
- api rate limiting (ip/agent)

```
npm i
```

```
npm start
```

```
npm run serve

concurrently \"tsc -w\" \"nodemon build/entry.js\"
```


### Expire mechanism
