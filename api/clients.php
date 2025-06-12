<?php
header("Content-Type: application/json");
require("../utils/db_login.php");
require("../class/clients_class.php");
require("../class/entreprises_class.php");
require("../class/adresses_class.php");

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $login, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $accClient = new AccesClients($pdo);
    $accEntreprise = new AccesEntreprises($pdo);
    $accAdresse = new AccesAdresses($pdo);
    echo json_encode([
        "clients" => $accClient->getClients(),
        "entreprises" => $accEntreprise->getEntreprises(),
        "adressesPrincipales" => $accAdresse->getAdressePrincipale(),
        "adressesSecondaires" => $accAdresse->getAdresseSecondaire()
    ]);
} catch (PDOException $e) {
    echo json_encode(["error" => "Erreur de connexion : " . $e->getMessage()]);
}
