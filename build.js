#!/usr/bin/env node

// ============================================
// Build Script — Wedding Invitation
// Zero npm dependencies (Node.js built-ins only)
// ============================================

const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, 'dist');
const SRC = path.join(__dirname, 'src');

// --- i18n Dictionary ---
const i18n = {
  es: {
    PAGE_TITLE: 'Katia & Sebastián — Nuestra Boda',
    META_DESCRIPTION: 'Estás invitado a la boda de Katia y Sebastián. 19 de diciembre de 2026, Cali, Colombia.',
    HERO_PRETEXT: 'Están cordialmente invitados',
    HERO_SUBTITLE: 'Los esperamos para celebrar nuestro amor',
    INVITATION_HEADING: 'Nuestra Invitación',
    INVITATION_ALT: 'Invitación de boda de Katia y Sebastián',
    DETAILS_HEADING: 'Detalles del Evento',
    DETAILS_DATE_LABEL: 'Fecha',
    DETAILS_DATE_VALUE: 'Sábado, 19 de diciembre de 2026',
    DETAILS_TIME_LABEL: 'Hora',
    DETAILS_VENUE_LABEL: 'Lugar',
    DETAILS_MAP_LINK: 'Ver en Google Maps',
    DETAILS_MAP_TITLE: 'Mapa de Hacienda Villa Mariana',
    DETAILS_DRESSCODE_LABEL: 'Código de Vestimenta',
    DETAILS_DRESSCODE_VALUE: 'Formal / Cocktail',
    COUNTDOWN_HEADING: 'Cuenta Regresiva',
    COUNTDOWN_DAYS: 'Días',
    COUNTDOWN_HOURS: 'Horas',
    COUNTDOWN_MINUTES: 'Minutos',
    COUNTDOWN_SECONDS: 'Segundos',
    COUNTDOWN_OVER: '¡Hoy es el gran día!',
    RSVP_HEADING: 'Confirma tu Asistencia',
    RSVP_INTRO: 'Por favor confirma tu asistencia antes del 19 de noviembre de 2026. ¡Tu presencia es nuestro mejor regalo!',
    RSVP_FORM_TITLE: 'Formulario de confirmación de asistencia',
    RSVP_LOADING: 'Cargando formulario...',
    ADD_TO_CALENDAR: 'Agregar al Calendario',
    FOOTER_FUN: '...y sí, ¡habrá barra libre!',
    FOOTER_DRESSCODE: 'Código de vestimenta: Formal / Cocktail',
    FOOTER_LOVE: 'Hecho con amor por Katia & Sebastián',
    LANDING_TITLE: 'Katia & Sebastián',
    LANDING_TEXT: 'Esta es una invitación personal. Si recibiste un enlace, úsalo para ver tu invitación.',
  },
  en: {
    PAGE_TITLE: 'Katia & Sebastián — Our Wedding',
    META_DESCRIPTION: 'You are invited to Katia and Sebastián\'s wedding. December 19, 2026, Cali, Colombia.',
    HERO_PRETEXT: 'You are cordially invited',
    HERO_SUBTITLE: 'Join us as we celebrate our love',
    INVITATION_HEADING: 'Our Invitation',
    INVITATION_ALT: 'Wedding invitation of Katia and Sebastián',
    DETAILS_HEADING: 'Event Details',
    DETAILS_DATE_LABEL: 'Date',
    DETAILS_DATE_VALUE: 'Saturday, December 19, 2026',
    DETAILS_TIME_LABEL: 'Time',
    DETAILS_VENUE_LABEL: 'Venue',
    DETAILS_MAP_LINK: 'View on Google Maps',
    DETAILS_MAP_TITLE: 'Map of Hacienda Villa Mariana',
    DETAILS_DRESSCODE_LABEL: 'Dress Code',
    DETAILS_DRESSCODE_VALUE: 'Formal / Cocktail',
    COUNTDOWN_HEADING: 'Counting Down',
    COUNTDOWN_DAYS: 'Days',
    COUNTDOWN_HOURS: 'Hours',
    COUNTDOWN_MINUTES: 'Minutes',
    COUNTDOWN_SECONDS: 'Seconds',
    COUNTDOWN_OVER: 'Today is the big day!',
    RSVP_HEADING: 'RSVP',
    RSVP_INTRO: 'Please confirm your attendance by November 19, 2026. Your presence is the greatest gift!',
    RSVP_FORM_TITLE: 'RSVP Form',
    RSVP_LOADING: 'Loading form...',
    ADD_TO_CALENDAR: 'Add to Calendar',
    FOOTER_FUN: '...and yes, there will be an open bar!',
    FOOTER_DRESSCODE: 'Dress code: Formal / Cocktail',
    FOOTER_LOVE: 'Made with love by Katia & Sebastián',
    LANDING_TITLE: 'Katia & Sebastián',
    LANDING_TEXT: 'This is a personal invitation. If you received a link, please use it to view your invitation.',
  },
};

