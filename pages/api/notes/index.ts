import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function notes(req: NextApiRequest, res: NextApiResponse) {

    const userId = Number(req.headers['user-id']);

    if((!userId)) {
        return res.status(401).json({ message: "Nejste vlastníkem tohoto obsahu!" });
    }

    if (req.method === "GET") {
        const notes = await prisma.note.findMany({
            where: { userId: userId },
            orderBy: { createdAt: 'desc'}
        });
        return res.status(200).json(notes)
    }
    else if (req.method === "POST") {
        const { title, content} = req.body

        if (!title) {
            return res.status(400).json({ message: "Název nesmí být prázdný!" })
        }

        const newNote = await prisma.note.create({
            data: {
                title,
                userId: userId,
            }
        })
        return res.status(201).json(newNote)
    }
    else {
        return res.status(405).json({ message: "Metoda není povolena!" })
    }
}
