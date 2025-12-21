export interface IMovie {
  _id?: any;
  title: string;
  year: number;
  posterUrl: string;
  synopsis: string;
  director: string;
  averageRating: number; // Promedio de ratings de calidad (1-5)
  christmasRating: number; // 🎄 NAVIDÓMETRO - Promedio de ratings navideños (1-5)
  isKidFriendly: boolean; // 🎅 Indica si mantiene la magia navideña
  reviewCount: number;
  christmasVotes: number;
  platforms?: string[]; // Plataformas donde se puede ver (Netflix, Prime Video, etc.)
  createdAt?: Date;
  updatedAt?: Date;
}
