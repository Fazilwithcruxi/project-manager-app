# 🌌 Zenith: Next-Gen Project Management

Zenith is a premium, high-performance project management dashboard designed for modern teams. It combines a stunning **glassmorphic UI** with bleeding-edge **AI capabilities** to make managing tasks faster, smarter, and visually immersive.

🚀 **[Live Demo](https://fazilwithcruxi.github.io/project-manager-app/)** | 📦 **[Repository](https://github.com/Fazilwithcruxi/project-manager-app)**

[![GitHub license](https://img.shields.io/github/license/Fazilwithcruxi/project-manager-app)](https://github.com/Fazilwithcruxi/project-manager-app/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/Fazilwithcruxi/project-manager-app)](https://github.com/Fazilwithcruxi/project-manager-app/stargazers)

---

## ✨ Key Features

- **🎙️ AI Voice Assistant (Zenith AI)**: Navigate the app and create tasks using just your voice. Powered by Google's Gemini 2.0 Flash for natural, context-aware interactions.
- **📋 Dynamic Kanban Board**: Effortless drag-and-drop workflow management with advanced filtering and state persistence.
- **📊 Interactive Analytics**: Real-time project tracking with beautiful charts (Recharts) and team performance metrics.
- **🎨 Glassmorphic Aesthetic**: A state-of-the-art dark mode interface featuring acrylic blurs, vibrant gradients, and micro-animations.
- **⚡ Full-Stack Power**: Lightning-fast React frontend powered by Vite, backed by a robust Node.js/Express server and PostgreSQL database.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Framer Motion, Recharts, Lucide Icons
- **Backend**: Node.js, Express, PostgreSQL
- **AI**: Google Generative AI (Gemini SDK)
- **Infrastructure**: Docker Desktop (PostgreSQL Container)

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for the database)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Fazilwithcruxi/project-manager-app.git

# Install Frontend dependencies
npm install

# Install Backend dependencies
cd backend
npm install
cd ..
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run the Application
```bash
# Start the Database
docker-compose up -d

# Start the Backend (in /backend)
npm run dev

# Start the Frontend (in root)
npm run dev
```

---

## 🔗 Project Link
Check out the repository here: [https://github.com/Fazilwithcruxi/project-manager-app](https://github.com/Fazilwithcruxi/project-manager-app)

---

Developed with ❤️ by [Fazil](https://github.com/Fazilwithcruxi)
