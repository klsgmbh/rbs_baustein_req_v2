# rbs_baustein_req_v2

Elemente:

Im Assistenten eingeblendete Adressfelder: Straße, Hausnummer, Hausnummer (bis), weiterer Adresshinweis, Postleitzahl, Ort, Land
XML-Ressourcen-Felder: C00000009  (Staatenliste)
Feld Adressvalidierung: rbs_valid (Regionales Bezugssystem - RBS für berliner Adressen)
Felder zur Übergabe von Geokoordinaten: etrs89_x, etrs89_y

Hilfsfelder sind im Antragsassistenten nicht sichtbar und werden für die Berechnung oder das Speichern/Abrufen von Werten verwendet.

Varianten:
Baustein "rbs_baustein_req": Der Baustein kann ohne die Felder "vartohnr" (Hausnummer-bis) und/oder "varadrzusatz" (Adresszusatz) integriert werden


Verwendung

Der Baustein wird in Antragsassistenten eingebaut, deren berliner Anschrift mit Hilfe des RBS-Dienstes auf Gültigkeit überprüft werden sollen.
Folgende Schritte sind zur Integration des Bausteins durchzuführen:

1. Anpassung des Modellverzeichnisses (Plugin-Dateien, XML-Dateien, Java-Script-Datei)

Dazu müssen die Bausteindateien im Modellverzeichnis, idealerweise in einem separaten Bausteinordner, abgelegt werden. 
Anschließend den Ordner „ui-rbs2“ aus dem Bausteinverzeichnis rbs_baustein_req/Ressourcen/plugins in das Modellverzeichnis <Modellname-Assistent>-Ressourcen/plugins kopieren. 

Die Dateien „staat_2019_04_01.xml“, "rbs-bez-liste-xml.xml" und "rbs_url.xml" aus dem Bausteinordner rbs_baustein_req-Dateien/WEB-INF/data in das Modellverzeichnis <Modellname-Assistent>-Dateien/WEB-INF/data kopieren.

Die Java-Script-Funktion "onlyBerlin()" der Java-Script-Datei im Baustein rbs_baustein_req_eid_skb1 mit dem Namen „rbs_baustein_req_eid_skb1.js“ in die Java-Script-Datei des Modells zu kopieren.

2. Anpassung der Java-Script-Datei / Optionale Konfiguration bei berliner Adressen 

Wird im Assistenten oder an ausgewählten Stellen ausschließlich mit berliner Anschriften gearbeitet, sollte die zuvor kopierte Java-Script-Funktion „onlyBerlin()“ in der Java-Script-Datei des Modells angepasst werden, damit auf der jeweiligen Dialogseite im Feld „Ort“ der Text „Berlin“ fix hinterlegt wird (d.h. er kann vom Nutzer nicht überschrieben werden) und das Feld „Land“ ausgeblendet wird.

Den Namen der Dialogseite erhält man auf der jeweiligen Dialogseite im gestarteten Assistenten über den Browser bzw. über die Entwicklertools des Browsers. 

Bsp. Firefox:
Menü aufrufen: Web-Entwickler/Werkzeuge ein- ausblenden
Auf dem Reiter „Inspektor“ kann nun dem Tag <body id> der Name der Dialogseite entnommen werden.

Den Namen der Dialogseite nun der Variablen „res“ innerhalb der vorab kopierten Funktion „onlyBerlin()“ in der Java-Script-Datei des Modells  zuordnen. (Hier können beliebig viele Dialogseitennamen hinterlegt werden.)

Wird der Titel nicht über die Relation angepasst, kann der Name des Bausteins verwendet werden. 

3. Anpassung der Modellattribute (Erweiterungen und ScriptEngine)

Mit der Integration des Bausteins ist eine Anpassung der folgenden Modellattribute erforderlich:

Attribut „Erweiterungen“: hier wird der Wert „ui-rbs2“ hinterlegt
Attribut „ScriptEngine“: hier wird der Wert „rhino“ hinterlegt

4. Composer-Datei des Antragsassistenten öffnen und den Baustein "rbs_baustein_req" als Referenz einfügen

5. Den Baustein mit den entsprechenden Satz verbinden und Gliederungsnummer vergeben

6. Einbindung des xml-Feldes "urlrbs" (Umgehungslösung)

Das im Baustein enthaltene xml-Feld "urlrbs" muss, trotz des im Attribut hinterlegten Wertes "CONTEXT", aus dem Baustein kopiert und an den zum Baustein gehörenden Satz angebunden werden (siehe Abbildung rechts).

7. RBS-Szenarien: 
Dieser Adresssbaustein kann gem. Bausteinfachkonzept für folgende Szenarien integriert werden:

   7.1. RBS als Ausfüllhilfe (Umsetzung der Punkte 1. - 5., hier ist keine weitere Konfiguration notwendig.)

   7.2. RBS mit harter Validierung

   Regel außerhalb des Bausteins ins Modell integrieren (Gliederungsnummer vergeben und Relation setzen) 
   und dessen Attribute wie folgt anpassen:

   Prüfausdruck: "validateAddress()"
   Prüfhinweis: "Diese Adresse kann nicht validiert werden!"
   Prüfart: "streng"

   7.3. RBS mit weicher Validierung und Abfrage des Bezirks bei ungültigen Anschriften 
   (Integration und Konfiguration: siehe Doku zum Baustein "rbs_bez")


#rbs_bez

Elemente:

Im Assistenten eingeblendete Adressfelder: Bezirk, Ortsteil


Varianten:
keine Varianten


Verwendung

Der Baustein wird in Antragsassistenten eingebaut, in denen nach einer ungültigen RBS-Adressvalidierung (siehe rbs_baustein_req) eine Abfrage zum Bezirk und zum Ortsteil erfolgen soll. 

Voraussetzung: Integration des Bausteins rbs_baustein_req

Folgende Schritte sind zur Integration des Bausteins durchzuführen:

1. Composer-Datei des Antragsassistenten öffnen und den Baustein "rbs_bez" als Referenz einfügen

2. Den Baustein mit den entsprechenden Satz verbinden (Association) und Gliederungsnummer vergeben


3. Regel zur weichen Validierung der berliner Anschrift integrieren

Außerhalb des Bausteins ist eine Regel mit folgenden Attributwerten in das Modell zu integrieren:

Prüfausdruck: "validateAddress()"
Prüfmeldung: "Die von Ihnen angegebene Adresse ist in unserem System nicht hinterlegt und kann nicht gefunden werden. Im nächsten Schritt können Sie Angaben zum Bezirk und Ortsteil machen um Ihren Antrag zu vervollständigen."
Prüfart: "locker"
   
 



