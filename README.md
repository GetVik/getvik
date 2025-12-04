# GetVik – Digital Marketplace Frontend

![GetVik Banner](public/banner.png)

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

This is the frontend for GetVik. 
Everything here is UI-only, more of a public peek into the design and structure.

</div>

---

## ⚠️ Mock Frontend Only

**This repo contains no real backend or payment logic.**
Data is mocked locally and resets on refresh. Good for demos and UI exploration.


## Tech Stack

*   **Framework**: Next.js
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **Animations**: Framer Motion, GSAP

## Getting Started

```bash
git clone https://github.com/GetVik/GetVik.git
npm install
cp .env.example .env
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Demo Login

| Role | Email | Password |
| :--- | :--- | :--- |
| **Creator** | `demo@getvik.com` | `password` |

## Project Structure

```
app/          - App Router pages/layouts
components/   - UI components
content/      - Static content (MDX etc)
context/      - React Context providers
data/         - Mock data
hooks/        - Custom React hooks
lib/          - Helpers and utils
public/       - Static assets
services/     - Mock services
types/        - Type definitions
```

## Contributing

PRs welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License.
