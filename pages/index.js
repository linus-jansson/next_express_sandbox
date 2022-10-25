import axios from 'axios';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
export default (props) => {
    const [sessionData, setSessionData] = useState({});

    useEffect(() => {
        axios.get('/api/isloggedin').then((response) => {
            console.log("use effect login check", response.data);
            setSessionData(response.data);
        });
    })

    return (
        <>
            <h1>Very Secret site</h1>

            <p>Session id: {sessionData?.id}</p>
            <p>logged in: {(sessionData?.authed === true) ? "true" : "false"}</p>

            <p>is GetServerSideProp id same as useeffect {(props.sessiondata?.id == sessionData?.id) ? "true" : "false"}</p>

            <Link href="/login">
                <a>Login page</a>
            </Link>
        </>
    )
}

export async function getServerSideProps(context) {
    let response = await axios.get('http://localhost:8000/api/isloggedin', { withCredentials: true });
    console.log(response.data);
    return {
        props: { sessiondata: response.data }, // will be passed to the page component as props
    }
}