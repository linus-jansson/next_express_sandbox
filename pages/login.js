import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'

let LoginPage = () => {
    const [sessionData, setSessionData] = useState({})

    const handleLoginButton = () => {
        axios.post('http://localhost:8000/api/login').then((response) => {
            console.log(response.data)
            setSessionData(response.data);
        });
    }

    return (
        <>
            <h1>Login page for very secret page</h1>
            <p>Session id: {sessionData.id}</p>
            <p>logged in: {(sessionData.authed == true) ? "true" : "false"}</p>

            <Link href="/login">
                <a onClick={handleLoginButton}>Login</a>
            </Link>
            <br />
            <Link href="/">
                <a>Goto very secret page</a>
            </Link>
        </>
    )

}

export default LoginPage