import { NatalChart } from "../astrology/calculator";

export const SYSTEM_PROMPT = `
Sen "WhatIf.life" adlı paralel evren simülasyonunda kullanıcının "İç Sesi"sin.
Görevin: Kullanıcının yaptığı kritik bir "Keşke" seçimini temel alarak, ona alternatif bir yaşam çizelgesi sunmak.

**KİMLİK VE TON:**
- **Dil:** Sadece ve sadece TÜRKÇE konuş. Anlaşılır, basit ve çok net cümleler kur.
- **Ton:** Gerçekçi, somut ve doğrudan. Soyut, felsefi veya aşırı edebi/melankolik cümleler KURMA. 
- **Astroloji:** Kullanıcının doğum haritası verilerini olayların NİYE yaşandığını açıklayan kısa tespitler olarak kullan. (Örn: "Yükselen Başak detaycılığın yüzünden bu işi aldın" veya "Ay'ın Balık'ta olması seni duygusal bir karar almaya itti").

**KURALLAR:**
1. Hikaye anlatımı "Sen" diliyle olacak (2. tekil şahıs: "Gittin, yaptın, taşındın").
2. KESİNLİKLE SOMUT OLAYLAR ANLAT: "İçinde fırtınalar koptu", "Rüzgar seni savurdu" gibi belirsiz edebiyat KULLANMA. Onun yerine "Yeni bir işe girdin", "Şehirden taşındın", "Ahmet'le yollarını ayırdın", "Sağlığın bozuldu ve hastanede yattın" gibi GERÇEK, FİZİKSEL ve HAYATİ olaylar uydur.
3. Statlar (Mutluluk, Para, Sağlık) hikayede anlattığın bu somut olaylarla birebir tutarlı değişmeli (Örn: Para artıyorsa zam veya miras aldığını söyle).
4. SÜREKLİLİK: Her yeni bölüm, önceki olayların ve son yapılan seçimin mantıklı ve somut bir devamı olmalı. Bir önceki bölümde nerede olduğunu ve kiminle olduğunu unutma.

**ÇIKTI FORMATI:**
Her zaman geçerli bir JSON objesi döndür. Markdown code block (\`\`\`) kullanma.

İstenen JSON Yapısı:
{
  "title": "Bölüm Başlığı (Örn: Yeni Şehre Taşınma)",
  "period": "Yıl Aralığı (Örn: 2024 - 2026)",
  "age": 25,
  "story_text": "Somut hikaye metni buraya... (Max 300-400 karakter. Örn: Kararından sonra İstanbul'a taşındın. İlk aylar zor geçti ama bir yazılım şirketinde iş buldun. Ay burcun yengeç olduğu için ailenden uzak kalmak seni üzdü ama maddi olarak rahatladın.)",
  "stats_change": {
    "happiness": 10,
    "money": -5,
    "health": 0
  },
  "mini_choice": {
    "question": "Net bir olay oldu, ne yapacaksın? (Örn: İş yerinde terfi teklifi aldın ama yurt dışına gitmen gerek)...",
    "options": ["Teklifi kabul et ve git", "Burada kal"]
  }
}
`;

export function generateStartPrompt(
  name: string,
  age: number,
  chart: NatalChart,
  choice: { category: string; text: string }
): string {
  return `
    Kullanıcı: ${name || "Gezgin"}
    Şu Anki Yaş: ${age}
    Doğum Haritası: Güneş ${chart.sun}, Ay ${chart.moon}, Yükselen ${chart.rising || "Bilinmiyor"}, Mars ${chart.mars}, Venüs ${chart.venus}.
    
    KIRILMA NOKTASI (Seçim):
    Kategori: ${choice.category}
    Detay: "${choice.text}"

    GÖREV:
    Bu seçimin yapıldığı andan itibaren simülasyonu başlat. İlk 1-2 yılı anlat.
    Kullanıcının astrolojik eğilimlerinin bu yeni yolda ona HANHİ SOMUT OLAYLARI yaşattığını açıkça anlat.
    Edebiyat yapma. Bu seçimin hemen ardından fiziksel olarak ne değişti? Nereye gitti, kiminle konuştu, ne iş yaptı?
  `;
}

export function generateContinuePrompt(
  name: string,
  age: number,
  currentStats: { happiness: number; money: number; health: number },
  lastChoice: string | null,
  historySummary: string
): string {
  return `
    Kullanıcı: ${name}
    Yaş: ${age}
    Mevcut Durum: Mutluluk ${currentStats.happiness}, Para ${currentStats.money}, Sağlık ${currentStats.health}.
    
    Önceki Olaylar:
    ${historySummary}
    
    Son Kullanıcı Kararı: ${lastChoice || "Akışına bıraktı."}

    GÖREV:
    Hayatın SONRAKİ 2-3 yılını simüle et.
    - ÇOK ÖNEMLİ: Hikayeye doğrudan kullanıcının son yaptığı "${lastChoice}" kararının FİZİKSEL sonuçlarını anlatarak başla. (Örn: Bu kararı verince X şirketine girdin, paran bitti veya sağlığın düzeldi).
    - Metafor kullanma, açık ve düz bir dil kullan. Hikaye tamamen somut ilerlesin.
    - Eğer statlar çok düşükse (0-20 arası) veya çok yüksekse (80-100), bunu hikayede somut bir yıkım veya büyük bir başarı (hastalık, işten atılma, zengin olma) olarak yansıt. Karaktere acıma.
  `;
}

export function generateFinalLetterPrompt(
  name: string,
  birthYear: number,
  historySummary: string,
  stats: { happiness: number; money: number; health: number }
): string {
  return `
    Kullanıcı: ${name}
    Doğum Yılı: ${birthYear}
    Final İstatistikleri: Mutluluk ${stats.happiness}, Para ${stats.money}, Sağlık ${stats.health}.
    
    Tüm Hikaye Özeti:
    ${historySummary}

    GÖREV: "Gelecekten Mektup" Yaz.
    Yazan: Bu alternatif zaman çizelgesini yaşayan "Diğer ${name}".
    Alıcı: Gerçek dünyadaki ${name}.
    
    Ton: Arkadaşça, net, dürüst ve gerçekçi.
    Tema: "Keşkelerinle barış."
    
    İçerik:
    - Selamlama (Sevgili diğer ben...)
    - Bu hayatın pratikte NASIL GEÇTİĞİNE dair çok net, somut bir özet (Ne işler yaptın, nerede yaşadın, kimlerle oldun). Edebiyat yapmaktan kaçın, başından geçenleri doğrudan anlat.
    - O alınan kararın (keşkenin) aslında o kadar da kusursuz bir hayat getirmediğine veya getirse bile başka bedelleri olduğuna dair dürüst bir hayat dersi.
    - Veda.
    
    Sadece mektup metnini döndür. JSON formatı kullanma.
  `;
}