<?php
	session_start();
	if($_SESSION['wrong']){
		echo "<h3>Wrong Password.</h3>";
	}
	$_SESSION['wrong'] = false;
?>
<html>
	<form action = "checkPassword.php" method = "POST">
		<center>
			<br><br><br><br><br><br><br><br><br><br><br>
			<h1>Quiz has been paused. Please wait for professor to come.</h1>
			Password: <input type = "text" name = "password">
		</center>
	</form>
</html>