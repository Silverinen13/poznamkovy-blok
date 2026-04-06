import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from "next-auth/react";

export default function Login(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const login = async (e: React.FormEvent) => {
        e.preventDefault()

        const result = await signIn("credentials", {
            username,
            password, 
            redirect: false,
        }
    )

        if(result?.ok) {
            alert ("Přihlášení bylo úspěšné!")
            router.push('/notes');
        }
        else {
            alert("Špatné jméno nebo heslo!")
        }

        setUsername('')
        setPassword('')
    }


return (
    <div>
        <h1>Přihlášení</h1>
        <form onSubmit={login}>
            <input
                type='text'
                placeholder='Uživatelské jméno'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <input
                type='password'
                placeholder='Heslo'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button type='submit'>Přihlásit se</button>
        </form>
    </div>
)}