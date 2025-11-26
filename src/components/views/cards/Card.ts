import { IProduct } from "../../../types";
import { Component } from "../../base/Component";

export class Card<T extends Partial<IProduct>> extends Component<T> {
    public id?: string;
    protected titleElement?: HTMLElement;
    protected priceElement?: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.titleElement = container.querySelector('.card__title') || undefined;
        this.priceElement = container.querySelector('.card__price') || undefined;
    }

    set title(value: string) {
        if (this.titleElement) {
            this.titleElement.textContent = value;
        }
    }

    set price(value: number | null) {
        if (this.priceElement) {
            this.priceElement.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
        }
    }
}
