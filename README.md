# CSC307_CocoLoco

** Figma Storyboard ** : https://www.figma.com/design/b0CTNj903HIhA1nK6MSvO0/UI-Prototyping?node-id=98-4&t=K3ox3zkKE5XOxGVy-1

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
