
```markdown
# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

**Конструктор:**  
- `container: HTMLElement` - DOM-элемент, к которому привязывается компонент

**Поля класса:**  
- `container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

**Методы класса:**  
- `render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
- `setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`

#### Класс Api
Содержит в себе базовую логику отправки запросов.

**Конструктор:**  
- `baseUrl: string` - базовый адрес сервера
- `options: RequestInit = {}` - опциональный объект с заголовками запросов

**Поля класса:**  
- `baseUrl: string` - базовый адрес сервера  
- `options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

**Методы:**  
- `get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
- `post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
- `handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

**Конструктор:** Не принимает параметров

**Поля класса:**  
- `_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

**Методы класса:**  
- `on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
- `emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
- `trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

## Данные

### Переменные окружения и константы

**Файл .env**
```
VITE_API_ORIGIN=https://larek-api.nomoreparties.co
```

**Файл src/utils/constants.ts**
- `API_URL = ${VITE_API_ORIGIN}/api/weblarek` — базовый адрес API
- `CDN_URL = ${VITE_API_ORIGIN}/content/weblarek` — базовый адрес CDN для картинок
- `categoryMap` — соответствия категорий модификаторам для UI

### Типы данных

Все типы и интерфейсы объявлены в файле: `src/types/index.ts`

**Интерфейсы**

- `ApiPostMethods` - `'POST' | 'PUT' | 'DELETE'` — допустимые методы при отправке данных на сервер

- `IApi`
  - `get<T>(uri: string): Promise<T>` — GET-запрос на uri, вернёт данные типа T
  - `post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>` — отправка data на uri (по умолчанию POST), вернёт данные типа T

- `TPayment` - `'online' | 'offline'` — способ оплаты: картой или наличными

- `IProduct` (товар)
  - `id: string` — уникальный идентификатор
  - `description: string` — описание
  - `image: string` — имя файла картинки на CDN
  - `title: string` — название товара
  - `category: string` — категория
  - `price: number | null` — цена в ₽; null — товар нельзя купить

- `IBuyer` (покупатель)
  - `payment: TPayment` — способ оплаты
  - `email: string` — e-mail
  - `phone: string` — телефон
  - `address: string` — адрес

- `IOrderRequest` (данные для оформления заказа)
  - `payment: TPayment` — способ оплаты
  - `email: string` — e-mail
  - `phone: string` — телефон  
  - `address: string` — адрес
  - `total: number` — сумма заказа
  - `items: string[]` — массив ID товаров
  - `customer: IBuyer` — данные покупателя

- `IValidationErrors` (ошибки валидации)
  - `payment?: string` — ошибка выбора способа оплаты
  - `email?: string` — ошибка в e-mail
  - `phone?: string` — ошибка в телефоне
  - `address?: string` — ошибка в адресе

- `IProductsResponse`
  - `total: number` — сколько всего товаров на сервере
  - `items: IProduct[]` — массив товаров текущего запроса

- `IOrderResponse`
  - `id: string` — идентификатор созданного заказа

## Модели данных

Модели слоя Model изолированы, каждая отвечает строго за свою задачу.

### CatalogModel

**Назначение:** хранение каталога товаров и выбранного товара для детального просмотра

**Конструктор:**
- `events: IEvents` - экземпляр EventEmitter для работы с событиями

**Поля:**
- `products: IProduct[]` — список всех товаров
- `previewId?: string` — id товара, выбранного для предпросмотра

**Методы:**
- `setProducts(list: IProduct[]): void` — сохранить массив товаров
- `getProducts(): IProduct[]` — получить весь каталог
- `getById(id: string): IProduct | undefined` — получить товар по id
- `setPreview(id?: string): void` — выбрать товар для предпросмотра
- `getPreview(): IProduct | undefined` — получить текущий товар предпросмотра

**События:**
- `catalog:changed` — обновился список товаров
- `catalog:preview` — выбран товар для предпросмотра

### CartModel

**Назначение:** хранение выбранных пользователем товаров и расчёт агрегатов корзины

**Конструктор:**
- `events: IEvents` - экземпляр EventEmitter для работы с событиями

**Поля:**
- `items: IProduct[]` — содержимое корзины

**Методы:**
- `getItems(): IProduct[]` — получить позиции корзины
- `add(product: IProduct): void` — добавить товар (только уникальные товары)
- `remove(productId: string): void` — удалить товар
- `clear(): void` — очистить корзину
- `getCount(): number` — суммарное количество единиц товара
- `getTotalPrice(products: IProduct[]): number` — итоговая стоимость
- `has(productId: string): boolean` — проверка наличия товара в корзине

**События:**
- `cart:changed` — корзина изменилась

### BuyerModel

**Назначение:** хранение данных покупателя и их валидация

**Конструктор:**
- `events: IEvents` - экземпляр EventEmitter для работы с событиями

**Поля:**
- `payment?: TPayment`
- `email?: string`
- `phone?: string`
- `address?: string`

**Методы:**
- `patch(data: Partial<IBuyer>): void` — частичное сохранение данных
- `get(): IBuyer` — получить все данные покупателя
- `clear(): void` — очистить данные
- `validate(): IValidationErrors` — валидация полей по правилу «поле не пустое»

**События:**
- `buyer:changed` — изменены данные покупателя

## Слой коммуникации

Класс ShopApi (src/components/services/ShopApi.ts) инкапсулирует работу с сервером.

**Конструктор:**
- `http: IApi` — принимает любой объект по интерфейсу IApi

**Методы:**
- `getProducts(): Promise<IProduct[]>` — GET /product/, возвращает массив товаров
- `createOrder(payload: IOrderRequest): Promise<IOrderResponse>` — POST /order/, отправляет данные заказа

**Типы ответов:**
- `IProductsResponse { total: number; items: IProduct[] }`
- `IOrderResponse { id: string }`

# Слой Представления (View)

Слой View отвечает за отображение данных и взаимодействие с пользователем. Все классы представления наследуются от базового класса `Component` и следуют принципу "один класс - один блок разметки".

## Базовые классы

### Класс Card
**Родительский класс для всех типов карточек**

```typescript
class Card<T extends Partial<IProduct>> extends Component<T>
```

**Конструктор:**
- `container: HTMLElement` - DOM-элемент, в который рендерится карточка

**Назначение:** Базовый класс для карточек товаров, содержащий общую функциональность.

**Поля:**
- `id?: string` - идентификатор товара
- `titleElement?: HTMLElement` - элемент заголовка
- `priceElement?: HTMLElement` - элемент цены

**Методы:**
- `set title(value: string)` - установка заголовка карточки
- `set price(value: number | null)` - установка цены ("Бесценно" для null)

**События:** Не генерирует события напрямую

## Классы карточек

### CardCatalog
**Карточка товара в каталоге**

```typescript
class CardCatalog extends Card<IProduct>
```

**Конструктор:**
- `container: HTMLElement` - DOM-элемент карточки
- `actions: ICardCatalogActions` - объект с обработчиками событий
  - `onClick?: () => void` - обработчик клика по карточке

**Назначение:** Отображение товара в основном каталоге магазина.

**DOM-элементы:**
- `.card__image` - изображение товара
- `.card__category` - категория товара
- `.card__title` - название товара (наследуется)
- `.card__price` - цена товара (наследуется)

**Методы:**
- `set image(value: string)` - установка изображения с CDN
- `set category(value: string)` - установка категории с применением стилей
- `set price(value: number | null)` - переопределение установки цены

**События:**
- `click` по карточке → вызывает `actions.onClick()`

### CardPreview
**Карточка предпросмотра товара**

```typescript
class CardPreview extends Card<IProduct>
```

**Конструктор:**
- `container: HTMLElement` - DOM-элемент карточки
- `actions: ICardPreviewActions` - объект с обработчиками событий
  - `onClick?: () => void` - обработчик клика по кнопке

**Назначение:** Детальное отображение товара в модальном окне предпросмотра.

**DOM-элементы:**
- `.card__image` - изображение товара
- `.card__category` - категория товара
- `.card__title` - название товара
- `.card__text` - описание товара
- `.card__button` - кнопка действия

**Методы:**
- `set image(value: string)` - установка изображения
- `set category(value: string)` - установка категории
- `set description(value: string)` - установка описания
- `set buttonText(value: string)` - установка текста кнопки
- `set buttonDisabled(value: boolean)` - блокировка кнопки

**События:**
- `click` по кнопке → вызывает `actions.onClick()`

### CardBasket
**Карточка товара в корзине**

```typescript
class CardBasket extends Card<IProduct>
```

**Конструктор:**
- `container: HTMLElement` - DOM-элемент карточки
- `actions?: ICardBasketActions` - опциональный объект с обработчиками событий
  - `onDelete?: (product: IProduct) => void` - обработчик удаления товара

**Назначение:** Отображение товара в списке корзины покупок.

**DOM-элементы:**
- `.basket__item-index` - порядковый номер товара
- `.basket__item-delete` - кнопка удаления
- `.card__title` - название товара
- `.card__price` - цена товара

**Методы:**
- `set index(value: number)` - установка порядкового номера

**События:**
- `click` по кнопке удаления → вызывает `actions.onDelete(product)`

## Базовый класс форм

### Класс Form
**Родительский класс для всех форм**

```typescript
abstract class Form<T> extends Component<T>
```

**Конструктор:**
- `container: HTMLElement` - DOM-элемент формы
- `events: IEvents` - экземпляр EventEmitter для работы с событиями

**Назначение:** Базовая функциональность для форм с валидацией и обработкой отправки.

**Поля:**
- `submitButton: HTMLButtonElement` - кнопка отправки формы
- `errorElement: HTMLElement` - элемент отображения ошибок

**Абстрактные методы:**
- `protected handleSubmit(): void` - обработка отправки формы
- `protected handleInput(field: keyof T, value: string): void` - обработка ввода данных

**Методы:**
- `set error(message: string)` - установка сообщения об ошибке
- `set valid(isValid: boolean)` - активация/блокировка кнопки отправки

**События:**
- `submit` формы → вызывает `handleSubmit()`
- `input` в полях формы → вызывает `handleInput()`

## Классы форм

### Order
**Форма оформления заказа**

```typescript
class Order extends Form<IOrder>
```

**Конструктор:**
- `container: HTMLElement` - DOM-элемент формы
- `events: IEvents` - экземпляр EventEmitter для работы с событиями

**Назначение:** Форма выбора способа оплаты и ввода адреса доставки.

**DOM-элементы:**
- `.button_alt` - кнопки выбора способа оплаты
- `input[name="address"]` - поле ввода адреса
- `button[type="submit"]` - кнопка "Далее"

**Методы:**
- `set payment(method: string)` - установка выбранного способа оплаты
- `set address(value: string)` - установка адреса доставки

**События:**
- `click` по кнопкам оплаты → `order:payment`
- `input` в поле адреса → `order:address` и `buyer:changed`
- `submit` формы → `order:submit`

### Contacts
**Форма контактных данных**

```typescript
class Contacts extends Form<IContacts>
```

**Конструктор:**
- `container: HTMLElement` - DOM-элемент формы
- `events: IEvents` - экземпляр EventEmitter для работы с событиями

**Назначение:** Форма ввода email и телефона покупателя.

**DOM-элементы:**
- `input[name="email"]` - поле ввода email
- `input[name="phone"]` - поле ввода телефона
- `button[type="submit"]` - кнопка "Оплатить"

**События:**
- `input` в поле email → `contacts:email` и `buyer:changed`
- `input` в поле телефона → `contacts:phone` и `buyer:changed`
- `submit` формы → `contacts:submit`

## Компоненты интерфейса

### Basket
**Компонент корзины покупок**

```typescript
class Basket extends Component<IBasket>
```

**Конструктор:**
- `container: HTMLElement` - DOM-элемент корзины
- `events: IEvents` - экземпляр EventEmitter для работы с событиями

**Назначение:** Отображение списка товаров в корзине и общей суммы.

**DOM-элементы:**
- `.basket__list` - список товаров
- `.basket__button` - кнопка оформления заказа
- `.basket__price` - общая сумма

**Методы:**
- `set items(value: HTMLElement[])` - установка списка товаров
- `set total(value: number)` - установка общей суммы
- `set empty(isEmpty: boolean)` - отображение состояния пустой корзины

**События:**
- `click` по кнопке оформления → `cart:checkout`

### Success
**Компонент успешного заказа**

```typescript
class Success extends Component<ISuccess>
```

**Конструктор:**
- `container: HTMLElement` - DOM-элемент компонента

**Назначение:** Отображение подтверждения успешного оформления заказа.

**DOM-элементы:**
- `.order-success__title` - заголовок
- `.order-success__description` - описание с суммой
- `.order-success__close` - кнопка закрытия

**Методы:**
- `set title(value: string)` - установка заголовка
- `set description(value: string)` - установка описания

**События:**
- `click` по кнопке закрытия → `success:close`

### Modal
**Модальное окно**

```typescript
class Modal extends Component<IModal>
```

**Конструктор:**
- `events: IEvents` - экземпляр EventEmitter для работы с событиями
- `container: HTMLElement` - DOM-элемент модального окна

**Назначение:** Универсальное модальное окно для отображения различного контента.

**DOM-элементы:**
- `.modal__close` - кнопка закрытия
- `.modal__content` - контейнер для контента

**Методы:**
- `open()` - открытие модального окна
- `close()` - закрытие модального окна
- `set content(value: HTMLElement)` - установка контента

**События:**
- `click` по кнопке закрытия → `modal:request-close`
- `click` по overlay → `modal:request-close`
- `keydown` (Escape) → `modal:request-close`

### Header
**Шапка сайта**

```typescript
class Header extends Component<IHeader>
```

**Конструктор:**
- `events: IEvents` - экземпляр EventEmitter для работы с событиями
- `container: HTMLElement` - DOM-элемент шапки

**Назначение:** Отображение шапки сайта с счетчиком товаров в корзине.

**DOM-элементы:**
- `.header__basket-counter` - счетчик товаров в корзине
- `.header__basket` - кнопка корзины

**Методы:**
- `set counter(value: number)` - установка значения счетчика

**События:**
- `click` по кнопке корзины → `basket:open`

### Gallery
**Галерея товаров**

```typescript
class Gallery extends Component<IGallery>
```

**Конструктор:**
- `container: HTMLElement` - DOM-элемент контейнера галереи

**Назначение:** Контейнер для отображения карточек товаров каталога.

**Методы:**
- `set items(items: HTMLElement[])` - установка списка карточек товаров

**События:** Не генерирует события

## Принципы работы слоя View

1. **Инкапсуляция DOM**: Каждый класс работает строго со своим блоком разметки
2. **Событийная модель**: Все пользовательские действия генерируют события для обработки в Презентере
3. **Наследование**: Карточки и формы используют общих родителей для переиспользования кода
4. **Изоляция**: Модальное окно является независимым компонентом, не имеющим наследников
5. **Реактивность**: Изменения данных автоматически отражаются в интерфейсе через сеттеры

Все компоненты могут быть использованы в любом месте приложения, включая модальные окна, что обеспечивает гибкость и переиспользование кода.
```