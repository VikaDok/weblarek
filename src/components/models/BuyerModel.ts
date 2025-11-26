import { IBuyer, TPayment, IValidationErrors } from '../../types/index';
import { IEvents } from '../base/Events';

export class BuyerModel {
    payment: TPayment | '';
    email: string;
    phone: string;
    address: string;

    constructor(private events: IEvents) {
        this.payment = '';
        this.email = '';
        this.phone = '';
        this.address = '';
    };

// сохраняем данные
    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.email !== undefined) this.email = data.email;
        if (data.phone !== undefined) this.phone = data.phone;
        if (data.address !== undefined) this.address = data.address;

        this.events.emit('buyer:changed', this.getData());
    }    

// получаем данные
    getData(): Partial<IBuyer> {
        return {
            payment: this.payment || undefined,
            email: this.email || undefined,
            phone: this.phone || undefined,
            address: this.address || undefined,
        };
    }

// очищаем данные
    clear(): void {
        this.payment = '';
        this.email = '';
        this.phone = '';
        this.address = '';

        this.events.emit('buyer:changed', this.getData())
    }

// валидация
    validate(): IValidationErrors {
        const errors: IValidationErrors = {};
        if (!this.payment) errors.payment = 'Не выбран способ оплаты';
        if (!this.email) errors.email = 'Введите ваш email';
        if (!this.phone) errors.phone = 'Введите телефон';
        if (!this.address) errors.address = 'Введите адрес';
        return errors;
    }
}