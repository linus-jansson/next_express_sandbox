import axios from 'axios';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const IndexPage = (props) => {
    const [sessionData, setSessionData] = useState();

    useEffect(() => {
        axios.get('/api/isloggedin').then((response) => {
            setSessionData(response.data);
        });
    }, [])

    return (
        <>
            <h1>Very Secret site</h1>

            <h2>useEffect</h2>
            <p>&gt;Session id: {sessionData?.id}</p>
            <p>&gt;Logged in: {(sessionData?.authed === true) ? "true" : "false"}</p>

            <h2>getServerSideProps</h2>
            <p>&gt;Session id: {props.sessionData?.id}</p>
            <p>&gt;Logged in: {(props.sessionData?.authed === true) ? "true" : "false"}</p>

            <p>is GetServerSideProp id same as useeffect {(props.sessiosData?.id === sessionData?.id) ? "true" : "false"}</p>

            <Link href="/login">
                <a>Login page</a>
            </Link>
        </>
    )
}

export default IndexPage;

export async function getServerSideProps(context) {
    // https://stackoverflow.com/questions/51466982/next-js-express-session-new-session-for-every-request-made-inside-getinitialp
    let response = await axios.get('http://localhost:8000/api/isloggedin', {
        headers: {
            cookie: context.req.headers.cookie, // need to send cookie to server
        }
    });
    console.log(response.data);
    if (response.data.authed !== true) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }
    else {
        return {
            props: { sessionData: response.data }, // will be passed to the page component as props
        }
    }

}