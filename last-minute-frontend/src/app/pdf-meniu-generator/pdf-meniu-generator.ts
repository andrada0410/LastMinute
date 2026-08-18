import { Component, inject, Input } from "@angular/core";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ShopService } from "../services/shop.service";
import { Product } from "../product";
import { PricePipe } from "../pipes/price";
import { ToastService } from "../services/toast.service";
import { PdfFontService } from "../services/pdf-font.service";

@Component({
  selector: "app-pdf-meniu-generator",
  standalone: true,
  template: `
    <button type="button" class="menu-item" (click)="generatePDF()">
      Generare meniu
    </button>
  `
})
export class PdfMeniuGenerator {
  private shopService = inject(ShopService);
  private pricePipe = new PricePipe();
  private toastService = inject(ToastService);
  private pdfFontService = inject(PdfFontService);

  @Input() shopName = "";
  @Input() products: Product[] = [];

  async generatePDF() {
    if (!this.products.length) {
      this.toastService.error("Trebuie să adaugi produse înainte să poți genera un meniu.");
      return;
    }

    try {
      const doc = new jsPDF();

      const [robotoBase64, robotoBoldBase64] = await Promise.all([
        this.pdfFontService.loadRobotoFont(),
        this.pdfFontService.loadRobotoBoldFont()
      ]);
      
      doc.addFileToVFS("Roboto-Regular.ttf", robotoBase64);
      doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");

      doc.addFileToVFS("Roboto-Bold.ttf", robotoBoldBase64);
      doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");

      doc.setFont("Roboto");

      doc.setFillColor(255, 102, 36);
      doc.rect(0, 0, 210, 32, "F");
      
      doc.setFont("Roboto", "normal");
      doc.setFontSize(9);
      doc.setTextColor(255, 224, 204);
      doc.text("MENIU", 14, 13);
      
      doc.setFont("Roboto", "bold");
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text(this.shopName, 14, 24);

      const imageDataUrls = await Promise.all(
        this.products.map((p) => this.loadImageAsBase64(p.photoPath)),
      );

      const rowHeight = 22;

      const data: any[] = [];
      this.products.forEach((p) => {
        data.push([
          {
            content: "",
            styles: { 
              minCellHeight: rowHeight,
              lineWidth: { top: 0.3, left: 0, right: 0, bottom: 0 },
              lineColor: "#E0E0E0"
            },
          },
          {
            content: p.name,
            styles: {
              fontSize: 12,
              fontStyle: "bold",
              textColor: "#1A1A1A",
              lineWidth: { top: 0.3, left: 0, right: 0, bottom: 0 },
              lineColor: "#E0E0E0"
            },
          },
          {
            content: this.pricePipe.transform(p.price),
            styles: {
              halign: "right",
              fontSize: 11,
              fontStyle: "bold",
              textColor: "#FF6624",
              lineWidth: { top: 0.3, left: 0, right: 0, bottom: 0 },
              lineColor: "#E0E0E0"
            },
          },
        ]);
        data.push([
          {
            content: this.cleanDescription(p.description),
            colSpan: 3,
            styles: {
              textColor: "#6B6B6B",
              fontSize: 9,
              cellPadding: { top: 2, bottom: 8, left: 4, right: 4 },
              lineWidth: 0
            },
          },
        ]);
      });

      autoTable(doc, {
        body: data,
        startY: 38,
        margin: { left: 14, right: 14 },
        rowPageBreak: "avoid",
        theme: "plain",
        styles: {
          font: "Roboto",
          fontSize: 10,
          cellPadding: 4,
          valign: "middle",
          overflow: "linebreak"
        },
        columnStyles: {
          0: { cellWidth: 22 },
          1: { cellWidth: 130 },
          2: { cellWidth: 30 },
        },
        didDrawCell: (data) => {
          if (data.column.index === 0 && data.row.index % 2 === 0) {
            const productIndex = data.row.index / 2;
            const imgData = imageDataUrls[productIndex];
            if (imgData) {
              const padding = 2;
              const size = Math.min(
                data.cell.width - padding * 2,
                data.cell.height - padding * 2,
              );
              doc.addImage(imgData, data.cell.x + padding, data.cell.y + padding, size, size);
            }
          }
        },
      });

      doc.save(`Meniu ${this.shopName}.pdf`);
    } catch (err) {
      console.error(err);
      this.toastService.error("Eroare generare meniu", "Eroare");
    }
  }

  private resolveImageUrl(path?: string): string | null {
    if (!path) 
      return 'assets/shop-dashboard/default-product.png';

    const isExternalLink = /^https?:\/\//i.test(path);
    
    return isExternalLink 
      ? path 
      : `${this.shopService.url}/uploads/${path}`;
  }

  private loadImageAsBase64(path?: string): Promise<string | null> {
    const url = this.resolveImageUrl(path);
    if (!url) 
      return Promise.resolve(null);

    return fetch(url)
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          }),
      )
      .catch(() => null);
  }

  private cleanDescription(text?: string | null): string {
    if (!text)
      return "";

    return text
      .split("\n")
      .map((line) => line.replace(/^[\t ]+/, "").replace(/[\t ]+$/, ""))
      .join("\n")
      .trim();
  }
}