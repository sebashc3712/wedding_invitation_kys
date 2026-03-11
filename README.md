# Wedding Invitation — Katia & Sebastián

Static wedding invitation site that generates a personalized page per guest.

## Prerequisites

- Node.js 20+ (use `nvm use 20` if needed)

## Quick Start

```bash
# Build the site
npm run build

# Preview locally
npm run serve
```

## Adding Guests

Edit `guests.json`:

```json
{
  "token": "unique8ch",
  "names": ["First Last", "First Last"],
  "displayName": "Name & Name",
  "lang": "es",
  "plusOne": false
}
```

Generate tokens with: `node -e "console.log(require('crypto').randomBytes(4).toString('hex'))"`

Then rebuild: `npm run build`

## Google Form Setup

1. Create a Google Form with fields:
   - Guest Name (Short answer)
   - Attending? (Multiple choice: Yes / No)
   - Number of guests (Dropdown: 1, 2, 3, 4)
   - Dietary restrictions (Short answer)
   - Message for the couple (Paragraph)

2. Click the three-dot menu → **Get pre-filled link**
3. Fill in dummy values, click **Get link**, copy it
4. Extract the Form ID and `entry.XXXXXX` field IDs from the URL
5. Update `build.js`:
   - Replace `YOUR_FORM_ID` with the real form ID
   - Replace `entry.XXXXXXXXX` and `entry.YYYYYYYYY` with real field entry IDs

6. Link the Form to a Google Sheet: **Responses** tab → **Link to Sheets**

## Deploying to GitHub Pages

```bash
# First time: create a GitHub repo, then:
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main

# Deploy
npm run deploy
```

Guest URLs will be: `https://YOUR_USER.github.io/YOUR_REPO/invite/{token}/`

## Project Structure

```
src/template.html    → HTML template with {{PLACEHOLDER}} markers
src/css/styles.css   → Full stylesheet
src/js/main.js       → Countdown timer + scroll animations
src/assets/          → Invitation image + favicon
guests.json          → Guest list
build.js             → Generates dist/ from template + guests
dist/                → Built output (deployed to GitHub Pages)
reference/           → Original design assets (not deployed)
```
