import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Register(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const addUser = async (e: React.FormEvent) => {
        e.preventDefault()

        const registration = await fetch('/api/register', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(
                {   username, 
                    password 
                }),
        });

        if(registration.ok) {
            router.push('/login');
        }
        else {
            alert ('Registrace se nepovedla!')
        }

        setUsername('')
        setPassword('')
    }


return (
    <div>
        <h1>Registrace</h1>
        <form onSubmit={addUser}>
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
            <button type='submit'>Vytvořit účet</button>
        </form>
    </div>
)}