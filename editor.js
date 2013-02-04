/**
* This file contains JavaScript functions to be used to create a JavaScript line editor for FHLSim (http://www.fhlsim.com)
* @author Matt Gill <code@mattgill.net>
* @copyright Copyright (c) 2009-2013, Matt Gill
*/

//define lines and positions
var lines = new Array();
lines['Even Strength Line 1'] = 'C,LW,RW,LD,RD';
lines['Even Strength Line 2'] = 'C,LW,RW,LD,RD';
lines['Even Strength Line 3'] = 'C,LW,RW,LD,RD';
lines['Even Strength Line 4'] = 'C,LW,RW,LD,RD';
lines['PP Line 1 (5 on 4)'] = 'C,LW,RW,LD,RD';
lines['PP Line 2 (5 on 4)'] = 'C,LW,RW,LD,RD';
lines['PP Line 1 (4 on 3)'] = 'C,W,LD,RD';
lines['PP Line 2 (4 on 3)'] = 'C,W,LD,RD';
lines['PK Line 1 (4 on 5)'] = 'C,W,LD,RD';
lines['PK Line 2 (4 on 5)'] = 'C,W,LD,RD';
lines['PK Line 1 (3 on 5)'] = 'C,LD,RD';
lines['PK Line 2 (3 on 5)'] = 'C,LD,RD';
lines['MiscExtra Skaters'] = '1,2';
lines['MiscStarting Goalie'] = 'G';

//define skill array
var skills = Array('IT','SP','ST','EN','DU','DI','SK','PA','PC','DF','SC','EX','LD','OV');

//extract player names and sort them. used in roster select box creation.
var player_names = new Array();
for (var i in players){
	player_names.push(i);
}
player_names.sort();  

//establish positions to display
var display_positions = new Array();
display_positions['C'] = 'Y';
display_positions['LW'] = 'Y';
display_positions['RW'] = 'Y';
display_positions['D'] = 'Y';
display_positions['G'] = 'Y';

//change the position flag
function changeDisplay(box){
	position = box.value; //figure out what position we are dealing with
	//if it is currently displayed, mark it as not to
	if (display_positions[position] == 'Y'){
		display_positions[position] = 'N';	
		box.style.color = 'grey';
	}
	//otherwise it was not being displayed. display it going forward
	else {
		display_positions[position] = 'Y';
		box.style.color = 'black';
		
	}
	//recreate the new roster boxes (dressed and scratched) using the new flags
	createRosterBox();
	//and re-count the number of dressed players
	dressedCount();
}


//assign player to a line
function assign(textbox){
    var selected_player_name = document.getElementById('roster').value; //find who is highlighted in the dressed box
    
    var nameElements = textbox.name.split("."); //segment the line and the position
    var line_div = document.getElementById(nameElements[0]); //grab the div for the line
    var line_group = line_div.getElementsByTagName('input'); //grab textboxes in div
    var already_on_line = 'No'; //assume he's not on for starters
    for(var i = 0; i < line_group.length; ++i) { //go through each textbox
      var elm = line_group[i]; //elm is a specific textbox
      if (elm.value == selected_player_name){ //if the value of that box is equal to the player name
	already_on_line = 'Yes';
      }
    }
    
    //if the player is already in this spot, remove the player frotm the position
    if (textbox.value == selected_player_name){
	textbox.value = '';
    }
    //otherwise, see if the player is already playing another position on this line
    else if (already_on_line == 'Yes'){
	//if he is, let the user know
	alert(selected_player_name + " is already on this line");
    }
    //otherwise assign the player to the spot
    else {
	textbox.value = selected_player_name;
    }
    
    displayPlayer(document.getElementById('roster')); //refresh the player display at the top
}

