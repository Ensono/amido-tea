# The Amido Tea Roundinator 3000

## Development

- Clone the repo
- Create a file in the route called dev-env.json
- Paste in the following, including the correct values where necessary
``` json
{
    "NODE_ENV": "development",
    "MONGO_URL": "<mongo url>",
    "EMAIL_USER": "<gmail account>",
    "EMAIL_PASS": "<gmail password>",
    "BREW_TIME": 10,
    "BREW_UNIT": "seconds",
    "AUTH0_DOMAIN": "<auth 0 domain>",
    "AUTH0_CLIENTID": "<auth0 client id>",
    "AUTH0_CLIENT_SECRET": "<auth0 client secret>"
}
```
- Start a mongo daemon running at the url configured above
- run

    npm install

- once complete, run

    grunt dev

... and navigate to http://localhost:3000/
