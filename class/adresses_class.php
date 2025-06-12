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
class AccesAdresses {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function getAdressePrincipale() {
        $query = $this->pdo->prepare('SELECT * FROM adresses WHERE priorite_adresse=1');
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

     public function getAdresseSecondaire() {
        $query = $this->pdo->prepare('SELECT * FROM adresses WHERE priorite_adresse!=1');
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getAdressePrincipaleByEntrepriseId($id) {
        $query = $this->pdo->prepare('SELECT * FROM adresses WHERE priorite_adresse=1 AND Id_entreprise=:id');
        $query->bindParam(":id",$id);
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getAdressesSecondairesByEntrepriseId($id) {
        $query = $this->pdo->prepare('SELECT * FROM adresses WHERE priorite_adresse!=1 AND Id_entreprise=:id ORDER BY priorite_adresse ASC');
        $query->bindParam(":id",$id);
        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    



    public function modifAdresse($idAdresse,$priorite,$rue,$cp,$ville,$idEntreprise){
        $res=$this->pdo->prepare("UPDATE adresses SET priorite_adresse=:priorite, rue=:rue, code_postal=:cp, ville=:ville, Id_entreprise=:idE WHERE Id_adresse=:idA");
        $res->bindParam(":priorite",$priorite);
        $res->bindParam(":rue",$rue);
        $res->bindParam(":cp",$cp);
        $res->bindParam(":ville",$ville);
        $res->bindParam(":idE",$idEntreprise);
        $res->bindParam(":idA",$idAdresse);
        $res->execute();
    }

    public function supprimerAdresse($id) {
        $query = $this->pdo->prepare("DELETE FROM adresses WHERE Id_adresse = :id");
        $query->bindParam(":id", $id);
        $query->execute();
    }


    //Décrémente les priorités supérieures au moment de la suppression d'une adresse
    public function decrementerPrioritesAdresses($idAdresseSupprimee) {
        // Récupère la priorité et l'entreprise de l'adresse à supprimer
        $query = $this->pdo->prepare("SELECT priorite_adresse, Id_entreprise FROM adresses WHERE Id_adresse = :id");
        $query->bindParam(":id", $idAdresseSupprimee);
        $query->execute();
        $adresse = $query->fetch(PDO::FETCH_ASSOC);

        if ($adresse) {
            $priorite = $adresse['priorite_adresse'];
            $idEntreprise = $adresse['Id_entreprise'];

            // Décale les autres adresses de l'entreprise avec une priorité supérieure
            $update = $this->pdo->prepare("
                UPDATE adresses
                SET priorite_adresse = priorite_adresse - 1
                WHERE Id_entreprise = :idEntreprise AND priorite_adresse > :priorite
            ");
            $update->bindParam(":idEntreprise", $idEntreprise);
            $update->bindParam(":priorite", $priorite);
            $update->execute();
        }
    }

    //Au changement de la priorité d'une adresse, récupère son ancienne priorité et modifie l'autre adresse correspondante
    public function decalerPrioriteAdresse($idAdresseModifiee, $nouvellePriorite) {
    // Étape 1 : récupérer la priorité actuelle et l'entreprise de l'adresse à modifier
    $query = $this->pdo->prepare("SELECT priorite_adresse, Id_entreprise FROM adresses WHERE Id_adresse = :idAdresse");
    $query->bindParam(":idAdresse", $idAdresseModifiee);
    $query->execute();
    $adresseModifiee = $query->fetch(PDO::FETCH_ASSOC);

    if (!$adresseModifiee) return;

    $prioriteActuelle = $adresseModifiee['priorite_adresse'];
    $idEntreprise = $adresseModifiee['Id_entreprise'];

    // Étape 2 : vérifier s'il existe une autre adresse avec la priorité cible
    $query2 = $this->pdo->prepare("
        SELECT Id_adresse FROM adresses 
        WHERE Id_entreprise = :idEntreprise 
        AND priorite_adresse = :nouvellePriorite 
        AND Id_adresse != :idAdresseModifiee
    ");
    $query2->bindParam(":idEntreprise", $idEntreprise);
    $query2->bindParam(":nouvellePriorite", $nouvellePriorite);
    $query2->bindParam(":idAdresseModifiee", $idAdresseModifiee);
    $query2->execute();
    $adresseEnConflit = $query2->fetch(PDO::FETCH_ASSOC);

    // Étape 3 : si une adresse est en conflit, on lui assigne la priorité actuelle
    if ($adresseEnConflit) {
        $idConflit = $adresseEnConflit['Id_adresse'];

        $update = $this->pdo->prepare("UPDATE adresses SET priorite_adresse = :nouvellePriorite WHERE Id_adresse = :id");
        $update->bindParam(":nouvellePriorite", $prioriteActuelle);
        $update->bindParam(":id", $idConflit);
        $update->execute();
    }
}

    public function addAdresse($priorite,$rue,$cp,$ville,$idEntreprise){
        $res=$this->pdo->prepare("INSERT INTO `adresses` (`priorite_adresse`, `rue`, `code_postal`, `ville`, `Id_entreprise`) VALUES (:priorite, :rue, :cp, :ville, :idE);");
        $res->bindParam(":priorite",$priorite);
        $res->bindParam(":rue",$rue);
        $res->bindParam(":cp",$cp);
        $res->bindParam(":ville",$ville);
        $res->bindParam(":idE",$idEntreprise);
        $res->execute();
    }

    public function getProchainePrioriteAdresse($idEntreprise) {
        $query = $this->pdo->prepare("
            SELECT MAX(priorite_adresse) AS max_priorite
            FROM adresses
            WHERE Id_entreprise = :idEntreprise
        ");
        $query->bindParam(":idEntreprise", $idEntreprise, PDO::PARAM_INT);
        $query->execute();
        
        $result = $query->fetch(PDO::FETCH_ASSOC);
        
        // Si aucune adresse n'existe encore pour cette entreprise, on retourne 1
        return isset($result['max_priorite']) && $result['max_priorite'] !== null
            ? $result['max_priorite'] + 1
            : 1;
    }

    //Incrémente toutes les priorités au-dessus lors de l'ajout
    public function incrementerPrioritesAdresses($idEntreprise, $nouvellePriorite) {
        // Vérifie que les paramètres sont valides
        if (!is_numeric($idEntreprise) || !is_numeric($nouvellePriorite)) {
            throw new InvalidArgumentException("Paramètres invalides pour incrementerPrioritesAdresses");
        }
        
        // Incrémente toutes les priorités >= nouvelle priorité pour cette entreprise
        $update = $this->pdo->prepare("
            UPDATE adresses
            SET priorite_adresse = priorite_adresse + 1
            WHERE Id_entreprise = :idEntreprise
            AND priorite_adresse >= :nouvellePriorite
        ");
        $update->bindParam(":idEntreprise", $idEntreprise, PDO::PARAM_INT);
        $update->bindParam(":nouvellePriorite", $nouvellePriorite, PDO::PARAM_INT);
        $update->execute();
    }
}


