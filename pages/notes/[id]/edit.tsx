import  { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic"

const Editor = dynamic(() => import("../../../components/editor"), { ssr: false });

export default function Home() {
    const { data: session, status }: any = useSession()
    const router = useRouter()
    const userId = session?.user?.id;
    const { id } = router.query;

    const [note, setNote] = useState<any>([])
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
        const res = await fetch(`/api/notes/${id}/edit`, {
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
    
    if (!note?.id || (!note.content && note.createdAt !== note.updatedAt)) return <p>Načítání...</p>;
    
    

return (
    <main>
        <button onClick={() => router.push("/notes")}>← Zpět</button>
        <button onClick={saveNote} disabled={saving}>
          {saving ? "Ukládám..." : "Uložit změny"}
        </button>
        <h1>{note.title}</h1>

        <Editor
            initialContent={note.content}
            onChange={(newContent) => setContent(newContent)}
        />
    </main>
  );
}