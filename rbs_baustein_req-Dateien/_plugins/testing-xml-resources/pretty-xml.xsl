<!-- Beliebiges XML-Dokument als Quelltext in HTML formatieren -->
<!-- Inspiration und alternative Ansätze siehe http://www2.informatik.hu-berlin.de/~obecker/XSLT/ und http://www.dpawson.co.uk/xsl/sect4/N10301.html -->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

  <xsl:template match="/">
    <div class="xml">
      <xsl:apply-templates select="*"/>
    </div>
  </xsl:template>

  <xsl:template match="*">

    <xsl:variable name="name">
      <xsl:call-template name="do-name"/>
    </xsl:variable>

    <div class="element">
      <span class="tag start">
        <xsl:text>&lt;</xsl:text>
        <xsl:copy-of select="$name"/>
        <xsl:apply-templates select="@*">
          <xsl:sort select="local-name()"/>
        </xsl:apply-templates>
        <xsl:call-template name="do-namespace-decls"/>
        <xsl:text>&gt;</xsl:text>
      </span>

      <xsl:choose>
        <xsl:when test="count(*)!=0 and count(text()[normalize-space()!=''])!=0">
          <div class="content mixed">
            <xsl:apply-templates select="*|text()"/>
          </div>
        </xsl:when>
        <xsl:otherwise>
          <xsl:apply-templates select="*|text()"/>
        </xsl:otherwise>
      </xsl:choose>

      <span class="tag end">
        <xsl:text>&lt;/</xsl:text>
        <xsl:copy-of select="$name"/>
        <xsl:text>&gt;</xsl:text>
      </span>
    </div>

  </xsl:template>

  <xsl:template match="text()">
    <xsl:if test="normalize-space()!=''">
      <span class="text">
        <xsl:value-of select="normalize-space()"/>
      </span>
    </xsl:if>
  </xsl:template>

  <xsl:template match="@*">
    <xsl:text> </xsl:text>
    <span class="attr">
      <xsl:call-template name="do-name"/>
      <xsl:text>=</xsl:text>
      <span class="value">
        <xsl:text>"</xsl:text>
        <xsl:value-of select="."/>
        <xsl:text>"</xsl:text>
      </span>
    </span>
  </xsl:template>

  <xsl:template name="do-name">
    <span class="name">
      <xsl:if test="contains(name(),':')">
        <span class="prefix">
          <xsl:value-of select="substring-before(name(), concat(':', local-name()))"/>
          <xsl:text>:</xsl:text>
        </span>
      </xsl:if>
      <xsl:value-of select="local-name()"/>
    </span>
  </xsl:template>
  <xsl:template name="do-namespace-decls">
    <xsl:variable name="this" select="."/>
    <xsl:for-each select="namespace::*">
      <xsl:sort select="local-name()"/>
      <!-- see http://www.w3.org/TR/xpath/#namespace-nodes -->
      <xsl:variable name="prefix" select="local-name()"/>
      <xsl:variable name="uri" select="string(.)"/>
      <!-- omit xmlns:xml declaration: -->
      <xsl:if test="$prefix!='xml'">
        <!-- find closest ancestor carrying a namespace declaration with the same prefix: -->
        <xsl:variable name="scope" select="$this/ancestor::*[namespace::*[local-name()=$prefix]][1]"/>
        <!-- omit the namespace declaration on this element if that ancestor declares the same namespace uri for the prefix: -->
        <xsl:if test="not($scope and string($scope/namespace::*[local-name()=$prefix])=$uri)">
          <xsl:text> </xsl:text>
          <span class="attr">
            <span class="name">
              <xsl:text>xmlns</xsl:text>
              <xsl:if test="string-length($prefix)!=0">
                <xsl:text>:</xsl:text>
                <xsl:value-of select="$prefix"/>
              </xsl:if>
            </span>
            <xsl:text>=</xsl:text>
            <span class="value">
              <xsl:text>"</xsl:text>
              <xsl:value-of select="$uri"/>
              <xsl:text>"</xsl:text>
            </span>
          </span>
        </xsl:if>
      </xsl:if>
    </xsl:for-each>
  </xsl:template>

</xsl:stylesheet>
