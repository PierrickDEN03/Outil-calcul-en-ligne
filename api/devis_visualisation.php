<?php
header("Content-Type: application/json");
require("../utils/db_login.php");
require("../class/datas_class.php");

if (!isset($_GET['id'])) {
    echo json_encode(["error" => "Aucun identifiant fourni"]);
    exit;
}

$id = intval($_GET['id']); // Sécurisation minimale

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $login, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $accDatas = new AccesDatas($pdo);
    echo json_encode([
        "infos" => $accDatas->getDatasById($id)
    ]);

} catch (PDOException $e) {
    echo json_encode(["error" => "Erreur de connexion : " . $e->getMessage()]);
}
