# StackLift

An open-source, GitHub Pages-friendly alternative to a multi-app Windows setup tool. Select applications from the web catalog, then use a GitHub Actions workflow to create a downloadable PowerShell installer artifact.

## Use it

1. Enable **Settings → Pages → Deploy from a branch** and select your default branch / root folder.
2. Open the deployed site, choose apps, and select **Prepare GitHub build**.
3. Copy the package IDs. In this repository, open **Actions → Build custom installer → Run workflow** and paste the IDs.
4. When the run completes, download the `StackLift-installer` artifact. Extract it and run `Install-SelectedApps.ps1` on Windows 10/11.

The generated script calls `winget install` with the exact app IDs, uses silent installation where supported, accepts package/source agreements, and continues if a package fails. Always review generated scripts before running them.

## Bundled HORI Device Manager Vol.2

Selecting **HORI Device Manager VOL.2** includes version `1.0.28.13` in the workflow artifact. The generated installer verifies the included EXE against its SHA-256 hash before launching it with a Windows administrator prompt. HORI's installer is interactive: complete its own installation screens when they appear. It is not installed silently and is not run by GitHub Actions.

The repository records the expected hash in [`assets/installers/HORI Device Manager VOL.2 1.0.28.13.exe.sha256`](assets/installers/HORI%20Device%20Manager%20VOL.2%201.0.28.13.exe.sha256). The included file remains the property of its publisher, Hori.

## Add or change apps

Edit the `apps` list at the top of [apps.js](apps.js). Every entry needs a valid `winget` package ID, name, category, accent color, and short icon label. Validate an ID on Windows with:

```powershell
winget show --id Publisher.Package --exact
```

Keep the catalog’s IDs limited to trusted packages. This project does not store vendor installers, install bundled offers, or require a third-party backend.

## Why GitHub Actions?

GitHub Pages is static, so it cannot securely build a personalized executable from browser selections by itself. This project keeps the selection in the browser and uses a manual Action run to build a transparent installer artifact in your own repository. That makes the build history and exact selected package IDs auditable.
