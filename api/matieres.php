<?php
header("Content-Type: application/json");
require("../utils/db_login.php");
require("../class/matieres_class.php");

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $login, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $acc = new AccesDatasMatiere($pdo);
    $data = $acc->getMatieres();
    echo json_encode([
        "matieres" => $acc->getMatieres(),
        "degressif" => $acc ->getDegressif(),
        "frais" => $acc ->getFrais(),
        "decoupe" =>$acc ->getPrixDecoupe()
    ]);
} catch (PDOException $e) {
    echo json_encode(["error" => "Erreur de connexion : " . $e->getMessage()]);
}
