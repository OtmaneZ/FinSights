import FinancialDashboard from '@/components/FinancialDashboard'

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900">FinSight</h1>
                            <span className="ml-2 text-sm text-gray-500">Dashboard</span>
                        </div>
                        <nav className="flex space-x-8">
                            <a href="/" className="text-gray-500 hover:text-gray-900">Accueil</a>
                            <a href="/dashboard" className="text-blue-600 font-medium">Dashboard</a>
                            <a href="/copilot" className="text-gray-500 hover:text-gray-900">Copilote IA</a>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <FinancialDashboard />
            </main>
        </div>
    )
}