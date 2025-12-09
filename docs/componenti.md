# Componenti

## AppShell
- **Cosa fa:** incapsula header, sidebar e footer per le viste autenticate.
- **Perché:** mantiene layout coerente e gestisce l'apertura della sidebar.
- **Come:** controlla lo stato `sidebarOpen`, calcola spazi per header/footer fissi e delega contenuto al `main`.
- **Return:** un layout React con header fisso, area contenuto scrollabile e footer.

## AppHeaderComponent
- **Cosa fa:** mostra il logo e un pulsante opzionale per aprire la sidebar.
- **Perché:** offre accesso rapido al menu laterale e identifica il brand.
- **Come:** rende una `header` fissa con slot per il logo e un bottone `PanelLeftIcon` se fornito un handler.
- **Return:** elemento `header` React.

## AppFooter
- **Cosa fa:** visualizza il nome utente e un pulsante di logout opzionale.
- **Perché:** fornisce uscita rapida e contestualizza l'utente corrente.
- **Come:** rende un `footer` fisso alto quanto indicato dalla prop `footerHeight`, mostrando azioni se presenti.
- **Return:** elemento `footer` React.

## AppointmentsCsvControls
- **Cosa fa:** espone azioni di export/import CSV per gli appuntamenti.
- **Perché:** permette di sincronizzare i dati con strumenti esterni come Excel.
- **Come:** compone due pulsanti; l'export reindirizza alla route di download, l'import usa un input file nascosto e invia `FormData`.
- **Return:** toolbar React con pulsanti e input file nascosto.

## AppointmentsMainView
- **Cosa fa:** organizza e mostra gruppi di appuntamenti con barra filtri.
- **Perché:** facilita la consultazione e il filtro della giornata.
- **Come:** mostra stati di loading/error, rende `ScheduleToolbar` e una lista di gruppi con `GroupHeader` e `AppointmentCard`.
- **Return:** sezione React scrollabile con toolbar e schede appuntamento.

## ArrivalCheckInModal
- **Cosa fa:** gestisce il flusso di check-in visitatore con consensi, foto e badge.
- **Perché:** raccoglie autorizzazioni necessarie e genera l'anteprima badge al momento dell'arrivo.
- **Come:** se `open` è falso non renderizza; altrimenti mostra una modale con checkbox di consenso, controlli fotocamera e anteprima badge; abilita conferma solo con consenso principale.
- **Return:** modale React o `null` se chiusa.

## CurrentInsideDemoPage
- **Cosa fa:** mostra un elenco demo di visitatori attualmente dentro.
- **Perché:** consente di validare rapidamente la vista di monitoraggio ingressi.
- **Come:** utilizza dati statici, rende card con informazioni sintetiche.
- **Return:** sezione React con elenco visitatori.

## CurrentVisitorsView
- **Cosa fa:** elenca visitatori presenti con azioni opzionali.
- **Perché:** supporta dashboard operative per controllare accessi in tempo reale.
- **Come:** mappe una lista di visitatori in card, mostrando tempo di check-in e host.
- **Return:** `div` React con elenco card o stato vuoto.

## ErrorDemoPage
- **Cosa fa:** simula errori di rete e runtime per testare la gestione errori.
- **Perché:** permette di verificare l'integrazione di `ErrorDialogPortal` e tracciamento errori.
- **Come:** offre pulsanti che generano fetch fallite o eccezioni volontarie.
- **Return:** pagina React con controlli di test errori.

## ErrorDialogPortal
- **Cosa fa:** visualizza overlay modale con cronologia errori applicativi.
- **Perché:** centralizza la gestione errori e rende chiaro lo stato all'utente.
- **Come:** legge lo stato dal contesto `ErrorDialogContext`, mostra dettagli, sorgente e pulsanti di chiusura/clear.
- **Return:** portale React con modale di errore o `null` se non visibile.

## UniversalButton
- **Cosa fa:** crea pulsanti standardizzati con icona, tooltip e varianti automatiche per l'azione.
- **Perché:** riduce duplicazioni di stile e naming per le azioni più comuni.
- **Come:** seleziona icona da Lucide per chiave stringa, calcola etichetta e variante visiva in base all'azione, espone tooltip.
- **Return:** componente React `Button` con tooltip.

## AppSidebar
- **Cosa fa:** mostra un menu laterale statico con icone.
- **Perché:** funge da esempio leggero di navigazione secondaria.
- **Come:** utilizza componenti `Sidebar` UI per renderizzare voci predefinite.
- **Return:** struttura `Sidebar` React.

## SimpleSidebar
- **Cosa fa:** fornisce una sidebar animata con overlay e pulsante per generare appuntamenti demo.
- **Perché:** offre un controllo rapido per dati di test e una navigazione minimal.
- **Come:** gestisce gli stati `rendered` e `active` per transizioni, blocca lo scroll del body quando aperta e chiama `postAppointments` su richiesta.
- **Return:** overlay e pannello React o `null` se non renderizzato.

## HeaderLogo
- **Cosa fa:** renderizza il logo combinando immagine e testo.
- **Perché:** garantisce un branding consistente nell'intestazione.
- **Come:** usa `next/image` per l'asset e un `span` per il nome prodotto.
- **Return:** blocco React con immagine e testo.

## SectionHeader
- **Cosa fa:** mostra il titolo di sezione con eventuali azioni icona.
- **Perché:** standardizza l'intestazione delle sezioni di pagina.
- **Come:** rende titolo e mappa le `headerActions` in pulsanti con tooltip dati.
- **Return:** contenitore React con titolo e pulsanti.