//create the player and line statisics boxes at the top of the form
function createStatBox() {
	//grab the area to work with
	var stat_div = document.getElementById('statDisplay');
	//need a player line display
	stat_div.innerHTML = "<div id='line_assignment'>&nbsp;</div>"; //player line assignment will go here
	
	//need a player stat display
	var traits = skills;
	var player_stats = "<div id='player_stats'><table cellpadding='0'><tr>";
	player_stats += "<td>POS</td><td>HD</td>";
	for (var i=0; i<traits.length; ++i){
		player_stats += "<td>"+traits[i]+"</td>";
	}
	player_stats += "</tr>";
	player_stats += "<tr>";
	player_stats += "<td><input type='text' readonly='readonly' name='player.POS' id='player.POS' size='3'</td></td><td><input type='text' readonly='readonly' name='player.HD' id='player.HD' size='3'</td></td>";
	for (var i=0; i<traits.length; ++i){
		player_stats += "<td><input type='text' readonly='readonly' name='player."+traits[i]+"' id='player."+traits[i]+"' size='2'</td>";
	}
	player_stats += "</tr>";
	
	//need a line average (merged with above to perserve spacing)
	player_stats += "<tr><td>&nbsp;</td><td>&nbsp;</td>";
	for (var i=0; i<traits.length; ++i){
		player_stats += "<td>"+traits[i]+"</td>";
	}
	player_stats += "</tr>";
	player_stats += "<tr>";
	player_stats += "<td colspan='2'>Line Average</td>";
	for (var i=0; i<traits.length; ++i){
		player_stats += "<td><input type='text' readonly='readonly' name='avg."+traits[i]+"' id='avg."+traits[i]+"' size='2'</td>";
	}
	player_stats += "</tr></table></div>";
	
	//print it all
	stat_div.innerHTML += player_stats;
	stat_div.innerHTML += "<br/><br/>";
}

//clear the textboxes on the form
function clearLines(){
	//don't worry from where, just grab all form elements
	var boxes = document.getElementsByTagName('input');
	for(var j = 0; j < boxes.length; ++j) { //go through each one
		var box = boxes[j]; //pick the specific box to work with
		if (box.type=='text'){ //make sure it's a text box
			box.value = ''; //clear it
		}
	}
	//update the player display at the top of the screen, as obviously the player cannot be a part of other lines
	displayPlayer(document.getElementById('roster'));
}

//find the highlighted character and display what lines he is on
function displayPlayer(selectBox){
	//line_assignment is the div of interest for line display, player_stats are the forms
	var player_name = selectBox.value; 
	var line_assignment = document.getElementById('line_assignment'); //line_assignment is what needs to be written to
	var assigned_to = '';
	
	//scan through every line
	for (var i in lines){
		var lineName = i;
		
		var line_div = document.getElementById(lineName); //grab a particular line
		var line_group = line_div.getElementsByTagName('input'); //grab its form elements
		
		for(var j = 0; j < line_group.length; ++j) { //cycle through each one
		  var elm = line_group[j]; //pick a specific input box (position) (happens to be it will always be a textbox)
		  //alert(elm.value);
		  //see if the player is playing here
		  if (player_name == elm.value){
			//if he is, add the line to the display string
			var lineDisplay = lineName.replace("Misc","");
			lineDisplay = lineDisplay.replace(" Line ","");
			lineDisplay = lineDisplay.replace("Even Strength","ES");
			assigned_to += ", "+lineDisplay;
		  }
		}
	}
	
	//eliminate first comma
	assigned_to = assigned_to.substr(2);
	
	//print line assignment
	line_assignment.innerHTML = "<b>" + player_name + "</b> is assigned to: <b>"+assigned_to + "</b>";
	
	//populate player stat form
	var stats = document.getElementById('player_stats');
	stats = stats.getElementsByTagName("input");
	
	for (var i= 0; i < stats.length; ++i){
		var stat_type = stats[i].name.substr(0,stats[i].name.indexOf(".")); //grab the stat type (before period)
		if (stat_type != 'player'){continue;} //if it's not a player related stat, don't fill it
		var stat = stats[i].name.substr(stats[i].name.indexOf(".")+1); //grab the stat name (after period)
		stats[i].value = players[player_name][stat];
	}
}

