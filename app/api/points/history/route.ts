// app/api/points/history/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const houseParam = url.searchParams.get('house');
    
    let whereClause = {};
    
    // Si un filtre de maison est fourni
    if (houseParam && houseParam !== 'all') {
      // Rechercher d'abord la maison par nom
      const house = await prisma.house.findFirst({
        where: {
          name: {
            contains: houseParam,
            mode: 'insensitive'
          }
        }
      });
      
      if (house) {
        whereClause = {
          houseId: house.id
        };
      }
    }
    
    const transactions = await prisma.pointTransaction.findMany({
      where: whereClause,
      include: {
        house: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limiter à 50 transactions pour éviter de surcharger la page
    });
    
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la récupération de l\'historique' },
      { status: 500 }
    );
  }
}