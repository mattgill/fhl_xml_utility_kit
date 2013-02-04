FHL XML Utility Kit
@author Matt Gill <code@mattgill.net>
@copyright Copyright (c) 2013, Matt Gill

Purpose:
This tool kit transforms the pre-formatted default rosters output from FHLSim into XML, and then displays it via XSL in rather pretty HTML.

History:
It was a graduate school project in 2007. The goal of the project was to transform XML data with XSL. As a former GM in FHLSim leagues, I always felt that trying to figure out who the best were on the team in a given specialty was annoying (finding the best defensive center on a team, or among all teams, for example). The meat of the project was in the XSLT transformation. However, since FHLSim doesn't create XML rosters by default, I had to write a quick script to create an XML version from the default pre-formatted HTML. When it was done, I thought people may find it useful so I posted it on my website. That being said, I don't know if anyone has used it. In June 2009, I added line editing via JavaScript because I wanted to do some JavaScript on the side. It's not perfect (as in I'm sure it can be fancier), but at least it provides an interface.

About the files in this set:
transform.php - is a web form that submits results to RostersToXML.php. transform.php takes the league name passed in and appends "Rosters.html" to it (resulting in the name of the file FHLSim outputs). 

RostersToXML.php - writes a file called rosters.xml which contains the information in the HTML rosters file as XML data. Refer to the XML schema documentation for the breakdown of the XML file and the comments in the PHP script to see how the transformation happens.

roster.html - references a Sarissa JavaScript library (see more below under 'Dependencies') as well as a function set I wrote. The funcs.js file looks for the rosters.xml file along with rosters.xsl to create HTML). The resulting transformation is a table for each team with the same roster information that FHLSim originally outputs. However, via the select boxes at the top, you can sort on each rating, along with look at all players in the league at once, among other options.

Dependencies:
This script depends on functionality provided by Sarissa. However, the Sarissa library is not included in this code out of licensing concerns. You can download Sarissa at (http://sarissa.sourceforge.net). I elected to have rosters.html use the condensed version, but you can drop either version in if you so choose, you just need to make sure that rosters.html references it as whatever you call it.

Other Notes:
- The HTML roster file must be straight from FHLSim. If extra elements are present (such as the result of XtraStats), I believe my script should fail. In addition, the rosters HTML file must be in the same directory as the scripts. 
- The HTML rosters file included is of the default rosters included with the FHLSim program.
- This project will probably not be updated in the future.

License:
This script can be modified and distributed freely provided credit is given to the original author where and when appropriate.