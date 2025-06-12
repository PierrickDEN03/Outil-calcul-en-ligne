<?php
header("Content-Type: application/json");
require("../utils/db_login.php");
require("../class/impressions_class.php");

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $login, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $acc = new AccesDatasImpr($pdo);
    echo json_encode([
        "impressions" => $acc->getImpressions(),
        "nbOnPaper" => $acc->getNbOnPaper(),
        "degressif" => $acc->getDegressif()
    ]);
} catch (PDOException $e) {
    echo json_encode(["error" => "Erreur de connexion : " . $e->getMessage()]);
}
