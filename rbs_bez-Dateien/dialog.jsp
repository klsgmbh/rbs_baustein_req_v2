<?xml version="1.0" encoding="utf-8"?>
<%@ page contentType="application/xhtml+xml; charset=utf-8" pageEncoding="utf-8" %>
<%@ taglib uri="http://www.cit.de/ns/jsp" prefix="cit" %>
<%@ page import="de.cit.jsp.control.PageProcessor" %>
<%! private boolean isVisited(final HttpSession session, final String id) { return ((java.util.Set)session.getAttribute("composer.visitedPages")).contains(id); } %>
<% if (session.getAttribute("composer.visitedPages") == null) { session.setAttribute("composer.visitedPages", java.util.Collections.synchronizedSet(new java.util.HashSet())); } %>
<% PageProcessor pageProcessor = PageProcessor.getSessionInstance(session); %>
<% pageProcessor.createSyncPoint("bezirk"); %>
<% ((java.util.Set)session.getAttribute("composer.visitedPages")).add("bezirk"); %>

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
    

<!DOCTYPE html
  PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:cit="http://www.cit.de/ns/jsp" xmlns:html="http://www.w3.org/1999/xhtml" lang="de-DE" class="no-js">
   <head>
      <cit:useBean name="myForm" class="de.cit.assistants.DataBean"/>
      <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
      <meta content="width=device-width, initial-scale=1, user-scalable=yes" name="viewport"/><% String buildRelease = application.getInitParameter("build.release"); if (buildRelease != null) {%><meta name="build.release" content="<%= buildRelease %>"/><% } %><% String buildNumber = application.getInitParameter("build.number"); if (buildNumber != null) {%><meta name="build.number" content="<%= buildNumber %>"/><% } %><% String buildRevision = application.getInitParameter("build.revision"); if (buildRevision != null) {%><meta name="build.revision" content="<%= buildRevision %>"/><% } %><!--plugin:theme-html5-->
    <cit:theme/>
    
      <script charset="utf-8" src="_plugins/theme-html5/script.js?-8236014590501371310" type="text/javascript"/>
  
      <title id="page-title">
         <cit:conditional test="!assistants.request.valid">Fehler beim Ausfüllen - </cit:conditional>rbs_bez - Bezirk</title>
      <cit:script href="/WEB-INF/etc/commons.js">/**/</cit:script>
      <cit:script href="/WEB-INF/etc/script.js" fileEncoding="utf-8">/**/</cit:script>
      <cit:script href="/WEB-INF/etc/custom.js" fileEncoding="windows-1252">/**/</cit:script>
      <cit:template select="/.." xhtml="true"/>
      <cit:control>
         <cit:link rel="helpbase" href="help.jsp"/>
         <cit:flow/>
      </cit:control>
   </head>
   <body id="bezirk">
      <div id="custom_top"/>
      <div id="if">
         <div id="page" class=" has_roadmap_right">
            <header>
               <div class="dynamic_area">
                  <div class="headercontent">
                     <div id="logo"/>
                     <h1>rbs_bez</h1>
                     <section id="useraccount"/>
                  </div>
               </div>
            </header>
            <nav id="roadmap" class="roadmap roadmap_right">
               <h3 class="accessibility">Dialogverlauf</h3>
               <button class="switch" type="button" onclick="return false;" aria-haspopup="true" aria-expanded="true" disabled="disabled">
                  <span class="icon-switch" aria-hidden="true"/>
                  <span class="accessibility">Dialogverlauf öffnen/schließen</span>
               </button>
               <ul class="icons"><% final boolean unvisited_d4e2 = !isVisited(session, "bezirk"); %><li class='present<%= unvisited_d4e2 ? " unvisited" : "" %>'>
                     <span class="item">
                        <span class="label">
                           <span class="labeltext">Bezirk</span>
                           <span class="labelicon" title='<%= unvisited_d4e2 ? "Aktuelle Seite (nicht besucht)" : "Aktuelle Seite" %>'>
                              <span class="accessibility"><%= unvisited_d4e2 ? "Aktuelle Seite (nicht besucht)" : "Aktuelle Seite" %></span>
                           </span>
                        </span>
                     </span>
                  </li>
               </ul>
            </nav>
            <div class="dynamic_area">
               <article>
                  <section id="content" class=" narrow">
                     <cit:form beanName="myForm">
                        <div class="wizard-body">
                           <h2 id="title">Bezirk</h2>
                           <cit:conditional test="!assistants.request.valid &amp;&amp; (assistants.request.strictInvalid === undefined || assistants.request.strictInvalid === true)">
                              <p class="invalidInfo v2">
                                 <span class="icon-warning-sign" aria-hidden="true"/>
                                 <strong>Fehler beim Ausfüllen: Bitte überprüfen Sie Ihre Angaben.</strong>
                              </p>
                           </cit:conditional>
                           <cit:conditional test="!assistants.request.valid &amp;&amp; assistants.request.softInvalid === true">
                              <p class="invalidInfo v2 loose">
                                 <span class="icon-exclamation-sign" aria-hidden="true"/>
                                 <strong>Mögliche Fehler beim Ausfüllen: Bitte kontrollieren Sie Ihre Angaben nochmals. Wenn Sie sicher sind, klicken Sie erneut auf <em class="button-name icon-arrow-right">Weiter</em>.</strong>
                              </p>
                           </cit:conditional>
                           <p class="required-hint">
                              <em>
                                 <span class="required-mark" aria-hidden="true">*</span>
                                 <span aria-hidden="true"> Pflichtfelder</span>
                                 <span class="accessibility">Diese Seite enthält Pflichtfelder.</span>
                              </em>
                           </p>
                           <cit:xmlResource id="bezirke" src="js:{myForm.transaction ? 'vfs:///root/intelliForm-Mandanten/default/Ressourcen/xml/rbs-bez-liste-xml.xml' : '/WEB-INF/data/rbs-bez-liste-xml.xml' }"/>
                           <section class="block live narrow" data-comments='<%= getComments(pageContext.getAttribute("form"), "beznum") %>' data-live-stay="stay_nonval_d0e16">
                              <cit:conditional test="!assistants.request.isValid('beznum')">
                                 <p class="errorText v2">
                                    <span class="icon-warning-sign" aria-hidden="true"/>
                                    <strong>
                                       <cit:errorText name="beznum"/>
                                    </strong>
                                 </p>
                              </cit:conditional>
                              <cit:errorText name="beznum" id="#page-strict">
                                 <p class="errorText v2" id="$$ID$$">
                                    <span class="icon-warning-sign" aria-hidden="true"/>
                                    <strong>
                                       <span class="accessibility">Fehler: </span>Bitte Eingabe bzw. Auswahl prüfen.</strong>
                                 </p>
                              </cit:errorText>
                              <cit:errorText name="beznum" id="#page-soft">
                                 <p class="errorText v2 loose" id="$$ID$$">
                                    <span class="icon-exclamation-sign" aria-hidden="true"/>
                                    <strong>
                                       <span class="accessibility">Fehler: </span>Bitte Eingabe bzw. Auswahl prüfen.</strong>
                                 </p>
                              </cit:errorText>
                              <div class="formline">
                                 <cit:inputLabel name="beznum" v="2" required="true">
                                    <span id="$$ID$$">Bezirk<span class="required-mark">
                                          <span aria-hidden="true">*</span>
                                          <span class="accessibility"> Dies ist ein Pflichtfeld.</span>
                                       </span>
                                    </span>
                                 </cit:inputLabel>
                                 <div class="inputcontainer">
                                    <cit:inputSelect name="beznum" immediate="true" ariaLabelledby="$label-id $error-ids" required="true">
                                       <cit:option value="">---wählen Sie einen Bezirk aus ---</cit:option>
                                       <cit:xmlOptions src="urn:xmlid:bezirke" select="/*/rbs:rbs-bez" text="rbs:bezname" value="@beznr">
                                          <cit:namespace prefix="rbs" uri="https://fbinter.stadt-berlin.de/rbs"/>
                                          <cit:sort select="rbs:bezname"/>
                                       </cit:xmlOptions>
                                    </cit:inputSelect>
                                 </div>
                              </div>
                              <cit:inputSubmit type="stay.nonval.d0e16" id="stay.nonval.d0e16" value="OK" title="Klicken Sie auf OK, um die Seite zu aktualisieren."/>
                              <script type="text/javascript">document.getElementById('stay_nonval_d0e16').style.display='none';</script>
                              <cit:script>_unmask(myForm, "beznum", "string");</cit:script>
                           </section>
                           <section class="block live narrow" data-comments='<%= getComments(pageContext.getAttribute("form"), "otnum") %>' data-live-stay="stay_nonval_d0e37">
                              <cit:conditional test="!assistants.request.isValid('otnum')">
                                 <p class="errorText v2">
                                    <span class="icon-warning-sign" aria-hidden="true"/>
                                    <strong>
                                       <cit:errorText name="otnum"/>
                                    </strong>
                                 </p>
                              </cit:conditional>
                              <cit:errorText name="otnum" id="#page-strict">
                                 <p class="errorText v2" id="$$ID$$">
                                    <span class="icon-warning-sign" aria-hidden="true"/>
                                    <strong>
                                       <span class="accessibility">Fehler: </span>Bitte Eingabe bzw. Auswahl prüfen.</strong>
                                 </p>
                              </cit:errorText>
                              <cit:errorText name="otnum" id="#page-soft">
                                 <p class="errorText v2 loose" id="$$ID$$">
                                    <span class="icon-exclamation-sign" aria-hidden="true"/>
                                    <strong>
                                       <span class="accessibility">Fehler: </span>Bitte Eingabe bzw. Auswahl prüfen.</strong>
                                 </p>
                              </cit:errorText>
                              <div class="formline">
                                 <cit:inputLabel name="otnum" v="2">
                                    <span id="$$ID$$">Ortsteil</span>
                                 </cit:inputLabel>
                                 <div class="inputcontainer">
                                    <cit:inputSelect name="otnum" immediate="true" ariaLabelledby="$label-id $error-ids">
                                       <cit:option value="">---wählen Sie einen Ortsteil aus ---</cit:option>
                                       <cit:xmlOptions src="urn:xmlid:bezirke" select="//rbs:rbs-bez[@beznr=$selectedBezirk]/rbs:rbs-ot" text="rbs:otname" value="@otnr">
                                          <cit:variable name="selectedBezirk" expression="myForm.beznum"/>
                                          <cit:namespace prefix="rbs" uri="https://fbinter.stadt-berlin.de/rbs"/>
                                          <cit:sort select="rbs:otname"/>
                                       </cit:xmlOptions>
                                    </cit:inputSelect>
                                 </div>
                              </div>
                              <cit:inputSubmit type="stay.nonval.d0e37" id="stay.nonval.d0e37" value="OK" title="Klicken Sie auf OK, um die Seite zu aktualisieren."/>
                              <script type="text/javascript">document.getElementById('stay_nonval_d0e37').style.display='none';</script>
                              <cit:script>_unmask(myForm, "otnum", "string");</cit:script>
                           </section>
                           <cit:inputComputed name="selectdistrict" value="selectDistrict()"/>
                        </div>
                        <nav id="roadmap_bottom" class="roadmap">
                           <h3 class="accessibility">Dialogverlauf</h3>
                           <ul class="icons"><% final boolean unvisited_d6e2 = !isVisited(session, "bezirk"); %><li class='present<%= unvisited_d6e2 ? " unvisited" : "" %>'>
                                 <span class="item">
                                    <span class="label">
                                       <span class="labeltext">Bezirk</span>
                                       <span class="labelicon" title='<%= unvisited_d6e2 ? "Aktuelle Seite (nicht besucht)" : "Aktuelle Seite" %>'>
                                          <span class="accessibility"><%= unvisited_d6e2 ? "Aktuelle Seite (nicht besucht)" : "Aktuelle Seite" %></span>
                                       </span>
                                    </span>
                                 </span>
                              </li>
                           </ul>
                        </nav>
                        <div class="wizard-buttons">
                           <div class="wizard-buttons-row">
                              <div class="button">
                                 <cit:inputSubmit type="cancel" class="submit-cancel prio3 icon-remove-sign" tabindex="0" value="Abbrechen"/>
                              </div>
                              <div class="button">
                                 <cit:inputSubmit type="save" class="submit-save prio3 icon-save" tabindex="0" value="Unterbrechen..." title="Klicken Sie hier, wenn Sie den Vorgang jetzt unterbrechen und später fortsetzen möchten."/>
                              </div>
                              <div class="button">
                                 <cit:inputSubmit type="back" class="submit-back prio2 icon-arrow-left" tabindex="0" value="Zurück"/>
                              </div>
                              <div class="button">
                                 <cit:inputSubmit class="submit-forward" tabindex="0" value="Weiter" type="forward"/>
                              </div>
                           </div>
                        </div>
                     </cit:form>
                     <footer>
                        <div class="footercontent">
                           <span>Powered by cit intelliForm</span>
                        </div>
                     </footer>
                  </section>
               </article>
            </div>
         </div>
      </div>
      <div id="custom_bottom"/>
   </body>
</html>