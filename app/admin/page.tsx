"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PointForm from '../components/PointForm';
import PointHistory from '../components/PointHistory';
import { House } from '@prisma/client';

export default function AdminPage() {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<'add' | 'history'>('add');
  
  useEffect(() => {
    async function fetchHouses() {
      try {
        const response = await fetch('/api/houses');
        const data = await response.json();
        setHouses(data);
      } catch (error) {
        console.error('Erreur lors du chargement des maisons:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchHouses();
  }, [refreshKey]);
  
  const handlePointsUpdated = () => {
    // Incrémenter la clé pour forcer le rechargement des données
    setRefreshKey(prevKey => prevKey + 1);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-800 text-2xl">Chargement...</div>
      </div>
    );
  }
  
  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Administration - Coupe des Quatre Maisons</h1>
          <Link 
            href="/"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Retour au classement
          </Link>
        </div>
        
        {/* Onglets */}
        <div className="flex mb-8 border-b">
          <button
            className={`py-3 px-6 font-medium text-lg ${activeTab === 'add' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('add')}
          >
            Ajouter/Retirer des points
          </button>
          <button
            className={`py-3 px-6 font-medium text-lg ${activeTab === 'history' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('history')}
          >
            Historique
          </button>
        </div>
        
        {/* Contenu des onglets */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'add' ? (
            <PointForm 
              houses={houses} 
              onPointsUpdated={handlePointsUpdated} 
            />
          ) : (
            <PointHistory key={`history-${refreshKey}`} />
          )}
        </div>
      </div>
    </main>
  );
}