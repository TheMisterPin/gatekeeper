# Rotte

## /app/layout
- **Cosa fa:** definisce il layout root e fornisce `ErrorDialogProvider` e font.
- **Perché:** centralizza provider e stili globali per tutte le pagine.
- **Come:** applica theme provider, header generale e wrapper HTML, includendo body class e children.
- **Return:** markup React con `<html>` e `<body>` configurati.

## /app/page (RootRedirectPage)
- **Cosa fa:** reindirizza l'utente alla pagina corretta in base all'autenticazione.
- **Perché:** evita mostrare contenuti incompleti sulla root e guida rapidamente al flusso giusto.
- **Come:** usa `useEffect` per leggere `useAuth` e sostituire la route con `/schedule` o `/login`.
- **Return:** `null` dopo aver avviato il redirect.

## /app/login/page
- **Cosa fa:** mostra il form di login con supporto a errori e recupero credenziali.
- **Perché:** gestisce l'onboarding degli utenti non autenticati.
- **Come:** rende `LoginPageContent` con `LoginForm`, integra `useLoginForm` per validazioni e mostra l'ora corrente.
- **Return:** struttura React della pagina di accesso.

## /app/checkin/page
- **Cosa fa:** espone l'esperienza di check-in con modale di consenso e cattura foto.
- **Perché:** abilita la registrazione visitatori sul posto.
- **Come:** usa `ArrivalCheckInModal`, `useCamera` e `useConsent` per orchestrare consensi, foto e badge.
- **Return:** pagina React con pulsanti di apertura modale e stato badge.

## /app/schedule/layout
- **Cosa fa:** fornisce il layout specifico della sezione agenda con `AppShell`.
- **Perché:** riusa header/footer e navigation coerenti per le pagine pianificazione.
- **Come:** inserisce `AppHeaderComponent`, `AppFooter` e `SimpleSidebar` intorno ai children.
- **Return:** struttura React di layout agenda.

## /app/schedule/page
- **Cosa fa:** mostra l'agenda del giorno con filtri host/data e cards appuntamento.
- **Perché:** consente a receptionist e host di consultare e gestire gli appuntamenti.
- **Come:** sfrutta `useScheduleController` per stato/filtri, passa dati a `AppointmentsMainView` e `AppointmentsCsvControls`.
- **Return:** pagina React con toolbar, elenco appuntamenti e azioni CSV.
