import mongoose from "mongoose";
import dotenv from "dotenv";
import { Movie } from "../models/Movie";
import { User } from "../models/User";
import { Review } from "../models/Review";
import bcrypt from "bcrypt";

dotenv.config();

const movies = [
  {
    title: "Mi Pobre Angelito (Home Alone)",
    year: 1990,
    posterUrl: "https://image.tmdb.org/t/p/w500/onTSipZ8R3bliBdKfPtsDuHTdlL.jpg",
    synopsis:
      "Kevin McCallister, un niño de 8 años, es accidentalmente dejado en casa cuando su familia se va de vacaciones a París. Debe defender su casa de dos torpes ladrones usando ingeniosas trampas.",
    director: "Chris Columbus",
    averageRating: 4.5,
    christmasRating: 4.8,
    isKidFriendly: true,
    reviewCount: 0,
    christmasVotes: 0,
    platforms: ["Disney+", "Star+"],
  },
  {
    title: "El Grinch (How the Grinch Stole Christmas)",
    year: 2000,
    posterUrl: "https://www.themoviedb.org/t/p/w1280/1WZbbPApEivA421gCOluuzMMKCk.jpg",
    synopsis:
      "El Grinch es una criatura verde y gruñona que vive en lo alto de una montaña con su perro Max. Odia la Navidad y planea robarla de Whoville, pero una niña llamada Cindy Lou Who podría cambiar su corazón.",
    director: "Ron Howard",
    averageRating: 4.0,
    christmasRating: 4.5,
    isKidFriendly: true,
    reviewCount: 0,
    christmasVotes: 0,
    platforms: ["Netflix", "Prime Video"],
  },
  {
    title: "Elf",
    year: 2003,
    posterUrl: "https://image.tmdb.org/t/p/w500/oKJLbTfGZWxorCgaZ7kAZOm2gHc.jpg",
    synopsis:
      "Buddy fue criado por elfos en el Polo Norte, pero cuando descubre que es humano, viaja a Nueva York para encontrar a su padre biológico y descubrir su verdadera identidad.",
    director: "Jon Favreau",
    averageRating: 4.6,
    christmasRating: 4.7,
    isKidFriendly: true,
    reviewCount: 0,
    christmasVotes: 0,
    platforms: ["HBO Max", "Prime Video"],
  },
  {
    title: "The Nightmare Before Christmas",
    year: 1993,
    posterUrl: "https://image.tmdb.org/t/p/w500/lJZBnr4TFzyuCiK0rPHYGJ96B0H.jpg",
    synopsis:
      "Jack Skellington, el rey de Halloween Town, descubre Christmas Town y queda fascinado. Decide secuestrar a Santa Claus y tomar su lugar, pero las cosas no salen como esperaba.",
    director: "Henry Selick",
    averageRating: 4.5,
    christmasRating: 4.6,
    isKidFriendly: true,
    reviewCount: 0,
    christmasVotes: 0,
    platforms: ["Disney+"],
  },
  {
    title: "Love Actually",
    year: 2003,
    posterUrl: "https://image.tmdb.org/t/p/w500/1ODdWLpyOnIVl0l67GrdaFDlJGf.jpg",
    synopsis:
      "Varias historias de amor entrelazadas se desarrollan en Londres durante las semanas previas a la Navidad, explorando diferentes aspectos del amor romántico.",
    director: "Richard Curtis",
    averageRating: 4.2,
    christmasRating: 4.3,
    isKidFriendly: true,
    reviewCount: 0,
    christmasVotes: 0,
    platforms: ["Prime Video", "Peacock"],
  },
  {
    title: "Bad Santa",
    year: 2003,
    posterUrl: "https://image.tmdb.org/t/p/w500/1YZQpfDiR5C6Kh9VRIXvC7cqvYZ.jpg",
    synopsis:
      "Willie es un ladrón alcohólico que se disfraza de Santa Claus cada Navidad para robar tiendas. Su vida cambia cuando conoce a un niño inocente que cree que es el verdadero Santa.",
    director: "Terry Zwigoff",
    averageRating: 3.5,
    christmasRating: 3.2,
    isKidFriendly: false,
    reviewCount: 0,
    christmasVotes: 0,
    platforms: ["Prime Video", "Paramount+"],
  },
  {
    title: "Klaus",
    year: 2019,
    posterUrl: "https://image.tmdb.org/t/p/w500/5CzqUCHsq80OdSPHlV5bF8AIsU7.jpg",
    synopsis:
      "Un cartero egoísta es enviado a un pueblo helado donde conoce a Klaus, un misterioso carpintero que vive solo y fabrica juguetes. Juntos traerán alegría a un pueblo dividido.",
    director: "Sergio Pablos",
    averageRating: 4.8,
    christmasRating: 4.9,
    isKidFriendly: true,
    reviewCount: 0,
    christmasVotes: 0,
    platforms: ["Netflix"],
  },
  {
    title: "Jingle All the Way",
    year: 1996,
    posterUrl: "https://image.tmdb.org/t/p/w500/wIdSHCw9vDgvTJCkN2hMChRnuWM.jpg",
    synopsis:
      "Un padre desesperado busca el juguete más popular de la temporada en la víspera de Navidad, enfrentándose a otros padres en una loca carrera por conseguirlo.",
    director: "Brian Levant",
    averageRating: 3.8,
    christmasRating: 4.1,
    isKidFriendly: true,
    reviewCount: 0,
    christmasVotes: 0,
    platforms: ["Disney+", "Hulu"],
  },
  {
    title: "The Polar Express",
    year: 2004,
    posterUrl: "https://image.tmdb.org/t/p/w500/oPBEnNkMfYgJ5vZqJ3V3a4OuRuY.jpg",
    synopsis:
      "Un niño escéptico aborda un tren mágico que lo lleva al Polo Norte en Nochebuena. Durante el viaje, aprende sobre la amistad, la valentía y el espíritu de la Navidad.",
    director: "Robert Zemeckis",
    averageRating: 4.3,
    christmasRating: 4.5,
    isKidFriendly: true,
    reviewCount: 0,
    christmasVotes: 0,
    platforms: ["HBO Max", "Prime Video"],
  },
  {
    title: "Die Hard",
    year: 1988,
    posterUrl: "https://image.tmdb.org/t/p/w500/yFihWxQcmqcaBR31QM6Y8gT6aYV.jpg",
    synopsis:
      "El policía John McClane se encuentra atrapado en un edificio durante una fiesta de Navidad cuando terroristas toman rehenes. Debe usar su astucia para salvar a los rehenes, incluida su esposa.",
    director: "John McTiernan",
    averageRating: 4.7,
    christmasRating: 2.8,
    isKidFriendly: false,
    reviewCount: 0,
    christmasVotes: 0,
    platforms: ["Hulu", "Prime Video"],
  },
];

