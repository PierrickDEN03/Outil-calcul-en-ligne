let datasEntreprises = []
let datasClients = []
let datasAdressesPrincipales = []
export let idClient = -1

window.addEventListener('DOMContentLoaded', () => {
    let entrepriseSelect = new Choices('.selectEntreprise', {
        searchEnabled: true,
        itemSelectText: '',
        shouldSort: true,
        placeholderValue: 'Sélectionner une entreprise',
    })

    fetch('../api/clients.php')
        .then((response) => response.json())
        .then((datasFetch) => {
            datasEntreprises = datasFetch.entreprises
            datasClients = datasFetch.clients
            datasAdressesPrincipales = datasFetch.adressesPrincipales
            console.log(datasAdressesPrincipales)
            datasEntreprises.sort((a, b) => a.nom_entreprise.localeCompare(b.nom_entreprise))
            datasClients.sort((a, b) => a.nom_prenom.localeCompare(b.nom_prenom))
            console.log(datasClients)
            entrepriseSelect.setChoices([
                { value: 'null', label: '-----------' },
                ...datasEntreprises.map((e) => {
                    const adresse = datasAdressesPrincipales.find((adresse) => adresse.Id_entreprise === e.Id_entreprise)
                    const clients = datasClients.filter((client) => client.entreprise_Id === e.Id_entreprise)

                    let label = `${e.nom_entreprise} - ${adresse?.ville} (${adresse?.code_postal})`

                    if (clients.length === 1) {
                        const client = clients[0]
                        label += ` | ${client.nom_prenom}`
                    }

                    return {
                        value: e.Id_entreprise,
                        label: label,
                    }
                }),
            ])
        })
        .catch((error) => console.error('Erreur lors du chargement des données :', error))
})

let btnAddClient = document.querySelector('.add_client')
let selectClient = document.querySelector('.selectClient')
let selectEntreprise = document.querySelector('.selectEntreprise')
let clientSelect = new Choices('.selectClient', {
    searchEnabled: true,
    itemSelectText: '',
    shouldSort: true,
    placeholderValue: 'Sélectionner un client',
})

//Listener pour le bouton addClient
btnAddClient.addEventListener('click', () => {
    const id = selectEntreprise.value
    const url = `../app/app.php?action=voir_details_entreprise` + `&id=${encodeURIComponent(id)}`
    window.open(url, '_blank')
})

//Listener pour le select des Clients
selectClient.addEventListener('change', (e) => {
    idClient = e.target.value
    console.log(idClient)
})

//Listener sur le select des entreprises
selectEntreprise.addEventListener('change', () => {
    idClient = -1
    if (selectEntreprise.value === 'null') {
        document.querySelector('.hiddenClient').style.display = 'none'
        return
    }
    console.log('changee')
    const idEntreprise = selectEntreprise.value
    const clients = datasClients.filter((client) => {
        return parseInt(client.entreprise_Id) === parseInt(idEntreprise)
    })
    //S'il y a plusieurs clients de cet entreprise, on affiche le select pour les clients
    if (parseInt(clients.length) === 0) {
        document.querySelector('.hiddenClient').style.display = 'none'
        idClient = -1
        console.log(idClient)
        alert("Aucun client n'est affilié à cet entreprise")
        return
    }
    if (parseInt(clients.length) === 1) {
        document.querySelector('.hiddenClient').style.display = 'none'
        idClient = clients[0].Id_client
        console.log(idClient)
        return
    }
    //Si plus d'un client dans l'entreprise, on met à l'affichage la barre déroulante pour les clients de l'entreprise
    document.querySelector('.hiddenClient').style.display = 'flex'
    clientSelect.clearChoices()
    clientSelect.setChoices(
        clients.map((c) => ({
            value: c.Id_client,
            label: `${c.nom_prenom} (${c.mail})`,
        })),
        'value',
        'label',
        false
    )
})

export function getIdClient() {
    return idClient
}
