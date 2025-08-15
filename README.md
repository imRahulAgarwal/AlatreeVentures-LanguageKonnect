## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/imRahulAgarwal/AlatreeVentures-LanguageKonnect.git
   cd AlatreeVentures-LanguageKonnect
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

## Environment Configuration

### Frontend (.env)
Create a `.env` file in the `frontend` folder:
```env
VITE_API_URL=http://localhost:5000
VITE_APP_URL=http://localhost:5173
```

### Backend (.env)
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017/languagekonnect

JWT_SECRET=thisisasecretkey

FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,

STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## Stripe Setup

1. Login to your [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your API keys from the Developers section
3. Set up webhook endpoints pointing to your backend
4. Update the environment variables with your Stripe keys

## Running the Application

### Start the Backend
```bash
cd backend
npm start
# or if nodemon is installed globally
npm test
```

### Start the Frontend
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Project Structure

```
├── frontend/          # React + Vite application
└── backend/           # Node.js Express server
```