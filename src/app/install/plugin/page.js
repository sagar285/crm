'use client'

import React, { useEffect } from "react";
import { Loader2, Package, Trash2, Settings } from "lucide-react";
import Link from "next/link";
import { MainLayout } from "@/components/testLayout";
import { useRouter } from "next/navigation";

const PluginsPage = () => {
  const [userPlugins, setUserPlugins] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserPlugins = async () => {
      try {
        const response = await fetch("/api/user/plugins");
        if (!response.ok) {
          throw new Error("Failed to fetch plugins");
        }
        const data = await response.json();
        setUserPlugins(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserPlugins();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Installed Plugins</h1>
        <p className="text-gray-600">Manage your installed plugins and their settings</p>
      </div>

      {userPlugins.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No plugins installed</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by installing your first plugin</p>
          <div className="mt-6">
            <button onClick={() => router.push("/admin/plugin")} className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Browse Plugins
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userPlugins.map((plugin) => (
            <Link href={`plugin/${plugin.id}`}
            key={plugin.id}
            >
            <div 
              key={plugin.id} 
              className="relative rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* {plugin.icon && (
                    <img 
                      src={plugin.icon} 
                      alt={`${plugin.name} icon`}
                      className="h-10 w-10 rounded-lg"
                    />
                  )} */}
                  <div>
                    <h3 className="font-medium text-gray-900">{plugin.plugin.name}</h3>
                    <p className="text-sm text-gray-500">v{plugin.plugin.description}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                    title="Plugin settings"
                  >
                    <Settings size={18} />
                  </button>
                  <button 
                    className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
                    title="Uninstall plugin"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <p className="mt-2 text-sm text-gray-600">
                {plugin.description}
              </p>

              <div className="mt-4 flex items-center space-x-4">
                {plugin.author && (
                  <span className="text-xs text-gray-500">
                    By {plugin.author}
                  </span>
                )}
                {plugin.lastUpdated && (
                  <span className="text-xs text-gray-500">
                    Updated {new Date(plugin.lastUpdated).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            </Link>
          ))}
        </div>
      )}
    </div>
    </MainLayout>
  );
};

export default PluginsPage;