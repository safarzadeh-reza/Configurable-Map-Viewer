<?php
include 'database/connection.php';
include 'classes/user.php';
include 'classes/follow.php';
include 'classes/tweet.php';

global $pdo;

session_start();

$getFromU = new User($pdo);
$getFromT = new Tweet($pdo);
$getFromF = new Follow($pdo);

define("BASE_URL", "http://192.168.100.96:8080/cmv/")

?>