<div align="center">

# 🛒 বাজার দর | Bazar Dor

### বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের দাম এক নজরে

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&duration=3000&pause=1000&color=008C3D&center=true&vCenter=true&width=650&lines=Know+Today%27s+Market+Prices;Compare+Prices+Across+Markets;Browse.+Compare.+Stay+Informed." alt="Animated introduction: Know today's market prices, compare prices across markets, and stay informed." />

<p>
  A Bengali market-price application for exploring daily prices,
  comparing markets, and tracking price changes.
</p>

[![Live Website](https://img.shields.io/badge/Live_Website-Visit_Bazar_Dor-008C3D?style=for-the-badge&logo=vercel&logoColor=white)](https://bazar-dor-self.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0F172A?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8)
![MongoDB](https://img.shields.io/badge/MongoDB-116149?style=for-the-badge&logo=mongodb&logoColor=white)

</div>

---

## 📖 About

**Bazar Dor** helps users explore the prices of essential products in Bangladesh through a Bengali interface.

Browse products by category, discover the largest price increases and decreases, and compare prices across different markets. Signed-in users can view detailed product information and manage their profiles.

## ✨ Features

| Feature | Description |
| --- | --- |
| 📈 Price increases | View the top six products with the largest price increases. |
| 📉 Price decreases | Discover the top six products with the largest price decreases. |
| 🛍️ All products | Browse available products with Bengali prices, units, and change badges. |
| 🗂️ Category browsing | Explore products by category with active navigation highlighting. |
| ↕️ Price sorting | Sort products by numeric price, from low to high or high to low. |
| 🏪 Market comparison | Compare minimum and maximum prices across markets. |
| 🔄 Price ticker | View a scrolling strip of product prices and percentage changes. |
| 🔐 Authentication | Sign in using email/password, Google, or GitHub. |
| 👤 Profile management | View account information and update your name on a separate page. |
| 🔗 Account linking | Connect a GitHub account from your profile. |
| 🛡️ Protected routes | Require authentication for product details and profile pages. |
| 🔔 Feedback | Receive toast notifications and see loading and error states. |

## 🧰 Technology Stack

| Layer | Technologies |
| --- | --- |
| Framework | Next.js App Router, React |
| Language | TypeScript |
| Styling | Tailwind CSS, HeroUI |
| Authentication | Better Auth |
| Database | MongoDB Atlas |
| Notifications | React Hot Toast |
| Icons | Gravity UI Icons |
| Deployment | Vercel |

## 🧭 Explore the Application

```text
Home
 ├── Today's price risers
 ├── Today's price fallers
 ├── All products
 └── Categories
      └── Product details 🔒

Authentication
 ├── Email and password
 ├── Google
 └── GitHub

Profile 🔒
 ├── Account information
 ├── GitHub account linking
 └── Edit name
```

| Route | Purpose |
| --- | --- |
| `/` | Homepage and product overview |
| `/category/[category]` | Category products and sorting |
| `/product/[product]` | Protected product details |
| `/sign-in` | Sign in |
| `/sign-up` | Create an account |
| `/profile` | Account details |
| `/profile/edit` | Update your name |

## 🚀 Local Setup

### 1. Install dependencies

From the project directory:

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
MONGODB_URI=your-mongodb-connection-string
BETTER_AUTH_SECRET=your-strong-random-secret
BETTER_AUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

Keep `.env` out of version control. Configure MongoDB Atlas network access for your development and deployment environments.

### 3. Configure social authentication

<details>
<summary><strong>🔑 Google and GitHub callback URLs</strong></summary>

#### Local development

**Google**

```text
http://localhost:3000/api/auth/callback/google
```

**GitHub**

```text
http://localhost:3000/api/auth/callback/github
```

#### Production

**Google**

```text
https://bazar-dor-self.vercel.app/api/auth/callback/google
```

**GitHub**

```text
https://bazar-dor-self.vercel.app/api/auth/callback/github
```

</details>

### 4. Start the application

```bash
npm run dev
```

Open **http://localhost:3000**.

## 📦 Production Build

```bash
npm run build
npm start
```

## 🌐 Deployment

The application is hosted on **Vercel**.

Add the required environment variables to the Vercel project and use:

```env
BETTER_AUTH_URL=https://bazar-dor-self.vercel.app
```

Redeploy after changing environment variables.

**Visit:** https://bazar-dor-self.vercel.app

## 📡 API

Market information comes from the assignment-provided API.

```text
Base URL:
https://api.abcz.workers.dev/api/bazardor
```

| Endpoint | Data |
| --- | --- |
| `/products` | Product prices and market information |
| `/categories` | Product categories |

> The external API may return `429 Too Many Requests` when its rate limit is reached.

## 🧮 Price Calculations

Product details display:

- The lowest price across available markets.
- The highest price across available markets.
- An approximate average calculated from each market’s price midpoint.

```text
Market midpoint = (Minimum price + Maximum price) ÷ 2

Approximate average = Sum of market midpoints ÷ Number of markets
```

Prices are indicative and may vary by location and market conditions.

---

<div align="center">

### 🛒 বাজার দর

**বাজারের দাম জানুন, সচেতনভাবে কেনাকাটা করুন।**

[🌐 Explore the Website](https://bazar-dor-self.vercel.app)

Built by **Ayman Nasir**

</div>
