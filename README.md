# 🚚 LogisticsHub - Fleet & Shipment Operations Dashboard

A modern, full-stack logistics management dashboard built with **React**, **Tailwind CSS**, and **Supabase**. It provides real-time shipment tracking, fleet management, billing records, interactive analytics, and role-based access control.

## 🚀 Live Demo

[View Live Application](https://logistics-dashboard-snowy-one.vercel.app/)

## ✨ Key Features

- **Role-Based Access Control (RBAC):** Admin email authorization. Admins gain full CRUD privileges, while non-admin users access a read-only viewer mode.
- **Real-Time Database Sync:** Powered by Supabase Realtime subscriptions so updates show instantaneously across open browser sessions without page refreshes.
- **Interactive Data & Analytics:** Dynamic charts built with Recharts for shipping volume trends, package status distributions, and monthly revenue.
- **Full CRUD Management:** Direct database connectivity for Shipments, Vehicles, Invoices, and Customer directories.
- **Inline Editing & Data Export:** Fast inline cell editing and one-click CSV report downloads.
- **UI/UX:** Dark Mode toggle, mobile responsive drawer navigation, and Toast alerts.

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, Lucide Icons, Recharts, Vite
- **Backend & Auth:** Supabase (PostgreSQL, Realtime Subscriptions, Authentication)
- **Deployment:** Vercel
