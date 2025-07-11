<?php session_start(); ?>
<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="./style/accueil.css" />
        <title>Outil de calcul en ligne</title>
    </head>
    <body>
        <div style="position: absolute; top: 20px; right: 20px">
            <?php
                if(empty($_SESSION['Id'])){
                    echo'<a href="./app/login.php">Se connecter →</a>';
                }else{
                    echo'<a href="./app/login.php?action=deconnexion">Se déconnecter →</a>';
                }
            ?>
        </div>
        <div class="menu-container">
            <h1>Menu</h1>
            <p>Veuillez choisir une fonctionnalité :</p>
            <div class="button-group">
                <button onclick="window.location.href='./app/app.php?action=calcul_matiere';">
                    <img
                        src="./img/fabric.png"
                        alt="Icône surface"
                        style="width: 45px; height: 45px; vertical-align: middle; margin-right: 8px"
                    />
                    Calcul de Surfaces
                </button>
                <button onclick="window.location.href='./app/app.php?action=calcul_impression';">
                    <img
                        src="./img/paper.png"
                        alt="Icône surface"
                        style="width: 45px; height: 45px; vertical-align: middle; margin-right: 8px"
                    />
                    Calcul de Feuilles
                </button>
                <button onclick="window.location.href='./app/app.php?action=backoffice';">
                    <img
                        src="./img/cycle.png"
                        alt="Icône surface"
                        style="width: 45px; height: 45px; vertical-align: middle; margin-right: 8px"
                    />
                    Backoffice
                </button>
            </div>
        </div>
    </body>
</html>
