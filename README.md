# PulseCheck Frontend

A beautiful, modern frontend for the PulseCheck uptime monitoring service built with Next.js 15 and JavaScript.

<img width="1679" alt="create-monitor" src="https://github.com/user-attachments/assets/59b238e8-340a-4792-a17a-38c25c34bafd" />
<img width="1680" alt="dashboard" src="https://github.com/user-attachments/assets/300447c7-b453-4d43-a252-659bb6661ec6" />
<img width="1678" alt="landing-page" src="https://github.com/user-attachments/assets/41e660c6-0fcd-4935-b6d6-493032582785" />
<img width="1680" alt="monitors-list" src="https://github.com/user-attachments/assets/175f584b-0782-4019-81f6-2382f7922415" />

## 🚀 Features

### Modern UI/UX
- **Clean, responsive design** with glassmorphism effects
- **Real-time updates** via WebSocket connections
- **Beautiful gradients** and smooth animations
- **Mobile-first** responsive design
- **Accessible** with proper contrast and semantic markup

### Authentication
- **User registration** and login
- **JWT token management** with automatic refresh
- **Protected routes** with authentication guards
- **Persistent sessions** with localStorage

### Monitor Management
- **Create monitors** with custom intervals and names
- **Real-time status updates** with WebSocket integration
- **Manual monitor checks** with instant feedback
- **Edit and delete** monitors with confirmation
- **Status indicators** with beautiful icons and colors

### Dashboard
- **Overview statistics** with total, up, down, and unknown monitors
- **Recent activity** feed with latest status updates
- **Quick actions** for adding and managing monitors
- **Real-time connection** status indicator

## 🛠️ Tech Stack

- **Next.js 15** - App Router with React Server Components
- **React 19** - Modern React with hooks and context
- **Lucide React** - Beautiful, consistent icons
- **WebSocket API** - Real-time bidirectional communication
- **CSS3** - Modern styling with gradients and animations
- **JavaScript** - No TypeScript for simplicity

## 📦 Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set environment variables**
   ```bash
   # .env.local
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_WS_URL=ws://localhost:8000
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🏗️ Project Structure

```
app/
├── globals.css              # Global styles and design system
├── layout.js               # Root layout with metadata
├── page.js                 # Landing page
├── login/
│   └── page.js             # Login form
├── register/
│   └── page.js             # Registration form
├── dashboard/
│   └── page.js             # Dashboard overview
└── monitors/
    ├── page.js             # Monitors list
    ├── new/
    │   └── page.js         # Create monitor form
    └── [id]/
        ├── page.js         # Monitor detail view
        └── edit/
            └── page.js     # Edit monitor form

components/
└── Navbar.js               # Navigation component

contexts/
└── AuthContext.js          # Authentication context

hooks/
└── useWebSocket.js          # WebSocket hook for real-time updates

lib/
└── api.js                  # API service with authentication
```

## 🎨 Design System

### Colors
- **Primary**: Linear gradient from #667eea to #764ba2
- **Success**: #48bb78 (green for UP status)
- **Error**: #f56565 (red for DOWN status)
- **Warning**: #ed8936 (orange for UNKNOWN status)
- **Background**: Linear gradient with glassmorphism

### Components
- **Cards**: Glass morphism with backdrop blur
- **Buttons**: Gradient primary, solid secondary
- **Forms**: Clean inputs with focus states
- **Status**: Color-coded badges with icons

## 🔧 API Integration

### Authentication Endpoints
```javascript
POST /auth/register    # User registration
POST /auth/login       # User login
```

### Monitor Endpoints
```javascript
GET    /api/v1/monitors           # Get all monitors
POST   /api/v1/monitors           # Create monitor
GET    /api/v1/monitors/:id       # Get monitor details
PUT    /api/v1/monitors/:id       # Update monitor
DELETE /api/v1/monitors/:id       # Delete monitor
POST   /api/v1/monitors/:id/check # Manual check
```

### WebSocket Endpoints
```javascript
WS /api/v1/ws/dashboard           # Dashboard updates
WS /api/v1/ws/:monitor_id         # Monitor-specific updates
```

## 📱 Features by Page

### Landing Page (/)
- Hero section with call-to-action
- Feature highlights with icons
- Statistics showcase
- Navigation to auth pages

### Login (/login)
- Email and password form
- Password visibility toggle
- Error handling with alerts
- Redirect to dashboard on success

### Register (/register)
- Full registration form (name, email, password)
- Form validation and error handling
- Success message with auto-redirect
- Link to login page

### Dashboard (/dashboard)
- Statistics cards (total, up, down, unknown)
- Recent activity list
- Quick add monitor button
- Real-time status updates

### Monitors (/monitors)
- Complete monitors list
- Status indicators with icons
- Quick actions (check, edit, delete)
- Empty state with call-to-action

### Add Monitor (/monitors/new)
- URL validation and form
- Interval selection dropdown
- Name field (optional)
- Tips and help text

### Edit Monitor (/monitors/:id/edit)
- Pre-filled form with current values
- Toggle active/inactive status
- Current status display
- Save/cancel actions

### Monitor Details (/monitors/:id)
- Real-time status with WebSocket
- Performance metrics
- Endpoint details
- Manual check button

## 🔄 Real-time Features

### WebSocket Integration
- Automatic reconnection on disconnect
- Real-time status updates
- Connection status indicator
- Error handling and retry logic

### Live Updates
- Monitor status changes
- Response time updates
- Last checked timestamps
- Dashboard statistics

## 🎯 Key Features

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly buttons
- Readable typography

### User Experience
- Loading states with spinners
- Error handling with alerts
- Success feedback
- Intuitive navigation

### Performance
- Fast page loads
- Efficient re-renders
- Optimized WebSocket usage
- Minimal bundle size

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_WS_URL=wss://your-api-domain.com
```

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔐 Security

- JWT tokens stored in localStorage
- Automatic token refresh handling
- Protected routes with auth guards
- CORS handling for API requests

## 🎨 Styling Approach

- **No CSS frameworks** - Pure CSS with modern features
- **CSS Grid and Flexbox** - Modern layout techniques
- **CSS Variables** - Consistent theming
- **Responsive units** - rem, vh, vw for scalability

## 📈 Future Enhancements

- Dark mode toggle
- Monitor grouping and filtering
- Historical data charts
- Notification preferences
- Team collaboration features

---

**Built with ❤️ using Next.js 14 and modern web standards**
