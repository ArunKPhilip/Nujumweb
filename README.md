# NUJJUM - Healthcare Accessibility Platform

A comprehensive web platform designed for persons with disabilities to provide accessible healthcare access, benefits verification, assistive technology, education, community support, and emergency services in the UAE.

## 🌟 Features

### Core Modules
- **🏥 NUJJUM Care**: Healthcare access and appointment booking
- **👥 Community**: Social networking and support groups
- **🏛️ Programs**: Government and private benefit programs
- **🛒 Marketplace**: Assistive technology and accessibility devices
- **📚 Education**: Training programs and career development
- **📞 Service Requests**: Support request management
- **🚨 SOS Emergency**: Emergency alert system

### Accessibility Features
- **WCAG 2.1 AA Compliance**: Full accessibility standards
- **Multi-language Support**: English and Arabic with RTL layout
- **Accessibility Modes**: Support for blind, deaf, and motor-impaired users
- **Dark Mode**: Theme switching with persistent preferences
- **Mobile-First Design**: Optimized for mobile devices (≤390px)

### Technical Features
- **Progressive Web App**: Installable web application
- **Offline Support**: Core functionality works offline
- **Secure Authentication**: Document verification and account creation
- **Geolocation Services**: Location-based healthcare access
- **Emergency Integration**: SMS/WhatsApp emergency notifications

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nujjum-web.git
   cd nujjum-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Building for Production

```bash
npm run build
```

### GitHub Pages Deployment

1. **Update package.json homepage field** with your GitHub username:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME"
   ```

2. **Install gh-pages package** (already included):
   ```bash
   npm install
   ```

3. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```

4. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Set source to "Deploy from a branch"
   - Select "gh-pages" branch

## 📱 Mobile-First Design

The platform is designed mobile-first with a ≤390px width constraint, ensuring optimal usability on smartphones while being fully responsive for tablets and desktop.

## 🌍 Multi-language Support

- **English (LTR)**: Default interface
- **Arabic (RTL)**: Native right-to-left layout support
- Responsive to user language preferences

## 🎨 Themes & Accessibility

### Color Schemes
- **Light Mode**: Clean, high-contrast design
- **Dark Mode**: Easy on the eyes in low-light conditions
- **Accessibility Modes**: Specialized theming for different impairments

### Touch Targets
- Minimum 44px touch targets (WCAG AA compliant)
- Motor-impaired mode: 64px+ touch targets

## 🔧 Architecture

### Tech Stack
- **Frontend**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router v6
- **State Management**: React Context
- **Styling**: Emotion (CSS-in-JS)
- **Build Tool**: Create React App

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Header, Navigation, etc.)
│   └── ui/            # Basic UI components
├── context/           # React Context providers
├── pages/            # Page components
├── theme/            # Theme and styling configuration
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## 🎯 Key User Flows

1. **Account Creation**
   - User registration with document upload
   - Verification workflow
   - Accessibility preference setup

2. **Healthcare Access**
   - Search for healthcare providers
   - Book appointments
   - View medical history

3. **Emergency Services**
   - One-tap SOS button
   - GPS location sharing
   - Emergency contact notifications

## 📋 Development Guidelines

### Code Standards
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Accessibility-first development

### Accessibility Checklist
- [ ] All interactive elements have sufficient touch targets
- [ ] Color contrast ratios meet WCAG AA standards
- [ ] Keyboard navigation works for all features
- [ ] Screen reader compatibility verified
- [ ] Multi-language support implemented

## 🏗️ Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For questions, support, or contributions, please reach out to the development team.

---

**NUJJUM Platform** - Empowering accessibility and healthcare access for all persons with disabilities in the UAE.
