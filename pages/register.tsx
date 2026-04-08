import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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

        const data = await registration.json();

        if(registration.ok) {
            alert (data.message)
            router.push('/login');
        }
        else {
            alert(data.message || "Registrace se nepovedla")
        }

        setUsername('')
        setPassword('')
    }


return (

        <div className="flex min-h-screen w-full items-center justify-center bg-background p-6 md:p-10">
        <Card className='w-full max-w-sm'>
            <CardHeader>
                <CardTitle>Zde si vytvoříte účet</CardTitle>
                <CardDescription>Zadejte uživatelské jméno a heslo </CardDescription>
                <CardAction>
                    <Button variant="link" asChild>
                        <Link href="login">Přihlášení</Link>
                    </Button>
                </CardAction>
            </CardHeader>
            <form onSubmit={addUser}>
                <CardContent>
                    <div className='flex flex-col gap-6'>
                        <div className='grid gap-2'>
                            <Label htmlFor="username">Uživatelské jméno</Label>
                            <Input
                                type='text'
                                placeholder='Uživatelské jméno'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className='grid gap-2'>
                            <Label htmlFor="password">Heslo</Label>
                            <Input
                                type='password'
                                placeholder='Heslo'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
                <br></br>
                <CardFooter className='flex-col gap-2'>
                    <Button type='submit'>Vytvořit účet</Button>
                </CardFooter>
            </form>
        </Card>
    </div>
)}