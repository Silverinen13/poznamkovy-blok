import  { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic"
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

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
    
        const deleteNote = async () => {

        const res = await fetch(`/api/notes/${id}/edit`, {
            method: "DELETE",
            headers: {
                "user-id": String(userId) 
            }
        })

        if(res.ok)
        {
            router.push("/notes")
        }
        else
        {
            alert("Chyba při mazání!")
        }
        
    }

return (

    <div className="flex flex-col gap-4 min-w-[1000px] p-[50px]">
        <Menubar className="justify-between px-2 min-w-[1000px] items-center">
            <div className="flex gap-2">
                <Label className="text-xl justify-between px-2 w-80"><strong>Název poznámky: </strong><div>{note.title}</div></Label>
            </div>
            <div className="flex gap-2">
                <Button onClick={() => router.push("/notes")}>← Zpět</Button>
                <MenubarMenu>
                    <MenubarTrigger>Soubor</MenubarTrigger>
                    <MenubarContent>
                        <MenubarGroup>
                            <Button onClick={saveNote} disabled={saving}>
                                {saving ? "Ukládám..." : "Uložit změny"}
                            </Button>
                            <Button onClick={() => deleteNote()}>Smazat</Button>
                        </MenubarGroup>
                    </MenubarContent>
                </MenubarMenu>
            </div>
        </Menubar>
        <Label className="text-lg justify-between px-2 w-80"><strong>Obsah poznámky: </strong></Label>
        <div className="min-w-[1000px]" >
            <Editor
            initialContent={note.content}
            onChange={(newContent) => setContent(newContent)}
            />
        </div>
        
    </div>
  );
}