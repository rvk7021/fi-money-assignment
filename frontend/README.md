# Inventory Management Frontend

A modern React + Tailwind CSS frontend for the Inventory Management Tool.

---

## Features
- User authentication (login, signup, logout)
- Product listing with pagination
- Add new products
- Update product quantity
- Responsive, clean UI with Tailwind CSS
- Analytics: total products, total inventory, most stocked product
- Error handling and loading states

---

## Setup Instructions

### 1. Install Dependencies
```sh
cd frontend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `frontend` directory:
```env
REACT_APP_API_URL=http://localhost:3000
PORT=3001
```
- `REACT_APP_API_URL`: The base URL of your backend API
- `PORT`: The port for the React dev server (default: 3001)

### 3. Start the Frontend
```sh
npm start
```
- The app will run at [http://localhost:3001](http://localhost:3001)

---

## Usage
- **Login** with your credentials or **sign up** for a new account.
- View, add, and update products from the Products page.
- Use the pagination controls to navigate through products.
- See analytics at the top of the Products page.
- Logout securely from any page.

---

## Project Structure
```
frontend/
  src/
    api/                # API utility functions (future use)
    components/         # Reusable UI components and modals
    context/            # Auth context
    hooks/              # Custom React hooks (future use)
    pages/              # Main pages (Login, Signup, Products)
    App.js
    index.js
    ...
  tailwind.config.js
  postcss.config.js
  ...
```

---

## Notes
- The frontend expects the backend to be running and accessible at the URL specified in `.env`.
- All authentication is handled via HttpOnly cookies for security.
- For best results, use the latest version of Node.js and npm.

---

## License
MIT
