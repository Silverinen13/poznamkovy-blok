import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'

const prisma = new PrismaClient();
const username = "demo"
const password = "demo1234"

const seedUsers = async () => {
    console.log('Přidávám uživatele...')

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.upsert({ 
        where: { name: username},
        update: {},
        create: {
            name: username,
            password: hashedPassword,
        }
    })

    console.log('Přidávání uživatele dokončeno!')


};

seedUsers()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error("Chyba při seedování: ", e)
        await prisma.$disconnect()
        process.exit(1)
});
