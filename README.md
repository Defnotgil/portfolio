# Gilbert Kilakiga — Professional Portfolio

A responsive, static portfolio with five academic projects, technical skills, education, 25 certificates, and a downloadable PDF résumé. Built with HTML, CSS, and JavaScript. No build, database, or environment variables are required.

## Upload to GitHub

1. Use this folder as the repository root.
2. On GitHub, create a new repository (for example, `gilbert-portfolio`).
3. Choose **Add file → Upload files**. Upload the **contents** of the extracted folder: `index.html`, `style.css`, `app.js`, `assets/`, `vercel.json`, and this README. Keep the `assets` folder structure. Use GitHub Desktop if your browser does not preserve folders.
4. Commit the upload to `main`. Check that `index.html` is at the repository root, not inside another portfolio folder. Do not upload the ZIP as your website.

## Deploy on Vercel

1. Sign in to Vercel and choose **Add New → Project**.
2. Connect GitHub and import your portfolio repository.
3. Use **Other** for Framework Preset and leave Root Directory at the repository root (`./`).
4. No build command or install command is needed. The included `vercel.json` sets the output directory to `.` and disables the build command.
5. Click **Deploy**. Open the resulting URL and check the projects, certificates, résumé viewer, and email buttons.

Future commits to your connected production branch trigger new Vercel deployments. This package has been tested locally; deployment in your Vercel account must be performed by you.

## Optional: publish directly on GitHub Pages

In the repository, open **Settings → Pages**. Choose **Deploy from a branch**, then `main` and `/(root)`, and save. Wait for the published URL shown by GitHub. The site uses relative asset paths so it also works under a repository subpath. The `.nojekyll` file disables Jekyll when present; the site does not otherwise depend on Jekyll.

## Preview locally

Open a terminal in this folder and run:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`. VS Code Live Server also works. Use a local server instead of double-clicking `index.html`, because the certificate gallery fetches a JSON file.

## Edit your content

- `index.html`: introduction, education, project descriptions, skills, and contact links.
- `style.css`: layout, colors, typography, and responsive rules.
- `app.js`: certificate search/filter/viewer and Copy Email behavior.
- `assets/certificates.json`: certificate titles, issuers, dates, categories, original files, and preview paths. Categories are `AI`, `Technology`, or `Professional`.
- `assets/gilbert-kilakiga-resume.pdf`: replace this file to update the résumé while retaining the view link.

To add a certificate, place its original and preview image in `assets/`, then add an entry in `certificates.json` following the existing format. Keep filenames and capitalization exact. Certificate counts update automatically.

The **Email me** button opens the visitor's configured email app. **Copy email address** copies the address on HTTPS/localhost; if clipboard access fails, it selects the visible email for manual copying. There is no contact-form backend.

The résumé omits the phone number and home address. The site and certificates include your name and the public contact email you supplied. Review future documents before publishing them.

## Official deployment documentation

- Vercel build configuration: https://vercel.com/docs/builds/configure-a-build
- Vercel project configuration: https://vercel.com/docs/project-configuration/vercel-json
- GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

Local-only originals are kept in `originals/` and verification tools in `tools/`. Both are ignored by Git. The original portrait remains in `originals/`; the optimized web image is in `assets/`.


## Local verification

Run `python -m http.server 8765` from this folder, then `python tools/verify_portfolio.py` in another terminal (requires Playwright). The website is served directly from the root index.html.
