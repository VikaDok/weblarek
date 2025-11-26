import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class CatalogModel {
    private products: IProduct[] = [];
    private previewId?: string;

    constructor(private events: IEvents) {}

// сохраняем массив
    setProducts(items: IProduct[]): void {
        this.products = items;
        this.events.emit('catlog:changed', { items });
    }

// отдаем весь массив
    getProducts(): IProduct[] {
        return this.products;
    }

//  поиск по id
    getById(id: string): IProduct | undefined {
        return this.products.find((p) => p.id === id);
    }

// сохраняем id выбранного товара или убираем выбор
    setPreview(id?: string): void {
        this.previewId = id;
        this.events.emit('catalog:preview', { id });
    }

// получаем выбранный товар или undefined
    getPreview(): IProduct | undefined {
        return this.previewId ? this.getById(this.previewId) : undefined;
    }
}