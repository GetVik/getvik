# GetVik - Public Mock Frontend

## ⚠️ Public Mock Frontend
This repository contains a **mock frontend** for demonstration purposes only.
- No real backend connection.
- No real payment processing.
- Data is reset on refresh.
- All data is mocked in `data/mock.ts` and services.

## 🔒 Security & Privacy

This repository is a **mock frontend** designed for demonstration and educational purposes.

- **No Real Data**: All user data, products, and transactions are simulated in the browser or via mock API handlers.
- **No Real Payments**: Payment flows are UI-only and do not process actual money.
- **Credentials**: The credentials provided (`demo@getvik.com` / `password`) are hardcoded for the demo. 
- **Secrets**: If you fork this to build a real app, please generate your own `NEXTAUTH_SECRET` and other environment variables.

## Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/GetVik/GetVik.git
    cd GetVik
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Setup Environment**
    Copy `.env.example` to `.env`:
    ```bash
    cp .env.example .env
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Demo Credentials

To sign in as a creator:
- **Email**: `demo@getvik.com`
- **Password**: `password`

## What is Mocked?
- **Authentication**: Uses NextAuth with hardcoded credentials.
- **Database**: All data is served from in-memory arrays in `data/mock.ts`.
- **File Uploads**: Simulates upload delay and returns blob URLs.
- **Payments**: Simulates checkout flow and redirects back to success page.

## License
MIT
