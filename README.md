# CSC307_CocoLoco

**DataBase UML** : https://lucid.app/lucidchart/18fd1f9d-c626-4e05-8653-da345afafee1/edit?viewport_loc=-656%2C-871%2C1774%2C985%2C0_0&invitationId=inv_014d83cf-ad1c-4fa6-9995-ce03d49fe600


## Dependencies
```bash
npm install concurrently
npm install -w express-backend express
npm install --save-dev nodemon
npm install cors
npm install mongoose
npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier
```


# How To Run:
### Run Both Frontend and Backend Together
Use **concurrently** to start both servers:
```bash
npm run dev
```

# Contributing:

## Code Style (Linting & Formatting)

We use **ESLint** and **Prettier** to keep our code clean and consistent.

### Code Style Rules

- Following the JavaScript AirBnb Style Guide
- Use **single quotes** and **semicolons**
- Max line width: **80 characters**

### VS Code Setup

1. Install the following extensions:
   - **ESLint**
   - **Prettier – Code Formatter**

2. In VS Code settings:
   - Enable **“Format on Save”**
   - Set **Prettier** as the **Default Formatter**

