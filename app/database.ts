export interface DataType {
  genre: string;
  city: string;
  year: string;
  improvisation: number;
  map: string;
  artist: string[];
  artistImage: string[];
  song: string[];
  sound: string[];
  GenreInfo: string;
}

const dataList: DataType[] = [
    {
      genre: "RAG TIME",
      city: "Saint louis",
      year: "1900",
      improvisation: 2,
      map : "/img/Map_01.png",
      artist: ["Scott Joplin", "Jelly Roll Morton", "W.C Handy"],
      artistImage: ["/img/img_1-1_scott_joplin.png", "/img/img_1-2_jelly_roll_morton.png", "/img/img_1-3_w.c._handy.png"],
      song: ["Maple Leaf Rag", "Tiger Rag", "St. Louis Blues"],
      sound : ["/music/1-1 Maple Leaf Rag.m4a", "/music/1-2 Tiger Rag.m4a", "/music/1-3 St. Louis Blues.m4a"],
      GenreInfo: "랙 타임은..."
    },
    {
      genre: "NEW ORLEANS",
      city: "New Orleans",
      year: "1910",
      improvisation: 4,
      map : "/img/Map_02.png",
      artist: ["Original Dixieland Jass Band", "Joe King Oliver", "New Orleans Rhythm Kings"],
      artistImage: ["/img/img_1-1_scott_joplin.png", "/img/img_1-2_jelly_roll_morton.png", "/img/img_1-3_w.c._handy.png"],
      song: ["Livery Stable Blues", "Dipper Mouth Blues", "Panama"],
      sound : ["/music/2-1 Livery Stable Blues.m4a", "/music/2-2 Dippermouth Blues.m4a", "/music/2-3 Panama.m4a"],
      GenreInfo: "뉴올리언스 재즈는..."
    },
    {
      genre: "CHICAGO JAZZ",
      city: "Chicago",
      year: "1920",
      improvisation: 3,
      map : "/img/Map_03.png",
      artist: ["Jelly Roll Morton", "Louis Armstrong & His Hot Five", "3-3"],
      artistImage: ["/img/img_1-1_scott_joplin.png", "/img/img_1-2_jelly_roll_morton.png", "/img/img_1-3_w.c._handy.png"],
      song: ["King Porter Stomp", "Hotter Than That", "3-3"],
      sound : ["/music/3-1 King Porter Stomp.m4a", "/music/3-2 Hotter Than That.m4a"],
      GenreInfo: "시카고 재즈는..."
    },
    {
      genre: "SWING JAZZ",
      city: "KANAS CITY",
      year: "1930",
      improvisation: 3,
      map : "/img/Map_04.png",
      artist: ["Benny Goodman", "Glenn Miller", "Duke Ellington"],
      artistImage: ["/img/img_1-1_scott_joplin.png", "/img/img_1-2_jelly_roll_morton.png", "/img/img_1-3_w.c._handy.png"],
      song: ["Sing Sing Sing", "In the Mood", "Take the 'A' Train"],
      sound : ["/music/4-1 Sing, Sing, Sing (Remastered).m4a", "/music/4-2 In The Mood (Remastered 1995).m4a", "/music/4-3 Take the 'A' Train.m4a"],
      GenreInfo: "스윙 재즈는..."
    },
    {
      genre: "BEBOP",
      city: "New York",
      year: "1940",
      improvisation: 5,
      map : "/img/Map_05.png",
      artist: ["Dizzy Gillespie", "Thelonious Monk", "Charlie Parker"],
      artistImage: ["/img/img_1-1_scott_joplin.png", "/img/img_1-2_jelly_roll_morton.png", "/img/img_1-3_w.c._handy.png"],
      song: ["A Night in Tunisia", "‘Round Midnight", "Ornithology"],
      sound : ["/music/5-1 A Night In Tunisia.m4a", "/music/5-2 Round Midnight.m4a"],
      GenreInfo: "비밥은..."
    },
    {
      genre: "COOL JAZZ",
      city: "Los Angeles",
      year: "1950",
      improvisation: 2,
      map : "/img/Map_06.png",
      artist: ["Miles Davis", "Dave Brubeck", "Chet Baker"],
      artistImage: ["/img/img_1-1_scott_joplin.png", "/img/img_1-2_jelly_roll_morton.png", "/img/img_1-3_w.c._handy.png"],
      song: ["So What", "Take Five", "My Funny Valentine"], 
      sound : ["/music/6-1 Boplicity.m4a", "/music/6-2 Take Five.m4a", "/music/6-3 My Funny Valentine.m4a"],
      GenreInfo: "쿨 재즈는..."
    },
    {
      genre: "HARD BOP",
      city: "Philadelphia",
      year: "1960",
      improvisation: 4,
      map : "/img/Map_07.png",
      artist: ["Art Blakey & The Jazz Messengers", "John Coltrane", "Horace Silver"],
      artistImage: ["/img/img_1-1_scott_joplin.png", "/img/img_1-2_jelly_roll_morton.png", "/img/img_1-3_w.c._handy.png"],
      song: ["Moanin’", "Giant Steps", "Song for My Father"],
      sound : ["/music/7-1 Moanin'.m4a", "/music/7-2 Giant Steps.m4a", "/music/7-3 Song For My Father.m4a"],
      GenreInfo: "하드밥은..."
    }
  ];
  
  export default dataList;