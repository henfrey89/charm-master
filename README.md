# Charm Master

A medieval-style team rewards tool. Teammates grant each other random magic charms for good work, collect all eight to complete a set, and rank up from Wanderer to Charm Master. Rounds run for one UK calendar month.

**Live site:** https://henfrey89.github.io/charm-master/

It is a static website (one `index.html`) backed by a Firebase Firestore database. There is no server to run.

---

## How it works

### Charms
Eight charms, all worth the same: Heart, Star, Horseshoe, Clover, Blue Moon, Unicorn, Rainbow and Red Balloon. When you grant one, the charm is drawn at random from all eight with equal odds. The giver writes a reason of up to 140 characters, shown next to the charm.

### Granting
- You cannot grant to yourself.
- You can only grant to someone who is in the current round.
- Each person can grant a limited number of charms per **UK calendar day**, and the limit rises with rank (3, 4, 5 and 6, see the table below). Admins have the same limits. The Grant page shows "Charms left today", and the limit resets at midnight UK time. It is also checked against the database when you cast, so using a second tab or device does not get around it.
- The limits are the `grants` values in the `LADDER` array in `index.html`.

### Sets and ranks
Collecting all eight charms completes a set. A set uses up one of each charm (spares stay on your bracelet) and ranks you up. The ladder is sized so the top rank can be reached within one monthly round, and everyone starts again as a Wanderer on the 1st.

| Sets | Rank | Charms you can grant per day |
|---|---|---|
| 0 | Wanderer | 3 |
| 1 | Apprentice | 4 |
| 2 | Enchanter | 5 |
| 3 | Charm Master | 6 |

A set takes about 22 random draws on average without trading, so three sets in a month is a stretch goal for a busy team, and trading spares makes it easier. Each rank has its own animated medallion. The code still contains medallion designs for two further ranks (Adept and Archmage) that are not currently on the ladder.

### Most Generous
The home page shows a **Most Generous** board: the top five people by number of charms granted in the current round (ties share a position), plus a stat card naming the leader. It resets each month with the round.

### Quests
A **quest** is a separate group running its own copy of the game: its own roster, admin and admin PIN, personal passcodes, bracelets, grants and trades. Nothing is shared between quests.

