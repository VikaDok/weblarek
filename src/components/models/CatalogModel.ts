import { IProduct } from "../../types";

export class CatalogModel {
    private products: IProduct[] = [];
    private previewId?: string;

// сохраняем массив
    setProducts(items: IProduct[]): void {
        this.products = items;
    }

// отдаем весь массив
    getProducts(): IProduct[] {
        return this.products;
    }

//  поиск по id
    getById(id: string): IProduct | undefined {
        return this.products.find((p) => p.id === id);
    }

// сохраняем id выбранного товара или снимаем выбор
    setPreview(id?: string): void {
        this.previewId = id;
    }

// получаем выбранный товар или undefined
    getPreview(): IProduct | undefined {
        return this.previewId ? this.getById(this.previewId) : undefined;
    }
}