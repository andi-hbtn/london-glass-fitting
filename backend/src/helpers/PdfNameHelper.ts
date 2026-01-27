export class PdfNameHelper {
    public imageName: string;
    constructor(imageName: string) {
        this.imageName = imageName;
    }
    public getPdfName(): string {
        const date = new Date();
        const y = date.getFullYear();
        const m = date.getMonth();
        const d = date.getDate();
        const h = date.getHours();
        const min = date.getMinutes();
        const sec = date.getSeconds();
        return this.imageName.split('.')[0] + y + m + d + h + min + sec + '.' + this.imageName.split('.')[1];
    }
}