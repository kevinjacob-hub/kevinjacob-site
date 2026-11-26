# Kevin Jacob personal site

A static site: a terminal-style landing page plus a drivable 3D map (three.js from a CDN). No build step and no backend.

## Where things live
- `js/content.js` holds almost all the text: intro, experience, projects, bakes, city and landmark boxes, pins, Kevin's Korner, puns and verses.
- `css/site.css` holds the styles. `js/game.js` is the 3D map, `js/terminal.js` the terminal commands, `js/home.js` and `js/korner.js` render the page sections, and `js/ide.js` the window controls.
- `images/` holds photos. They load by file name (see `images/README.txt`), and a missing photo hides itself.
- `resume.pdf` is the resume (`RESUME` in `js/content.js` points to it).

## Run locally
Open `index.html` in a browser, or run `python3 -m http.server` in this folder.

## Kevin's Korner RSVPs
Sign-ups are emailed through FormSubmit (`KK.endpoint` in `js/content.js`). After the site is live, submit one test RSVP and click the activation link FormSubmit emails you. This is a one-time step. Afterward you can swap the endpoint to the private ID FormSubmit gives you, so your email address stays out of the page.

## Deploy
Any static host works (GitHub Pages, Cloudflare Pages, Netlify). Publish the repo root with no build command.

## Party games

`games/` holds browser party games (no server). `games/imposter.html` is Guess the Imposter: the host sets players, imposters and topic, and each player scans a QR code that carries their own card in the link. Topics live in `games/imposter.js` (the `T` object). `games/wavelength.html` is Wavelength: the clue-giver scans a QR code to see a secret number from 1 to 10 on a scale, and the group guesses it. Scales live in `games/wavelength.js` (the `SP` list). Open the terminal and type `games`.
