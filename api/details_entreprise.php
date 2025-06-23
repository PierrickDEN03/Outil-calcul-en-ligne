<?php
header("Content-Type: application/json");
require("../utils/db_login.php");
require("../class/clients_class.php");
require("../class/entreprises_class.php");
require("../class/adresses_class.php");
require("../class/paiements_class.php");

if (!isset($_GET['id'])) {
    echo json_encode(["error" => "Aucun identifiant fourni"]);
    exit;
}

$id = intval($_GET['id']); // Sécurisation minimale

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $login, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $accClient = new AccesClients($pdo);
    $accEntreprise = new AccesEntreprises($pdo);
    $accAdresse = new AccesAdresses($pdo);
    $accPaiement = new AccesPaiement($pdo);

    // On récupère les données spécifiques à l’ID
    $client = $accClient->getClientById($id); 
    $entreprise = $accEntreprise->getEntrepriseById($id); 
    $adressePrincipale = $accAdresse->getAdressePrincipaleByEntrepriseId($id);
    $adressesSecondaires = $accAdresse->getAdressesSecondairesByEntrepriseId($id);
    $devis = $accEntreprise->getDevisById($id);
    $paiement = $accPaiement->getPaiements();

    echo json_encode([
        "clients" => $client,
        "entreprise" => $entreprise,
        "adressePrincipale" => $adressePrincipale,
        "adressesSecondaires" => $adressesSecondaires,
        "devis" => $devis,
        "paiements" => $paiement
    ]);

} catch (PDOException $e) {
    echo json_encode(["error" => "Erreur de connexion : " . $e->getMessage()]);
}
