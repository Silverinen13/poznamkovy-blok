import  { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react";

export default function Home() {
    const { data: session, status }: any = useSession()
    const router = useRouter()
    const userId = session?.user?.id;
    const { id } = router.query;

    const [notes, setNote] = useState<any>([])
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        }
    }, [status, router])


    
    const fetchNote = async () => {

        const res = await fetch(`/api/notes/${id}`, {
            headers: {
                "user-id": String(userId) 
            }
        });
        const data = await res.json()
        setNote(data)
        setContent(data.content)
    }

    const saveNote = async () => {
        setSaving(true)
        const res = await fetch(`/api/notes/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "user-id": String(userId)
            },
            body: JSON.stringify({ content })
        });

        if (res.ok) {
            alert("Uloženo!");
        }
            setSaving(false);
    };

    useEffect (() => {
        if (userId){
            fetchNote()
        }
    }, [userId])
  
    if (status === "loading") return <p>Načítání...</p>

return (
    <main>
        <button onClick={() => router.push("/notes")}>← Zpět</button>
        <button onClick={saveNote} disabled={saving}>
          {saving ? "Ukládám..." : "Uložit změny"}
        </button>
      <h1>{notes.title}</h1>
      <h4>Vaše poznámky</h4>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </main>
  );
}