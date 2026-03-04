<!-- markdownlint-disable MD024 -->
# Клиент FC Vympel

Этот репозиторий содержит фронтенд‑клиент для приложения FC Vympel. Приложение написано на React (создано с помощью Create React App) и использует **Redux Toolkit** для управления состоянием и **Firebase** для аутентификации и хранения данных.

Функционал приложения включает регистрацию и вход пользователей (включая Google OAuth), управление командами, планирование и результаты матчей, а также простой чат. Исходники находятся в каталоге `src/` и организованы по компонентам и страницам.

## 🚀 Быстрый старт

Следуйте шагам ниже, чтобы запустить проект локально.

### 1. Клонирование репозитория

```bash
git clone https://github.com/thesolesab/FCVympel.git
cd FCVympel
```

### 2. Установка зависимостей

Проект использует React 18 и другие библиотеки. Ранее в `package.json` находилась зависимость `react-beautiful-dnd`, которая конфликтовала с React 18 по peer‑dependency — она была удалена, чтобы установка зависимостей проходила корректно.

Установите зависимости:

```bash
npm install
```

Если возникнут ошибки с peer‑dependencies, можно попробовать вариант:

```bash
npm install --legacy-peer-deps
```

### 3. Настройка переменных окружения

Для инициализации Firebase требуются ключи и идентификаторы. Скопируйте пример и заполните свои значения:

```bash
cp .env.example .env.local   # или создайте .env
# затем отредактируйте .env.local и вставьте конфигурацию Firebase
```

Значения можно получить в настройках вашего проекта Firebase:

```env
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
```

> **Важно**: не коммитите файлы с секретами. В корне проекта `.gitignore` уже исключает все `*.env*`.

### 4. Запуск в режиме разработки

```bash
npm start
```

Приложение будет доступно по адресу http://localhost:3000 и поддерживает горячую перезагрузку при изменениях.

### 5. Полезные команды

| Команда | Описание |
|--------:|:---------|
| `npm test` | Запуск Jest в режиме наблюдения (watch) |
| `npm run build` | Сборка production‑версии в папку `build/` |
| `npm run eject` | Извлечение конфигурации CRA (без возврата) |

Для подробностей см. документацию Create React App: https://facebook.github.io/create-react-app/docs/getting-started

## 🧱 Структура проекта (кратко)

```
src/
├── components/      # переиспользуемые UI‑компоненты
├── pages/           # компоненты страниц (роуты)
├── firebase1/       # хелперы и хуки для Firebase
├── hooks/           # пользовательские React‑хуки
├── store/           # Redux slices и конфигурация стора
├── styles/          # глобальные стили (SCSS)
└── index.js         # точка входа приложения
```

## 📦 Основные зависимости

Ключевые библиотеки в проекте:

- React 18
- Redux Toolkit
- Firebase (Auth, Firestore, Storage)
- MUI (Material UI)
- Formik и Yup для форм и валидации
- sass для стилей

## 🛠️ Рекомендации

- При добавлении функционала, использующего Firebase, обновляйте `.env.example` и документируйте новые переменные.
- Периодически выполняйте `npm audit` и решайте найденные уязвимости.

## 📄 Лицензия

Проект предоставляется «как есть» без явной лицензии. При открытии проекта в публичный доступ рекомендуется добавить соответствующую лицензию.

---

Удачной работы! 🎉

<!-- markdownlint-enable MD024 -->

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
