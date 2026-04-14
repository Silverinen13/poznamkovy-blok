export const exportNotes = (data: any)=> {
    const dataToExport = Array.isArray(data) ? data : [data]

    const string = JSON.stringify(dataToExport, null, 2)
    const blob = new Blob([string], {type: "application/json"})
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a") as HTMLAnchorElement
    link.href = url

    if(!Array.isArray(data) && data.title){
        link.download = `${data.title}.json`
    }
    else{
        link.download = "export_poznamek.json"
    }


    link.click()

}