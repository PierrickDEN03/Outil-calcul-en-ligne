<?php
header("Content-Type: application/json");
require("../class/datas_class.php");
session_start();

try {
    $acc = new AccesDatas($pdo);
    //Retourne juste la valeur => Pour les pages de calcul, si connecté alors on peut enregistrer le devis
    echo json_encode([
        "user" => $_SESSION['Pseudo'] ?? null,
        "new_id" => $acc->genererId()
    ]);
} catch (Exception $e) {
    echo json_encode(["error" => "Erreur lors de la lecture de la session : " . $e->getMessage()]);
}
