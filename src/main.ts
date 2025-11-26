import './scss/styles.scss';

import { CatalogModel } from './components/models/CatalogModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';
import { CardCatalog } from './components/views/cards/CardCatalog';
import { CardPreview } from './components/views/cards/CardPreview';
import { CardBasket } from './components/views/cards/CardBasket';
import { Api } from './components/base/Api';
import { Events } from './components/base/Events';
import { ShopApi } from './components/services/ShopApi';
import { API_URL } from './utils/constants';
import { Basket } from './components/views/forms/Basket';
import { Header } from './components/views/Header';
import { Gallery } from './components/views/Gallery';
import { Modal } from './components/views/modals/Modal';
import { Success } from './components/views/forms/Success';
import { Order } from './components/views/forms/Order';
import { Contacts } from './components/views/forms/Contacts';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new Events();

// CatalogModel
const catalog = new CatalogModel(events);
const cart = new CartModel(events);
const buyer = new BuyerModel(events);

//Api
const http = new Api(API_URL, {
    headers: { 'Content-Type': 'application/json' },
});
const api = new ShopApi(http);

//шаблоны
const templateCatalog = ensureElement<HTMLTemplateElement>('#card-catalog');
const templatePreview = ensureElement<HTMLTemplateElement>('#card-preview');
const templateBasketItem = ensureElement<HTMLTemplateElement>('#card-basket');
const templateBasket = ensureElement<HTMLTemplateElement>('#basket');
const templateOrder = ensureElement<HTMLTemplateElement>('#order');
const templateContacts = ensureElement<HTMLTemplateElement>('#contacts');
const templateSuccess = ensureElement<HTMLTemplateElement>('#success');

//view
const header = new Header(events, ensureElement('.header'));
const gallery = new Gallery(ensureElement('.gallery'));
const modal = new Modal(events, ensureElement('#modal-container'));

const basket = new Basket(cloneTemplate(templateBasket), events);
const order = new Order(cloneTemplate(templateOrder), events);
const contacts = new Contacts(cloneTemplate(templateContacts), events);
const success = new Success(cloneTemplate(templateSuccess), events);

//закрытие модал
events.on('modal:request-close', () => {
    modal.close();
});

//каталог
events.on('catalog:changed', ({ items }) => {
    const cards = items.map((product) => {
        const node = cloneTemplate(templateCatalog);
        const card = new CardCatalog(node, {
            onClick: () => events.emit('card:selected', { id: product.id }), 
        });
        return card.render(product);
    });

    gallery.items = cards;
});

events.on('card:selected', ({ id }) => {
    catalog.setPreview(id);
});

//открываем Preview
events.on('catalog:preview', () => {
    const product = catalog.getPreview();
    if (!product) return;

    const node = cloneTemplate(templatePreview);

    const inCart = cart.getItems().some((p) => p.id === product.id);

    const card = new CardPreview(node, {
        onClick: () => events.emit('preview:action', { id: product.id }),
    });

    modal.content = card.render({...product, inCart, buttonText: product.price === null ? 'Недоступно' : inCart ? 'Удалить' : 'В корзину',
        buttonDisabled: product.price === null,
    });

    modal.open();
});

//добавляем/удаляем из Preview
events.on('preview:action', ({ id }) => {
    const product = catalog.getById(id);
    if (!product) return;

    const inCart = cart.getItems().some((item) => item.id === id);

    if (inCart) {
        cart.remove(id);
    } else {
        cart.add(product);
    }

    modal.close();
});

//корзина
events.on('cart:changed', () => {
    header.counter = cart.getCount();
    renderBasket();
});

//открываем корзину
events.on('basket:open', () => {
    modal.content = basket.render({});
    modal.open();
});

events.on('cart:item:remove', ({ id }) => {
    cart.remove(id);
});

//оформляем
events.on('cart:checkout', () => {
    modal.content = order.render({});
    modal.open();
});

//выбираем способ оплаты
events.on('order:payment', ({ field, value }) => {
    buyer.setData({ [field]: value });
});

//вовдим адрес
events.on('order:address', ({ field, value }) => {
    buyer.setData({ [field]: value });
});

//переход в Contacts
events.on('order:submit', () => {
    modal.content = contacts.render({});
});

//вводим телефон, почту и передаем в Buyer
events.on('contacts:email', ({ email }) => buyer.setData({ email }));
events.on('contacts:phone', ({ phone }) => buyer.setData({ phone }));

//обновляем форму после смены покупателя
events.on('buyer:changed', () => {
    const data = buyer.getData();
    const errors = buyer.validate();

    //переходим к заказу
    order.render({
        payment: data.payment ?? '',
        address: data.address ?? '',
        error: data.payment || data.address ? errors.payment || errors.address || '' : '',
        valid: !errors.payment && !errors.address,
    });

    //контакты
    contacts.render({
        email: data.email ?? '',
        phone: data.phone ?? '',
        error: data.email || data.phone ? errors.email || errors.phone || '' : '',
        valid: !errors.email && !errors.phone,
    });
});

//в заказ
events.on('contacts:submit', () => {
    const data = {
        ...buyer.getData(),
        total: cart.getTotal(),
        items: cart.getItems().map((item) => item.id),
    };

    api.createOrder(data).then((result) => {
        cart.clear();
        buyer.clear();

        modal.content = success.render({
            description: `Списано ${result.total} синапсов`,
        });

        modal.open();
        });
});


//закрываем success
events.on('success:close', () => modal.close());

//рендер корзины
function renderBasket() {
    const items = cart.getItems();

    const cards = items.map((product, index) => {
        const node = cloneTemplate(templateBasketItem);
        const card = new CardBasket(node, {
            onDelete: () => events.emit('cart:item:remove', { id: product.id }),
        });
        return card.render({ ...product, index: index + 1 });
    });

    basket.items = cards;
    basket.total = cart.getTotal();
    basket.empty = cards.length === 0;
}

// Загрузка товаров с сервера
api
    .getProducts()
    .then((list) => {
        catalog.setProducts(list);
        events.emit('catalog:changed', { items: list });
    })
    .catch((error) => {
        console.error('Ошибка загрузки каталога:', error);
    });