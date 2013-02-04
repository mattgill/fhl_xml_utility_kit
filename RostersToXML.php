<?php
/**
 * This script takes a HTML roster file outputted by the FHLSim program and converts it to an XML file,
 * as well as makes JavaScript files per team for the line editor script.
 * NOTE: Must be an output file directly from the FHLSim program. No additional processing can be done before running this script.
 * Custom headers and footers as allowed by the FHLSim program should not be a problem though this has not been tested.
 *
 * @author Matt Gill <code@mattgill.net>
 * @copyright Copyright (c) 2013, Matt Gill
 * May be modified and distributed freely so long as credit is given to the original author for work completed.
 */
	
// create filename
$leagueName = $_POST['leagueName'];
$rosterFile = $leagueName."Rosters.html";
	
// make sure file exists before proceeding. if it does not, die. 
if (!file_exists($rosterFile)){
	echo "$rosterFile does not exist. Are you sure you entered your league name correctly and that the files are uploaded?";
	die();
}
	
// read in html file
$file = fopen($rosterFile, "r");
flock($file, LOCK_SH);
$rosterFile = array(null);
array_pop($rosterFile);
while (!feof($file)) {
	$line = fgets($file);
	$rosterFile[] = $line;
}
flock($file, LOCK_UN);
fclose($file);
	
// prepare XML file
$xmlRoster = fopen("rosters.xml", 'w');
flock($xmlRoster, LOCK_EX);
// create a date string to insert into XML file
$dateString = date("l, M j Y"); 
	
$xmlStart = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"."\n"."<league leagueName=\"$leagueName\" dateLine=\"As of $dateString\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"  xsi:noNamespaceSchemaLocation=\"rosters.xsd\">"."\n";
$xmlStart = utf8_encode($xmlStart);
fwrite($xmlRoster, "$xmlStart");
	
$preBlock = false; // denotes if lines are part of rosters
$proTeam = false; // denotes if the current preBlock (if active is a pro roster), if it is a farm roster, $proTeam should be false
	
// for each line stored during the file read earlier
foreach($rosterFile as $line)
{
	// attempt to find paragraph tag
	$dateFind = strstr($line,"<p>");
	
	// check to see if a closing PRE tag exists
	$preEndFind = strstr($line,"</PRE>");
	
	// if $preEndFind does not return FALSE, then a ending PRE tag was found. This line is not a player!
	if ($preEndFind != false)
	{$preBlock = FALSE;
		// if it was a PRO pre block, write a </pro> tag to end the element
		if ($proTeam === true)
		{
			$writeString = "\t\t"."</pro>"."\n";
		}
		// if it wasn't a pro block, it was a farm block, write a ending farm tag, furthermore, add a ending team tag since a new team will be the next element to come in the rosters file
		else
		{
			$writeString = "\t\t"."</farm>"."\n"."\t"."</team>"."\n";
		}
		// write out
		$writeString = utf8_encode($writeString);
		fwrite($xmlRoster,$writeString);
	}
	
	// if this loop is entered, is because a <PRE> was recently found but the corresponding </PRE> was not yet found
	if ($preBlock == true)
	{
		// convert this line containing a player into an XML element inside a string
		$playerRecord = makePlayer($line);
		$playerRecord = utf8_encode($playerRecord);
		// write the XML element string to the XML file
		fwrite($xmlRoster,($playerRecord));
	}
	
	// see if the line contains a team (an H2 tag followed by the start of an anchor tag)
	// the initial Team Rosters heading is also H2, hence the addition of the anchor tag is important
	$h2Pos = strstr($line,"<H2><A");
	
	// if $h2Pos does not return FALSE, then a team name occupies this line
	if ($h2Pos != false)
	{
		// the team name starts with the 23rd character in the line. the line starts at position 0. The H2 tag closes at position 3. The A NAME tag runs from 4-22. FHL leaves 10 characters for the A NAME regardless of whether the team name is 10 characters (max team name length in FHL is 10 letters)
		// find the position of the end of the team anchor tag
		$teamNameStart = 23;
		$teamNameEnd = strpos($line,"</A>");
		// adjust so position reflects last character of team name
		$teamNameEnd = $teamNameEnd - 1;
		
		// determine how many characters are in team name
		$teamNameLength = $teamNameEnd - $teamNameStart + 1;
		
		// get substring of team name
		$teamName = substr($line,23,$teamNameLength);
		
		// write the team name element and attribute to the XML file
		$writeString = "\t"."<team name=\"$teamName\">"."\n";			
		$writeString = utf8_encode($writeString);
		fwrite($xmlRoster,$writeString);
	}		
	
	// if a line starts with a <pre>, then the players are coming up in the line after
	$preFind = strstr($line,"<PRE>");
	
	// if <pre> tag appears, next line will be a player, and every line after as well, until closing <pre> tag appears
	if ($preFind != false)
	{$preBlock = true;
		// this preBlock is a different type of roster than the last time a <pre> block was realized, adjust $proTeam as such
		if ($proTeam == true)
		{
			// going into a farm team section, start a farm element
			$proTeam = false;
			$writeString = "\t\t"."<farm>"."\n";
		}
		else
		{
			// going into a pro team section, start a pro element
			$proTeam = true;
			$writeString = "\t\t"."<pro>"."\n";
		}
		$writeString = utf8_encode($writeString);
		fwrite($xmlRoster,$writeString);
	}
}
	
