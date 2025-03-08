"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Transaction {
  id: number;
  houseId: number;
  points: number;
  comment: string | null;
  createdAt: string;
  house: {
    name: string;
  };
}

// Fonction pour obtenir la couleur selon le nom de la maison
const getHouseColor = (name: string): string => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('pouf') || lowerName.includes('hufflepuff')) return 'bg-yellow-500';
  if (lowerName.includes('serp') || lowerName.includes('slytherin')) return 'bg-emerald-700';
  if (lowerName.includes('serd') || lowerName.includes('ravenclaw')) return 'bg-blue-800';
  if (lowerName.includes('gryf') || lowerName.includes('gryffindor')) return 'bg-red-700';
  return 'bg-gray-500'; // Couleur par défaut
};

export default function PointHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  
  useEffect(() => {
    async function fetchTransactions() {
      try {
        const url = filter === 'all' 
          ? '/api/points/history' 
          : `/api/points/history?house=${filter}`;
          
        const response = await fetch(url);
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'historique:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchTransactions();
  }, [filter]);
  
  if (loading) return <div className="text-center p-4">Chargement de l'historique...</div>;
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Historique des Points</h2>
      
      <div className="mb-6">
        <label className="block mb-2 font-medium">Filtrer par maison:</label>
        <select
          className="p-2 border rounded-md bg-white"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Toutes les maisons</option>
          <option value="gryffondor">Gryffondor</option>
          <option value="poufsouffle">Poufsouffle</option>
          <option value="serdaigle">Serdaigle</option>
          <option value="serpentard">Serpentard</option>
        </select>
      </div>
      
      {transactions.length === 0 ? (
        <div className="bg-gray-50 p-8 text-center rounded-lg">
          <p className="text-gray-500 text-lg">Aucune transaction trouvée.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Maison
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commentaire
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(transaction.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${getHouseColor(transaction.house.name)} mr-2`}></div>
                        <span className="text-sm font-medium text-gray-900">{transaction.house.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-sm leading-5 font-medium rounded-full ${
                        transaction.points > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.points > 0 ? `+${transaction.points}` : transaction.points}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {transaction.comment || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}