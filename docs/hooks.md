# Hook

## useCamera
- **Cosa fa:** incapsula l'accesso alla fotocamera, la gestione dello stream e la cattura di snapshot.
- **Perché:** semplifica l'integrazione video evitando di duplicare logica media e canvas.
- **Come:** avvia `getUserMedia`, collega lo stream a un `videoRef`, cattura frame su canvas e restituisce data URL.
- **Return:** oggetto con flag `isCameraActive`, `capturedImageUrl`, `videoRef` e metodi `startCamera`, `stopCamera`, `capturePhoto`.

## useIsMobile
- **Cosa fa:** determina se la viewport è sotto il breakpoint mobile.
- **Perché:** consente di adattare il layout o le interazioni ai dispositivi piccoli.
- **Come:** inizializza lo stato leggendo `window.innerWidth`, poi ascolta `matchMedia` per aggiornarsi ai resize.
- **Return:** booleano che indica se la larghezza è inferiore al breakpoint.

## useConsent
- **Cosa fa:** gestisce i flag di consenso principale e biometrico per il check-in.
- **Perché:** garantisce che le azioni sensibili avvengano solo dopo aver raccolto i permessi.
- **Come:** espone stato locale, handler di toggle e reset coordinato dei due consensi.
- **Return:** stato dei consensi e callback per aggiornarli o reimpostarli.

## useLoginForm
- **Cosa fa:** fornisce stato e validazione del form di login.
- **Perché:** centralizza l'handling di submission, errori e controllo campi.
- **Come:** usa `react-hook-form`, valida email/password, chiama `login` da `useAuth` e gestisce errori remoti.
- **Return:** metodi e proprietà da passare a `LoginForm`, inclusi `onSubmit` e `form`.

## useScheduleController
- **Cosa fa:** coordina fetch, filtri e selezione per l'agenda appuntamenti.
- **Perché:** separa la logica di caricamento dati dal rendering della pagina schedule.
- **Come:** esegue fetch delle risorse, mantiene stato di loading/error, espone handler per ricerca, filtri e click sugli appuntamenti.
- **Return:** oggetto con dati (gruppi, opzioni), stati (loading/error) e callback di interazione.

## useAuth (AuthContext)
- **Cosa fa:** espone stato di autenticazione e azioni login/logout.
- **Perché:** consente alle pagine di sapere se l'utente è autenticato e di aggiornare le credenziali.
- **Come:** usa `useState` per token e utente, persiste sul client, fornisce provider contestuale.
- **Return:** `{ isAuthenticated, user, login, logout }`.

## useErrorDialog (ErrorDialogContext)
- **Cosa fa:** raccoglie errori applicativi e controlla la loro visualizzazione modale.
- **Perché:** offre un punto unico per riportare errori a `ErrorDialogPortal`.
- **Come:** mantiene una coda di errori, metadati e flag `visible`; espone funzioni per aprire, chiudere e svuotare la lista.
- **Return:** stato del dialog e azioni `showError`, `close`, `clearHistory`.
