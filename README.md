# Portfolio site

Plain HTML, CSS and JavaScript. No build step, no framework.

## Folder layout

```
index.html          page shell (you rarely touch this)
data/content.js     ALL the text: your intro, links, skills and every project
css/site.css        the look
js/app.js           turns content.js into the page (you don't need to edit it)
media/<project-id>/ photos, videos and code files for each project
assets/fonts/       self-hosted fonts
favicon.svg         browser tab icon
```

## Preview on your computer

Double-clicking `index.html` works for everything except the Code tab when it loads code from files. For the full thing, open a terminal in this folder and run:

```
python3 -m http.server
```

Then go to http://localhost:8000.

## Put it online (GitHub Pages)

1. Create a public repo named exactly `<your-username>.github.io`.
2. On the repo page, click **Add file > Upload files** and drag in everything in this folder, including the folders.
3. Click **Commit changes**.
4. Go to **Settings > Pages**, set Source to **Deploy from a branch**, Branch **main**, folder **/ (root)**, and click **Save**.
5. After a minute or two your site is at `https://<your-username>.github.io`.

To change anything later, open the file on github.com, click the pencil icon, edit, and commit. The site updates in about a minute.

## Change a project

Open `data/content.js`, find the project by its `id`, and edit the text between the quotes. Anything left as `""` or `[]` is hidden on the page.

## Add a project

1. In `data/content.js`, copy one whole project block, from its opening `{` to the closing `},`.
2. Paste it where you want the new tab to appear.
3. Give it a new `id` (short, lowercase, no spaces, for example `radar`). The id becomes the link: `yoursite/#radar`.
4. Fill in `tab`, `title`, `summary`, `built` and `stack`.
5. Make a folder `media/radar/` for its files.

## Add photos and videos

Put the files in `media/<id>/`, then list them in that project's `media` array:

```js
media: [
  { type: "image",   src: "media/drone/bench.jpg", alt: "Drone on the bench", caption: "Pi 5 and Hailo mounted" },
  { type: "video",   src: "media/drone/flight.mp4", poster: "media/drone/flight.jpg", caption: "First flight" },
  { type: "youtube", id: "VIDEO_ID", caption: "Full walkthrough" },
],
```

A **Gallery** tab appears automatically once the list isn't empty. Click a photo to enlarge it.

GitHub's web upload is limited to 25 MB per file. Upload long videos to YouTube (unlisted is fine) and use the `youtube` type. The `VIDEO_ID` is the part after `v=` in the YouTube link.

## Add code

Put the file in `media/<id>/code/` and list it in that project's `code` array:

```js
code: [
  { file: "fir_bandpass.v", lang: "verilog", src: "media/drone/code/fir_bandpass.v",
    note: "FIR band-pass filter", href: "https://github.com/you/drone/blob/main/fir_bandpass.v" },
],
```

A **Code** tab appears automatically, with syntax highlighting. `lang` can be `verilog`, `python`, `c`, `cpp`, `js`, `matlab`, `bash` or `text`. `href` is optional and adds a "View on GitHub" link.

Never upload keys or passwords: LoRa/AES keys, Wi-Fi passwords or API tokens.

## Diagrams

A project's `figure` can be:

- a block diagram, using `kind: "flow"` (see the drone and solar car examples in `content.js`)
- your own image: `{ kind: "image", src: "media/radar/diagram.png", alt: "...", caption: "..." }`
