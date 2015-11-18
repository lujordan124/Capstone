<?php
	session_start();
	$password = $_POST['password'];
	if($password == "comparch"){
		header("Location: test.html");
	} else {
		$_SESSION['wrong'] = true;
		header("offfocus.php");
	}
?>