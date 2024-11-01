interface A4Dimensions {
    // A4 dimensions in mm
    readonly width: number;  // 210mm
    readonly height: number; // 297mm
}

interface CanvasDimensions {
    width: number;
    height: number;
}

interface MappingOptions {
    orientation?: 'portrait' | 'landscape';
    margins: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    dpi: number;  // Dots per inch for conversion
    maxScale: number; // Maximum scale factor
    fitToPage: boolean; // Whether to force fit to page
}

class CanvasToA4Mapper {
    // A4 constants
    private static readonly A4_DIMENSIONS: A4Dimensions = {
        width: 210,    // mm
        height: 297    // mm
    };

    private static readonly DEFAULT_OPTIONS: MappingOptions = {
        orientation: 'portrait',
        margins: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        },
        dpi: 300,
        maxScale: 1,
        fitToPage: true
    };

    /**
     * Maps canvas dimensions to A4 page dimensions
     */
    static mapCanvasToA4(
        canvas: HTMLCanvasElement,
        options: MappingOptions = this.DEFAULT_OPTIONS
    ): {
        width: number;
        height: number;
        x: number;
        y: number;
        scale: number;
    } {
        const settings = { ...options };
        const { orientation, margins, dpi, fitToPage, maxScale } = settings;

        // Get A4 dimensions in pixels (at specified DPI)
        const pixelsPerMM = dpi / 25.4; // Convert DPI to pixels per mm

        // Get available space on page (accounting for orientation)
        const pageWidth = orientation === 'portrait'
            ? this.A4_DIMENSIONS.width
            : this.A4_DIMENSIONS.height;
        const pageHeight = orientation === 'portrait'
            ? this.A4_DIMENSIONS.height
            : this.A4_DIMENSIONS.width;

        // Convert to pixels
        const availableWidth = (pageWidth - margins.left - margins.right) * pixelsPerMM;
        const availableHeight = (pageHeight - margins.top - margins.bottom) * pixelsPerMM;

        // Calculate scale factor
        let scale = Math.min(
            availableWidth / canvas.width,
            availableHeight / canvas.height
        );

        // Apply maximum scale constraint
        if (maxScale) {
            scale = Math.min(scale, maxScale);
        }

        // If not fitting to page, use 1:1 scale unless it exceeds page bounds
        if (!fitToPage) {
            scale = Math.min(1, scale);
        }

        // Calculate dimensions
        const scaledWidth = canvas.width * scale;
        const scaledHeight = canvas.height * scale;

        // Center on page
        const x = margins.left * pixelsPerMM + (availableWidth - scaledWidth) / 2;
        const y = margins.top * pixelsPerMM + (availableHeight - scaledHeight) / 2;

        return {
            width: scaledWidth,
            height: scaledHeight,
            x,
            y,
            scale
        };
    }

    /**
     * Creates a new canvas with A4 dimensions
     */
    static createA4Canvas(
        originalCanvas: HTMLCanvasElement,
        options: MappingOptions = this.DEFAULT_OPTIONS
    ): HTMLCanvasElement {
        const settings = {...options};
        const { dpi, orientation } = settings;

        // Create new canvas with A4 dimensions
        const a4Canvas = document.createElement('canvas');
        const pixelsPerMM = dpi / 25.4;

        // Set A4 dimensions based on orientation
        if (orientation === 'portrait') {
            a4Canvas.width = this.A4_DIMENSIONS.width * pixelsPerMM;
            a4Canvas.height = this.A4_DIMENSIONS.height * pixelsPerMM;
        } else {
            a4Canvas.width = this.A4_DIMENSIONS.height * pixelsPerMM;
            a4Canvas.height = this.A4_DIMENSIONS.width * pixelsPerMM;
        }

        const ctx = a4Canvas.getContext('2d');
        if (!ctx) throw new Error('Failed to get canvas context');

        // Set white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, a4Canvas.width, a4Canvas.height);

        // Map original canvas to A4
        const { width, height, x, y, scale } = this.mapCanvasToA4(
            originalCanvas,
            options
        );

        // Draw original canvas content
        ctx.drawImage(
            originalCanvas,
            x,
            y,
            width,
            height
        );

        return a4Canvas;
    }

    /**
     * Converts millimeters to pixels at given DPI
     */
    static mmToPixels(mm: number, dpi: number): number {
        return mm * (dpi / 25.4);
    }

    /**
     * Converts pixels to millimeters at given DPI
     */
    static pixelsToMM(pixels: number, dpi: number): number {
        return pixels / (dpi / 25.4);
    }
}