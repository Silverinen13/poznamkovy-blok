import  { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/router"
import Link from 'next/link'
import {
  Menubar,
} from "@/components/ui/menubar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Home() {
    const { data: session, status }: any = useSession()
    const router = useRouter()
    const userId = session?.user?.id;
    const [notes, setNotes] = useState<any[]>([])
    const [title, setTitle] = useState('')
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        }
    }, [status, router])


   
    const fetchNotes = async () => {

        const res = await fetch('/api/notes', {
            headers: {
                "user-id": String(userId) 
            }
        });
        const data = await res.json()
        setNotes(data)
    }
    useEffect (() => {
        if (userId){
            fetchNotes()
        }
    }, [userId])
  


  const AddNote = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    const res = await fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "user-id": String(userId) 
      },
      body: JSON.stringify(
        {
          title,
        })
    })
    
    setTitle("");
    fetchNotes();
  
  }

  if (status === "loading") return <p>Načítání...</p>

return (

  <div className="flex flex-col gap-4 items-center w-full pt-[50px] min-h-screen">
    <Menubar className="w-full justify-between px-2 w-100">
      <div className="flex items-center gap-2">
        <Label>Poznámkový blok</Label>
      </div>
        <Button onClick={() => signOut({ callbackUrl: '/login' })} > Odhlásit se </Button>
    </Menubar>
    <Card className='w-full max-w-sm'>
      <CardHeader>
        <CardTitle>Zde můžete vytvořit novou poznámku</CardTitle>
        <CardDescription>Zadejte název nové poznámky</CardDescription>
      </CardHeader>
      <form onSubmit={AddNote}>
        <CardContent>
          <div className='flex flex-col gap-6'>
            <div className='grid gap-2'>
              <Label htmlFor="username">Název</Label>
                <Input
                  placeholder="Název poznámky"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>
        </CardContent>
        <br></br>
        <CardFooter className='flex-col gap-2'>
          <Button type="submit">Přidat poznámku</Button>
        </CardFooter>
      </form>
    </Card>
    <h4>Vaše poznámky</h4>
    <ul className="w-100">
      {notes?.map(note =>(
        <li key={note.id} className="flex items-center justify-between p-2 border border-white rounded-lg">
          <Label>{note.title}</Label>
          <div className="flex items-center gap-1">
            <Button><Link href={`/notes/${note.id}`}>Zobrazit</Link></Button>
            <Button><Link href={`/notes/${note.id}`}>Editova</Link></Button>
            <Button><Link href={`/notes/${note.id}`}>Smazat</Link></Button>
          </div>
        </li>
      ))}
    </ul>
  </div>
  );
}