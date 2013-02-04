/**
* This script is a JavaScript function library that contains core functions for XML/XSL transformation and display of FHL-based XML roster files.
* @author Matt Gill <code@mattgill.net>
* @copyright Copyright (c) 2007-2013, Matt Gill
*/

//store variables
//rating holds the rating that the rosters will be sorted on
var rating = '';
//sort order is either ascending or descending  and will be set when the rating is selected. certain ratings are logically apt to be sorted in certain orders
var sortOrder = 'ascending';
//display can be 'full', 'pro', or 'farm'. Full will display both pro and farm rosters, while 'pro' will display only pro rosters and 'farm' will display only farm rosters
//set it to 'full' on initialization
var display = 'full';
//league list will hold if players are displayed in a massive list or by teams (set to 'false' if 'by teams' is desired)
var leagueList = 'false';
//teamSelect is the name of the team to be shown 
//if value of teamSelect is "All", then all teams will be shown
var teamSelect = 'All';
//teamSelectIndex holds the selectedIndex position of the team selected so it can be highlighted once the list is recreated after XSLT transformation
var teamSelectIndex = '0';
//placeholder for XML file
var xml;
//placeholder for XSL file
var xsl;
	
	
//this function allows the retrieval of an XML document
//getXmlDocument written by Emmanuil Batsis for the artcie "Sarissa to the Rescue" - http://www.xml.com/pub/a/2005/02/23/sarissa.html
function getXmlDocument(fileUrl)
{
    var xmlDocument = Sarissa.getDomDocument();
    xmlDocument.async = false;
    xmlDocument.load(fileUrl);
    if (Sarissa.getParseErrorText(xmlDocument) != Sarissa.PARSED_OK)
    {
	    alert(Sarissa.getParseErrorText(xmlDocument));
    }
	return xmlDocument;
}
//this function will be run on the loading of the body to set the framework for future operations
//this function will also update the "Sort By" select box as well as per comment below
function init()
{
	//grab the XML we will need
	xml       = getXmlDocument("rosters.xml");
	//grab the stylesheet we will use as well
	xsl       = getXmlDocument("rosters.xsl");
	//update the sort by select boxes to reflect that the way the XML data is stored is sorted by position
	document.selects.ratingSelect.selectedIndex = 2;
}

//setRating assigns ratingPass to the variable 'rating'. ratingPass is the rating on which the rosters should be sorted upon XSLT transformation. setRating() also sets the sortOrder variable depending on the rating selected. certain ratings are better suited to be sorted in a given order. 
function setRating(ratingPass){
	rating = ratingPass;
	if (ratingPass == "position")
	{rating = "(number(@position='C') * 1) + (number(@position='LW') * 2) + (number(@position='RW') * 3)  + (number(@position='D') * 4)  + (number(@position='G') * 5)";}
	if (rating == "number" || rating == "name" || rating == "hand" || ratingPass == "position")
	{sortOrder = 'ascending';} else {sortOrder = 'descending';}
}

//setDisplay assigns the argument displayPass to the 'display' variable. 
function setDisplay(displayPass){
	display = displayPass;
}

//setLeagueList assigns the argument leagueListPass to the leagueList variable. 
function setLeagueList(leagueListPass){
	leagueList = leagueListPass;
}

//setTeam assigns the argument teamPass to the selectTeam variable. 
function setTeam(teamPass){
	teamSelect = teamPass;
}

//setSelectedIndex assigns the selectedIndex of the team selected to the teamSelectIndex variable
function setSelectedIndex(siPass)
{
	teamSelectIndex = siPass;
}


//this function creates the XSLT Processor, determines a place to display the results of the transformation, applies the stylesheet to the processor, sets parameters, and transforms the XML document that should be obtain prior to the running of this function
//the end of the function updates the teamSelect box as per the comments
function createRosters()
{
	//create a XSLT Processor
	var processor = new XSLTProcessor();
	//assign what element in the DOM will house the results of the transformation
	var results   = document.getElementById('results');
		
	//import stylesheet grabbed earlier for processor
	processor.importStylesheet(xsl);
	
	//attach the two parameters to the processor
	processor.setParameter('', 'rating',rating);
	processor.setParameter('', 'display',display);
	processor.setParameter('', 'leagueList',leagueList);
	processor.setParameter('', 'sortOrder',sortOrder);
	processor.setParameter('', 'teamSelect',teamSelect);
	//transform and spit the results into the appropriate DOM object
	Sarissa.updateContentFromNode(xml, results, processor);
	
	//JavaScript is not executed during the output of the translation. As such, the space below is used to update the teamSelect box and have it show the team that has been selected (so the box reflects what the user is being shown)
	teamSelectBox = document.getElementById('teamSelectSelect');
	teamSelectBox.selectedIndex = teamSelectIndex;
	
}
