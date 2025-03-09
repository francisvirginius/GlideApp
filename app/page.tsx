"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'

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
  if (lowerName.includes('serd') || lowerName.includes('ravenclaw')) return 'bg-[#00345C]';
  if (lowerName.includes('gryf') || lowerName.includes('gryffindor')) return 'bg-[#A9203E]';
  return 'bg-gray-500'; // Couleur par défaut
};

// Fonction pour obtenir le drapeau de la maison
const getHouseFlag = (name: string): string => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('pouf') || lowerName.includes('hufflepuff')) return '/images/drapeau-poufsouffle.jpg';
  if (lowerName.includes('serp') || lowerName.includes('slytherin')) return '/images/drapeau-serpentard.jpg';
  if (lowerName.includes('serd') || lowerName.includes('ravenclaw')) return '/images/drapeau-serdaigle.jpg';
  if (lowerName.includes('gryf') || lowerName.includes('gryffindor')) return '/images/drapeau-gryffondor.jpg';
  return '/images/gold.png'; // Image par défaut
};

// Fonction pour obtenir la bordure en fonction du rang
const getBorderClass = (rank: number): string => {
  if (rank === 0) return 'border-yellow-400'; // Or pour le 1er
  if (rank === 1) return 'border-gray-300'; // Argent pour le 2ème
  if (rank === 2) return 'border-yellow-700'; // Bronze pour le 3ème
  return 'border-gray-600'; // Gris pour les autres
};

// Fonction pour obtenir l'image de médaille en fonction du rang
const getMedalImage = (rank: number): string => {
  if (rank === 0) return '/images/gold.png';
  if (rank === 1) return '/images/silver.png';
  if (rank === 2) return '/images/bronze.png';
  return '/images/gold.png'; // Image par défaut pour les autres rangs
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
  
  // Rendu spécifique pour chaque position
  const renderHouseCard = (house: House, index: number) => {
    const isFirstPlace = index === 0;
    const borderClass = getBorderClass(index);
    const medalImage = getMedalImage(index);
    const houseFlag = getHouseFlag(house.name);
    
    return (
      <div 
        key={house.id}
        className={`${getHouseColor(house.name)} rounded-lg overflow-hidden shadow-lg relative ${isFirstPlace ? 'scale-115 transform origin-top mb-12' : 'mb-6'}`}
      >
        <div className="flex items-center px-4 py-5">
          <div className={`${isFirstPlace ? 'w-28 h-28' : 'w-24 h-24'} relative mr-6`}>
            {/* Blason avec bordure spécifique au rang */}
            
            
          <div className="relative w-36 h-36 -translate-y-4.5"> 
  {/* Image du cadre (médaille) - cacher pour le dernier (Serdaigle) */}
  {index !== 3 && (
    <Image
      src={medalImage}
      layout="fill"
      objectFit="contain"
      alt="Cadre de médaille"
      className={index > 0 ? "scale-75" : ""} // Réduire la taille pour les positions 2-4
    />
  )}

  {/* Icône de la maison au centre - utiliser les nouvelles icônes */}
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="w-20 h-20 relative">
      <Image
        src={`/images/icone_${house.name.toLowerCase().includes('gryf') ? 'gryffondor' : 
              house.name.toLowerCase().includes('pouf') ? 'poufsoufle' : 
              house.name.toLowerCase().includes('serp') ? 'serpentard' : 
              'serdaigle'}.jpeg`}
        layout="fill"
        objectFit="contain"
        alt="Icône de la maison"
      />
    </div>
  </div>
</div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center">
              <div className={`${isFirstPlace ? 'w-14 h-14 text-3xl m-4' : 'w-12 h-12 text-2xl m-4'} flex items-center justify-center bg-black text-white rounded-full font-bold mr-4 ${borderClass} border-2`}>
                {index + 1}
              </div>
              <h2 className={`${isFirstPlace ? 'text-5xl' : 'text-4xl'} font-bold text-white`}>{house.name}</h2>
            </div>
          </div>
          
          <div className={`text-white ${isFirstPlace ? 'text-7xl' : 'text-6xl'} font-bold mr-25 text-8xl italic`}>
            {house.points}
          </div>
          
          {/* Drapeau spécifique à la maison */}
          <div className={`w-16 h-full absolute right-0 ${borderClass} flex items-center justify-center`}>
            <div className={`${isFirstPlace ? 'w-12 h-12' : 'w-10 h-10'}`}>
              <Image
                src={houseFlag}
                layout="fill"
                objectFit="cover"
                alt="drapeau de maison"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <main className="min-h-screen bg-gray-900 py-8 px-4 relative">
      <h1 className="text-4xl font-bold text-white text-center mb-12">Coupe des Quatre Maisons</h1>
      
      <div className="max-w-4xl mx-auto space-y-6">
        {houses.map((house, index) => renderHouseCard(house, index))}
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