# Hatla2ee

Hatla2ee is a **cars classified** platform designed to help users buy and sell cars easily. This project is built using **Next.js** with multi-region support, localization, and optimized performance features.

## 🚀 Features
- **Multi-Region Deployment**: Supports different regions with minimal feature changes.
- **Search & Filters**: Advanced filtering for car listings.

## 📂 Project Structure
```
/src
 ├── app
 │   ├── layout.tsx         # Root layout
 │   ├── page.tsx           # Home page
 │   ├── [locale]
 │   │   ├── layout.tsx     # Locale layout (ar/en)
 │   │   ├── page.tsx       # Localized homepage
 │   │   ├── cars
 │   │   │   ├── page.tsx   # Car listings
 │   │   │   ├── [id]
 │   │   │   │   ├── page.tsx   # Car details page
 │   ├── api               # API routes
 │   │   ├── auth
 │   │   │   ├── login.ts  # Login API
 │   │   │   ├── logout.ts # Logout API
 │   ├── middleware.ts     # Handles redirections
 ├── components            # Reusable UI components
 ├── lib                   # Utility functions & helpers
 ├── public                # Static assets
 ├── styles                # Global styles
 ├── i18n                  # Localization files
 ├── .env.local            # Environment variables
 ├── next.config.js        # Next.js configuration
 ├── README.md             # Project documentation
```


## 🛠️ Installation & Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/hatla2ee.git
   cd hatla2ee
   ```
2. Install dependencies:
   ```sh
   yarn install
   ```
3. Set up environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=https://api.hatla2ee.com
   ```
4. Run the development server:
   ```sh
   yarn run dev
   ```

## 📌 Deployment
Hatla2ee is optimized for **multi-region deployment**, ensuring the best performance for different locations.

- **Staging**: `https://hatla2ee-stage.dubizzlelabs.run/`
- **Production**: `https://[region].hatla2ee.com`

To deploy, run:
```sh
yarn run build && yarn run start
```

## 🔥 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature-xyz`)
3. Commit changes (`git commit -m "Added feature xyz"`)
4. Push to the branch (`git push origin feature-xyz`)
5. Create a Pull Request

## 📄 License
This project is licensed under the **MIT License**.

---
**Hatla2ee – The Ultimate Cars Classified Platform 🚗💨**