//this function is run whenever a div is clicked. averages the stats of players on the line
function averageLines(lineDiv){
	//undo bold on every line
	for (var i in lines){
		var lineName = i;
		var lineBlock = document.getElementById(lineName);
		lineBlock.style.fontWeight = '';
	}
	
	//bold current line
	lineDiv.style.fontWeight = 'bold';
	
	//grab textboxes on the line
	var line = lineDiv.getElementsByTagName('input');
	
	//average current line
	var avgs = Array(); //store summations, then averages here
	for (var i in skills){
		avgs[skills[i]] = 0; //initialize all
	}
	//now go sum
	var player_count = 0;
	//go through each player
	for (var j in line){
		var player_name = line[j].value; //extract player name
		if (player_name == undefined || player_name == ''){continue;}
		player_count++; //player was present
		for (var i in skills){
			//going through each skill for a player and summing
			avgs[skills[i]] += Number(players[player_name][skills[i]]);
		}
	}
	//now average
	for (var i in avgs){ //for each skill in average
		var base_num = avgs[i];
		avgs[i] = Math.round(avgs[i]/player_count);
		if (player_count == 0){avgs[i] = "";} //avoid 'NaN' result
	}
	
	
	//now populate statbox
	var stats = document.getElementById('player_stats'); //get stats area
	stats = stats.getElementsByTagName("input"); //gather all form elements
	
	for (var i=0; i < stats.length; ++i){
		var stat_type = stats[i].name.substr(0,stats[i].name.indexOf(".")); //grab the stat type (before period)
		if (stat_type != 'avg'){continue;} //if it's not meant for the line average, ignore it (only other option is player)
		var stat = stats[i].name.substr(stats[i].name.indexOf(".")+1); //grab the stat name (after period)
		stats[i].value = avgs[stat]; //assign value to stat box for stat
	}
}

//generates the divs and form elements used to display/enter lines
function genLines(){
	var lineBox = document.getElementById('lines'); //this is where line sections will be added
	
	var prevLineType = 'Ev'; //makes the first line work
	var currLineType = '';
	for (var i in lines){ //for each type of line
		currLineType = i.substr(0,2); //extract the first two letters
		//if this line is not similar to the last line (i.e. going from Even Strength to Power Play), create a new line 
		if (currLineType != prevLineType){
			lineBox.innerHTML += "<div style='clear: both;'><br/></div>"; //add a br to segment it all
		}
		var displayI = i.replace("Misc",""); //to avoid groupings - without Misc though Goalies and Extra Skaters would have their own lines
		
		//create div. div id is line name, the display is the var above
		var lineDiv = "<div id='" + i + "' style='float: left; padding-right: 20px;' onclick='averageLines(this);'>\n<span id='lineTitle'>" + displayI + "</span><br/>\n"; //start the line
		lineDiv += "<table>\n"; //start table
		var positions = lines[i].split(","); //extract positions needed for line
		//create a text box for each position on the line - each table row contains a position name and a text box
		for (var j in positions){
			lineDiv += "<tr><td>";
			lineDiv += positions[j];
			lineDiv += "</td><td>";
			var boxId = i + "." + positions[j];
			lineDiv += "<input type='text' name='" + boxId + "' id='" + boxId + "' readonly='readonly' onclick='assign(this);'>";
			lineDiv += "</td></tr>\n";
		}
		//end table and div and write the line to the line box
		lineDiv += "</table>";
		lineDiv += "</div>\n";
		lineBox.innerHTML += lineDiv;
		
		prevLineType = i.substr(0,2); //set the previous on the way out
	}
}

//scratch a player
function scratchPlayer(playerBox){
	var player_name = document.getElementById('roster').value; //determine the player we are dealing with
	players[player_name]['dressed'] = 'N'; //scratch him in the roster
	
	//remove player from all lines
	//scan through every line
	for (var i in lines){
		var lineName = i; //line name
		var line_div = document.getElementById(lineName); //grab the div that has its information
		var line_group = line_div.getElementsByTagName('input'); //grab all form elements in the line's div
		for(var j = 0; j < line_group.length; ++j) { //go through each line position
			var elm = line_group[j];
			if (player_name == elm.value){ //if this player is playing, remove hom from the line
			      elm.value = '';
			}
		}
	}
	//re-create roster boxes (dressed and scratched) with the new player information
	createRosterBox();
	//adjust the player display at the top to reflect the player highlighted in the select (may have changed after re-creation)
	displayPlayer(document.getElementById('roster'));
	//re-count the number of dressed players
	dressedCount();
}

//dress a player
function dressPlayer(playerBox) {
	var player_name = document.getElementById('scratched').value; //find the player we are dealing with
	players[player_name]['dressed'] = 'Y'; //set him to active in the roster file
	//re-create roster boxes (dressed and scratched) with the new player information
	createRosterBox();
	//adjust the player display at the top to reflect the player highlighted in the select (may have changed after re-creation)
	displayPlayer(document.getElementById('roster'));
	//re-count the number of dressed players
	dressedCount();
}

