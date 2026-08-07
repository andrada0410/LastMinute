import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class PdfFontService {
  private robotoRegularCache: Promise<string> | null = null;
  private robotoBoldCache: Promise<string> | null = null;

  loadRobotoFont(): Promise<string> {
    if (!this.robotoRegularCache) {
      this.robotoRegularCache = this.fetchFontAsBase64("/assets/fonts/Roboto-Regular.ttf");
    }
    return this.robotoRegularCache;
  }

  loadRobotoBoldFont(): Promise<string> {
    if (!this.robotoBoldCache) {
      this.robotoBoldCache = this.fetchFontAsBase64("/assets/fonts/Roboto-Bold.ttf");
    }
    return this.robotoBoldCache;
  }

  private fetchFontAsBase64(path: string): Promise<string> {
    return fetch(path)
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result as string;
              resolve(result.split(",")[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          }),
      );
  }
}