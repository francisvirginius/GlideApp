// app/components/HouseRanking.tsx
"use client";

import { useState, useEffect } from 'react';
import { House } from '@prisma/client';

export default function HouseRanking() {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchHouses() {
      try {
        const response = await fetch('/api/houses');
        const data = await response.json();
        // Trier les maisons par points (ordre décroissant)
        const sortedHouses = data.sort((a: House, b: House) => b.points - a.points);
        setHouses(sortedHouses);
      } catch (error) {
        console.error('Erreur lors du chargement des maisons:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchHouses();
  }, []);
  
  if (loading) return <div className="text-center p-4">Chargement du classement...</div>;
  
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Classement des Maisons</h2>
      
      <div className="space-y-4">
        {houses.map((house, index) => (
          <div 
            key={house.id} 
            className={`p-4 rounded-lg shadow flex justify-between items-center ${
              index === 0 ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-white'
            }`}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center bg-gray-800 text-white rounded-full mr-3">
                {index + 1}
              </div>
              <span className="font-bold text-xl">{house.name}</span>
            </div>
            <div className="font-bold text-2xl">{house.points} pts</div>
          </div>
        ))}
      </div>
    </div>
  );
}