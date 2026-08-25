# StackLift

An open-source, GitHub Pages-friendly alternative to a multi-app Windows setup tool. Select applications from the web catalog, then use a GitHub Actions workflow to create a downloadable PowerShell installer artifact.

## Use it

1. Enable **Settings → Pages → Deploy from a branch** and select your default branch / root folder.
2. Open the deployed site, choose apps, and select **Prepare GitHub build**.
3. Copy the package IDs. In this repository, open **Actions → Build custom installer → Run workflow** and paste the IDs.
4. When the run completes, download the `StackLift-installer` artifact. Extract it and run `Install-SelectedApps.ps1` on Windows 10/11.

The generated script calls `winget install` with the exact app IDs, uses silent installation where supported, accepts package/source agreements, and continues if a package fails. Always review generated scripts before running them.

## Add apps from the website

Visitors do not need to download or edit this repository to use additional applications. On the catalog page, select **Can't find an app? Add it**, enter a display name and exact `winget` package ID, then save it. The custom app is kept in that browser's local storage, is selected automatically, and is included in the next GitHub Actions build. It does not modify the public catalog for other visitors.

Before adding an ID, validate it on Windows:

```powershell
winget show --id Publisher.Package --exact
```

## Add or change the shared catalog

Edit the `apps` list at the top of [apps.js](apps.js). Every entry needs a valid `winget` package ID, name, category, accent color, and short icon label. Validate an ID on Windows with:

```powershell
winget show --id Publisher.Package --exact
```

Keep the catalog’s IDs limited to trusted packages. This project does not store vendor installers, install bundled offers, or require a third-party backend.

## Why GitHub Actions?

GitHub Pages is static, so it cannot securely build a personalized executable from browser selections by itself. This project keeps the selection in the browser and uses a manual Action run to build a transparent installer artifact in your own repository. That makes the build history and exact selected package IDs auditable.
