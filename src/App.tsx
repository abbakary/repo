import { Routes, Route } from 'react-router-dom'
import { UserProvider } from './lib/user-context'

// Import pages
import Dashboard from './pages/Dashboard'
import CustomersPage from './pages/CustomersPage'
import OrdersPage from './pages/OrdersPage'
import JobCardsPage from './pages/JobCardsPage'
import InvoicesPage from './pages/InvoicesPage'
import InventoryPage from './pages/InventoryPage'
import TimeTrackingPage from './pages/TimeTrackingPage'
import ReportsPage from './pages/ReportsPage'
import UserManagementPage from './pages/UserManagementPage'
import ManagerActivitiesPage from './pages/ManagerActivitiesPage'
import InquiriesPage from './pages/InquiriesPage'

function App() {
  return (
    <UserProvider>
      <div className="font-sans">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/job-cards" element={<JobCardsPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/inquiries" element={<InquiriesPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/time-tracking" element={<TimeTrackingPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/user-management" element={<UserManagementPage />} />
          <Route path="/manager-activities" element={<ManagerActivitiesPage />} />
        </Routes>
      </div>
    </UserProvider>
  )
}

export default App
