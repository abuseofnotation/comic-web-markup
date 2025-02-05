Comic-Web is a lightweight markup language and rendering engine designed for creating comics programmatically. It allows users to define comic panels using a simple, text-based syntax, which is then rendered into SVG images. The markup language supports layers, character dialogue, moods, and custom image integration, providing flexibility for both automated and manual comic creation.

The repo includes:

- */lib/* --- Rendering Engine: Converts markup into SVG elements, handling layer stacking, character positioning, and speech balloon placement.

- */lib/index.js* --- API: A JavaScript function (renderComic) that processes markup and image directories to generate SVG outputs.

- */plugin.js* --- Plugin: Enables seamless integration into HTML by replacing placeholder images with dynamically rendered panels.

- */editor.js* --- *Editor: An interactive environment for writing and testing comic scripts in real-time.

- *comic/style.css* -- Styling: Customizable CSS for controlling the appearance of frames, balloons, and other elements.

For more info see https://abuseofnotation.github.io/comic-web-markup
