export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'online' | 'offline';

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

export interface ICartItem {
    productId: string;
    quantity: number;
}

export interface IOrderRequest {
    items: ICartItem[];
    customer: IBuyer;
}

export interface IValidationErrors {
    payment?: string;
    email?: string;
    phone?: string;
    address?: string;
}

export interface IProductsResponse {
    total: number;
    items: IProduct[];
}

export interface IOrderResponse {
    id: string;
    total: number;
}

export interface IGallery {
    items: HTMLElement[];
}

export interface IBasket {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

//создаем карточки для Gallery
// events.on('catalog:changed', () => {
//     const itemCards = productsModel.getItems().map((item) => {
//         const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
//             onClick: () => events.emit('card:select', item),
//         });

//         return card.render(item);
//     });

//     gallery.render({ catalog: itemCards });
// });

// larekApi
//     .getProductList()
//     .then((data) => {
//         productsModel.setItems(data.items);
//     })
//     .catch((err) => console.error(err));