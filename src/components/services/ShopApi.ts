import { IApi, IProductsResponse, IProduct, IOrderRequest, IOrderResponse } from "../../types/index";

export class ShopApi {
    public http: IApi;

    constructor(http: IApi) {
        this.http = http;
    }

// получаем товары GET/ product
    async getProducts(): Promise<IProduct[]> {
        const url = '/product/';
        const data: IProductsResponse = await this.http.get(url);
        const items: IProduct[] = data.items;
        return items;
    }

// создаем заказ POST/ order
    async createOrder(payload: IOrderRequest): Promise<IOrderResponse> {
        const url = '/order/';
        const body: IOrderRequest = payload;
        const result: IOrderResponse = await this.http.post(url, body);
        return result;
    }
}