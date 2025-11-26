import { Form } from "./Form";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

export interface IOrder {
    payment: string;
    address: string;
}

export class Order extends Form<IOrder> {
    protected paymentButtons: NodeListOf<HTMLButtonElement>;
    protected addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this.paymentButtons = container.querySelectorAll('.button_alt');
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);

        this.paymentButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                this.events.emit('order:payment', { field: 'payment', value: btn.name });
                this.events.emit('buyer:changed');
            });
        });
    }

    protected handleInput(field: keyof IOrder, value: string): void {
        if (field === 'address') {
            this.events.emit('order:address', { field, value });
        }

        this.events.emit('buyer:changed');
    }

    protected handleSubmit(): void {
        this.events.emit('order:submit');
    }

    set payment(method: string) {
        this.paymentButtons.forEach((btn) => {
            btn.classList.toggle('button_alt-active', btn.name === method);
        });
    }

    set address(value: string) {
        this.addressInput.value = value;
    }

    set error(value: string) {
        super.error = value;
    }

    set valid(value: boolean) {
        super.valid = value;
    }
}