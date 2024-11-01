// main.ts
import { CanvasDrawer } from './canvas-drawer';

let canvasDrawer: CanvasDrawer;

document.addEventListener('DOMContentLoaded', () => {
    canvasDrawer = new CanvasDrawer('myCanvas');
    canvasDrawer.initialize();

    // Add event listeners
    document.getElementById('drawTextBtn')?.addEventListener('click', () => {
        canvasDrawer.drawText();
    });

    document.getElementById('drawGradientBtn')?.addEventListener('click', () => {
        canvasDrawer.drawGradientText();
    });

    document.getElementById('drawImageBtn')?.addEventListener('click', async () => {
        await canvasDrawer.drawImage();
    });

    document.getElementById('applyEffectsBtn')?.addEventListener('click', () => {
        canvasDrawer.applyEffects();
    });

    document.getElementById('clearCanvasBtn')?.addEventListener('click', () => {
        canvasDrawer.clearCanvas();
    });
});