- **Quests page:** lists every quest with a search box. Open it from the quest button in the header (or it appears first if you have not joined one).
- **Joining:** pick a quest and enter its password. Then you join its roster as usual (name plus your own six-digit passcode, approved by that quest's admin). A device remembers the quests it has joined and who you are in each one.
- **Starting one:** name it and choose a password. You then become its first admin and choose its admin PIN.
- **Switching:** the header button takes you back to the Quests page. The page reloads into the quest you pick.
- **Original Quest:** data created before quests existed is shown as "Original Quest", with no quest password.
- Quest passwords are stored as salted hashes in `quests/{id}`. Like the other checks they run in the browser, so they keep out casual visitors rather than determined attackers. Every quest name is visible to anyone with the link.
- Each quest's data lives in collections named `<questId>~people`, `<questId>~cards` and so on. The Firestore rules cover these with a pattern, so **republish `firestore.rules` after updating**.
- **Retire or delete (quest admins):** the quest's Admin page has a **Retire or delete this quest** section, and both actions need the quest's admin PIN. *Retire* hides it from the Quests list but keeps all its data; tick **Show retired quests** on the Quests page to find it again, then **Restore quest** from its Admin page. *Delete quest* removes its roster, bracelets, grants, trades and the quest itself for good, and needs the quest name typed to confirm. The Original Quest cannot be retired or deleted from the app.
- Not built: renaming a quest, and changing a quest's password.

### Recent Deeds feed
The home page has a **Recent Deeds** feed under the leaderboard: who gave whom which charm, with the reason and date, newest first, for the current round in your quest. It shows eight at a time with a Show more button. When granting, a tick-box **Show this on the team feed** (on by default) lets the giver keep a charm private. Private charms still reach the recipient's profile and still count for ranks, Most Generous and achievements; they just do not appear in the feed (stored as `priv: true` on the grant). Your profile's **Latest Deeds** is a separate personal list of charms you received.

### Achievements
The profile page has an **Achievements** panel with nine goals, worked out from your activity in the current round, so they start again each month: First Charm, Open Hand (grant one), Thanked Five (grant to five different people), Well Loved (receive from three different people), Generous Soul (grant ten), Market Day (complete a swap), Nearly There (hold seven different charms), Set Complete and Charm Master. Locked ones show progress such as 2 / 5. They are calculated on the fly and nothing extra is stored.

### Rounds
A round is one UK calendar month (for example `2026-11`). Bracelets, ranks, grants and trades are stored per round, so a new month starts with everyone as a Wanderer. Admins choose who is in the current and next month's round from the Admin page.

### Trading (the Open Market)
- Trades are one-for-one: offer a spare charm, ask for a charm you are missing.
- Anyone in the round can accept an open offer.
- Offers expire after 3 days.
- If an offer can no longer be honoured (for example the spare is gone) it is voided.

### Install on your phone
The standalone site can be added to a phone's home screen so it opens like an app, full screen with its own icon. Use the **Install on your phone** link in the page footer: on Android and desktop Chrome it opens the browser's install prompt, and on iPhone it explains Share, then Add to Home Screen. The link disappears once installed. It is a basic installable web app: a small service worker (`sw.js`) loads the latest copy from the network and only falls back to the last copy if you are offline. Needs the site over https. It is not part of the Claude artifact copy.

### Welcome tour and sound
- A cinematic intro plus a parchment scroll that explains the game. It opens automatically once per round for each person, can be skipped, and replays from the **?** button.
- Sound is on by default: a bardcore tavern tune loops in the background, with sound effects for the intro, charm reveals and set completion. The speaker button mutes it, and the choice is remembered on that device. Browsers only allow sound after the first click or keypress.
- The intro music and the background tune are two separate pieces.
- Reduced-motion settings turn the animations off.

---

## Joining and sign-in

The sign-in screen is a pick-your-name list, and each name is protected by its own **six-digit passcode**.

- **First run:** the very first person to enter a name becomes the admin. They choose the **admin PIN** (four digits) and their own passcode at the same time.
- **Everyone else:** requests to join with a name and a passcode they choose, and an admin approves or declines from the Admin page. Admins can also add people directly.
- **Signing in:** pick your name, then enter your passcode. On a name with no passcode yet (for example someone an admin added directly), the first person to pick it chooses one.
- **Wrong tries:** after 5 wrong passcodes on a device, that name is locked on that device for 10 minutes.
- **Forgotten passcode:** an admin presses **Reset passcode** next to the person on the Admin page, and the person chooses a new one next time they sign in.
- Only a salted SHA-256 hash of each passcode is stored (`pass` on the person's record), never the digits.
- Anyone with the link can still see the names on the roster. See [Security model](#security-model).

---

## Admin

The **Admin** tab appears for admins only.

- **Join requests:** approve or decline.
- **Roster:** switch someone in or out of the current and next round, make an admin or member, or **Remove** someone completely.
- **Remove:** deletes the person, their bracelets in every round and their open swap offers, after an "are you sure?" step. Charms already granted stay in the history, and old swaps show "A teammate". You cannot remove yourself or the last admin.
- **Admin PIN:** see below.
- **Wipe progress in this quest:** clears every bracelet, rank, granted charm and swap offer for the current month, in this quest only. Other quests and other months are untouched, and the roster stays. It cannot be undone.
- There must always be at least one admin.

### Admin PIN
A four-digit PIN chosen by the admins.

- It is set when the first admin is created, and can be changed any time in the Admin page's **Admin PIN** section (the current PIN is needed to change it).
- Anyone who clicks **Make admin** must enter the PIN first. Until a PIN exists, nobody can be made an admin.
- After 5 wrong tries on a device, PIN entry is locked for 10 minutes.
- Only a salted SHA-256 hash is stored, in the `_config/adminpin` document. The digits are never stored.
- Demoting an admin to member does not ask for the PIN.
- **Forgotten PIN:** in the Firebase console, open Firestore Database > Data, delete the `adminpin` document in the `_config` collection, then set a new one in the Admin page.

---

## Architecture

| File | What it is |
|---|---|
| `index.html` | The whole app: HTML, CSS and JavaScript in one file, plus a small shim that connects it to Firebase |
| `firebase-config.js` | The four Firebase web app settings (apiKey, authDomain, projectId, appId). These are public identifiers, not secrets |
| `firestore.rules` | The Firestore security rules. Paste into Firebase console > Firestore > Rules and Publish |
| `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | Lets the site be installed on a phone's home screen (see below) |
| `SETUP.md` | Step-by-step guide to set up Firebase and GitHub Pages from scratch |

- **Hosting:** GitHub Pages, serving `main` / root.
- **Database:** Firebase project `charm-master`, Firestore in `europe-west2` (London).
- **Auth:** Firebase anonymous sign-in. It exists only so the database rules can require a signed-in client. It is not a login for people.
- **SDK:** Firebase JS SDK (compat build 10.12.2) loaded from Google's `gstatic.com`.

### Data model (Firestore)

| Path | Contents |
|---|---|
| `people/{id}` | `name`, `role` (`admin`/`member`), `rounds` (`{ "2026-11": true }`), `status` (`pending`/`active`), `requestedAt`, `welcomed` (round the tour was last shown), `pass` (`salt` and `hash` of the personal passcode) |
| `cards/{YYYY-MM}__{personId}` | `roundId`, `personId`, `counts` (per charm), `sets` |
| `grants/{id}` | `roundId`, `toId`, `byId`, `charm`, `reason`, `at`, optional `priv` (true hides it from the team feed) |
| `trades/{id}` | `roundId`, `fromId`, `give`, `want`, `status` (`open`/`done`/`cancelled`/`void`), `toId`, `at`, `expiresAt`, `resolvedAt` |
| `quests/{id}` | `name`, `nameLower`, `pass` (`salt`, `hash`), `createdAt` |
| `<questId>~people`, `~cards`, `~trades`, `~grants`, `~_config` | The same collections as above and below, one set per quest. Data from before quests existed stays in the unprefixed collections (the Original Quest) |
| `_config/adminpin` | `salt`, `hash`, `setAt` |
| `_leases/{path}` | Short locks so two simultaneous grants to the same person do not overwrite each other |

### Firestore rules in short
Signed-in clients can read and write everything, except:
- `people` writes need a name of 1 to 60 characters.
- `grants` creates need a reason of up to 140 characters.

### The Claude artifact copy
The same app also exists as a Claude artifact, which uses Claude's own database and needs a Claude sign-in. It is a separate copy with separate data. The GitHub Pages site is the one for sharing with the team.

---

## Setting up from scratch

See [SETUP.md](SETUP.md). In short: create a Firebase project, create a Firestore database, enable Anonymous sign-in, publish `firestore.rules`, register a web app, paste its settings into `firebase-config.js`, enable GitHub Pages, and add `YOURNAME.github.io` under Firebase Authentication > Settings > Authorized domains.

When you change `firestore.rules` in this repo, also paste it into the Firebase console. Pushing the file does not update the live rules.

---

## Security model

Charm Master is built to be trust-based, for a team that knows each other.

- Anyone with the link can open the app, see the roster and ask to join. Signing in as a person needs their six-digit passcode, and making someone an admin needs the admin PIN.
- These checks, the daily grant limit and the lock-outs run in the browser, not in the database. The stored hashes can be read by anyone who knows how to look, so a determined technical person could guess a six-digit passcode or bypass the checks. They stop casual impersonation, not a real attack. Proper accounts (for example Google sign-in) would be needed for that.
- The Firebase web settings in `firebase-config.js` are public by design. Access is controlled by the Firestore rules.
- Names and charm history live in your Firebase project, not on SolarEdge systems. Check with IT if that matters.

---

## Status

Built and working:
- Join requests, roster, remove people, admin PIN, personal passcodes
- Granting with reveal animation and the daily limit
- Bracelets, sets and ranks
- Quests (several separate groups, each with its own admin, roster and progress)
- **Most Generous** board and stat card on the home page
- Open Market trading
- Recent Deeds team feed (with a private option), achievements and install-to-home-screen
- Guide page, welcome tour and music
- Hosted on GitHub Pages with Firebase

Not built yet:
- **Hall of Fame and month-end rollover.** New months already start fresh because data is stored per round, but standings are not saved to a Hall of Fame. (The Guide's Rules tab already mentions it.)
- Admin setup checklist and empty-state polish
- Confetti

Everything was tested against a mock database in a browser, and the sign-in screen against the live Firebase project. Features beyond the sign-in screen have not been tried on the live database yet.

---

## Development

There is no build step for the site: edit `index.html` and push to `main`, and GitHub Pages redeploys in a minute or two (hard-refresh to see changes).

The app was developed as a Claude artifact first and ported to this standalone version with a small shim that gives it the same database interface on top of Firestore.
