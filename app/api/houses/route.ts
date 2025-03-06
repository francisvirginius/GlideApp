// app/api/houses/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const houses = await prisma.house.findMany({
      orderBy: {
        points: 'desc'
      }
    });
    
    return NextResponse.json(houses);
  } catch (error) {
    console.error('Erreur lors de la récupération des maisons:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la récupération des maisons' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { message: 'Le nom de la maison est requis' },
        { status: 400 }
      );
    }
    
    const existingHouse = await prisma.house.findUnique({
      where: { name }
    });
    
    if (existingHouse) {
      return NextResponse.json(
        { message: 'Cette maison existe déjà' },
        { status: 400 }
      );
    }
    
    const newHouse = await prisma.house.create({
      data: { name, points: 0 }
    });
    
    return NextResponse.json(newHouse, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la maison:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la création de la maison' },
      { status: 500 }
    );
  }
}