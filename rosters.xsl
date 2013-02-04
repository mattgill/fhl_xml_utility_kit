<?xml version="1.0" encoding="UTF-8"?>
<!--
 This page loads a FHLSim XML Roster file and shows an interface (with supporting JavaScript) to create a text-based line file. 
 
 @author Matt Gill <code@mattgill.net>
 @copyright Copyright (c) 2007-2013, Matt Gill
 May be modified and distributed freely so long as credit is given to the original author for work completed.
 
--> 
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <!-- Series of parameters that need to be passed in at transformation time --> 
    <xsl:param name="rating"/>
    <xsl:param name="display"/>
    <xsl:param name="leagueList"/>
    <xsl:param name="sortOrder"/>
    <xsl:param name="teamSelect"/>
    <xsl:template match="/">
        <!-- Output must be well-formed to show with Sarissa. As such, everything below is contained within "output" -->
        <output>
            <!-- Make a select box and populate it with team names. This will allow the user to select in sole team for viewing as opposed to browsing every team in the league -->
            Select Team (Teams Only): <select name="teamSelectSelect" id="teamSelectSelect" onchange="setTeam(this.value);setSelectedIndex(this.selectedIndex);createRosters();">
                <option value="All">All</option>
                <xsl:for-each select=".//team">
                    <xsl:sort select="@name" order="ascending"/>
                    <xsl:element name="option"><xsl:attribute name="value"><xsl:value-of select="@name"/></xsl:attribute><xsl:value-of select="@name"/></xsl:element>
                </xsl:for-each>
            </select>
            <!-- Adjusts according to whether the user seeks a team-by-team breakdown or a list of all players in the league -->
            <xsl:choose>
                <xsl:when test="$leagueList = 'true'">
                    <xsl:element name="a"><xsl:attribute name="name">top</xsl:attribute></xsl:element>
                    <h1><xsl:value-of select="/league/@leagueName"/> Players</h1>
                    <h3><xsl:value-of select="/league/@dateLine"/></h3>
                    <table><tr align="center" class="colHeader"><td>#</td><td align="left">Player</td><td>Pos</td><td>Hand</td><td>CD</td>
                    <td>IJ</td><td>IT</td><td>SP</td><td >ST</td><td>EN</td><td>DU</td><td>DI</td><td>SK</td>
                        <td>PA</td><td>PC</td><td>DF</td><td>SC</td><td>EX</td><td>LD</td><td>OV</td><td>Team</td></tr>
                             <xsl:call-template name="printRoster"/>
                      </table>
                  </xsl:when>
                <xsl:otherwise>
                    <h1><xsl:value-of select="/league/@leagueName"/> Rosters</h1>
                    <h3><xsl:value-of select="/league/@dateLine"/></h3>
                    <xsl:for-each select="/league/team">
                        <!-- sort the teams alphabetically -->
                        <xsl:sort select="@name"/>
                        <xsl:if test="@name = $teamSelect or 'All' = $teamSelect">
                            <span class="teamHeader"><xsl:element name="a"><xsl:attribute name="name"><xsl:value-of select="@name"/></xsl:attribute><xsl:value-of select="@name"/></xsl:element></span>
                            <table>
                            <xsl:if test="$display != 'farm'">
                            <tr><td colspan="20" class="rosterHeader">Pro Roster</td></tr>
                            <tr align="center" class="colHeader"><td>#</td><td align="left">Player</td><td>Pos</td><td>Hand</td><td>CD</td>
                                <td>IJ</td><td>IT</td><td>SP</td><td >ST</td><td>EN</td><td>DU</td><td>DI</td><td>SK</td>
                                <td>PA</td><td>PC</td><td>DF</td><td>SC</td><td>EX</td><td>LD</td><td>OV</td></tr>
                                <xsl:for-each select="pro">
                                    <xsl:call-template name="printRoster"/>
                                        </xsl:for-each>
                            </xsl:if>
                            <xsl:if test="$display != 'pro'">
                            <tr><td colspan="20" class="rosterHeader">Farm Roster</td></tr>
                                   <tr align="center" class="colHeader"><td>#</td><td align="left">Player</td><td>Pos</td><td>Hand</td><td>CD</td>
                                            <td>IJ</td><td>IT</td><td>SP</td><td >ST</td><td>EN</td><td>DU</td><td>DI</td><td>SK</td>
                                            <td>PA</td><td>PC</td><td>DF</td><td>SC</td><td>EX</td><td>LD</td><td>OV</td></tr>
                                 <xsl:for-each select="farm">
                                    <xsl:call-template name="printRoster"/>
                                 </xsl:for-each>
                                </xsl:if>
                            </table>      
                            <br/><br/>
                        </xsl:if>
                    </xsl:for-each>
              </xsl:otherwise>
            </xsl:choose>
        </output>
    </xsl:template>

    <!-- printRoster prints the ratings for every player found within the current position in the XML document, depending on where the template is called. -->
    <xsl:template name="printRoster">
        <xsl:for-each select=".//player">
            <xsl:sort select="@*[name()=$rating]" order="{$sortOrder}"/>
            <xsl:variable name="rowClass"><xsl:choose><xsl:when test="position() mod 2 = 0">alt</xsl:when><xsl:otherwise>std</xsl:otherwise></xsl:choose></xsl:variable>
            <tr><xsl:attribute name="class"><xsl:value-of select="$rowClass"></xsl:value-of></xsl:attribute>
                <td align="right"><xsl:value-of select="@number"/></td>
                <td align="left"><xsl:value-of select="@name"/></td>               
                <td align="right"><xsl:value-of select="@position"/></td>               
                <td align="center"><xsl:value-of select="@shoots"/></td>
                <td align="center"><xsl:value-of select="@condition"/></td>
                <td align="center"><xsl:value-of select="@injury"/></td>
                <td align="center"><xsl:value-of select="@intensity"/></td>
                <td align="center"><xsl:value-of select="@speed"/></td>
                <td align="center"><xsl:value-of select="@strength"/></td>
                <td align="center"><xsl:value-of select="@endurance"/></td>
                <td align="center"><xsl:value-of select="@durability"/></td>
                <td align="center"><xsl:value-of select="@discipline"/></td>
                <td align="center"><xsl:value-of select="@skating"/></td>
                <td align="center"><xsl:value-of select="@passing"/></td>
                <td align="center"><xsl:value-of select="@puck_control"/></td>
                <td align="center"><xsl:value-of select="@defense"/></td>
                <td align="center"><xsl:value-of select="@scoring"/></td>
                <td align="center"><xsl:value-of select="@experience"/></td>
                <td align="center"><xsl:value-of select="@leadership"/></td>
                <td align="center"><xsl:value-of select="@overall"/></td>
                <xsl:if test="$leagueList = 'true'"><td align="left"><xsl:value-of select="../../@name"/></td></xsl:if>
            </tr>            
        </xsl:for-each>
    </xsl:template>
 </xsl:stylesheet>
