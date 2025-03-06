// app/components/PointForm.tsx
"use client";

import { useState } from 'react';
import { House } from '@prisma/client';

interface PointFormProps {
  houses: House[];
  onPointsUpdated: () => void;
}

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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Ajouter/Retirer des Points</h2>
      
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
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Maison</label>
          <select
            className="w-full p-2 border rounded-md"
            value={selectedHouse}
            onChange={(e) => setSelectedHouse(parseInt(e.target.value))}
          >
            <option value={0}>Sélectionnez une maison</option>
            {houses.map((house) => (
              <option key={house.id} value={house.id}>
                {house.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 font-medium">Points (négatif pour retirer)</label>
          <input
            type="number"
            className="w-full p-2 border rounded-md"
            value={points}
            onChange={(e) => setPoints(parseInt(e.target.value))}
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 font-medium">Commentaire</label>
          <textarea
            className="w-full p-2 border rounded-md"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Pourquoi ajouter/retirer des points?"
          />
        </div>
        
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? 'Chargement...' : 'Soumettre'}
        </button>
      </form>
    </div>
  );
}