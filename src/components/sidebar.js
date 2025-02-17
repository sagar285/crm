// components/Sidebar.jsx
"use client";
import React from 'react';
import Link from 'next/link';
import { Home, Users, Settings, HelpCircle } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { title: 'posts', icon: <Home size={20} />, path: '/' },
    { title: 'plugins', icon: <Users size={20} />, path: '/admin/plugin' },
    { title: 'installedplugin', icon: <Settings size={20} />, path: '/install/plugin' },
    { title: 'Help', icon: <HelpCircle size={20} />, path: '/help' },
  ];

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-800 text-white">
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-center border-b border-gray-700">
        <h1 className="text-xl font-bold">CRM</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => (
          <Link
            key={item.title}
            href={item.path}
            className="flex items-center rounded-lg px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>

      {/* Footer Section */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-gray-600"></div>
          <div>
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-gray-400">john@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;