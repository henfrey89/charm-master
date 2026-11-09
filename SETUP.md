# Charm Master: put it on its own web address

You need two free accounts: Firebase (the database) and GitHub (the website). About 20 minutes, no coding.
Menu names in the Firebase console change now and then, so if a label differs slightly, look for the closest match.

## Part 1: the database (Firebase)
1. Go to console.firebase.google.com and sign in with a Google account. Click "Create a project", name it "charm-master", and turn Google Analytics off.
2. Left menu: Build > Firestore Database > Create database. Choose a location close to your team (europe-west2 is London) and start in production mode.
3. Left menu: Build > Authentication > Get started > Sign-in method > Anonymous > Enable > Save.
4. Back in Firestore Database, open the Rules tab. Delete what is there, paste the whole contents of firestore.rules from this folder, and click Publish.
5. Click the gear (Project settings). Under "Your apps" click the web icon (</>), name the app "charm-master", skip hosting, and register it. Copy the four values shown (apiKey, authDomain, projectId, appId).
6. Open firebase-config.js in a text editor, replace the four PASTE_ values with yours, and save.

## Part 2: the website (GitHub Pages)
1. Go to github.com, sign in, and click New repository. Name it "charm-master" and choose Public (free Pages needs public).
2. Click "uploading an existing file" and upload index.html and firebase-config.js. Commit.
3. Settings > Pages > Source: "Deploy from a branch", branch main, folder / (root), Save. After a minute the address appears: https://YOURNAME.github.io/charm-master/
4. Back in Firebase: Authentication > Settings > Authorized domains > Add domain, and enter YOURNAME.github.io

## Part 3: first run
1. Open your address yourself before anyone else. The first person to enter a name becomes the admin.
2. Share the link. People request to join, and you approve them in Admin.

## Things to know
- Anyone with the link can open the app and pick or request any name. There is no password. Treat the link like a team-chat invite.
- Names and charm history are stored in your Firebase project, not at SolarEdge. Check with IT if that matters.
- Your current demo data in the Claude version is not copied over. You start fresh.
