<?php
/**
 * This page loads a FHLSim XML Roster file and shows an interface (with supporting JavaScript) to create a text-based line file. 
 *
 * @author Matt Gill <code@mattgill.net>
 * @copyright Copyright (c) 2013, Matt Gill
 * May be modified and distributed freely so long as credit is given to the original author for work completed.
 */
    
    
// load the roster file
$xml = simplexml_load_file('rosters.xml');

// establish a team if one was requested
$team = (isset($_POST['team']) && $_POST['team'] != "") ? $_POST['team'] : "";
if ($team == ''){ // have the user pick one
?>
<html>
	<head>
		<title>FHL Line Editor</title>
	</head>
	<body>
		<form name='team_select' action='line_editor.php' method='POST'>
			<select name='team'>
<?php
	// run through the rosters and grab every team
	$teams = array();
	foreach ($xml->xpath("//team") as $team_array){
		$team_name = $team_array['name'];
		array_push($teams, strval($team_name));
    }
    sort($teams);
    foreach ($teams as $team_option){
		// see if this is the team requested if applicable, then write out the select option
		$selected = ($team == $team_option) ? " selected" : "";
		echo "\t\t<option value='$team_option'$selected>$team_option</option>\n";    
    }
?>
			</select>
			<input type='submit' value='Load Team'>
		</form>
	</body>
</html>
<?php
} else { // otherwise we have a team to work with
?>
<html>
    <head>
<?php
    print "\t<title>FHL Line Editor";
    if ($team != ""){ print " - $team";}
    print "</title>\n";
?>
<?php 
	echo "\t<script type=\"text/javascript\" src=\"js_teams/$team.js\"></script>\n";
?>
		<script type="text/javascript" src="editor.js"></script>
	</head>
    <body>
    <div id='rosterDiv' style='float: left;'>
        <form name='team_select' action='line_editor.php' method='POST'>
            <select name='team'>
<?php
	// run through the rosters and grab every team
	$teams = array();
	foreach ($xml->xpath("//team") as $team_array){
		$team_name = $team_array['name'];
		array_push($teams, strval($team_name));
	}
	sort($teams);
	foreach ($teams as $team_option){
		// see if this is the team requested if applicable
		$selected = ($team == $team_option) ? " selected" : "";
		// write select option
		echo "\t\t<option value='$team_option'$selected>$team_option</option>\n";    
	}
    ?>
            </select>
            <br/>
            <input type='submit' value='Load Team'>
        </form>
        <div id='roster_header'><b>Dressed</b></div>
        <select size=20 name='roster' id='roster' onchange='displayPlayer(this)'/><br/>
        <input type='button' value='Scratch Player' onclick='scratchPlayer();'><br/>
        <div id='scratched_header'><b>Scratched</b></div>
        <select size=8 name='scratched' id='scratched'/><br/>
        <input type='button' value='Dress Player' onclick='dressPlayer();'><br/><br/>
        
        Position Display Toggles<br/>
        <input type='button' value='C' onclick='changeDisplay(this);'/>
        <input type='button' value='LW' onclick='changeDisplay(this);'/>
        <input type='button' value='RW' onclick='changeDisplay(this);'/>
        <br/>
        <input type='button' value='D' onclick='changeDisplay(this);'/>
        <input type='button' value='G' onclick='changeDisplay(this);'/>
        <br/><br/>
        
        <input type='button' value='Generate Lines' onclick='outputLines();'><br/>
        <input type='reset' value='Clear Form' onclick='clearLines();'>   
    </div>
    <div id='bigDisplay' style='padding-left: 25px; margin-left: 25px; float: left; text-align: left;'>
        <div id='statDisplay' style='float: left; text-align: left; padding-right: auto; clear: left;'></div>
        <div id='lines' style='text-align: left; padding-right: auto; padding-left: 0px; clear: left;'></div>
        <div id='buttonRow' style='float: left; text-align: left; clear: left; '></div>
    </div>
</form>

<!-- submit button prints lines here -->
<div id='outputHeader' style='clear: both;'>
    <br/><br/><b>Text Line Output</b> (click 'Generate Lines' to populate this box)<br/><br/>
</div>
<div id='output' style='clear: both; border: 1px solid black;'><br/></div>

<script type="text/javascript">
    //load rosters initially
    createRosterBox();
    genLines();
    createStatBox();
    displayPlayer(document.getElementById('roster'));
    dressedCount();
</script>
</body>
</html>
<?php
}
?>