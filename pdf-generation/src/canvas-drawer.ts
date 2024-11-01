export class CanvasDrawer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(canvasId: string) {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) {
            throw new Error(`Canvas with id ${canvasId} not found`);
        }

        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('Failed to get canvas context');
        }

        this.canvas = canvas;
        this.ctx = context;
    }

    // Utility method to get input values
    private getInputValues(): {
        text: string;
        color: string;
        fontSize: number;
    } {
        const text = (document.getElementById('textInput') as HTMLInputElement)?.value || 'Hello Canvas!';
        const color = (document.getElementById('colorPicker') as HTMLInputElement)?.value || '#ff0000';
        const fontSize = parseInt((document.getElementById('fontSize') as HTMLInputElement)?.value || '48', 10);

        return { text, color, fontSize };
    }

    public clearCanvas(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    public drawText(): void {
        const { text, color, fontSize } = this.getInputValues();

        this.ctx.font = `${fontSize}px Arial`;
        this.ctx.fillStyle = color;
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = 'center';

        // Draw text with shadow
        this.ctx.shadowColor = 'rgba(0,0,0,0.3)';
        this.ctx.shadowBlur = 5;
        this.ctx.shadowOffsetX = 3;
        this.ctx.shadowOffsetY = 3;

        this.ctx.fillText(text, this.canvas.width/2, this.canvas.height/2);

        // Reset shadow
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
    }

    public drawGradientText(): void {
        const { text, fontSize } = this.getInputValues();

        this.ctx.font = `${fontSize}px Arial`;
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = 'center';

        const gradient = this.ctx.createLinearGradient(
            this.canvas.width/2 - 100,
            this.canvas.height/2 - 50,
            this.canvas.width/2 + 100,
            this.canvas.height/2 + 50
        );
        gradient.addColorStop(0, '#ff0000');
        gradient.addColorStop(0.5, '#00ff00');
        gradient.addColorStop(1, '#0000ff');

        this.ctx.fillStyle = gradient;
        this.ctx.fillText(text, this.canvas.width/2, this.canvas.height/2);
    }

    public async drawImage(): Promise<void> {
        const img = new Image();
        img.src = '/api/placeholder/400/300';

        await new Promise<void>((resolve, reject) => {
            img.onload = () => {
                const x = (this.canvas.width - img.width) / 2;
                const y = (this.canvas.height - img.height) / 2;

                this.ctx.drawImage(img, x, y);

                const { color } = this.getInputValues();
                this.ctx.strokeStyle = color;
                this.ctx.lineWidth = 5;
                this.ctx.strokeRect(x, y, img.width, img.height);

                resolve();
            };
            img.onerror = reject;
        });
    }

    public applyEffects(): void {
        const { text, color, fontSize } = this.getInputValues();

        this.ctx.save();

        this.ctx.translate(this.canvas.width/2, this.canvas.height/2);
        this.ctx.rotate(Math.PI / 180 * 15);

        this.ctx.font = `${fontSize}px Arial`;
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = 'center';

        const patternCanvas = document.createElement('canvas');
        const patternCtx = patternCanvas.getContext('2d');
        if (!patternCtx) {
            throw new Error('Failed to get pattern canvas context');
        }

        patternCanvas.width = 20;
        patternCanvas.height = 20;

        patternCtx.fillStyle = '#ddd';
        patternCtx.fillRect(0, 0, 10, 10);
        patternCtx.fillRect(10, 10, 10, 10);

        const pattern = this.ctx.createPattern(patternCanvas, 'repeat');
        if (!pattern) {
            throw new Error('Failed to create pattern');
        }

        this.ctx.fillStyle = pattern;
        this.ctx.fillText(text, 0, 0);

        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.strokeText(text, 0, 0);

        this.ctx.restore();
    }

    public initialize(): void {
        this.drawText();
    }
}