import Sidebar from "./sidebar"

export  function MainLayout({ children }) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    )
  }
  
  // app/(auth)/layout.js - Layout for auth pages without sidebar
  export  function AuthLayout({ children }) {
    return (
      <div className="w-full">
        <main>
          {children}
        </main>
      </div>
    )
  }