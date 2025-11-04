import { IProduct } from '../../types/index';

export class CartModel {
    private items: IProduct[] = [];
    add(product: IProduct): void {
        const existing = this.items.find((item) => item.id === product.id);
        if (!existing) {
            this.items.push(product);
        }
    }

    remove(productId: string): void {
        this.items = this.items.filter((item) => item.id !== productId);
    }

    clear(): void {
        this.items = [];
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getCount(): number {
        return this.items.length;
    }

    getTotal(): number {
        let total = 0;
        for (const item of this.items) {
            if (typeof item.price === 'number') {
                total += item.price;
            }
        }
        return total;
    }
}