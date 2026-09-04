# Strays Home Animal Rescue Foundation — website

Static website for **Strays Home Animal Rescue Foundation**, Islamabad, Pakistan.
No build step, no framework, no dependencies — pure HTML, CSS and vanilla JavaScript,
designed to be hosted for free on **GitHub Pages** at `https://strayshome.com`.

---

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero, impact stats, auto-scrolling photo sliders, donation spotlight, ways to help, FAQ |
| `donate.html` | **Donations** — impact picker, Meezan Bank details with copy-to-clipboard IBAN, GoFundMe, monthly sponsorship, in-kind wishlist, donation policy |
| `about.html` | Story, mission, vision, values, sanctuary location |
| `our-work.html` | Programmes, "found an animal" first-aid guidance, cost breakdown |
| `adopt.html` | Adoption process, adopter criteria, enquiry form, FAQ |
| `get-involved.html` | Volunteer roles, fostering, sponsorship, corporate partnerships, sign-up form |
| `gallery.html` | Full-page auto-scrolling photo wall with lightbox |
| `contact.html` | Emergency numbers, contact grid, message form, opening hours, scam warning |
| `terms.html` | Terms & Conditions |
| `privacy.html` | Privacy Policy |
| `404.html` | Friendly not-found page (served automatically by GitHub Pages) |

---

## Adding photos (important)

The sliders and the gallery wall are driven by a simple manifest, so you never have to touch HTML.

1. Save the photos you want from Instagram (only photos the foundation owns).
2. Rename them `01.jpg`, `02.jpg`, … and put them in **`assets/gallery/photos/`**.
3. Edit **`assets/gallery/manifest.json`** so the `alt` and `caption` text matches each photo.
4. Commit and push.

If an image listed in the manifest is missing, the site quietly shows a coloured
"Photo coming soon" tile instead of a broken image — so nothing ever looks broken.

Keep images around **1200 px on the long edge and under ~300 KB**. Portrait (4:5) crops look best.
See `assets/gallery/photos/README.md` for details.

---

## Deploying to GitHub Pages

1. Create a repository and push these files to the default branch.
2. **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, folder `/ (root)`.
3. The `CNAME` file already contains `strayshome.com`. In your domain registrar's DNS, add:
   - Four `A` records for the apex `strayshome.com` pointing to
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - A `CNAME` record for `www` pointing to `<your-github-username>.github.io`
4. Back in **Settings → Pages**, confirm the custom domain and tick **Enforce HTTPS**
   (this may take a few minutes to become available while the certificate is issued).

Working locally? Open `index.html` directly, or run a tiny server so `fetch()` can read the
gallery manifest:

```powershell
python -m http.server 8080
# then visit http://localhost:8080
```

---

## Things to update before / after launch

- [ ] Add real photos to `assets/gallery/photos/` and update `manifest.json`
- [ ] Confirm the **account title** shown on `donate.html` matches the bank exactly
- [ ] Add mobile wallet details (JazzCash / Easypaisa / SadaPay) to `donate.html` if you use them
- [ ] Add Meezan Bank's SWIFT/BIC to `donate.html` for international wires, once confirmed by the bank
- [ ] Replace the indicative impact numbers on `index.html` (`data-count` values) with real figures
- [ ] Add your registration / NPO number to `terms.html` and the footer once available
- [ ] Have `terms.html` and `privacy.html` reviewed by a lawyer in Pakistan
- [ ] Consider swapping `logo.jpg` for a transparent PNG/SVG for a crisper header mark
- [ ] Verify the domain in [Google Search Console](https://search.google.com/search-console) and submit `https://strayshome.com/sitemap.xml`
- [ ] Do the same in [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [ ] Create a **Google Business Profile** for the sanctuary (category: *Animal Shelter*) — this is the single biggest win for “animal shelter near me” searches in Islamabad
- [ ] Make sure the name, address and phone number are **identical** on the website, Google Business Profile and Instagram bio
- [ ] Put `https://strayshome.com` in the Instagram bio link (inbound links and brand searches feed rankings)
- [ ] Confirm the sanctuary coordinates in the structured data (`33.7167, 72.9333` is approximate for Shah Allah Ditta)
- [ ] Test rich results with the [Rich Results Test](https://search.google.com/test/rich-results) after going live

---

## Technical notes

- **Design system** lives in `assets/css/styles.css` (CSS custom properties at the top —
  change the palette in one place).
- **All behaviour** is in `assets/js/main.js`: mobile nav, scroll reveals, animated counters,
  copy-to-clipboard, donation amount picker, marquee/wall builders, lightbox and mailto forms.
- **Forms have no backend.** They open the visitor's email client pre-filled. If you later want
  real form submissions, swap the `data-mailto` attribute for a Formspree/Netlify Forms endpoint.
- **Accessibility:** skip link, keyboard-operable nav and lightbox, visible focus rings,
  semantic landmarks, and full `prefers-reduced-motion` support (all auto-scrolling stops).
- **SEO:** keyword-targeted titles, meta descriptions and H1s (“animal shelter in Pakistan”,
  “animal rescue in Pakistan”, “stray animal shelter”, “adopt a rescue dog Islamabad”),
  canonical URLs, Open Graph + geo meta, `robots.txt`, `sitemap.xml`, and JSON-LD structured
  data: `AnimalShelter` / `NGO` with address, geo, opening hours and areas served on the home
  and contact pages, `FAQPage` on home / donate / adopt, `BreadcrumbList` on every inner page,
  `ItemList` of programmes on Our Work, and a `DonateAction`.
- **Adding new content for SEO:** the highest-value thing you can publish is *rescue stories* —
  each one is a page that naturally contains local place names and search terms. If you add a
  blog later, put it at `/stories/` and add the URLs to `sitemap.xml`.
- **Privacy:** no cookies, no analytics, no trackers. The only third-party request is Google Fonts.
