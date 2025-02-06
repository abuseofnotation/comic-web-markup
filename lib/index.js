import {render} from './render.js'
import {parse} from './parse.js'

const attempt = (f) => (...args) => {
  try {return f(...args)} catch (e) {console.log(e)}
}
const pipe = (...f) => (arg, config)=> f.reduce((res, f) => f(res, config), arg)


function svgToCanvas(svgElement) {
    // Check if the SVG element exists
    if (!svgElement) {
        console.error('SVG element is missing.');
        return null;
    }

    // Serialize the SVG element to a string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);

    // Create a new Image object
    const img = new Image();

    // Set the image source to the SVG data URL
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);

    // Create a new canvas element
    const canvas = document.createElement('canvas');

    // Wait for the image to load
        img.onload = () => {
            console.log(img)
            // Set the canvas dimensions to match the SVG
            canvas.width = img.width;
            canvas.height = img.height;

            // Get the 2D rendering context of the canvas
            const ctx = canvas.getContext('2d');

            // Draw the SVG image onto the canvas
            ctx.drawImage(img, 0, 0);

        };

        // Handle errors if the image fails to load
        img.onerror = (error) => {
            console.error('Error loading SVG image:', error);
        };
    return canvas
}

export const renderComic = attempt(pipe(parse, render, svgToCanvas))

