import { IProduct } from "../../../types";
import { Component } from "../../base/Component";
import { categoryMap, CDN_URL } from "../../../utils/constants";

type CategoryKey = keyof typeof categoryMap;

export class Card<T extends Partial<IProduct>> extends Component<T> {
    public id?: string;
    protected titleElement?: HTMLElement;
    protected priceElement?: HTMLElement;
    protected imageElement?: HTMLImageElement;
    protected categoryElement?: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.titleElement = container.querySelector('.card__title') || undefined;
        this.priceElement = container.querySelector('.card__price') || undefined;
        this.imageElement = container.querySelector('.card__image') || undefined;
        this.categoryElement = container.querySelector('.card__category') || undefined;
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

    set image(value: string) {
        if (this.imageElement && value) {
            this.setImage(this.imageElement, `${CDN_URL}${value}`, this.title);
        }
    }

    set category(value: string) {
        if (this.categoryElement) {
            this.categoryElement.textContent = value;
            for (const key in categoryMap) {
                this.categoryElement.classList.remove(categoryMap[key as CategoryKey]);
            }

            if (value in categoryMap) {
                this.categoryElement.classList.add(categoryMap[value as CategoryKey]);
            }
        }
    }
}
