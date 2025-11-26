import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

export interface IBasket {
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasket> {
    protected listElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;
    protected totalElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.listElement = ensureElement('.basket__list', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', container);
        this.totalElement = ensureElement('.basket__price', container);
        this.buttonElement.addEventListener('click', () => {
            this.events.emit('cart:checkout');
        });
    }

    set items(value: HTMLElement[]) {
        this.listElement.replaceChildren(...value);
    }

    set total(value: number) {
        this.totalElement.textContent = `${value} синапсов`;
    }

    set empty(isEmpty: boolean) {
        if (isEmpty) {
            this.listElement.innerHTML = '<p>Корзина пустая</p>';
            this.buttonElement.disabled = true;
        } else {
            this.buttonElement.disabled = false;
        }
    }
}