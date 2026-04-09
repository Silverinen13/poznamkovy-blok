import  { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react";
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Link from 'next/link'


export default function Home() {
    const { data: session, status }: any = useSession()
    const router = useRouter()
    const userId = session?.user?.id;
    const { id } = router.query;

    const [note, setNote] = useState<any>([])
    const [content, setContent] = useState('')

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

    useEffect (() => {
        if (userId){
            fetchNote()

        }
    }, [userId])
  
    if (status === "loading") return <p>Načítání...</p>

return (
    <div className="flex flex-col gap-4 items-center w-full pt-[50px] min-h-screen">
        <Menubar className="justify-between px-2 w-100">
            <div className="flex items-center gap-2">
                <Label>{note.title}</Label>
            </div>
            <div className="flex gap-2">
                <Button onClick={() => router.push("/notes")}>← Zpět</Button>
                <MenubarMenu>
                    <MenubarTrigger>Soubor</MenubarTrigger>
                    <MenubarContent>
                        <MenubarGroup>
                            <Button><Link href={`/notes/${note.id}/edit`}>Editovat</Link></Button>
                            <Button onClick={() => deleteNote()}>Smazat</Button>
                        </MenubarGroup>
                    </MenubarContent>
                </MenubarMenu>
            </div>
        </Menubar>
        <div className="flex flex-col gap-2 w-100 border border-white rounded-lg p-4">
            <Label className="text-xl justify-between px-2 w-80"><strong>Název poznámky: </strong><div>{note.title}</div></Label>
            <Label className="text-lg justify-between px-2 w-80"><strong>Vytvořeno: </strong>{new Date(note.createdAt).toLocaleString("cs-CZ")}</Label>
            <Label className="text-lg justify-between px-2 w-80"><strong>Upraveno: </strong>{new Date(note.updatedAt).toLocaleString("cs-CZ")}</Label>
        </div>
        
    </div>
  );
}