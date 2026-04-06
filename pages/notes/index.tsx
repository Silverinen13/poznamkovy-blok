import  { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/router"

export default function Home() {
    const { data: session, status }: any = useSession()
    const router = useRouter()
    const userId = session?.user?.id;
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        }
    }, [status, router])

    if (status === "loading") return <p>Načítání...</p>
    const [notes, setNotes] = useState<any[]>([])
    const [title, setTitle] = useState('')
    const fetchNotes = async () => {
        if (!userId) return alert("Počkej vteřinu, než se načte přihlášení..."); // TADY!;
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

    //pak odstranit
    console.log("Odesílám poznámku pro userId:", userId);

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

    if (!res.ok) {
    const errorData = await res.json();
    console.error("Chyba z API (status " + res.status + "):", errorData.message);
  } else {
    setTitle("");
    fetchNotes();
  }
  }

return (
    <main>
      <h1>Poznámkový blok</h1>
      <h4>Vaše poznámky</h4>

      <form onSubmit={AddNote}>
        <input
          placeholder="Název poznámky"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          />
          <button type="submit">Přidat poznámku</button>
      </form>

      <ul>
        {notes?.map(note =>(
          <li key={note.id}>
            <span>
              {note.title}
            </span>
          </li>
        ))}
        </ul>
        <hr></hr>
        <button onClick={() => signOut({ callbackUrl: '/login' })} > Odhlásit se </button>
    </main>
  );
}