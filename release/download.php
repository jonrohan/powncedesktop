<?php
	$version = $_REQUEST['v'];
	$virtual_page = "/download/PownceMonkey-v".$version;
?>
<script type="text/javascript">
	var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
	document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>

<script type="text/javascript">
    var pageTracker = _gat._getTracker("UA-xxxxxx-x");
    pageTracker._initData();
    pageTracker._trackPageview('<?php echo$virtual_page?>');
	window.location = "PownceMonkey-v<?php echo$version?>.air";
</script>