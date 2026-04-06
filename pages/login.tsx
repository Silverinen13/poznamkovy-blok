import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const login = async (e: React.FormEvent) => {
        e.preventDefault()

        const Login = await fetch('/api/login', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(
                {   username, 
                    password 
                }),
        });

        const data = await Login.json();

        if(Login.ok) {
            alert (data.message)
            router.push('/notes');
        }
        else {
            alert(data.message || "Přihlášení se nepovedlo!")
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