<?xml version="1.0" encoding="us-ascii"?>
<out:stylesheet xmlns:out="http://www.w3.org/1999/XSL/Transform" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://xmlns.cit.de/assistants/store" xmlns:s="http://xmlns.cit.de/assistants/store" xmlns:a="http://xmlns.cit.de/assistants/internal" xmlns:t="http://xmlns.cit.de/intelliform/transaction" xmlns:a2="http://xmlns.cit.de/assistants/store#attributes" xmlns:java="http://xml.apache.org/xslt/java" version="1.0" exclude-result-prefixes="xsl s a" extension-element-prefixes="java">
   <out:template match="/*">
      <data class="de.cit.assistants.DataBean" name="myForm">
         <out:if test="@t:form-version">
            <out:attribute name="version">
               <out:value-of select="@t:form-version"/>
            </out:attribute>
         </out:if>
         <out:for-each select="beznum">
            <field name="beznum" type="string">
               <out:if test="string-length(normalize-space(.))=0">
                  <out:attribute name="type">string</out:attribute>
               </out:if>
               <out:choose>
                  <out:when test="@a:label">
                     <out:attribute name="label">
                        <out:value-of select="@a:label"/>
                     </out:attribute>
                  </out:when>
                  <out:when test="@label">
                     <out:attribute name="label">
                        <out:value-of select="@label"/>
                     </out:attribute>
                  </out:when>
               </out:choose>
               <out:apply-templates select="@*"/>
               <out:value-of select="."/>
            </field>
         </out:for-each>
         <out:for-each select="otnum">
            <field name="otnum" type="string">
               <out:if test="string-length(normalize-space(.))=0">
                  <out:attribute name="type">string</out:attribute>
               </out:if>
               <out:choose>
                  <out:when test="@a:label">
                     <out:attribute name="label">
                        <out:value-of select="@a:label"/>
                     </out:attribute>
                  </out:when>
                  <out:when test="@label">
                     <out:attribute name="label">
                        <out:value-of select="@label"/>
                     </out:attribute>
                  </out:when>
               </out:choose>
               <out:apply-templates select="@*"/>
               <out:value-of select="."/>
            </field>
         </out:for-each>
         <out:for-each select="selectdistrict">
            <field name="selectdistrict" type="string">
               <out:if test="string-length(normalize-space(.))=0">
                  <out:attribute name="type">string</out:attribute>
               </out:if>
               <out:if test="@xsi:type">
                  <out:attribute name="type">
                     <out:value-of select="@xsi:type"/>
                  </out:attribute>
               </out:if>
               <out:apply-templates select="@*"/>
               <out:value-of select="."/>
            </field>
         </out:for-each>
      </data>
   </out:template>
   <out:template match="@s:readonly">
      <out:attribute name="{local-name()}">
         <out:value-of select="."/>
      </out:attribute>
   </out:template>
   <out:template match="@*"/>
</out:stylesheet>