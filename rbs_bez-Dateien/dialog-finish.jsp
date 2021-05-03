<?xml version="1.0" encoding="utf-8"?>
<%@ page contentType="application/xhtml+xml; charset=utf-8" pageEncoding="utf-8" %>
<%@ taglib uri="http://www.cit.de/ns/jsp" prefix="cit" %>
<%@ page import="de.cit.jsp.control.PageProcessor" %>
<%! private boolean isVisited(final HttpSession session, final String id) { return ((java.util.Set)session.getAttribute("composer.visitedPages")).contains(id); } %>
<% if (session.getAttribute("composer.visitedPages") == null) { session.setAttribute("composer.visitedPages", java.util.Collections.synchronizedSet(new java.util.HashSet())); } %>
<% PageProcessor pageProcessor = PageProcessor.getSessionInstance(session); %>
<% pageProcessor.createSyncPoint(""); %>
<% ((java.util.Set)session.getAttribute("composer.visitedPages")).add(""); %>

<%!
static java.lang.reflect.Method getComments;
static {
  try {
    getComments = de.cit.jsp.tags.FormTag.class.getMethod("getComments", String.class);
  } catch (NoSuchMethodException e) {
  }
}
   static String getComments(final Object form, final String fieldname) {
      try {
         return form != null && getComments != null ? (String) getComments.invoke(form, fieldname) : "";
      } catch (Exception e) {
         return "";
      }
   }
%>
    
<%@ page import="de.cit.assistants.DataBean" %>
<%@ page import="de.cit.jsp.util.SequenceTransformation" %>
<%@ page import="org.apache.log4j.Level" %>
<%@ page import="org.apache.log4j.Logger" %>
<%@ page import="org.w3c.dom.Document" %>
<%@ page import="org.xml.sax.ErrorHandler" %>
<%@ page import="org.xml.sax.SAXException" %>
<%@ page import="org.xml.sax.SAXParseException" %>
<%@ page import="javax.xml.XMLConstants" %>
<%@ page import="javax.xml.transform.dom.DOMSource" %>
<%@ page import="javax.xml.validation.Schema" %>
<%@ page import="javax.xml.validation.SchemaFactory" %>
<%@ page import="javax.xml.validation.Validator" %>
<%@ page import="java.io.IOException" %>
<%@ page import="java.net.URL" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.ArrayList" %>

<%!

    boolean valid(DataBean data, HttpSession session, String stylesheets, String schema, Logger logger, Level level) throws IOException, SAXException {
        Document document = data.toXML(new SequenceTransformation(stylesheets.split("\\|"), session));
        return validate3(session.getServletContext().getResource(schema), document, logger, level);
    }

    boolean validate3(URL schemaUrl, Document document, final Logger logger, final Level level) throws SAXException, IOException {
        SchemaFactory factory = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
        Schema schema = factory.newSchema(schemaUrl);
        Validator validator = schema.newValidator();
        final List<SAXParseException> errors = new ArrayList<SAXParseException>();
        validator.setErrorHandler(new ErrorHandler() {
            public void warning(SAXParseException e) throws SAXException {
                errors.add(e);
            }

            public void error(SAXParseException e) throws SAXException {
                errors.add(e);
            }

            public void fatalError(SAXParseException e) throws SAXException {
                errors.add(e);
            }
        });
        try {
            validator.validate(new DOMSource(document));
            for (SAXParseException error : errors) {
                logger.log(level, error.getMessage() + " at line " + error.getLineNumber() + " column " + error.getColumnNumber());
            }
            return errors.size() == 0;
        } catch (SAXException e) {
            logger.log(level, "Validation exception: " + e.getMessage());
            return false;
        }
    }

    public static final String WORKBENCH_PROPERTY = "de.cit.intelliform.workbench.running";
    public static final String JBOSS_PROPERTY = "jboss.home.dir";

    boolean testing = System.getProperty(WORKBENCH_PROPERTY) != null ? Boolean.getBoolean(WORKBENCH_PROPERTY) : System.getProperty(JBOSS_PROPERTY) == null;

