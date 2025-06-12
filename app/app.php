<?php
    session_start();
    require("../utils/db_login.php");
    require("../utils/tbs_class.php");
    require("../class/impressions_class.php");
    require("../class/matieres_class.php");
    require("../class/datas_class.php");
    require("../class/clients_class.php");
    require("../class/entreprises_class.php");
    require("../class/adresses_class.php");
    require("../controlers/controleur_app.php");
    $tbs= new clsTinyButStrong;
    try{
        $pdo = new PDO("mysql:host=$host;dbname=$dbname", $login, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $cible= $_SERVER["PHP_SELF"];
        $acc_datasImpr = new AccesDatasImpr($pdo);
        $acc_datasMatiere = new AccesDatasMatiere($pdo);  
        $acc_datasEnr = new AccesDatas($pdo);
        $acc_client = new AccesClients($pdo);
        $acc_entreprise = new AccesEntreprises($pdo);
        $acc_adresses = new AccesAdresses($pdo);
        $appli= new Appli ($tbs);
        $appli->moteur($acc_datasImpr,$acc_datasMatiere,$acc_datasEnr,$acc_client,$acc_entreprise,$acc_adresses);
    }catch(PDOException $e){
        $appli->moteur($acc_datasImpr,$acc_datasMatiere,$acc_datasEnr,$acc_client,$acc_entreprise,$acc_adresses);
    }

?>