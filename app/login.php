<?php
    session_start();
    require("../utils/db_login.php");
    require("../utils/tbs_class.php");
    require("../class/login_class.php");
    require("../controlers/controleur_login.php");
    $tbs= new clsTinyButStrong;
    try{
        $pdo = new PDO("mysql:host=$host;dbname=$dbname", $login, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $cible= $_SERVER["PHP_SELF"];
        $acc_users = new AccesUsers($pdo);
        $appli= new Appli ($tbs);
        if(!empty($_GET["action"]) && ($_GET["action"]=="modif")){      //On fait passer les variables onshow ici
            $data=$acc_users->recupererProfil($_SESSION['Id']);
            $pseudo=$data["pseudo"];
        }
        $appli->moteur($acc_users);
    }catch(PDOException $e){
        echo$e;
        $appli->moteur($acc_users);
    }
?>