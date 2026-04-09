import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function noteById(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const userId = Number(req.headers['user-id']);

    if((!userId)) {
        return res.status(401).json({ message: "Pro přístup k poznámkám se nejprve přihlaste!" });
    }

    if (req.method === "GET") {
        const note = await prisma.note.findUnique({
            where: { id: Number(id) }, 
        });

        if(!note) {
            return res.status(404).json({ message: "Poznámka nenalezena!" });
        }

        if(note.userId !== userId){
            return res.status(403).json({ message: "Nemáte přístup k této poznámce!" });
        }

        return res.status(200).json(note)
    }

    if (req.method === "PUT" || req.method === "POST") {
        return res.status(405).json({ message: "Povolen je pouze GET!" });
}
    
}