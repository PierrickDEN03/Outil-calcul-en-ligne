<?php
header("Content-Type: application/json");
require("../utils/db_login.php");
require("../class/paiements_class.php");
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $login, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $acc = new AccesPaiement($pdo);
    echo json_encode([
        "infos" => $acc->getPaiements(),
    ]);
} catch (PDOException $e) {
    echo json_encode(["error" => "Erreur de connexion : " . $e->getMessage()]);
}
