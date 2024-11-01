// index.ts
import { convertHtmlToPdf, convertHtmlStringToPdf } from './PdfConverter';

async function main() {
    try {
        // Example 1: Converting an HTML file to PDF
        await convertHtmlToPdf(
            'canvas-demo.html',
            'output/canvas-demo.pdf',
            {
                format: 'A4',
                margin: {
                    top: '2cm',
                    right: '2cm',
                    bottom: '2cm',
                    left: '2cm'
                }
            }
        );

        await convertHtmlToPdf(
            'css-demo.html',
            'output/css-demo.pdf',
            {
                format: 'A4',
                margin: {
                    top: '0cm',
                    right: '0cm',
                    bottom: '0cm',
                    left: '0cm'
                }
            }
        );

        // Example 2: Converting an HTML string to PDF
        const htmlString = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .header { color: #333; text-align: center; }
            .content { margin: 20px; }
          </style>
        </head>
        <body>
          <h1 class="header">Sample Report</h1>
          <div class="content">
            <h2>Section 1</h2>
            <p>This is a sample paragraph with some content.</p>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
              <li>Item 3</li>
            </ul>
          </div>
        </body>
      </html>
    `;

        await convertHtmlStringToPdf(
            htmlString,
            './output/report.pdf',
            {
                format: 'A4',
                landscape: false
            }
        );

        // Example 3: Generate multiple PDFs in a loop
        const users = [
            { name: 'John Doe', email: 'john@example.com' },
            { name: 'Jane Smith', email: 'jane@example.com' }
        ];

        for (const user of users) {
            const certificateHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { 
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 50px;
              }
              .certificate {
                border: 2px solid #000;
                padding: 20px;
                margin: 20px;
              }
            </style>
          </head>
          <body>
            <div class="certificate">
              <h1>Certificate of Completion</h1>
              <h2>${user.name}</h2>
              <p>Email: ${user.email}</p>
              <p>Date: ${new Date().toLocaleDateString()}</p>
            </div>
          </body>
        </html>
      `;

            await convertHtmlStringToPdf(
                certificateHtml,
                `./output/certificate-${user.name.toLowerCase().replace(' ', '-')}.pdf`
            );
        }

        console.log('All PDFs generated successfully!');
    } catch (error) {
        console.error('Error generating PDFs:', error);
    }
}

// Run the examples
main();