async function seedDatabase() {
  try {
    const connectionString = process.env.MONGODB_URI;

    if (!connectionString) {
      throw new Error("MONGODB_URI not found in environment variables");
    }

    await mongoose.connect(connectionString);
    console.log("MongoDB connected");

    // Clear existing data
    console.log("Clearing existing data...");
    await Movie.deleteMany({});
    await Review.deleteMany({});
    await User.deleteMany({});

    // Insert movies
    console.log("Inserting movies...");
    const insertedMovies = await Movie.insertMany(movies);
    console.log(`${insertedMovies.length} movies inserted successfully`);

    // Create test users
    console.log("Creating test users...");
    const hashedPassword = await bcrypt.hash("password123", 10);

    const testUsers = [
      {
        email: "user1@test.com",
        username: "ChristmasFan",
        password: hashedPassword,
      },
      {
        email: "user2@test.com",
        username: "MovieCritic",
        password: hashedPassword,
      },
      {
        email: "admin@test.com",
        username: "Admin",
        password: hashedPassword,
      },
    ];

    const insertedUsers = await User.insertMany(testUsers);
    console.log(`${insertedUsers.length} test users created`);

    // Create sample reviews
    console.log("Creating sample reviews...");
    const sampleReviews = [
      {
        movieId: insertedMovies[0]._id, // Home Alone
        userId: insertedUsers[0]._id,
        rating: 5,
        christmasRating: 5,
        comment:
          "¡Una película navideña clásica! Kevin es adorable y las trampas son geniales. Perfecta para ver en familia durante las fiestas.",
      },
      {
        movieId: insertedMovies[0]._id, // Home Alone
        userId: insertedUsers[1]._id,
        rating: 4,
        christmasRating: 5,
        comment:
          "Muy entretenida y llena de espíritu navideño. Las escenas de slapstick nunca envejecen. Un must para la temporada.",
      },
      {
        movieId: insertedMovies[6]._id, // Klaus
        userId: insertedUsers[0]._id,
        rating: 5,
        christmasRating: 5,
        comment:
          "¡La mejor película navideña moderna! La animación es hermosa y la historia es conmovedora. Mantiene perfectamente la magia de la Navidad.",
      },
      {
        movieId: insertedMovies[9]._id, // Die Hard
        userId: insertedUsers[1]._id,
        rating: 5,
        christmasRating: 3,
        comment:
          "Excelente película de acción, pero el debate de si es navideña o no continúa. Tiene ambiente navideño, pero no es exactamente para toda la familia.",
      },
    ];

    const insertedReviews = await Review.insertMany(sampleReviews);
    console.log(`${insertedReviews.length} sample reviews created`);

    // Update movie ratings based on reviews
    console.log("Updating movie ratings...");
    for (const review of insertedReviews) {
      const movieReviews = await Review.find({ movieId: review.movieId });

      const totalRating = movieReviews.reduce((sum, r) => sum + r.rating, 0);
      const totalChristmasRating = movieReviews.reduce(
        (sum, r) => sum + r.christmasRating,
        0
      );

      await Movie.findByIdAndUpdate(review.movieId, {
        averageRating: Math.round((totalRating / movieReviews.length) * 10) / 10,
        christmasRating: Math.round((totalChristmasRating / movieReviews.length) * 10) / 10,
        reviewCount: movieReviews.length,
        christmasVotes: movieReviews.length,
      });
    }

    console.log("\n=================================");
    console.log("Seed completed successfully!");
    console.log("=================================");
    console.log("\nTest users created:");
    console.log("- user1@test.com / password123 (ChristmasFan)");
    console.log("- user2@test.com / password123 (MovieCritic)");
    console.log("- admin@test.com / password123 (Admin)");
    console.log(`\n${insertedMovies.length} Christmas movies added`);
    console.log(`${insertedReviews.length} sample reviews added\n`);

    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
