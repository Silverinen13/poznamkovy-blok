import type { NextApiRequest,NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import { hashPassword } from "@/lib/hash";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Povolen je pouze POST!" });
    }

    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Vyplň všechna pole!" });
    }

    const existingUser = await prisma.user.findUnique({
        where: { name: username },
    });

    if (existingUser) {
        return res.status(400).json({ message: "Uživatel už existuje!" });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            name: username,
            password: hashedPassword,
        },
    });

    return res.status(201).json({ message: "Registrace proběhla v pořádku.", id: user.id });
}