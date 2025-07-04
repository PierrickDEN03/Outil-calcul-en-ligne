import { datasDevis, devisLoaded } from './getDevisWithId.js'
console.log('datas devis e c : ', datasDevis)
let datasEntreprises = []
let datasClients = []
let datasAdressesPrincipales = []
export let idClient = -1
let entrepriseSelect
let clientSelect
let selectEntreprise = document.querySelector('.selectEntreprise')
let selectClient = document.querySelector('.selectClient')
let action
let idDevis
let btnRefresh = document.querySelector('.btnRefresh')
btnRefresh.addEventListener('click', () => {
    alert('Les données concernant les entreprises et les clients ont été rafraichies.')
    fetchClientsData()
})
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search)
    idDevis = params.get('id')
    action = params.get('modif')
    entrepriseSelect = new Choices('.selectEntreprise', {
        searchEnabled: true,
        itemSelectText: '',
        shouldSort: true,
        placeholderValue: 'Sélectionner une entreprise',
    })

    clientSelect = new Choices('.selectClient', {
        searchEnabled: true,
        itemSelectText: '',
        shouldSort: true,
        placeholderValue: 'Sélectionner un client',
    })

    fetchClientsData()
})

let btnAddClient = document.querySelector('.add_client')

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
    const idEntreprise = selectEntreprise.value
    const clients = datasClients.filter((client) => {
        return parseInt(client.entreprise_Id) === parseInt(idEntreprise)
    })
    console.log('change entreprise id : ', idEntreprise)
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
    //Valeur par défaut, force l'utilisateur à saisir un client
    idClient = -2
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

export function handleEntrepriseWithDevis() {
    const nomEntreprise = datasDevis.entreprise_nom?.trim().toLowerCase()
    const idEntreprise = datasEntreprises.find((e) => e.nom_entreprise.trim().toLowerCase() === nomEntreprise)?.Id_entreprise

    // Sélectionne et déclenche le changement
    entrepriseSelect.setChoiceByValue(idEntreprise)
    selectEntreprise.value = idEntreprise
    const clients = datasClients.filter((client) => {
        return parseInt(client.entreprise_Id) === parseInt(idEntreprise)
    })
    clientSelect.setChoices(
        clients.map((c) => ({
            value: c.Id_client,
            label: `${c.nom_prenom} (${c.mail})`,
        })),
        'value',
        'label',
        false
    )
    if (clients.length > 1) {
        // Ce code s'exécutera après que le change ait été géré
        document.querySelector('.hiddenClient').style.display = 'flex'
    }
    //On redéfinit l'id qui sera récupéré dans les autres scripts
    idClient = datasDevis.client_id
    console.log('id trouvé : ', idClient)
    clientSelect.setChoiceByValue(idClient)
    selectClient.value = idClient
    console.log(clientSelect.value)
}

function fetchClientsData() {
    fetch('../api/clients.php')
        .then((response) => response.json())
        .then((datasFetch) => {
            datasEntreprises = datasFetch.entreprises
            datasClients = datasFetch.clients
            datasAdressesPrincipales = datasFetch.adressesPrincipales

            datasEntreprises.sort((a, b) => a.nom_entreprise.localeCompare(b.nom_entreprise))
            datasClients.sort((a, b) => a.priorite - b.priorite)

            // Re-initialiser les selects
            entrepriseSelect.clearChoices()
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

            clientSelect.clearChoices()
            clientSelect.enable()

            const params = new URLSearchParams(window.location.search)
            const idDevis = params.get('id')
            const action = params.get('modif')

            if (idDevis && action === 'modif') {
                devisLoaded.then(() => {
                    handleEntrepriseWithDevis()
                })
            }
        })
        .catch((error) => console.error('Erreur lors du chargement des données :', error))
}
