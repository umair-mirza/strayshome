# Gallery photos

Put the photos you want on the website in this folder.

## How it works

1. Save/download the photos you want to use from the Instagram page
   (<https://www.instagram.com/strayshomeanimalrescue/>) — only use photos the
   foundation owns or has permission to publish.
2. Rename them `01.jpg`, `02.jpg`, `03.jpg` … and drop them in this folder.
3. Open `assets/gallery/manifest.json` and update the `alt` and `caption` text so it
   matches each photo. Good alt text matters for accessibility and SEO.
4. Commit and push — GitHub Pages redeploys automatically.

## Rules of thumb

- **Format:** `.jpg` for photos (or `.webp` if you also update the file names in the manifest).
- **Size:** roughly 1200 px on the long edge, under ~300 KB each. Big files make the
  auto-scrolling gallery stutter on phones.
- **Shape:** portrait (4:5) crops look best in the sliders, but any shape works — tiles crop to fit.
- **Missing files are safe:** if an image listed in the manifest is not here, the site quietly
  shows a coloured "Photo coming soon" tile instead of a broken image.

## Adding more than 24 photos

Just add more entries to the `photos` array in `manifest.json`. The home page sliders and the
gallery wall automatically use as many as you provide.
