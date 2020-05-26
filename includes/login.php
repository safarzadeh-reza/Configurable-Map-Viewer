<?php
if(isset($_POST['login']) && !empty($_POST['login'])){
    $email = $_POST['email'];
    $password = $_POST['password'];

    if(!empty($email) or !empty($password)){
        $email = $getFromU->checkInput($email);
        $password = $getFromU->checkInput($password);

        // if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
        //     $error = "ایمیل نامعتبر";
        // }
        //else{
            if($getFromU->login($email, $password) === false){
                $error = "!ایمیل یا رمز عبور نامعتبر";
            }
        //};
    }else{
        $error = "لطفا ایمیل و رمز عبور را وارد کنید";
    }
}
?>
<div class="login-div">
    ورود به سامانه
<form method="post"> 
	<ul>
		<li>
		  <input type="text" name="email" placeholder="لطفا ایمیل خود را وارد کنید"/>
		</li>
		<li>
		  <input type="password" name="password" placeholder="رمز عبور"/><input type="submit" name="login" value="ورود"/>
		</li>
		<li>
		  <input type="checkbox" Value="Remember me">مرا به خاطر بسپار
		</li>
	</ul>
    <?php 
    if(isset($error)){
        echo '<li class="error-li">
        <div class="span-fp-error">'.$error.'</div>
       </li> ';
    }
    ?>
	 
	
	</form>
</div>