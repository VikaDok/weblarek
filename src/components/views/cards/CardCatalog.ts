import { Card } from './Card';
import { ensureElement } from '../../../utils/utils';
import { categoryMap, CDN_URL } from '../../../utils/constants';
import { IProduct } from '../../../types';

type CategoryKey = keyof typeof categoryMap;

interface ICardCatalogActions {
    onClick?: () => void;
}

export class CardCatalog extends Card<IProduct> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    constructor(container: HTMLElement, protected actions: ICardCatalogActions) {
        super(container);

        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.container.addEventListener('click', () => {this.actions.onClick?.();
        });
    }

    set image(value: string) {
        this.setImage(this.imageElement, `${CDN_URL}${value}`, this.title);
    }

    set category(value: string) {
        this.categoryElement.textContent = value;

        for (const key in categoryMap) {
            this.categoryElement.classList.toggle(categoryMap[key as CategoryKey], key === value);
        }
    }

    set price(value: number | null) {
        if (value === null) {
            this.priceElement!.textContent = 'Бесценно';
        } else {
            this.priceElement!.textContent = `${value} синапсов`;
        }
    }
}