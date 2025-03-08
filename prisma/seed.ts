import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Vérifier si les maisons existent déjà
  const houseCount = await prisma.house.count();
  
  if (houseCount === 0) {
    // Créer les quatre maisons avec les noms exacts de la maquette
    const houses = [
      { name: 'Poufsouffle', points: 0 },
      { name: 'Serpentard', points: 0 },
      { name: 'Serdaigle', points: 0 },
      { name: 'Gryffondor', points: 0 }
    ];
    
    for (const house of houses) {
      await prisma.house.create({
        data: house
      });
    }
    
    console.log('Les maisons ont été initialisées avec succès!');
  } else {
    console.log('Les maisons existent déjà dans la base de données.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });