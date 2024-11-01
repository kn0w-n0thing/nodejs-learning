import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

interface PdfOptions {
    format?: 'Letter' | 'Legal' | 'Tabloid' | 'Ledger' | 'A0' | 'A1' | 'A2' | 'A3' | 'A4' | 'A5';
    landscape?: boolean;
    margin?: {
        top?: string;
        right?: string;
        bottom?: string;
        left?: string;
    };
}

async function convertHtmlToPdf(
    htmlPath: string,
    outputPath: string,
    options: PdfOptions = {}
): Promise<void> {
    try {
        // Validate input file exists
        if (!fs.existsSync(htmlPath)) {
            throw new Error(`HTML file not found at path: ${htmlPath}`);
        }

        // Ensure output directory exists
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Launch browser
        const browser = await puppeteer.launch({
            headless: true // Use new headless mode
        });

        // Create new page
        const page = await browser.newPage();

        // Read HTML file content
        const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

        // Set content to page
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0' // Wait for network to be idle
        });

        // Generate PDF with default options
        await page.pdf({
            path: outputPath,
            format: options.format || 'A4',
            landscape: options.landscape || false,
            margin: options.margin || {
                top: '0cm',
                right: '0cm',
                bottom: '0cm',
                left: '0cm'
            },
            printBackground: true
        });

        // Close browser
        await browser.close();

        console.log(`PDF successfully generated at: ${outputPath}`);
    } catch (error) {
        throw new Error(`Failed to convert HTML to PDF: ${error}`);
    }
}

// Helper function to convert HTML string directly to PDF
async function convertHtmlStringToPdf(
    htmlString: string,
    outputPath: string,
    options: PdfOptions = {}
): Promise<void> {
    try {
        const browser = await puppeteer.launch({
            headless: true
        });

        const page = await browser.newPage();
        await page.setContent(htmlString, {
            waitUntil: 'networkidle0'
        });

        await page.pdf({
            path: outputPath,
            format: options.format || 'A4',
            landscape: options.landscape || false,
            margin: options.margin || {
                top: '0cm',
                right: '0cm',
                bottom: '0cm',
                left: '0cm'
            },
            printBackground: true
        });

        await browser.close();
        console.log(`PDF successfully generated at: ${outputPath}`);
    } catch (error) {
        throw new Error(`Failed to convert HTML string to PDF: ${error}`);
    }
}

export { convertHtmlToPdf, convertHtmlStringToPdf, PdfOptions };