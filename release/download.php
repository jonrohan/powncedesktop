<?php
$myFile = "current.txt";
$fh = fopen($myFile, 'r');
$theData = fread($fh, filesize($myFile));
fclose($fh);
header( 'Location: http://www.dinnermint.org/PownceMonkey/release/PownceMonkey-v'.$theData.'.air' ) ;
?>
