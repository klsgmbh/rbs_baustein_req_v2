<?xml version="1.0" encoding="us-ascii"?>
<out:stylesheet xmlns:out="http://www.w3.org/1999/XSL/Transform" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:ifp="http://xmlns.cit.de/intelliform/pages/annotation/1.0" xmlns:a="http://xmlns.cit.de/assistants/internal" xmlns:java="http://xml.apache.org/xslt/java" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0" exclude-result-prefixes="xsl" extension-element-prefixes="java">
   <out:template match="/*">
      <out:copy>
         <out:apply-templates select="@*"/>
         <out:for-each select="idData">
            <out:apply-templates select="." mode="copy"/>
         </out:for-each>
         <out:for-each select="objtype">
            <out:copy>
               <out:value-of select="."/>
            </out:copy>
         </out:for-each>
         <out:for-each select="bisf00000016">
            <out:copy>
               <out:value-of select="."/>
            </out:copy>
         </out:for-each>
         <out:for-each select="adrzs">
            <out:copy>
               <out:value-of select="."/>
            </out:copy>
         </out:for-each>
         <out:for-each select="f00000053">
            <out:copy>
               <out:value-of select="."/>
            </out:copy>
         </out:for-each>
         <out:for-each select="hnr">
            <out:copy>
               <out:value-of select="."/>
            </out:copy>
         </out:for-each>
         <out:for-each select="f00000016">
            <out:copy>
               <out:value-of select="."/>
            </out:copy>
         </out:for-each>
         <out:for-each select="f00000084">
            <out:copy>
               <out:value-of select="."/>
            </out:copy>
         </out:for-each>
         <out:for-each select="f00000054">
            <out:copy>
               <out:value-of select="."/>
            </out:copy>
         </out:for-each>
         <out:for-each select="otname">
            <out:copy>
               <out:value-of select="."/>
            </out:copy>
         </out:for-each>
         <out:for-each select="bzrname">
            <out:copy>
               <out:value-of select="."/>
            </out:copy>
         </out:for-each>
         <out:for-each select="otnr">
            <out:copy>
               <out:value-of select="."/>
            </out:copy>
         </out:for-each>
         <out:for-each select="bzrnr">
            <out:copy>
               <out:value-of select="."/>
            </out:copy>
         </out:for-each>
         <out:for-each select="strnr">
            <out:copy>
               <out:value-of select="."/>
            </out:copy>
         </out:for-each>
         <out:for-each select="f00000035">
            <out:copy>
               <out:value-of select="."/>
            </out:copy>
         </out:for-each>
         <out:for-each select="land">
            <out:copy>
               <out:value-of select="."/>
            </out:copy>
         </out:for-each>
         <out:for-each select="etrs89_x">
            <out:copy>
               <out:value-of select="."/>
            </out:copy>
         </out:for-each>
         <out:for-each select="etrs89_y">
            <out:copy>
               <out:value-of select="."/>
            </out:copy>
         </out:for-each>
         <out:for-each select="rbs_valid">
            <out:copy>
               <out:value-of select="."/>
            </out:copy>
         </out:for-each>
         <out:for-each select="bezirk_nummer">
            <out:copy>
               <out:value-of select="."/>
            </out:copy>
         </out:for-each>
      </out:copy>
   </out:template>
   <out:template match="@*">
      <out:copy>
         <out:apply-templates select="node()"/>
      </out:copy>
   </out:template>
   <out:template match="@*|node()" mode="copy">
      <out:copy>
         <out:apply-templates select="@*|node()" mode="copy"/>
      </out:copy>
   </out:template>
   <out:template match="@*[namespace-uri()='http://xmlns.cit.de/assistants/internal']" mode="copy"/>
</out:stylesheet>