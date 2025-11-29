import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

export interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected closeButton: HTMLButtonElement;
    protected contentElement: HTMLElement;

    private handleEscape = (evt: KeyboardEvent) => {
        if (evt.key === 'Escape') {
            this.events.emit('modal:request-close');
        }
    };

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
        this.closeButton.addEventListener('click', () => {
            this.events.emit('modal:request-close');
        });

        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.events.emit('modal:request-close');
            }
        });
    }

    open() {
        this.container.classList.add('modal_active');
        document.addEventListener('keydown', this.handleEscape);
    }

    close() {
        this.container.classList.remove('modal_active');
        this.contentElement.innerHTML = '';
        document.removeEventListener('keydown', this.handleEscape);
    }

    set content(value: HTMLElement) {
        this.contentElement.replaceChildren(value);
    }
}