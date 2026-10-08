
  # Create GitHub Repository

  This is a code bundle for Create GitHub Repository. The original project is available at https://www.figma.com/design/5dgQaoiO2RrmyE3WP3bANe/Create-GitHub-Repository.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Creating a new Google OAuth project (no organization)

  Use this when replacing the OAuth keys for staff sign-in. The app reads
  `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REDIRECT_URI` from env,
  so new keys override the old ones with no code changes.

  1. Sign in to https://console.cloud.google.com with a personal @gmail.com
     account (do not use the khmtutoring.com Workspace account).
  2. In the project dropdown (top bar) choose **New Project**.
  3. Name it (e.g. `khmtutoring-auth`) and set **Location/Organization** to
     **No organization**, then Create.
     - If you don't see an organization dropdown, the project is already
       personal and has no organization attached.
     - If "No organization" is not selectable, you're signed into a Workspace
       org as primary. Use an incognito window with only the personal gmail
       signed in, and repeat from step 1.
  4. **APIs & Services → OAuth consent screen**:
     - User type: **External** → Create.
     - App name: `KHM Tutoring Staff Portal`; support email and developer
       contact: `khmtutoring1@gmail.com`.
     - Scopes: `openid`, `email`, `profile` (all non-sensitive, added
       automatically when you leave defaults).
     - Testing status is fine: add `khmtutoring1@gmail.com` and any tutor
       gmails that will sign in as **Test users**. Publish only if Google
       verification is wanted.
  5. **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
     - Application type: **Web application**.
     - Authorized JavaScript origins:
       - `https://www.khmtutoring.com`
       - `http://localhost:3000` (dev only)
     - Authorized redirect URIs:
       - `https://www.khmtutoring.com/auth/callback`
       - `http://localhost:3000/auth/callback` (dev only)
     - Create, then copy the **Client ID** and **Client secret**.
  6. Drop the keys in:
     - Local dev: `.env.local`
       - `GOOGLE_CLIENT_ID=<new client id>`
       - `GOOGLE_CLIENT_SECRET=<new secret>`
       - `GOOGLE_REDIRECT_URI=https://www.khmtutoring.com/auth/callback`
     - Production: Vercel → `khmtutoringwebsite` → Settings → Environment
       Variables → Production, same three values, then redeploy.
  7. Verify at `/staff/login`: Continue with Google should land on the
     6-digit PIN gate. If Google blocks the app, the account isn't a Test
     user yet (step 4) or the redirect URI doesn't match exactly.

  ## Staff PINs

  - **Individual PINs (recommended):** an admin invites a staff email from
    `/staff/management`, which issues a unique 6-digit PIN and emails it. The
    PIN is stored hashed (scrypt) with lockout after repeated failures.
  - **Universal PIN:** `013100` by default, overridable with the
    `UNIVERSAL_STAFF_PIN` env var. It is honored **only for emails already on
    the staff allowlist** (add the email first, then the person signs in with
    Google and enters the universal PIN). An unknown Google account cannot
    self-admit. Every universal-PIN activation is written to
    `staff_pin_activations` and logged to the server output.
  