# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

New read me

# 🚚 LogisticsHub - Fleet & Shipment Operations Dashboard

A modern, full-stack logistics management dashboard built with **React**, **Tailwind CSS**, and **Supabase**. It provides real-time shipment tracking, fleet management, billing records, interactive analytics, and role-based access control.

## 🚀 Live Demo

[View Live Application](https://logistics-dashboard-snowy-one.vercel.app/)

## ✨ Key Features

- **Role-Based Access Control (RBAC):** Admin email whitelist enforcement. Admins gain full CRUD privileges, while non-admin users access a read-only viewer mode.
- **Real-time Database Sync:** Uses Supabase Realtime subscriptions so data updates instantaneously across active browser sessions without refreshing.
- **Interactive Data & Analytics:** Integrated Recharts for monthly shipping volume trends, status distributions, and revenue graphs.
- **Full CRUD Management:** Real database integration for Shipments, Vehicles, Invoices, and Customer directories.
- **Inline Editing & Data Export:** Quick inline record updating and one-click CSV report exports.
- **UI/UX:** Dark Mode toggle, responsive mobile drawer sidebar, and toast alerts.

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, Lucide Icons, Recharts, Vite
- **Backend & Auth:** Supabase (PostgreSQL, Realtime Subscriptions, Authentication)
- **Deployment:** Vercel
