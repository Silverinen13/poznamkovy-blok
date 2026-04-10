# Aplikace poznámkového bloku

Webová aplikace pro správu osobních poznámek s autentizací uživatele, kde každý uživatel pracuje pouze se svými daty.

---

## Požadavky a instalace

### Instalace

1. Nejprve musíme stáhnou projekt z GitLabu
``` bash
git clone https://git.uzlabina.cz/stribja/poznamkovy-blok
```
2. Vstoupíme do složky projektu
``` bash
cd poznamkovy-blok
```
3. Pokud pracuejem na OS Windows, přepneme se do Linux subsystému
 ``` bash
 wsl
```
4. Nainstalujeme **node_modules**
``` bash
npm install
```
5. Nainstalujeme prismu
``` bash
npm install prisma@6.3.0 @prisma/client@6.3.0 
```

### Nastavení desktop dockeru
- Pro běh databáze budeme používat aplikaci desktop docker

1. Zapneme databázi v aplikaci desktop docker
``` bash
    docker run --name noteapps -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password123 -e POSTGRES_DB=notesapp -p 5432:5432 -d postgres:latest
```

### Inicializace prismy
1. Vygenerujeme prismu
``` bash
npx prisma generate
```
2. Imigrujeme prismu lokálně
``` bash
npx prisma migrate dev
```

### Nastavení .env souboru

- Pro setup .env souboru použijeme připravený skrip který spustíme následujícím příkazem
``` bash
npm run env:copy
```

### Seeding script

- Pro vyzkoušení funkčnosti aplikace je zřízenn uživatelský demo účet. 
- Uživatelské jméno uživatele: demo
- Heslo uživatele: demo1234

- Pro vytvoření uživatele použijeme následující seeding script bez nutnosti registrace přes webovou aplikaci:
``` bash
npx tsx prisma/seed.ts
```

## Zapnutí aplikace
- Abychom zapli aplikaci, zadáme následující příkaz:
``` bash
npm run dev
```

- Pokud by byl problém se zapnutím aplikace, kvůli seklé cache, použijemé následující příkaz, který cache smaže a následně opět vytvoří
``` bash
rm -rf .next && npm run dev
```

- Aplikace se otevře na adrese http://localhost:3000
- Pro přístup na stránku pro přihlášení použijeme následující cestu http://localhost:3000/login

## Import a Export

### Import
- Import se nachází v následující cestě -> /pages/api/notes/import

Import lze vyzkoušet po přihlášení do aplikace na stránce http://localhost:3000/notes. V menu stačí kliknout na tlačítko importovat a vybrat soubor jsou v následujícím formátu:

``` json
[
  {
    "title": "První poznámka",
    "content": "Obsah první poznámky",
    "createdAt": "2026-03-01T10:15:00.000Z",
    "updatedAt": "2026-03-10T09:00:00.000Z",
  },

  {
    "title": "Druhá poznámka",
    "content": "Obsah druhé poznámky",
  },
]
```

### Export

- Import se nachází v následující cestě -> /pages/api/notes/export

Import lze vyzkoušet po přihlášení do aplikace na stránce http://localhost:3000/notes. V menu stačí kliknout na tlačítko exportovat, čímž se exportují všechyn poznámky uživatele, nebo můžeme exportovat jednotlivé poznámky kliknutím na tlačítko v řádku seznamu poznámek.