// close the output file
$endLeague = "</league>";
$endLeague = utf8_encode($endLeague);
fwrite($xmlRoster,$endLeague);
flock($xmlRoster, LOCK_UN);
fclose($xmlRoster);

// let the user know the script is done
echo "Transformation complete.";
	
// function makePlayer creates a XML element with attributes for the player whose line is passed in. Returns XML element entity. 
function makePlayer($input)
{
	$number = substr($input,0,2);
	$nameSpace = substr($input,3,22);
	$name = trim($nameSpace);
	$pos = trim(substr($input,26,2));
	$shoots = substr($input,29,1);
	$condition = substr($input,32,2);
	$injury = trim(substr($input,35,2));
	
	// all previous ratings were a certain amount of characters. the ratings below may be two or three digit ratings. this is why explode is used as opposed to pre-determined substrings like above.
	list ($intensity, $speed, $strength, $endurance, $durability, $discipline, $skating,
		  $passing, $puckControl, $defense, $scoring, $experience, $leadership, $overall) = explode(" ",substr($input,38));
	
	$playerRecord = "\t\t\t"."<player number=\"$number\" name=\"$name\" position=\"$pos\" shoots=\"$shoots\" condition=\"$condition\" injury=\"$injury\" intensity=\"$intensity\" speed=\"$speed\" strength=\"$strength\" endurance=\"$endurance\" durability=\"$durability\" discipline=\"$discipline\" skating=\"$skating\" passing=\"$passing\" puck_control=\"$puckControl\" defense=\"$defense\" scoring=\"$scoring\" experience=\"$experience\" leadership=\"$leadership\" overall=\"$overall\"/>"."\n";
	return $playerRecord;
}

// make a javascript file
// load the roster file
$xml = simplexml_load_file('rosters.xml');

// output the team roster in JS and then reference it to keep this page clean
$key_converter = array(); // will convert a name to abbreviation
$key_converter['position'] = 'POS';
$key_converter['shoots'] = 'HD';
$key_converter['intensity'] = 'IT';
$key_converter['speed'] = 'SP';
$key_converter['strength'] = 'ST';
$key_converter['endurance'] = 'EN';
$key_converter['durability'] = 'DU';
$key_converter['discipline'] = 'DI';
$key_converter['skating'] = 'SK';
$key_converter['passing'] = 'PA';
$key_converter['puck_control'] = 'PC';
$key_converter['defense'] = 'DF';
$key_converter['scoring'] = 'SC';
$key_converter['experience'] = 'EX';
$key_converter['leadership'] = 'LD';
$key_converter['overall'] = 'OV';

// write each team to a javascript file
if (!file_exists('js_teams')){ // make the directory if not present
	mkdir('js_teams');
}
foreach ($xml->xpath("//team") as $team_array)
{
	$team = $team_array['name'];
	// write a file
	$fh = fopen("js_teams/$team.js","w");
	// load players into JS array
	fwrite($fh, "var players = new Array();"."\n");
	foreach ($xml->xpath("//team[@name='$team']/pro/player") as $player_array){
		fwrite($fh, "players['".$player_array['name']."'] = new Array();\n");
		fwrite($fh, "players['".$player_array['name']."']['number'] = '".trim($player_array['number'])."';\n");
		fwrite($fh, "players['".$player_array['name']."']['name'] = '".trim($player_array['name'])."';\n");
		fwrite($fh, "players['".$player_array['name']."']['dressed'] = 'Y';\n");
		foreach ($key_converter as $key => $value) {
			$js_var = $value;
			fwrite($fh, "players['".$player_array['name']."']['$js_var'] = '".$player_array[$key]."';\n");
		}
	}
	fclose($fh);
}
?>