// app/api/points/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { houseId, points, comment } = await request.json();
    
    if (!houseId) {
      return NextResponse.json(
        { message: 'L\'ID de la maison est requis' },
        { status: 400 }
      );
    }
    
    if (typeof points !== 'number') {
      return NextResponse.json(
        { message: 'Les points doivent être un nombre' },
        { status: 400 }
      );
    }
    
    // Vérifier que la maison existe
    const house = await prisma.house.findUnique({
      where: { id: houseId }
    });
    
    if (!house) {
      return NextResponse.json(
        { message: 'Maison non trouvée' },
        { status: 404 }
      );
    }
    
    // Créer la transaction en utilisant Prisma transaction
    const [transaction, updatedHouse] = await prisma.$transaction([
      // Créer la transaction de points
      prisma.pointTransaction.create({
        data: {
          houseId,
          points,
          comment: comment || null
        }
      }),
      
      // Mettre à jour les points de la maison
      prisma.house.update({
        where: { id: houseId },
        data: {
          points: { increment: points }
        }
      })
    ]);
    
    return NextResponse.json({ transaction, house: updatedHouse });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des points:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la mise à jour des points' },
      { status: 500 }
    );
  }
}