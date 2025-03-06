// app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import HouseRanking from './components/HouseRanking';
import PointForm from './components/PointForm';
import PointHistory from './components/PointHistory';
import { House } from '@prisma/client';

export default function Home() {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  
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
  
  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Coupe des Quatre Maisons</h1>
          <p className="text-xl text-gray-600">Gestion des points des maisons de Poudlard</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <HouseRanking key={`ranking-${refreshKey}`} />
          </div>
          
          <div className="md:col-span-2">
            <div className="space-y-8">
              <PointForm 
                houses={houses} 
                onPointsUpdated={handlePointsUpdated} 
              />
              
              <PointHistory key={`history-${refreshKey}`} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}