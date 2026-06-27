# Shopify Floating Announcement App

A production-ready, fully compliant Shopify Application built using modern web standards. The app allows merchants to create and customize a floating announcement banner from their Admin Dashboard, which updates in real-time across the storefront using Shopify's secure Native Metafields pipeline.

---

## 🏗️ System Architecture & Data Flow

The application strictly adheres to the standard pipeline architecture required for scalable Shopify apps:

+--------------------------+       1. Form Submission      +-------------------------+
|                          | ----------------------------> |                         |
|  Admin Dashboard UI      |                               |  App Backend Server     |
|  (React Router v7 / Vite)| <---------------------------- |  (Node.js / Express)    |
|                          |       4. Success Alert        |                         |
+--------------------------+                               +-------------------------+
|              |
2. Log Audit Entry   |              | 3. Set Shop Metafield
v              v
+------------+    +-----------------------+
|  MongoDB   |    | Shopify Admin API     |
|  Database  |    | (GraphQL Mutation)    |
+------------+    +-----------------------+
|
| 5. Core Native Pull
v
+----------------------------------+
|                                  |
|   Storefront Theme App Extension |
|   (Liquid Embed Block - Body)    |
|                                  |
+----------------------------------+


### End-to-End Execution Flow:
1. **Admin Input:** The merchant updates the announcement text on the React-based admin panel and clicks "Save".
2. **Database Persistence:** The backend instantly records the textual change along with a strict ISO timestamp into MongoDB to maintain an unalterable audit history.
3. **Shopify Synchronization:** The backend utilizes the Shopify Admin GraphQL API via `metafieldsSet` mutation to programmatically lock the text inside the native shop metafield space (`namespace: "my_app"`, `key: "announcement"`).
4. **Storefront Presentation:** The Shopify Theme App Extension (App Embed Block) pulls the cached token data directly using edge-native Liquid runtime variables `{{ shop.metafields.my_app.announcement.value }}` without relying on deprecated script injections.

---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS / Core UI Framework Integration.
- **Backend:** Node.js, Express, React Router v7 / Remix Architecture.
- **Database:** MongoDB via Mongoose Object Modeling (Audit Logging Mode).
- **Shopify Framework:** Theme App Extensions (App Embed Blocks) & Shopify GraphQL Admin API.

---

## 📁 Project Structure Key Components

```text
├── app/
│   ├── config/
│   │   └── mongodb.server.js      # MongoDB database connection engine
│   ├── models/
│   │   └── announcement.model.js  # Schema configuration for tracking audit logs
│   ├── routes/
│   │   ├── app._index.jsx         # Merchant Dashboard UI & GraphQL sync action logic
│   │   └── app.announcement.jsx   # Public proxy data loader stream layout
│   └── shopify.server.js          # Main authenticating environment core configurations
└── extensions/
    └── announcement-banner/
        └── blocks/
            └── announcement.liquid# Premium capsule UI block injected globally into standard <body>

Local Development Setup
Follow these quick steps to launch the repository locally:

1. Prerequisites
Ensure you have Node.js v18+ and a running instance of MongoDB Compass / Atlas Connection String.

2. Installation
Clone this repository to your local directory and install the necessary dependencies:
npm install

3. Environment Configurations
Create a .env file inside your root directory and map the configuration credentials:

Code snippet

PORT=8081
SHOPIFY_API_KEY=your_shopify_app_client_id
SHOPIFY_API_SECRET=your_shopify_app_client_secret
SCOPES=write_metafields,read_metafields
SHOPIFY_APP_URL=[https://your-temporary-dev-tunnel.ngrok-free.app](https://your-temporary-dev-tunnel.ngrok-free.app)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/your_db_name

4. Boot Up the Server
Initialize the unified CLI environment to load the proxy interface bridges:

Bash

npm run dev

📌 Submission Resources
Host Theme Configuration: Ensure the Floating Announcement App Embed Block is manually set to Enabled inside your development store's live Theme Customizer panel.

Production Infrastructure Deployment: App pipeline configured and optimized to support multi-tenant environment clouds.