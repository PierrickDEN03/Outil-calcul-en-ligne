<?php

// Connexion à la base
require("../utils/db_login.php");

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $login, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["error" => "Erreur de connexion à la base : " . $e->getMessage()]);
    exit;
}


// Classe d'accès aux données
class AccesClients {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function getClients() {
        $query = $this->pdo->prepare('SELECT * FROM clients WHERE Id_client!=-1');
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getClientById($id) {
        $query = $this->pdo->prepare('SELECT * FROM clients WHERE entreprise_Id=:id ORDER BY priorite ASC');
        $query->bindParam(":id",$id);
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }


    public function modifClient($id,$nomPrenom,$mail,$telephone,$entreprise,$priorite,$fixe){
        $res=$this->pdo->prepare("UPDATE clients SET nom_prenom=:nom, mail=:mail, telephone=:tel, entreprise_Id=:entreprise, priorite=:priorite, fixe=:fixe WHERE Id_client=:id");
        $res->bindParam(":nom",$nomPrenom);
        $res->bindParam(":mail",$mail);
        $res->bindParam(":tel",$telephone);
        $res->bindParam(":entreprise",$entreprise);
        $res->bindParam(":id",$id);
        $res->bindParam(":priorite",$priorite);
        $res->bindParam(":fixe",$fixe);
        $res->execute();
    }

    public function supprimerClient($id) {
        $query = $this->pdo->prepare("DELETE FROM clients WHERE Id_client = :id");
        $query->bindParam(":id", $id);
        $query->execute();
    }

    //Au moment de suppression, on décrémente toute les priorités au-dessus
    public function decrementerPriorites($idClientModif) {
        // On commence par récupérer la priorité et l'entreprise du client supprimé
        $query = $this->pdo->prepare("SELECT priorite, entreprise_Id FROM clients WHERE Id_client = :id");
        $query->bindParam(":id", $idClientModif);
        $query->execute();
        $client = $query->fetch(PDO::FETCH_ASSOC);

        if ($client) {
            $priorite = $client['priorite'];
            $idEntreprise = $client['entreprise_Id'];

            // Mettre à jour les priorités supérieures à celle du client supprimé
            $update = $this->pdo->prepare("
                UPDATE clients
                SET priorite = priorite - 1
                WHERE entreprise_Id = :idEntreprise AND priorite > :priorite
            ");
            $update->bindParam(":idEntreprise", $idEntreprise);
            $update->bindParam(":priorite", $priorite);
            $update->execute();
        }
    }

    //Incrémente toute les priorités au-dessus lors de l'ajout
    public function incrementerPriorites($idEntreprise, $nouvellePriorite) {
    // Vérifie que les paramètres sont valides
    if (!is_numeric($idEntreprise) || !is_numeric($nouvellePriorite)) {
        throw new InvalidArgumentException("Paramètres invalides pour incrementerPriorites");
    }
    // Incrémente toutes les priorités >= nouvelle priorité pour cette entreprise
    $update = $this->pdo->prepare("
        UPDATE clients
        SET priorite = priorite + 1
        WHERE entreprise_Id = :idEntreprise
        AND priorite >= :nouvellePriorite
    ");
    $update->bindParam(":idEntreprise", $idEntreprise, PDO::PARAM_INT);
    $update->bindParam(":nouvellePriorite", $nouvellePriorite, PDO::PARAM_INT);
    $update->execute();
}


    //Au changement de la priorité d'un client, récupère son ancienne priorité et modifie l'autre client correspondant
    public function decalerPrioriteClient($idClientModifie, $nouvellePriorite) {
        // Étape 1 : récupérer la priorité actuelle et l'entreprise du client à modifier
        $query = $this->pdo->prepare("SELECT priorite, entreprise_Id FROM clients WHERE Id_client = :idClient");
        $query->bindParam(":idClient", $idClientModifie);
        $query->execute();
        $clientModifie = $query->fetch(PDO::FETCH_ASSOC);
        if (!$clientModifie) return;
        $prioriteActuelle = $clientModifie['priorite'];
        $entrepriseId = $clientModifie['entreprise_Id'];
        // Étape 2 : vérifier s'il existe un autre client avec la priorité cible
        $query2 = $this->pdo->prepare("
            SELECT Id_client FROM clients 
            WHERE entreprise_Id = :entrepriseId 
            AND priorite = :nouvellePriorite 
            AND Id_client != :idClientModifie
        ");
        $query2->bindParam(":entrepriseId", $entrepriseId);
        $query2->bindParam(":nouvellePriorite", $nouvellePriorite);
        $query2->bindParam(":idClientModifie", $idClientModifie);
        $query2->execute();
        $clientEnConflit = $query2->fetch(PDO::FETCH_ASSOC);
        // Étape 3 : si un client est en conflit, on lui assigne la priorité actuelle
        if ($clientEnConflit) {
            $idConflit = $clientEnConflit['Id_client'];

            $update = $this->pdo->prepare("UPDATE clients SET priorite = :nouvellePriorite WHERE Id_client = :id");
            $update->bindParam(":nouvellePriorite", $prioriteActuelle);
            $update->bindParam(":id", $idConflit);
            $update->execute();
        }
    }


    public function getProchainePriorite($idEntreprise) {
        $query = $this->pdo->prepare("
            SELECT MAX(priorite) AS max_priorite
            FROM clients
            WHERE entreprise_Id = :idEntreprise
        ");
        $query->bindParam(":idEntreprise", $idEntreprise, PDO::PARAM_INT);
        $query->execute();

        $result = $query->fetch(PDO::FETCH_ASSOC);

        // Si aucun client n’existe encore pour cette entreprise, on retourne 1
        return isset($result['max_priorite']) && $result['max_priorite'] !== null
            ? $result['max_priorite'] + 1
            : 1;
    }


    public function addClient($nomPrenom,$mail,$telephone,$fixe,$entreprise,$priorite){
        $res=$this->pdo->prepare("INSERT INTO `clients` (`nom_prenom`, `mail`, `telephone`, `entreprise_id`, `priorite`, `fixe`) VALUES (:nom, :mail, :tel, :entreprise, :priorite, :fixe);");
        $res->bindParam(":nom",$nomPrenom);
        $res->bindParam(":mail",$mail);
        $res->bindParam(":tel",$telephone);
        $res->bindParam(":entreprise",$entreprise);
        $res->bindParam(":priorite",$priorite);
        $res->bindParam(":fixe",$fixe);
        $res->execute();
    }
}


