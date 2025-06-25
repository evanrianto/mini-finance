# Personal Finance Tracker

A beautiful, modern personal finance tracking application built with Next.js, designed specifically for individual use with a focus on simplicity and powerful analytics.

## ✨ Features

### 💰 **Income & Expense Tracking**
- Easy-to-use transaction form with income/expense toggle
- Categorized transactions with predefined categories
- Tag support for better organization
- Date tracking for all transactions

### 🎨 **Beautiful Modern UI**
- Clean, responsive design optimized for 16:9 displays
- Perfect mobile experience
- Dark mode support
- Smooth animations and transitions
- Modern component library (Tailwind CSS + custom components)

### 📊 **Advanced Analytics**
- **Overview Dashboard**: Key financial metrics at a glance
- **Monthly Trends**: Income vs expenses over time
- **Category Breakdown**: Pie charts showing spending patterns
- **Comparative Analysis**: Bar charts for month-to-month comparison
- **Top Categories**: Detailed spending analysis

### 📱 **Responsive Design**
- Optimized for 16:9 ratio displays
- Perfect mobile and tablet experience
- Container-based layout that centers beautifully on ultrawide monitors
- Touch-friendly interface

### 🔧 **Single User Focus**
- No authentication complexity
- Local storage for data persistence
- Sample data included for immediate exploration
- Quick setup and use

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start the development server:**
```bash
npm run dev
```

3. **Open your browser:**
Navigate to `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

## 🏗️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Components**: Custom UI components with Headless UI
- **Charts**: Recharts for beautiful data visualization
- **Icons**: Lucide React icons
- **Data Storage**: Local Storage (browser-based)
- **TypeScript**: Full type safety

## 📊 Analytics Features

### Dashboard Stats Cards
- **Total Income**: Lifetime income with growth indicators
- **Total Expenses**: Lifetime expenses with trends
- **Net Income**: Overall financial position
- **This Month**: Current month's performance

### Interactive Charts
1. **Line Charts**: Monthly income vs expense trends
2. **Pie Charts**: Category spending breakdown with percentages
3. **Bar Charts**: Month-to-month comparisons
4. **Category Lists**: Top spending categories with color coding

### Smart Insights
- Month-over-month growth percentages
- Category spending analysis
- Visual indicators for positive/negative trends
- Automatic color coding (green for income, red for expenses)

## 🎯 16:9 Display Optimization

The app is specifically optimized for 16:9 displays while maintaining excellent responsiveness:

- **Desktop (1920x1080)**: Perfect fit with 1600px container
- **Laptop (1366x768)**: Responsive grid adjustments
- **Ultrawide (21:9)**: Centered container with elegant margins
- **Mobile/Tablet**: Single-column responsive layout

## 💡 Usage Tips

### Adding Transactions
1. Click the "Add Transaction" button
2. Choose Income or Expense
3. Enter amount, description, and category
4. Optionally add tags for better organization
5. Set the date (defaults to today)

### Viewing Analytics
- **Overview**: Quick dashboard with key metrics
- **Transactions**: Complete transaction history
- **Analytics**: Detailed charts and breakdowns

### Categories
**Income Categories:**
- Salary, Freelance, Investment, Business, Other Income

**Expense Categories:**
- Housing, Food, Transportation, Healthcare, Entertainment, Shopping, Utilities, Other Expense

## 🎨 Design Features

### Color Scheme
- **Primary**: Green gradient for income
- **Secondary**: Red for expenses
- **Accent**: Blue for neutral elements
- **Background**: Light gradient with dark mode support

### Responsive Breakpoints
- **Mobile**: < 768px (single column)
- **Tablet**: 768px - 1024px (two columns)
- **Desktop**: 1024px - 1920px (full layout)
- **Ultrawide**: > 1920px (centered container)

## 📂 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx           # Main dashboard
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # Reusable UI components
│   ├── AnalyticsCharts.tsx # Chart components
│   ├── StatsCards.tsx     # Metric cards
│   ├── TransactionForm.tsx # Add transaction form
│   └── TransactionList.tsx # Transaction display
├── hooks/
│   └── useFinanceData.ts  # Data management hook
└── lib/
    ├── types.ts           # TypeScript definitions
    └── utils.ts          # Utility functions
```

**Enjoy tracking your finances beautifully! 💰✨**
