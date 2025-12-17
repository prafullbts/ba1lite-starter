# BTS BA1 Lite Business Simulation

A React-based business simulation template for BTS consultants to build custom client simulations.

## Features

### 🎨 Dynamic Color System (Momenta Structure)
The application now uses a centralized color management system based on the Momenta color structure:

- **Configurable Themes**: Switch between BTS colors and custom client colors
- **Light/Dark Mode**: Configurable theme mode (set by developer, not user-switchable)  
- **WCAG Compliant**: All color combinations meet accessibility standards
- **Dynamic CSS Variables**: Colors are injected at runtime for maximum flexibility

#### Color Configuration
Edit `src/Sim/colors.ts` to configure the simulation's appearance:

```typescript
// Theme configuration - Set this to configure the simulation's appearance
export const THEME_CONFIG = {
  mode: 'dark' as 'light' | 'dark',
  useCustomColors: false, // Set to true to use custom client colors
};
```

#### Available Colors
- **Primary/Secondary**: Main brand colors  
- **Accent Colors 1-6**: Mapped to BTS brand equivalents by default
- **Semantic Colors**: Information, confirmation, attention
- **Dynamic Gradients**: Built using color variables

### 🏗️ Architecture

The project follows strict separation of concerns:

- **`src/Sim/colors.ts`**: Centralized color management
- **`src/Sim/Calcs.ts`**: All metric calculations and business logic
- **`src/Sim/Const.ts`**: Configuration objects and type definitions
- **`src/Sim/Content.ts`**: All text content and labels
- **`src/Sim/Dec_and_State.tsx`**: State management and simulation context

### 🧭 Navigation Flow

The simulation follows a structured flow:
1. Strategy Planning
2. Dashboard (with KPI overview)
3. Strategic Initiative Selection
4. Core Decision Screens (Investment Levels)
5. Event Scenarios
6. Performance Analysis & Results

### 📊 KPI Tracking

Real-time KPI bar displays:
- Financial metrics (Revenue, Profit, etc.)
- Operational metrics (CSAT, ESAT, etc.)
- Visual gauges for key performance indicators
- Change indicators with animations

## Getting Started

1. **Install dependencies**: `npm install`
2. **Start development server**: `npm run dev`
3. **Configure colors**: Edit `src/Sim/colors.ts` for client branding
4. **Customize content**: Update `src/Sim/Content.ts` with client-specific text
5. **Adjust calculations**: Modify `src/Sim/Calcs.ts` for business logic

## Building Custom Simulations

### Step 1: Color & Branding
```typescript
// In src/Sim/colors.ts
export const THEME_CONFIG = {
  mode: 'light', // or 'dark'
  useCustomColors: true, // Use custom client colors
};

// Customize client colors
const CUSTOM_COLORS = {
  primary: '#009EDB',
  secondary: '#D3421A',
  // ... other colors
};
```

### Step 2: Content Updates
Update `src/Sim/Content.ts` with client-specific:
- Initiative descriptions
- Event scenarios
- Metric labels
- UI text

### Step 3: Business Logic
Modify `src/Sim/Calcs.ts` to implement client's:
- Metric calculation formulas
- Initiative impacts
- Event outcomes
- Round progression logic

### Step 4: Configuration
Adjust `src/Sim/Const.ts` for:
- Starting values
- Constraints (FTE limits, initiative selections)
- Round structure

## Technology Stack

- **React 18** with TypeScript
- **Tailwind CSS** with dynamic color system
- **Radix UI** components
- **React Router** for navigation
- **Recharts** for data visualization
- **Vite** for fast development

## Best Practices

- ✅ All colors use semantic tokens from the design system
- ✅ Text content imported from centralized Content.ts
- ✅ Business logic isolated in Calcs.ts
- ✅ Configuration values in Const.ts
- ✅ WCAG AA compliant color contrasts
- ✅ Responsive design for all screen sizes

---

*Built with ❤️ for BTS consultants creating impactful business simulations*
