<?php
header("Content-Type: application/json");
require("../utils/db_login.php");
require("../class/datas_class.php");
require("../class/clients_class.php");
require("../class/entreprises_class.php");
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $login, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $acc = new AccesDatas($pdo);
    $accClient = new AccesClients($pdo);
    $accEntreprise = new AccesEntreprises($pdo);
    echo json_encode([
        "datas" => $acc->getDatas(),
        "clients" => $accClient->getClients(),
        "entreprises" => $accEntreprise->getEntreprises(),
    ]);
} catch (PDOException $e) {
    echo json_encode(["error" => "Erreur de connexion : " . $e->getMessage()]);
}
