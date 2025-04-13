<h1 align="center">
  <img src=".github/images/v1.1.0/mazanoke-app-icon.png" alt="mazanoke icon" width="120">

   MAZANOKE
</h1>

<h2 align="center"> A self-hosted local image optimizer that runs in your browser.</h2>


<center>
   <img src=".github/images/v1.1.0/featured-desktop-solo-dark.jpg" alt="mazanoke desktop screen capture dark mode" width="1200">
</center>

## About
MAZANOKE is a simple image optimizer that runs in your browser, works offline, and keeps your images private without ever leaving your device.

## Table of Content
- [Features](#features)
- [Install](#install)
- [Screenshots](#screenshots)
- [Attributions](#attributions)
- [License](#license)

## Features

- 🖼️ **Optimize Images in Your Browser**
  - Adjust image quality
  - Set target file size
  - Set max width/height
  - Paste images from clipboard
  - Convert between `JPG`, `PNG`, `WebP`
  - Convert from `HEIC`, `AVIF`, `GIF`, `SVG`
- 🔒 **Privacy-Focused**
  - Works offline
  - On-device image processing
  - Removes EXIF data (location, date, etc.)
  - No tracking
  - Installable web app. ([Learn more](#web-app))

**Planned**
- [X] Upload multiple files at once. (Completed)
- [X] Support for more image file types.
  - Recently added conversion from: `HEIC`, `AVIF`, `GIF`, `SVG` → `JPG/PNG/WebP`.
- [X] Remember last-used settings.
- [ ] Image cropping.

## Install

### Docker

1. Using [Docker Compose](https://docs.docker.com/compose/):
```
services:
  mazanoke:
    container_name: mazanoke
    image: ghcr.io/civilblur/mazanoke:latest
    ports:
      - "3474:80"
```
1. Access the app at `http://localhost:3474`

### Local

1. Download the [latest source code release](https://github.com/civilblur/mazanoke/releases).
1. Open the `index.html` file to launch the app in your browser.

### Web App

1. Go to [MAZANOKE.com](https://mazanoke.com/), or self-host for better privacy.
1. If your browser supports web apps, you'll see an "Install" button in the top-right. Click it to install.
1. A shortcut to MAZANOKE will be added to your device and can even be used offline.

<img src=".github/images/v1.1.0/capture-install-button.png" alt="Install MAZANOKE progressive web app button" height="100">

## Screenshots

<center>
   <img src=".github/images/v1.1.0/featured-image-mobile-group-dark-light.jpg" alt="mazanoke mobile devices" width="1200">
</center>

<center>
   <img src=".github/images/v1.1.0/featured-desktop-solo-light.jpg" alt="mazanoke desktop screen capture light mode" width="1200">
</center>

|    |   |
| :---: | :---: |
| Dark mode<br><img src=".github/images/v1.1.0/capture-desktop-dark.jpg" alt="mazanoke dark mode" width="50%"> | Light mode<br><img src=".github/images/v1.1.0/capture-desktop-light.jpg" alt="mazanoke light mode" width="50%">  |
| Settings<br><img src=".github/images/v1.1.0/capture-desktop-solo-settings-dark.jpg" alt="mazanoke settings" width="50%">  | Download optimized images<br><img src=".github/images/v1.1.0/capture-desktop-solo-output-dark.jpg" alt="mazanoke settings" width="50%">  |

## Attributions
- [Browser Image Compression](https://github.com/Donaldcwl/browser-image-compression)
- [heic-to](https://github.com/hoppergee/heic-to), [libheif](https://github.com/strukturag/libheif), [libde265](https://github.com/strukturag/libde265)
- [JSZip](https://github.com/Stuk/jszip)

[View full list and details](./docs/ATTRIBUTIONS.md)

## License
[GNU General Public License v3.0](https://github.com/civilblur/mazanoke/blob/main/README.md)