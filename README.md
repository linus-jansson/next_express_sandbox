## Session cookies with Express Session and Nextjs
The server uses Express session to store remember a user that has been on the page. The session is stored in a mongoDB collection. When the user vists a protected page. The frontend asks if the user is signed in where the backend will respond with a yes or a no.



The back has three main endpoints `/api/login` `/api/logout` `/api/isloggedin`
### `/api/login`
> Used to login the user. The user is logged in by sending a post request to the endpoint with the username and password in the body. The server then checks if the user exists in the database. If the user exists the server creates a session cookie and saves `authed = true` to it.
### `/api/logout`
> Destroys any session the user has to the server

### `/api/isloggedin`
> Gets the users session cookie and checks if the user is logged in. If the user is logged in the server returns `authed = true` else it returns `authed = false`

#### Getting user logged in from NextJS `getServerSideProps()`
When using the `/api/isloggedin` endpoint in `getServerSideProps()` from NextJs. The clients cookie needs to explicitly be sent to the server as this seems not to be done by default when requesting. This is done by passing the cookie into the header of the request.
eg.
```js
import axios from 'axios'
export async function getServerSideProps(context) {
    let response = await axios.get('http://localhost:8000/api/isloggedin', {
        headers: {
            cookie: context.req.headers.cookie, // need to send cookie to server
        }
    });
    console.log(response.data);
    return {
        props: { sessionData: response.data }, // will be passed to the page component as props
    }
}
```

#### Getting user logged in from `useEffect()` in NextJs
Same as above but using `useEffect()` instead of `getServerSideProps()`. However when using useEffect the cookie does not need to be sent explicitly.
eg.
```js
import React, { useEffect, useState } from 'react';
import axios from 'axios'

const Page = () => {
    const [sessionData, setSessionData] = useState();

    useEffect(() => {
        axios.get('/api/isloggedin').then((response) => {
            setSessionData(response.data);
        });
    }, [])

    return (
        <div>
            {sessionData.authed ? 'Logged in' : 'Not logged in'}
        </div>
    )
}
```

The difference between the two is that `getServerSideProps()` is called on the server and `useEffect()` is called on the client. This means that `getServerSideProps()` will be always be called before the page ever loads to the client.