// --- Google Form Config ---
// Form: "Boda Katia y Sebastián"
const GOOGLE_FORM_BASE = 'https://docs.google.com/forms/d/e/1FAIpQLSf9rHer-YS9CMORYVpNouzfACFOqyv3RNvfSWDNShe6pZlj3g/viewform?embedded=true';
const FORM_FIELD_NAME = 'entry.1252728832'; // Nombre(s)

function buildGoogleFormUrl(guestName) {
  const params = new URLSearchParams();
  params.set(FORM_FIELD_NAME, guestName);
  return `${GOOGLE_FORM_BASE}&${params.toString()}`;
}

// --- Utility Functions ---
function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFileSync(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function copyDirSync(src, dest) {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function replaceAll(str, replacements) {
  for (const [key, value] of Object.entries(replacements)) {
    str = str.split(key).join(value);
  }
  return str;
}

// --- Landing Page HTML ---
function buildLandingPage(lang = 'es') {
  const t = i18n[lang];
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.PAGE_TITLE}</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
  <link rel="icon" href="assets/favicon.ico" type="image/x-icon">
</head>
<body>
  <div class="landing">
    <h1 class="landing__title">${t.LANDING_TITLE}</h1>
    <p class="landing__text">${t.LANDING_TEXT}</p>
  </div>
</body>
</html>`;
}

// --- Main Build ---
function build() {
  console.log('Building wedding invitation site...\n');

  // Clean & create dist
  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true });
  }
  ensureDir(DIST);

  // Copy static assets
  copyDirSync(path.join(SRC, 'css'), path.join(DIST, 'css'));
  copyDirSync(path.join(SRC, 'js'), path.join(DIST, 'js'));
  copyDirSync(path.join(SRC, 'assets'), path.join(DIST, 'assets'));

  // Read template
  const template = fs.readFileSync(path.join(SRC, 'template.html'), 'utf-8');

  // Read guest list
  const guestsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'guests.json'), 'utf-8'));
  const guests = guestsData.guests;

  console.log(`Found ${guests.length} guests.\n`);

  // Generate per-guest pages
  for (const guest of guests) {
    const lang = guest.lang || 'es';
    const t = i18n[lang];
    const formUrl = buildGoogleFormUrl(guest.names.join(', '));

    // Build replacements map
    const replacements = {
      '{{LANG}}': lang,
      '{{DISPLAY_NAME}}': guest.displayName,
      '{{GUEST_NAMES}}': guest.names.join(', '),
      '{{TOKEN}}': guest.token,
      '{{GOOGLE_FORM_URL}}': formUrl,
    };

    // Add all i18n strings
    for (const [key, value] of Object.entries(t)) {
      replacements[`{{i18n.${key}}}`] = value;
    }

    const html = replaceAll(template, replacements);
    const guestDir = path.join(DIST, 'invite', guest.token);
    ensureDir(guestDir);
    fs.writeFileSync(path.join(guestDir, 'index.html'), html, 'utf-8');

    console.log(`  ✓ /invite/${guest.token}/ → ${guest.displayName} (${lang})`);
  }

  // Generate landing page & 404
  const landingHtml = buildLandingPage('es');
  fs.writeFileSync(path.join(DIST, 'index.html'), landingHtml, 'utf-8');
  fs.writeFileSync(path.join(DIST, '404.html'), landingHtml, 'utf-8');

  console.log('\n  ✓ index.html (landing page)');
  console.log('  ✓ 404.html\n');

  console.log('Build complete! Preview with: npx serve dist\n');
  console.log('Guest URLs:');
  for (const guest of guests) {
    console.log(`  ${guest.displayName}: /invite/${guest.token}/`);
  }
  console.log('');
}

build();
