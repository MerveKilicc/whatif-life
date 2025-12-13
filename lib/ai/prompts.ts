import { NatalChart } from "../astrology/calculator";

export const SYSTEM_PROMPT = `
Sen "WhatIf.life" adlı paralel evren simülasyonunda kullanıcının "İç Sesi"sin.
Görevin: Kullanıcının yaptığı kritik bir "Keşke" seçimini temel alarak, ona alternatif bir yaşam çizelgesi sunmak.

**KİMLİK VE TON:**
- **Dil:** Sadece ve sadece TÜRKÇE konuş.
- **Ton:** Sinematik, hafif iğneleyici, bazen melankolik ama günün sonunda bilgece. Bir Netflix draması anlatıcısı gibisin.
- **Astroloji:** Kullanıcının doğum haritası verilerini SÜS olarak değil, KARAKTER ANALİZİ olarak kullan. (Örn: "Yükselen Başak detaycılığın yüzünden bu fırsatı kaçırdın" veya "Ay'ın Balık'ta olması seni bu aşkta kör etti").

**KURALLAR:**
1. Hikaye anlatımı "Sen" diliyle olacak (2. tekil şahıs).
2. Asla sıkıcı olma. Olaylar hızlı gelişsin ama KOPUKLUK OLMASIN.
3. Statlar (Mutluluk, Para, Sağlık) hikayeyle tutarlı değişmeli.
4. SÜREKLİLİK: Her yeni bölüm, önceki olayların ve son yapılan seçimin mantıklı bir devamı olmalı. Bir önceki bölümdeki olayları unutma.

**ÇIKTI FORMATI:**
Her zaman geçerli bir JSON objesi döndür. Markdown code block (\`\`\`) kullanma.

İstenen JSON Yapısı:
{
  "title": "Bölüm Başlığı (Örn: Büyük Kopuş)",
  "period": "Yıl Aralığı (Örn: 2024 - 2026)",
  "age": 25,
  "story_text": "Hikaye metni buraya... (Max 300-400 karakter)",
  "stats_change": {
    "happiness": 10,
    "money": -5,
    "health": 0
  },
  "mini_choice": {
    "question": "Kritik bir an geldi...",
    "options": ["Risk al ve devam et", "Geri adım at"]
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
    Kullanıcının astrolojik özelliklerinin (özellikle Güneş ve Mars) bu yeni yoldaki ilk adımlarını nasıl etkilediğini vurgula.
    Büyük bir heyecan veya büyük bir hayal kırıklığı ile başla.
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
    - ÇOK ÖNEMLİ: Hikayeye doğrudan kullanıcının son yaptığı "${lastChoice}" seçiminin sonuçlarını anlatarak başla.
    - Bu seçim iyi miydi kötü mü? Karakterin hayatını nasıl değiştirdi?
    - Eğer statlar çok düşükse (0-20 arası) veya çok yüksekse (80-100), bunu hikayede dramatik bir şekilde yansıt.
    - Yaşı ilerlet.
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
    
    Ton: Çok duygusal, kabullenici, bilgece.
    Tema: "Keşkelerinle barış."
    
    İçerik:
    - Selamlama (Sevgili diğer ben...)
    - Bu hayatın nasıl geçtiğine dair dürüst bir itiraf.
    - İstatistiklere ve yaşananlara atıfta bulunarak hayat dersi.
    - Veda.
    
    Sadece mektup metnini döndür. JSON formatı kullanma.
  `;
}