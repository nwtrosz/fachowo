export interface Project {
  id: number;
  title: string;
  category: 'Komercyjne' | 'Mieszkaniowe' | 'Podłogi' | 'Inne';
  image: string;
  description: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: 'Remont Biura w Centrum',
    category: 'Komercyjne',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800',
    description: 'Nowoczesne wykończenie biura open space',
  },
  {
    id: 2,
    title: 'Remont Mieszkania',
    category: 'Mieszkaniowe',
    image: 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?auto=format&fit=crop&w=800',
    description: 'Kompleksowy remont mieszkania z nowoczesnym wykończeniem',
  },
  {
    id: 3,
    title: 'Układanie Podłóg',
    category: 'Podłogi',
    image: 'https://images.unsplash.com/photo-1581858726768-fdff21ac91a1?auto=format&fit=crop&w=800',
    description: 'Montaż i wykończenie podłóg drewnianych',
  },
  {
    id: 4,
    title: 'Salon Fryzjerski',
    category: 'Komercyjne',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800',
    description: 'Adaptacja lokalu pod ekskluzywny salon fryzjerski'
  },
  {
    id: 5,
    title: 'Apartament w Kamienicy',
    category: 'Mieszkaniowe',
    image: 'https://images.unsplash.com/photo-1502005229766-939cb9342722?auto=format&fit=crop&w=800',
    description: 'Renowacja zabytkowego apartamentu ze sztukaterią'
  }
];
