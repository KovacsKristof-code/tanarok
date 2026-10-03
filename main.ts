import * as readline from 'node:readline/promises';
import { Print } from './listazas.ts';
import util from 'node:util';
import type {Tanar} from './helyettesites.ts'
import { writeFile } from 'node:fs/promises';

using rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function NewData() {
    let newTanar: Tanar;
    let nev = await rl.question("Mi az új tanár neve? ")
    if(nev === "") {
        console.log(util.styleText(["yellow"], "A név nem lehet üres!"))
        return
    }
   
    let oraSzam = parseInt(await rl.question("Mennyi órát dolgozik?  "))
    if (oraSzam > 7 || oraSzam < 1 || !oraSzam) {
       console.log(util.styleText(["yellow"], "Az óraszám helytelen!"))
       return
    }

    let napLista: string[] = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
    let d = new Date()
    let dd = d.getDay()+1

    if (dd > 7) {
        dd = 0
    }
    
    newTanar = {
        nev: nev,
        oraSzam: oraSzam,
        hetNapja: napLista[dd]!
    }
    
    await fetch(`https://retoolapi.dev/vVoZTA/data`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newTanar)
        })

    console.log(util.styleText(["green"], "Sikeres feltöltés!"))
}

async function Del(id: number) {
    await fetch(`https://retoolapi.dev/vVoZTA/data/${id}`, {
        method: "DELETE",
    })
}

async function Delete() {
    let idd = parseInt(await rl.question('A törölni kívánt elem ID: '))
    await Del(idd)
    console.log(util.styleText(["green"], "Törlés sikeres!"))
}

async function quiteMentes() {
    let response = await fetch('https://retoolapi.dev/vVoZTA/data')
    let adat = await response.json()

    let fajlNev = await rl.question("Mi legyen a fajl neve:  ")
    let iras = JSON.stringify(adat, null, 2)
    await writeFile(fajlNev, iras)
}

let v: number;

do{
    console.log("1) Listázás\n2) Új adat beszúrás\n3) Törlés\n4) Mentés és kilépés")
    v = parseInt(await rl.question("Mit választasz? "))

    switch(v) {
        case 1: 
            await Print()
            break
        case 2: 
            await NewData()
            break
        case 3:
            await Delete()
            break
        case 4: 
            await quiteMentes()
            break
        default:
            break
    }
} while (v != 4)
