<?php
$dsn = 'mysql:host=localhost; dbname=cmv';
$user = 'root';
$pass = ''; 

try{
    $pdo = new PDO($dsn, $user, $pass, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'UTF8'"));
    $pdo->exec("SET CHARACTER SET UTF8");
}catch(PDOException $e){
    echo 'Connection error!' . $e->getMessage();
}
?>