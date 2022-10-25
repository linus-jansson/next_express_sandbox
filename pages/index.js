import axios from 'axios';
import Link from 'next/link';
export default (props) => {
    return (
        <>
            <h1>Very Secret site</h1>

            <p>Session id: {props.sessiondata?.id}</p>
            <p>logged in: {(props.sessiondata?.authed === true) ? true : false}</p>

            <Link href="/login">
                <a>Login page</a>
            </Link>
        </>
    )
}

export async function getServerSideProps(context) {
    let response = await axios.get('http://localhost:8000/api/isloggedin');
    console.log(response.data);
    return {
        props: { sessiondata: response.data }, // will be passed to the page component as props
    }
}