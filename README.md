<h1 align="center">
  <img src="git-images/mazanoke-app-icon.png" alt="mazanoke icon" width="180">

   MAZANOKE
</h1>

<h2 align="center"> A self-hosted local image compressor that runs in your browser.</h2>

<center>
   <img src="git-images/featured-desktop-solo-dark.jpg" alt="mazanoke screencapture" width="1000">
</center>

## About

MAZANOKE is a simple image compressor and converter that runs entirely in your browser. No external uploads, works offline as a web app, and is powered by [Browser Image Compression](https://github.com/Donaldcwl/browser-image-compression). You can try a demo [here](https://civilblur.github.io/mazanoke/)

## Table of Content

- [Features](#features)
- [Install](#install)
- [Screenshots](#screenshots)
- [License](#license)

## Features

- 🚀 **Compress & Convert Images Instantly In Your Browser**
  - Adjust image quality (0-100%).
  - Set a target file size.
  - Set max dimensions, to not exceed a certain width/height.
  - Convert between JPG, PNG, and WebP.
- 🌍 **Installable Web App**
  - Use as a Progressive Web App (PWA).
  - Dark and light mode.
  - Fully responsive for desktop, tablet, and mobile.
- 🔒 **Privacy-Focused**
  - Works offline.
  - All image processing happens locally.
  - No data is uploaded to external servers. Your files stay on your device.

**Planned**

- [ ] Upload queue.
  - Currently, only one image can be uploaded at a time.
- [ ] Remember last-used settings.

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

### Local (Desktop)

1. Download the [latest source code release](https://github.com/civilblur/mazanoke/releases).
1. Open the `index.html` file to launch the app in your browser.

### Installing as Progressive Web App

1. To install MAZANOKE as a web app, it must be hosted over HTTPS or on a local network, such as with Docker.
1. If the requirements are met, [click here](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing) for instructions on how to install the web app on your device.

## Screenshots

<center>
   <img src="git-images/featured-image-mobile-group-dark-light.jpg" alt="mazanoke mobile devices" width="1000">
</center>

|    |   |
| :---: | :---: |
| Dark mode<br><img src="git-images/capture-desktop-dark.jpg" alt="mazanoke dark mode" width="50%"> | Light mode<br><img src="git-images/capture-desktop-light.jpg" alt="mazanoke light mode" width="50%">  |
| Settings<br><img src="git-images/capture-desktop-solo-settings-dark.jpg" alt="mazanoke settings" width="50%">  | Download compressed images<br><img src="git-images/capture-desktop-solo-output-dark.jpg" alt="mazanoke settings" width="50%">  |

## License

MAZANOKE: [GNU General Public License v3.0](https://github.com/civilblur/mazanoke/blob/main/README.md)

Browser Image Compression: [MIT License](https://github.com/Donaldcwl/browser-image-compression/blob/master/LICENSE)

Geist, Geist Mono: [OFL License](https://github.com/vercel/geist-font/blob/main/LICENSE.txt)
