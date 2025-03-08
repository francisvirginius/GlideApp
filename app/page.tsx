"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Type pour les maisons
interface House {
  id: number;
  name: string;
  points: number;
}

// Fonction pour obtenir la couleur de fond selon le nom de la maison
const getHouseColor = (name: string): string => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('pouf') || lowerName.includes('hufflepuff')) return 'bg-yellow-500';
  if (lowerName.includes('serp') || lowerName.includes('slytherin')) return 'bg-emerald-700';
  if (lowerName.includes('serd') || lowerName.includes('ravenclaw')) return 'bg-blue-800';
  if (lowerName.includes('gryf') || lowerName.includes('gryffindor')) return 'bg-red-700';
  return 'bg-gray-500'; // Couleur par défaut
};

export default function Home() {
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
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-2xl">Chargement du classement...</div>
      </div>
    );
  }
  
  return (
    <main className="min-h-screen bg-gray-900 py-8 px-4 relative">
      <h1 className="text-4xl font-bold text-white text-center mb-12">Coupe des Quatre Maisons</h1>
      
      <div className="max-w-4xl mx-auto space-y-6">
        {houses.map((house, index) => (
          <div 
            key={house.id}
            className={`${getHouseColor(house.name)} rounded-lg overflow-hidden shadow-lg relative`}
          >
            <div className="flex items-center px-4 py-5">
              <div className="w-24 h-24 relative mr-6">
                {/* Emplacement pour le blason - dans un vrai projet, vous ajouteriez les vraies images */}
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-yellow-200">
                  <div className={`w-full h-full ${getHouseColor(house.name)}`}></div>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="w-12 h-12 flex items-center justify-center bg-black text-white rounded-full text-2xl font-bold mr-4">
                    {index + 1}
                  </div>
                  <h2 className="text-4xl font-bold text-white">{house.name}</h2>
                </div>
              </div>
              
              <div className="text-white text-7xl font-bold mr-10">
                {house.points}
              </div>
              
              {/* Élément décoratif à droite (simulé) */}
              <div className="w-16 h-full absolute right-0 border-l-4 border-yellow-200 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Bouton de navigation vers la page d'administration */}
      <Link 
        href="/admin" 
        className="fixed bottom-10 right-10 bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-gray-200 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </Link>
    </main>
  );
}