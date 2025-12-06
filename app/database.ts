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
      artist: ["Scott Joplin", "James Scott", "W.C Handy"],
      artistImage: ["/img/img_1-1_scott_joplin.png", "/img/img_1-2_jelly_roll_morton.png", "/img/img_1-3_w.c.handy.png"],
      song: ["Maple Leaf Rag", "Frog Legs Rag", "St. Louis Blues"],
      sound : ["/music/1-1 Maple Leaf Rag.m4a", "/music/1-2 Frog Legs Rag.m4a", "/music/1-3 St. Louis Blues.m4a"],
      GenreInfo: "랙 타임은 19세기 말 세인트루이스에서 등장한 음악으로, 불규칙한 리듬(Ragged Time)을 특징으로 했습니다. 주요 박자보다 앞선 강세나 긴 음과 짧은 음을 교차시키는 방식으로 독특한 리듬감을 만들었고, 이는 훗날 재즈의 핵심 요소로 발전한 스윙·그루브의 초기 형태로 평가됩니다. 다만 멜로디에는 즉흥성이 없어 재즈 그 자체라기보다 재즈의 전신으로 간주되었고, 즉흥적이지 않았기에 악보로 인쇄되어 널리 유통될 수 있어 대륙횡단철도 노동자들 사이에서도 큰 인기를 끌었습니다."
    },
    {
      genre: "NEW ORLEANS",
      city: "New Orleans",
      year: "1910",
      improvisation: 4,
      map : "/img/Map_02.png",
      artist: ["Original Dixieland Jass Band", "Joe King Oliver", "New Orleans Rhythm Kings"],
      artistImage: ["/img/img_2-1_original_dixie_jass_band.png", "/img/img_2-2_joe_king_oliver.png", "/img/img_2-3_new_orlean_rythm_kings.png"],
      song: ["Livery Stable Blues", "Dipper Mouth Blues", "Panama"],
      sound : ["/music/2-1 Livery Stable Blues.m4a", "/music/2-2 Dippermouth Blues.m4a", "/music/2-3 Panama.m4a"],
      GenreInfo: "뉴올리언즈 재즈는 다양한 문화가 공존한 항구 도시 뉴올리언스에서 형성되었습니다. 이곳에는 프랑스·에스파냐 전통을 이어받아 유럽식 연주에 능숙한 크레올과, 아프리카적 음악 요소를 지닌 아메리칸 니그로가 함께 살며 서로의 음악에 영향을 주었습니다. 남북전쟁 이후 군악대가 해산되며 금관악기가 값싸게 풀리자 흑인 음악가들은 이를 이용해 자신들만의 행진밴드를 만들었고, 장례식과 야외행사에서 연주하며 독특한 스타일을 발전시켰습니다. 초기 재즈의 악기 구성은 코넷, 클라리넷, 트롬본과 기타·벤조, 튜바 또는 콘트라베이스, 간단한 드럼으로 이루어졌고 피아노는 포함되지 않았습니다. 악보가 불완전했기 때문에 연주자들은 각자의 파트를 즉흥적으로 채워 넣는 집단 즉흥연주를 펼쳤으며, 이를 ‘핫 플레이’라고 불렀습니다. 스토리빌과 텐더로인 같은 홍등가에서 성장하던 이 음악은 1917년 지역 폐쇄 이후 음악가들이 시카고·뉴욕으로 이동하면서 미국 전역으로 확산되었습니다."
    },
    {
      genre: "CHICAGO JAZZ",
      city: "Chicago",
      year: "1920",
      improvisation: 3,
      map : "/img/Map_03.png",
      artist: ["Jelly Roll Morton", "Louis Armstrong & His Hot Five", "Bix Beiderbecke"],
      artistImage: ["/img/img_3-1_jelly_roll_morton.png", "/img/img_1-2_jelly_roll_morton.png", "/img/img_1-3_w.c._handy.png"],
      song: ["King Porter Stomp", "Hotter Than That", "Singin' The Blues"],
      sound : ["/music/3-1 King Porter Stomp.m4a", "/music/3-3 Singin' The Blues.m4a"],
      GenreInfo: "시카고 재즈는 뉴올리언스에서 활동하던 흑인 음악가들이 미시시피 강 증기선과 이주 흐름을 따라 북상하면서 발전한 재즈의 새로운 형태였습니다. 당시 뉴올리언스와 세인트루이스를 오가던 증기선에는 무도회장이 있어 많은 음악가들이 연주하며 생계를 이어갔고, 그중 페이트 매러블의 켄터키 재즈 악단은 ‘떠다니는 음악학교’라 불릴 만큼 뛰어난 연주자들을 배출했습니다. 루이 암스트롱 역시 이 악단 출신으로, 1922년 시카고로 이주하면서 시카고 재즈의 형성을 이끌었습니다. 금주법 시기 시카고는 갱스터 조직이 운영한 스피크이지 문화가 번성해 재즈가 주요 엔터테인먼트로 자리 잡았고, 이러한 환경에서 암스트롱은 핫 파이브와 핫 세븐 밴드를 결성해 재즈 표현의 혁신을 이뤄냈습니다. 그는 멜로디를 매번 새롭게 변주하며 악기의 톤을 극대화했고, 기존의 집단 즉흥 연주를 개인 중심의 솔로 연주로 전환시켜 시카고 재즈의 가장 큰 특징을 확립했습니다."
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
      GenreInfo: "스윙 재즈는 1920년대 후반 시카고의 스피크이지 문화가 갱스터와 정치권 갈등, 그리고 알 카포네 몰락으로 쇠퇴하면서 뉴욕을 중심으로 부상한 새로운 재즈 스타일입니다. 뉴욕 할렘의 코튼 클럽과 새비 클럽이 재즈의 중심지가 되었고, 루이 암스트롱을 비롯한 주요 뮤지션들이 이곳으로 이동했습니다. 대공황 속에서 사람들은 저렴하고 활기찬 댄스홀을 찾았고, 넓은 공간을 채울 큰 음량이 필요해지면서 스윙 재즈는 빅밴드 형태로 발전했습니다. 스윙 재즈의 핵심은 싱코페이션과 비정형적 박자 분할을 활용한 스윙감으로, 2비트에서 4비트 리듬으로 전환되며 더욱 생동감 있는 리듬을 만들어냈습니다. 연주자가 많았던 만큼 편곡의 중요성이 커졌고, 즉흥 연주는 테마를 기반으로 한 제한적 변주로 이루어졌습니다. 이 시기 스탠더드 레퍼토리가 확립되었고, 동시에 각 밴드의 수석 연주자들이 독주 실력을 발휘하며 집단성과 개인성이 공존하는 스윙 재즈의 특징을 형성했습니다."
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
      GenreInfo: "비밥은 스윙 시대의 상업화된 연주 방식에 반기를 든 연주자들이 뉴욕 할렘의 민턴스 플레이하우스 같은 장소에 모여 즉흥성과 강렬한 리듬을 탐구하며 탄생한 새로운 재즈 형태입니다. 특히 백인 중심 음악 산업에 대한 불만을 가진 흑인 뮤지션들은 스윙의 틀로는 표현할 수 없었던 음악적 자유를 추구했고, 이는 제2차 세계대전 이후 강화된 인종차별과 사회적 억압에 맞서는 상징적 의미도 지녔습니다. 비밥은 복잡한 화성 진행과 빠른 프레이징을 통해 흑인들의 불안과 저항을 음악적으로 드러냈습니다. 음악적 특징으로는 즉흥 연주의 극대화가 중심이었으며, 이를 위해 텐션 노트와 대리 코드를 활용해 기존 화성을 재구성하며 독창적인 선율을 만들었습니다. 색소폰과 트럼펫은 비브라토, 벤딩, 글리산도 같은 기법으로 표현력을 확장했고, 대규모 빅밴드 대신 소규모 콤보가 중심이 되어 연주자 간 대화와 창의성이 강조되었습니다. 이러한 혁신은 재즈를 댄스 음악에서 예술적 음악으로 끌어올렸지만, 난해한 구조로 인해 대중성과는 거리가 멀어지는 한계도 남겼습니다."
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
      GenreInfo: "쿨 재즈는 높은 난이도와 격정적 연주로 대중과의 거리가 멀어진 비밥의 대안으로 등장한 재즈 스타일입니다. 찰리 파커와 디지 길레스피 같은 비밥 연주자들의 뛰어난 기교는 많은 연주자들이 쉽게 따라갈 수 없었고, 비밥의 과격함은 감상자에게도 부담이었습니다. 이에 쿨 재즈는 비밥의 화성 어법을 계승하되 과도한 긴장을 줄이고 음들을 절제해 선택하며 보다 여유롭고 부드러운 사운드를 추구했습니다. 템포와 리듬도 안정적이고 차분해 대중에게 친숙하게 다가갔고, 이러한 부드러움 덕분에 많은 쿨 재즈 연주자들이 영화음악 작업에 참여하기도 했습니다. 쿨 재즈는 뉴욕과 LA 웨스트 코스트의 백인 연주자들에 의해 발전했으며, 특히 웨스트 코스트 재즈는 스윙 시대의 편곡 전통을 이어받아 대위법과 유럽 클래식 요소를 도입해 구조적 세련미를 강조했습니다. 그러나 일부에서는 이러한 절제와 형식미가 재즈의 핵심인 즉흥성과 열정을 희생했다는 비판도 제기되었습니다."
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
      GenreInfo: "하드 밥은 백인 중심의 쿨 재즈가 인기를 얻자 비밥 연주자들이 이에 대응해 비밥의 복잡성에 블루스·가스펠·R&B의 강렬한 감정과 에너지를 더해 만들어낸 스타일입니다. 이름처럼 단단한 리듬과 뚜렷한 구조를 지향했으며, 주로 필라델피아와 뉴욕 등 이스트 코스트에서 발전했습니다. 하드 밥은 비밥의 창의성을 유지하면서도 보다 명확한 멜로디와 강렬한 그루브를 강조했고, 즉흥 연주 역시 간결하고 개연성 있는 코드 진행 위에서 전개되며 난해함을 줄였습니다. 특히 드럼과 베이스의 역할 변화가 두드러졌는데, 이들은 단순한 리듬 반주를 넘어 자유로운 패턴과 솔로 연주를 통해 연주자 간 상호작용, 즉 인터플레이를 강화했습니다. 1950년대 LP의 등장으로 연주 시간이 길어지면서 음악가들은 더 깊이 있는 표현과 확장된 즉흥을 시도할 수 있었고, 이는 하드 밥의 성숙에 큰 영향을 주었습니다. 이후 하드 밥은 블루스 기반의 펑키 재즈, 가스펠 기반의 소울 재즈로 분화되며 재즈의 정체성을 더욱 확장시켰습니다."
    }
  ];
  
  export default dataList;