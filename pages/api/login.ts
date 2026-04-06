import type { NextApiRequest,NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import { verifyPassword } from "@/lib/hash";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Povolen je pouze POST!" });
    }

    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Vyplň všechna pole!" });
    }

    const user = await prisma.user.findUnique({
        where: { name: username },
    });

    if(!user) {
        return res.status(401).json({ message: "Špatné jméno nebo heslo!" });
    }

    const validPassword = await verifyPassword(password, user.password);

    if(!validPassword) {
        return res.status(401).json({ message: "Špatné jméno nebo heslo!" });
    }

    return res.status(200).json({ message: "Přihlášení bylo úspěšné." });
}