%>

        
<!DOCTYPE html
  PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:cit="http://www.cit.de/ns/jsp" xmlns:html="http://www.w3.org/1999/xhtml">
   <head>
      <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
      <title>rbs_bez - Abschlussseite</title>
      <cit:useBean name="myForm" class="de.cit.assistants.DataBean"/>
      <cit:control/>
      <style type="text/css">
          body {
            font-family: Verdana, sans-serif;
            font-size: 10pt;
          }

          .schema-valid {
            color: green;
          }

          .schema-invalid {
            color: red;
            font-weight: bold;
          }

          .action-overlay {
            display: none;
          }
          </style>
   </head>
   <body>
      <cit:form beanName="myForm">
         <h1>Abschlussseite</h1>
         <p style="font-weight:bold">Diese Seite wird lokal zu Testzwecken angezeigt. Sie ist beim Betrieb des Assistenten auf dem
            <em>cit intelliForm Server</em>
            nicht sichtbar.
          </p>
         <h2>Offizielle Ergebnisse des Assistenten</h2><% if (!testing || application.getResource("/WEB-INF/pdf/Formular.pdf") != null) { %><p>
            <cit:formlink source="myForm" target="_blank">PDF-Formular [Neues Fenster]</cit:formlink>
         </p><% } else { %><p>
            <img style="opacity: 0.5" class="pdf-icon" src="res/static/images/application_pdf.png" width="16" height="16" alt="PDF-Formular" border="0"/>
            <span title="Kein lokales PDF-Formular vorhanden. PDF-Integration daher nur auf cit intelliForm Server verfügbar." style="color: gray; text-decoration:underline">PDF-Formular [Neues Fenster]</span>
         </p><% } %><p>
            <cit:xmllink source="myForm" target="_blank" replace="true" xslt="/WEB-INF/etc/refine.xsl">XML-Datensatz [Neues Fenster]</cit:xmllink>
         </p>
         <p>
            <cit:xmllink source="myForm" target="_blank" id="xml_raw">XML-Datensatz in Rohform [Neues Fenster]</cit:xmllink>
         </p>
         <h2>Informationen und Links zu Entwicklungs- und Testzwecken</h2><% if (testing) { %><% boolean valid = valid(myForm, session, "/WEB-INF/etc/refine.xsl", "/WEB-INF/etc/schema.xsd", Logger.getLogger("webapp.dialog-finish"), Level.WARN); %><p class='<%= valid ? "schema-valid" : "schema-invalid" %>'>Der offizielle XML-Datensatz ist <%= valid ? "Schema-valid. Gut." : "nicht Schema-valid (siehe Log-Datei). Schlecht." %></p><p>XML-Schema-Datei:
              <input type="text" onfocus="this.select()" readonly="readonly" style="width: 40em;" value="E:\KLSAG\BDA\Bausteine\rbs_baustein_req_v2_skb\rbs_bez-Dateien\WEB-INF\etc\schema.xsd"/>
         </p>
         <p>
            <cit:xmllink source="myForm" target="_blank">XML-Datensatz in Rohform [Neues Fenster]</cit:xmllink>
         </p>
         <p>
            <cit:xmllink source="myForm" target="_blank" xslt="/WEB-INF/etc/refine-pages.xsl">XML-Referenzdatensatz für Datensatzbrowser cit intelliForm Creator [Neues Fenster]</cit:xmllink>
         </p><% } %><div>
            <cit:inputSubmit type="back" value="Zurück" tabindex="0"/>
            <cit:inputSubmit type="start" value="Neu starten" tabindex="0"/>
            <cit:inputSubmit type="close" value="Schließen" tabindex="0"/>
         </div>
      </cit:form>
   </body>
</html>