export async function Print() {
    let response = await  fetch('https://retoolapi.dev/vVoZTA/data')
    let adat = await response.json()

    for (const t of adat) {
        console.log(t)
    }
}