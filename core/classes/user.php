<?php
class User{
    protected $pdo;

    function __construct($pdo){
        $this->pdo = $pdo;
    }

    public function checkInput($var){
        $var = htmlspecialchars($var);
        $var = trim($var);
        $var = stripcslashes($var);
        return $var;
    }

    public function login($email, $password){
        $stmt = $this->pdo->prepare("SELECT user_id FROM users WHERE email =:email  AND password =:password ");
        $stmt->bindParam(":email", $email, PDO::PARAM_STR);
        $stmt->bindParam(":password", (md5($password)), PDO::PARAM_STR);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_OBJ);
        $count = $stmt->rowCount();
        if($count>0){
            $_SESSION['user_id'] = $user->user_id;
            header('location: '.BASE_URL.'cmv.php');
        }
        else{
            return false;
        }
    }
    
    public function loggedIn(){
        return(isset($_SESSION['user_id'])) ? true : false;
    }


    public function userData($user_id){
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE user_id=:user_id ");
        $stmt->bindParam(":user_id", $user_id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    public function update($table, $user_id, $fields){
        $columns = '';
        $i = 1;
        foreach($fields as $name => $value){
            $columns .= "{$name} = :{$name}";
            if($i < count($fields)){
                $columns .= ', ';
            }
            $i++;
        }
    $sql = "UPDATE {$table} SET {$columns} WHERE user_id = {$user_id}";
        if ($stmt = $this->pdo->prepare($sql)){
            foreach ($fields as $key => $value){
                $stmt->bindValue(':' .$key, $value);
            }
            $stmt->execute();
            // var_dump($sql);
        }
    }

    public function checkPassword($password){
        $stmt = $this->pdo->prepare("SELECT password FROM users WHERE  password=:password ");
        $stmt->bindParam(":password", (md5($password)), PDO::PARAM_INT);
        $stmt->execute();
        $count = $stmt->rowCount();
        if($count>0){
            return true;
        }else{
            return false;
        }
    }

    public function logout(){
        $_SESSION = array();
        session_destroy();
        header('location: '.BASE_URL.'index.php');

    }

}
?>