//go through the player roster and count how many are dressed
function dressedCount() {
	var dressedHeader = document.getElementById('roster_header'); //grab the area of the page I want to write to
	var total_active = 0;
	for (var i in player_names){ //go through player by name
		var player_name = player_names[i];
		//if he's dressed, add to the count
		if (players[player_name]['dressed'] == 'Y') {total_active++;}
	}
	dressedHeader.innerHTML = "<b>Dressed</b> ("+ total_active +" players)"
}

//create the roster boxes from which to select players
function createRosterBox() {
	//reset the dressed/scratched boxes
	var dressedBox = document.getElementById('roster');
	dressedBox.length = 0;
	var scratchedBox = document.getElementById('scratched');
	scratchedBox.length = 0;
	
	//player names are now sorted, so iterate through
	for (var i in player_names){
		i = player_names[i]; //now i is the player name
		//see if the player plays a position that should be displayed
		if (display_positions[players[i]['POS']] == 'Y'){
			//create the option for them
			var opbar = document.createElement('OPTION');
			opbar.text = i + " ("+ players[i]['POS'] +")";
			opbar.value = i;
			//add to the correct box depending on player status
			if (players[i]['dressed'] == 'Y'){
				//add to dressed box
				dressedBox.options.add(opbar);
			}
			else {
				//add to scratched box
				scratchedBox.options.add(opbar);
			}
		}
	}
	//reset selectedIndex for dressed players
	dressedBox.selectedIndex = 0;
}

//output roster and lines to text format to be read in by FHLSim program
function outputLines(){ 
	var displayString = ''; //big holder
	var rosterString = ''; //roster holder
	var lineString = ''; //lines holder
	
	//roster info
	var total_active = 0;
	for (var i in player_names){
		var player_name = player_names[i];
		if (players[player_name]['dressed'] == 'Y') {total_active++;} //add to count if active
	}
	
	//need 20 dressed players only
	if (total_active > 20){alert("You have more than 20 players dressed."); return false;}
	if (total_active < 20){alert("You have fewer than 20 (" + total_active + ") players dressed."); return false;}
	
	//FHLSim will expect the roster in the following order
	var displayOrder = new Array('C','LW','RW','D','G');
	for (var z = 0; z < displayOrder.length; ++z){ //go through each position
		var pos = displayOrder[z];
		var displayLine = ''; //start position line
		for (var i in player_names){
			i = player_names[i]; //now i is the player name
			//if the player is dressed and is the right position, add him to the position line
			if ((players[i]['POS'] == pos) && (players[i]['dressed'] == 'Y'))
			{
				displayLine += "," + players[i]['number'];
			}
		}
		displayLine = displayLine.substr(1); //skip that first comma
		rosterString += displayLine + '<br/>'+"\n"; //add HTML and text newlines to line
		
		//other than 20 players only, only two can be Goalies. If dealing with Goalies, check the count
		if (pos == 'G'){
			var goalies = displayLine.split(",");
			if (goalies.length < 2){
				alert("You must have two Goalies dressed.");
				return false;
			}
			else if (goalies.length > 2){
				alert("You can only have two Goalies dressed.");
				return false;
			}
		}
	}
	//line manipulation
	for (var i in lines) //i is line name
	{
		//get line section
		var lineDiv = document.getElementById(i);
		
		//grab positions
		var linePlayers = lineDiv.getElementsByTagName('input');
		for (var j = 0; j < linePlayers.length; ++j){ //for each position
			linePlayer = linePlayers[j]; //position element
			if (linePlayer.value == ''){
				alert("Player not assigned for " + linePlayer.name);
				return false;
			}
			var playerNum = players[linePlayer.value]['number'];
			//add player jersey number to output
			lineString += playerNum;
			//if not the last player on the line, add a comma
			if (j != (linePlayers.length - 1)){lineString += ','}
		}
		//end of the line, add a breakrule (HTML) and a newline char
		lineString += '<br/>' + "\n";
	}
	
	//write out the results
	var outputDiv = document.getElementById('output');
	displayString = rosterString + '***<br/>' + "\n" + lineString;
	outputDiv.innerHTML = displayString;
	
	//notify user to scroll down in case their screen is too small
	alert("Please scroll below for your lines. E-mail the contents of the box as a text file to your commissioner.");
}