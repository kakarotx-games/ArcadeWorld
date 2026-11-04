# ArcadeWorld

A static, mobile-responsive arcade website with 20 playable browser games.

## Run locally
1. Extract the ZIP.
2. Open the `ArcadeWorld` folder in VS Code.
3. Open `index.html` in a browser, or use the VS Code Live Server extension.

No build command, package manager, API key, database server, or paid service is required.

## Publish free with GitHub Pages
1. Create a GitHub repository named `ArcadeWorld`.
2. Upload `index.html`, `styles.css`, `app.js`, and this README to the repository root.
3. Open repository **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose branch `main` and folder `/ (root)`, then Save.
6. Wait for GitHub Pages to publish the site. The public address will look like `https://YOUR-USERNAME.github.io/ArcadeWorld/`.

## Data and privacy
The game catalogue is included in `app.js`. Player activity, favourite counts, and scores are stored in the visitor's browser using `localStorage`. This is a local browser database, not a shared online leaderboard. Scores do not sync across devices or users. Clearing browser data can erase them.

## Google Search
After publishing, submit the public site URL in Google Search Console and request indexing. Indexing is not guaranteed or instant. A website hosted on GitHub Pages is a public website; it is not automatically an app in the Google Play Store.

## Notes
- The project is static HTML/CSS/JavaScript and works on GitHub Pages.
- Google Fonts is an optional external font dependency; the site has fallback fonts.
- No user account, payment, or backend service is used.
