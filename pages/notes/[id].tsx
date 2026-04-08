import  { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react";
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
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

    

    useEffect (() => {
        if (userId){
            fetchNote()
        }
    }, [userId])
  
    if (status === "loading") return <p>Načítání...</p>

return (
    <div className="flex flex-col gap-4 items-center w-full pt-[50px] min-h-screen">
        <Menubar className="w-full justify-between px-2 w-100">
            <div className="flex items-center gap-2">
                <Label>{note.title}</Label>
            </div>
            <Button onClick={() => router.push("/notes")}>← Zpět</Button>
            <MenubarMenu>
                <MenubarTrigger>Soubor</MenubarTrigger>
                <MenubarContent>
                    <MenubarGroup>
                        <Button><Link href={`/notes/${note.id}/edit`}>Editovat</Link></Button>
                        <Button><Link href={`/notes/${note.id}`}>Smazat</Link></Button>
                    </MenubarGroup>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>

        <button onClick={() => router.push("/notes")}>← Zpět</button>
        <h1>{note.title}</h1>
        <label>{note.createdAt}</label>
        <label>{note.updatedAt}</label>
    </div>
  );
}