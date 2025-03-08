"use client";

import { useState } from 'react';
import { House } from '@prisma/client';

interface PointFormProps {
  houses: House[];
  onPointsUpdated: () => void;
}

// Fonction pour obtenir la couleur selon le nom de la maison
const getHouseColor = (name: string): { bg: string, text: string, border: string } => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('pouf') || lowerName.includes('hufflepuff')) 
    return { bg: 'bg-yellow-500', text: 'text-yellow-500', border: 'border-yellow-500' };
    
  if (lowerName.includes('serp') || lowerName.includes('slytherin')) 
    return { bg: 'bg-emerald-700', text: 'text-emerald-700', border: 'border-emerald-700' };
    
  if (lowerName.includes('serd') || lowerName.includes('ravenclaw')) 
    return { bg: 'bg-blue-800', text: 'text-blue-800', border: 'border-blue-800' };
    
  if (lowerName.includes('gryf') || lowerName.includes('gryffindor')) 
    return { bg: 'bg-red-700', text: 'text-red-700', border: 'border-red-700' };
    
  return { bg: 'bg-gray-500', text: 'text-gray-500', border: 'border-gray-500' };
};

export default function PointForm({ houses, onPointsUpdated }: PointFormProps) {
  const [selectedHouse, setSelectedHouse] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedHouse) {
      setError('Veuillez sélectionner une maison');
      return;
    }
    
    if (points === 0) {
      setError('Veuillez entrer un nombre de points à ajouter ou retirer');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          houseId: selectedHouse,
          points,
          comment,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Une erreur est survenue');
      }
      
      // Réinitialiser le formulaire
      setSelectedHouse(0);
      setPoints(0);
      setComment('');
      setSuccess(true);
      
      // Informer le parent que les points ont été mis à jour
      onPointsUpdated();
      
      // Faire disparaître le message de succès après 3 secondes
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedHouseObj = houses.find(h => h.id === selectedHouse);
  const houseColors = selectedHouseObj ? getHouseColor(selectedHouseObj.name) : { bg: '', text: '', border: '' };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Ajouter ou Retirer des Points</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Points mis à jour avec succès!
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">Maison</label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {houses.map((house) => (
              <div
                key={house.id}
                className={`
                  p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${selectedHouse === house.id 
                    ? `${getHouseColor(house.name).border} ${getHouseColor(house.name).bg} text-white` 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                onClick={() => setSelectedHouse(house.id)}
              >
                <div className="font-bold text-lg">{house.name}</div>
                <div className="mt-1">{house.points} points</div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Points</label>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold
                ${points < 0 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800'}
              `}
              onClick={() => setPoints(prev => (prev <= 0 ? prev - 1 : -1))}
            >
              -
            </button>
            
            <input
              type="number"
              className={`w-20 h-16 text-center text-2xl font-bold border-2 rounded-md
                ${points > 0 ? 'border-green-500 text-green-600' : 
                  points < 0 ? 'border-red-500 text-red-600' : 
                  'border-gray-300 text-gray-700'}
              `}
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
            />
            
            <button
              type="button"
              className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold
                ${points > 0 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}
              `}
              onClick={() => setPoints(prev => (prev >= 0 ? prev + 1 : 1))}
            >
              +
            </button>
          </div>
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Commentaire</label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Raison de l'ajout ou du retrait de points..."
          />
        </div>
        
        <button
          type="submit"
          className={`py-3 px-6 rounded-md text-white font-bold transition-colors
            ${selectedHouse ? houseColors.bg : 'bg-gray-400 cursor-not-allowed'}
          `}
          disabled={isLoading || !selectedHouse}
        >
          {isLoading ? 'Chargement...' : points > 0 
            ? `Ajouter ${points} points` 
            : points < 0 
              ? `Retirer ${Math.abs(points)} points` 
              : 'Soumettre'}
        </button>
      </form>
    </div>
  );
}