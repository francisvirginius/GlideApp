// app/components/PointHistory.tsx
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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Historique des Points</h2>
      
      <div className="mb-4">
        <label className="block mb-2 font-medium">Filtrer par maison:</label>
        <select
          className="p-2 border rounded-md"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Toutes les maisons</option>
          <option value="gryffindor">Gryffondor</option>
          <option value="hufflepuff">Poufsouffle</option>
          <option value="ravenclaw">Serdaigle</option>
          <option value="slytherin">Serpentard</option>
        </select>
      </div>
      
      {transactions.length === 0 ? (
        <p className="text-gray-500">Aucune transaction trouvée.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Maison</th>
                <th className="py-2 px-4 text-left">Points</th>
                <th className="py-2 px-4 text-left">Commentaire</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">
                    {format(new Date(transaction.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                  </td>
                  <td className="py-2 px-4">{transaction.house.name}</td>
                  <td className={`py-2 px-4 font-medium ${
                    transaction.points > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.points > 0 ? `+${transaction.points}` : transaction.points}
                  </td>
                  <td className="py-2 px-4">{transaction.comment || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}