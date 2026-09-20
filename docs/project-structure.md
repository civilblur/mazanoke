# Project Structure

An outline of the project structure.

- [Directories and Files Outline](#directories-and-files-outline)
- [Basic App Flow](#basic-app-flow)

## Directories and files outline

| **File**                               | **Description**                                                                 |
| -------------------------------------- | ------------------------------------------------------------------------------- |
| **Root**                               |                                                                                 |
| `index.html`                           | Main HTML file that loads the app.                                              |
| `service-worker.js`                    | Service worker for offline and PWA support.                                     |
| `manifest.json`                        | Manifest for PWA configuration.                                                 |
|                                        |                                                                                 |
| **Config**                             |                                                                                 |
| `nginx.conf`                           | Nginx server configuration for routing and optional basic auth.                 |
|                                        |                                                                                 |
| **JavaScript (`assets/js`)**           | Core functionality of the app.                                                  |
| `compression.js`                       | Handles the image compression logic.                                            |
| `download.js`                          | Handles the download logic of the compressed images.                            |
| `events.js`                            | Event listeners and handlers.                                                   |
| `global.js`                            | Initializes global variables such as references to elements, form, states, etc. |
| `helpers.js`                           | Helper functions.                                                               |
| `ui.js`                                | User interface DOM manipulation.                                                |
| `utilities.js`                         | Utility functions for various tasks and smaller types of processing.            |
|                                        |                                                                                 |
| **Vendor Libraries (`assets/vendor`)** | External libraries, essential to the app's functionality.                       |
| ...                                    | See purpose of all libraries in ATTRIBUTIONS.md                                 |
|                                        |                                                                                 |
| **Images (`assets/images`)**           | Static images for user interface and metatags.                                  |
| ...                                    |                                                                                 |
|                                        |                                                                                 |
| **CSS (`assets/css`)**                 | App styling.                                                                    |
| `fonts.css`                            | Font definitions.                                                               |
| `style.css`                            | Main styling of the user interface.                                             |
| `variables.css`                        | Global CSS variables for dynamic color, sizing, font, etc.                      |
|                                        |                                                                                 |
| **Fonts (`assets/fonts`)**             | Font files.                                                                     |
| ...                                    |                                                                                 |

## Basic App Flow

To better understand the app’s flow and file interactions, the outline below describes the general image optimization process.

Throughout the app, all external libraries are accessed via the local alias `lib` (e.g., `lib.browserImageCompression`), as defined in `global.js`. This keeps libraries organized and separate from the project’s code.

1. `index.html` launches the app.
1. The scripts load in a specific order to initialize global variables, references, and dependencies required by other scripts.
   1. `vendor/*.js` (vendor scripts).
   1. `global.js`
   1. `utilities.js`
   1. `helpers.js`
   1. `ui.js`
   1. `compression.js`
   1. `download.js`
   1. `events.js`
1. `initApp()` in `events.js` binds events to interactive elements in `index.html` and manages saving and restoring app settings.
1. When a user drops or selects an image, event handlers in `events.js` capture it and trigger compression functions from `compression.js`.
1. Before compression, `ui.js` parses and validates the user’s settings, using utilities functions from `utilities.js`. This builds the `options` object that is passed to the image compressor.
1. Input images go through `preProcessImage(file)` in `compression.js` for decoding and ensure compatibility with `browser-image-compression.js`, which is the main compression library used in this project.
   - Browser-supported formats (JPG, PNG, WebP) skip pre-processing.
   - Unsupported formats like HEIC and ICO are pre-processed.
   - AVIF is supported but already highly optimized. It is thus pre-processed into a lossy format to avoid larger file sizes after compression.
1. Image processing state (e.g., `isCompressing`, `compressQueue`) is stored and accessed in `global.js`.
1. At this stage, two image processing have been executed: `preProcessImage(file)` and `lib.browserImageCompression(file, options)`.
1. Lastly, `postProcessImage()` handles final conversions if needed. It is used for output formats that browsers don’t natively support, like ICO.
1. Once the final encoding is done, `handleCompressionResult(file, output)` in `helpers.js` updates the UI with the compressed image. Downloads, either single or zipped multiple images, are managed by `download.js`.
