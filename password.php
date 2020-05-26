<?php
    include 'core/init.php';
    $user_id = $_SESSION['user_id'];
    $user = $getFromU->userData($user_id);
    if($getFromU->loggedIn() === false){
        header('Location: '.BASE_URL.'index.php');
        die();
    }
    // $getFromU->update('users', $user_id, array('userGroup' => 'guest2' ));

    if(isset($_POST['submit'])){
        $currentPwd = $_POST['currentPwd'];
        $newPassword = $_POST['newPassword'];
        $rePassword = $_POST['rePassword'];

        if(!empty($currentPwd) && !empty($newPassword) &&!empty($rePassword)){
            if($getFromU->checkPassword($currentPwd) === true){
                if(strlen($newPassword)<6){
                    $error['newPassword'] = "  رمز عبور باید بیشتر از 6 کاراکتر باشد  ";
                }else if($newPassword != $rePassword){
                    $error['rePassword'] = "  پسووردهای وارد شده مطابقت ندارند  ";
                }else{
                    $getFromU->update('users', $user_id, array('password' => md5($newPassword)));
                    header('location: '.BASE_URL.$user->userGroup);
                }
            }
            else{
                    $error['currentPwd'] = "  رمز عبور کنونی اشتباه وارد شده است  ";
                }
            }
        }else{
            $error['fields'] = "  تمامی ستون ها لازم است پر شود  ";
        }

        if(isset($_POST['exit'])){
            header('location: '.BASE_URL.$user->userGroup);
        }

    
?>

<html>
	<head>
		<title>تغییر رمز عبور</title>
		<meta charset="UTF-8" />
		<link rel="stylesheet" type="text/css" href="css/font-awesome.min.css">
  		<script src="192.168.100.96:8080/cmv/js/jquery.min.js"></script>
        <link rel="stylesheet" href="css/style-complete.css"/>
    	</head>
	<!--Helvetica Neue-->
<body>
<div class="wrapper">
<!-- header wrapper -->

	 <!-- nav ends -->
	</div><!-- nav container ends -->
</div><!-- header wrapper end -->
<div class="container-wrap">
	<div class="lefter">
		<div class="inner-lefter">
			<div class="acc-info-wrap">
				<div class="acc-info-img">
					<!-- PROFILE-IMAGE -->
					<!-- <img src="PROFILE-IMAGE"/> -->
				</div>
				<div class="acc-info-name" >
                    <h3><?php echo $user->userName;?></h3>
                    <br>
					<h4><?php echo $user->userTitle;?></h4>
                </div>
			</div>
			<!--Acc info wrap end-->
			

		</div>
	</div><!--LEFTER ENDS-->
	
	<div class="righter">
		<div class="inner-righter">
			<div class="acc">
				<div class="acc-heading">
					<h2>تغییر رمز عبور</h2>
					<h3>در این قسمت رمز عبور خود را می توانید تغییر دهید.</h3>
				</div>
				<form method="POST">
				<div class="acc-content">
					<div class="acc-wrap">
						<div class="acc-right">
							رمز عبور کنونی
						</div>
						<div class="acc-right">
							<input type="password" name="currentPwd"/>
							<span>
                            <?php if(isset($error['currentPwd'])) {echo $error['currentPwd'];}?>							</span>
						</div>
					</div>

					<div class="acc-wrap">
						<div class="acc-right">
							رمز عبور جدید
						</div>
						<div class="acc-right">
							<input type="password" name="newPassword" />
							<span>
                            <?php if(isset($error['newPassword'])) {echo $error['newPassword'];}?>							</span>
						</div>
					</div>

					<div class="acc-wrap">
						<div class="acc-right">
							تکرار رمز عبور جدید
						</div>
						<div class="acc-right">
							<input type="password" name="rePassword"/>
							<span>
                            <?php if(isset($error['rePassword'])) {echo $error['rePassword'];}?>							</span>
						</div>
					</div>
					<div class="acc-wrap">
						<div class="acc-left">
						</div>
						<div class="acc-right">
                            <input type="Submit" name="submit" value="اعمال تغییرات"/>
                            <input type="Submit" name="exit" value="انصراف"/>
						</div>
						<div class="settings-error">
                        <?php if(isset($error['fields'])) {echo $error['fields'];}?>
 						</div>	
					</div>
				 </form>
				</div>
			</div>
			<div class="content-setting">
				<div class="content-heading">
					
				</div>
				<div class="content-content">
					<div class="content-left">
						
					</div>
					<div class="content-right">
						
					</div>
				</div>
			</div>
		</div>	
	</div>
	<!--RIGHTER ENDS-->
</div>
<!--CONTAINER_WRAP ENDS-->
</div>
<!-- ends wrapper -->
</body>
</html>
