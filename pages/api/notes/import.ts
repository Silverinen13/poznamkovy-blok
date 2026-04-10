import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../lib/prisma"

export default async function importNotes(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST")
    {
        return res.status(405).json({ message: "Povolen je pouze POST!" });
    }
    const userID = Number(req.headers['user-id']);
    const notesArray = req.body

    if (!Array.isArray(notesArray))
    {
        return res.status(403).json({ message: "Nelze nahrát prázndé pole!" });
    }

    const importNotes = await prisma.note.createMany({

    data: notesArray.map((note: any) => {
    return {
        title: note.title,
        content: note.content,
        userId: userID,
        createdAt: note.createdAt ? new Date(note.createdAt) : new Date(),
        updatedAt: note.updatedAt ? new Date(note.updatedAt) : new Date()
    }
})
    })

    return res.status(200).json({ alert: "Import proběhl v pořádku!" });
}
