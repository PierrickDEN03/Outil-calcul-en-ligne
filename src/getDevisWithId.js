// getDevisWithId.js
export let datasDevis = [null]

export const devisLoaded = new Promise((resolve, reject) => {
    const params = new URLSearchParams(window.location.search)
    const idDevis = params.get('id')

    if (!idDevis) {
        resolve(null) // ou reject si c'est une erreur
        return
    }

    fetch(`../api/devis_visualisation.php?id=${idDevis}`)
        .then((response) => response.json())
        .then((datasFetch) => {
            datasDevis = datasFetch.infos[0]
            resolve(datasDevis)
        })
        .catch((error) => {
            console.error('Erreur lors du chargement des données :', error)
            reject(error)
        })
})
