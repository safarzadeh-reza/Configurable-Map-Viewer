<?php
    include 'core/init.php';
?>

<!--
   This template created by Meralesson.com 
   This template only use for educational purpose 
-->
<html>
	<head>
		<title>سامانه اطلاعات مکانی پارسا</title>
		<meta charset="UTF-8" />
		<!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.css"/> -->
		<link rel="stylesheet" href="css/style-complete.css"/>
	</head>
	<!--Helvetica Neue-->
<body>
<div class="front-img">
	<img src="images/t3.jpg"></img>
</div>	

<!-- <div class="wrapper"> -->
<!-- header wrapper -->
<!-- <div class="header-wrapper">
	
	<div class="nav-container">
		<div class="nav">
			
			<div class="nav-left">
				<ul>
					<li><i class="fa fa-twitter" aria-hidden="true"></i><a href="#">Home</a></li>
					<li><a href="#">About</a></li>
				</ul>
			</div>

			<div class="nav-right">
				<ul>
					<li><a href="#">Language</a></li>
				</ul>
			</div>
	

		</div>

	</div>

</div> -->
<!-- header wrapper end -->
	
<!---Inner wrapper-->
<div class="inner-wrapper">
	<!-- main container -->
	<div class="main-container">
		<!-- content left-->
		<div class="content-right">
			<h1 style="font-family: B titr">سامانه جامع اطلاعات مکانی پارسا</h1>
			<br/>
			<br/>
			<br/>
			<p></p>
		</div><!-- content left ends -->	

		<!-- content right ends -->
		<div class="content-center">
			<!-- Log In Section -->
			<div class="login-wrapper">
			  <!--Login Form here-->
              <?php include 'includes/login.php'; ?>
			</div><!-- log in wrapper end -->

			<!-- SignUp Section -->
			<!-- <div class="signup-wrapper">
               <?php //include 'includes/signup-form.php'; ?> -->
			<!-- </div>  -->
			<!-- SIGN UP wrapper end -->

		</div><!-- content right ends -->

	</div><!-- main container end -->

</div><!-- inner wrapper ends-->
</div><!-- ends wrapper -->
</body>
</html>

