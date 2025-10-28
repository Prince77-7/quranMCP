# Quran MCP Server - AI Agent Capabilities Guide

## 🌟 ENGLISH VERSION

### What is the Quran MCP Server?

You have access to a comprehensive **Quran Model Context Protocol (MCP) Server** that provides authentic Islamic resources including the Holy Quran, Hadith collections, Tafsir (commentary), and audio recitations. This server enables you to search, retrieve, and present Islamic knowledge with accuracy and reverence.

### 🔍 Revolutionary Search Capabilities

**IMPORTANT**: This MCP server features powerful keyword and phrase search - you don't need to know exact Surah and Ayah numbers! Users can ask questions like "What does the Quran say about patience?" and you can search for relevant verses.

### 📚 Available Tools (18 Total)

#### 1. QURAN ACCESS TOOLS

**`get_quran_verse`** - Get a specific verse with Arabic text and translation
- Parameters: `surah` (1-114), `ayah` (verse number), `translation` (optional: en.asad, en.sahih, en.pickthall, en.yusufali, en.hilali)
- Example: Get Surah Al-Fatiha, verse 1

**`get_full_surah`** - Get all verses of a complete chapter
- Parameters: `surah` (1-114), `include_translation` (boolean), `translation` (optional)
- Example: Get the entire Surah Al-Baqarah with translation

**`get_random_verse`** - Get a random verse for daily inspiration
- Parameters: `include_translation` (boolean), `translation` (optional)
- Use case: Daily Quran verse feature

**`get_surah_info`** - Get information about a Surah
- Parameters: `surah` (1-114)
- Returns: Name, number of verses, revelation type (Meccan/Medinan)

**`list_surahs`** - List all 114 Surahs with names and basic info
- No parameters required
- Returns: Complete list of all Quran chapters

**`list_translations`** - List all available Quran translations
- No parameters required
- Returns: Available translation options

#### 2. SEARCH TOOLS (Most Powerful Features!)

**`search_quran`** - Search Quran by keywords or phrases
- Parameters: `query` (min 2 chars), `translation` (default: en.sahih), `max_results` (default: 20, max: 50)
- Examples: 
  - "patience" - finds all verses about patience
  - "those who believe" - finds verses with this phrase
  - "prayer" - finds verses about salah
- **Use this when users ask "What does the Quran say about X?"**

**`search_quran_by_topic`** - Search by predefined Islamic topics
- Parameters: `topic`, `translation`, `max_results`
- Topics: prayer, patience, charity, faith, paradise, hell, prophet, allah, mercy, justice, knowledge, family, death, creation, guidance
- Example: Search for verses about "charity"

**`search_hadith`** - Search Hadith collections by keywords
- Parameters: `query`, `collections` (optional array), `max_results`
- Collections: bukhari, muslim, abudawud, tirmidhi, nasai, ibnmajah
- Example: Search for hadiths about "prayer times"

**`search_hadith_by_topic`** - Search Hadith by predefined topics
- Parameters: `topic`, `collections` (optional), `max_results`
- Topics: prayer, fasting, charity, hajj, faith, prophet, companions, knowledge, manners, family, marriage, death, jihad, repentance
- Example: Search for hadiths about "fasting"

#### 3. HADITH TOOLS

**`get_hadith`** - Get a specific Hadith by number
- Parameters: `collection` (bukhari, muslim, abudawud, tirmidhi, nasai, ibnmajah), `hadith_number`
- Example: Get Hadith #1 from Sahih Bukhari

**`get_random_hadith`** - Get a random Hadith for inspiration
- Parameters: `collection` (optional)
- Use case: Daily Hadith feature

**`list_hadith_collections`** - List all available Hadith collections
- No parameters required

#### 4. TAFSIR (COMMENTARY) TOOLS

**`get_tafsir`** - Get scholarly commentary for a verse
- Parameters: `surah`, `ayah`, `tafsir` (default: en-tafisr-ibn-kathir)
- Use case: When users want deeper understanding of a verse

**`list_tafsir_sources`** - List all available Tafsir sources
- No parameters required
- Returns: Available commentary sources with authors

#### 5. AUDIO RECITATION TOOLS

**`get_recitation_url`** - Get audio MP3 URL for a verse
- Parameters: `surah`, `ayah`, `reciter` (default: Maher_AlMuaiqly_64kbps)
- Returns: Direct MP3 URL for listening

**`list_reciters`** - List all available Quran reciters
- No parameters required

#### 6. SYSTEM TOOLS

**`get_cache_stats`** - Get server performance statistics
- No parameters required
- Use case: Monitoring and debugging

---

### ⚠️ CRITICAL ACCURACY GUIDELINES

1. **Always verify Surah and Ayah numbers** - Surah numbers are 1-114, Ayah numbers vary by Surah
2. **Use search tools when users don't know exact references** - Don't guess verse numbers
3. **Respect Islamic terminology** - Use proper transliterations and respectful language
4. **Provide context** - When sharing verses, explain the context if relevant
5. **Multiple translations** - Offer to show different translations when meaning is nuanced
6. **Hadith authenticity** - All collections provided are from authentic sources (Sahih Bukhari, Sahih Muslim, etc.)
7. **Never fabricate** - If you can't find something, say so. Don't make up verses or hadiths
8. **Arabic text** - Always include Arabic text when available alongside translations

---

### 💡 Common Use Cases & Examples

**User asks: "What does the Quran say about patience?"**
→ Use `search_quran` with query "patience" or `search_quran_by_topic` with topic "patience"

**User asks: "Show me Ayat al-Kursi"**
→ Use `get_quran_verse` with surah=2, ayah=255

**User asks: "Give me a random verse for today"**
→ Use `get_random_verse` with include_translation=true

**User asks: "What hadiths talk about prayer times?"**
→ Use `search_hadith` with query "prayer times"

**User asks: "Explain Surah Al-Fatiha verse 5"**
→ First use `get_quran_verse` (surah=1, ayah=5), then use `get_tafsir` (surah=1, ayah=5)

**User asks: "I want to listen to Surah Yaseen"**
→ Use `get_recitation_url` for each verse, or suggest using `get_full_surah` first to show the text

**User asks: "List all Surahs about prophets"**
→ Use `list_surahs` to show all, then use `search_quran` with query "prophet" or "messenger"

---

### 🎯 Best Practices

1. **Start with search** when users ask topical questions
2. **Combine tools** - Get verse + tafsir + recitation for comprehensive answers
3. **Offer options** - "Would you like to see more verses on this topic?"
4. **Be educational** - Explain Surah names, revelation context, etc.
5. **Respect sensitivity** - Islamic content requires respectful, accurate handling
6. **Use proper formatting** - Present Arabic text clearly, separate from translation
7. **Cite sources** - Always mention which translation or Hadith collection you're using

---

## 🌙 النسخة العربية

### ما هو خادم بروتوكول سياق نموذج القرآن (Quran MCP Server)؟

لديك وصول إلى **خادم بروتوكول سياق نموذج القرآن الشامل** الذي يوفر موارد إسلامية أصيلة بما في ذلك القرآن الكريم، ومجموعات الأحاديث، والتفسير، والتلاوات الصوتية. يمكّنك هذا الخادم من البحث واسترجاع وتقديم المعرفة الإسلامية بدقة واحترام.

### 🔍 قدرات البحث الثورية

**مهم جداً**: يتميز خادم MCP هذا بإمكانيات بحث قوية بالكلمات المفتاحية والعبارات - لا تحتاج لمعرفة أرقام السور والآيات بالضبط! يمكن للمستخدمين طرح أسئلة مثل "ماذا يقول القرآن عن الصبر؟" ويمكنك البحث عن الآيات ذات الصلة.

### 📚 الأدوات المتاحة (18 أداة)

#### 1. أدوات الوصول للقرآن

**`get_quran_verse`** - الحصول على آية محددة مع النص العربي والترجمة
- المعاملات: `surah` (1-114)، `ayah` (رقم الآية)، `translation` (اختياري)
- مثال: الحصول على سورة الفاتحة، الآية 1

**`get_full_surah`** - الحصول على جميع آيات سورة كاملة
- المعاملات: `surah` (1-114)، `include_translation` (منطقي)، `translation` (اختياري)
- مثال: الحصول على سورة البقرة كاملة مع الترجمة

**`get_random_verse`** - الحصول على آية عشوائية للإلهام اليومي
- المعاملات: `include_translation` (منطقي)، `translation` (اختياري)
- حالة الاستخدام: ميزة آية القرآن اليومية

**`get_surah_info`** - الحصول على معلومات عن سورة
- المعاملات: `surah` (1-114)
- يُرجع: الاسم، عدد الآيات، نوع النزول (مكية/مدنية)

**`list_surahs`** - عرض جميع السور الـ 114 مع الأسماء والمعلومات الأساسية
- لا توجد معاملات مطلوبة

**`list_translations`** - عرض جميع الترجمات المتاحة للقرآن
- لا توجد معاملات مطلوبة

#### 2. أدوات البحث (الميزات الأقوى!)

**`search_quran`** - البحث في القرآن بالكلمات المفتاحية أو العبارات
- المعاملات: `query` (حد أدنى حرفان)، `translation`، `max_results` (افتراضي: 20، حد أقصى: 50)
- أمثلة:
  - "الصبر" - يجد جميع الآيات عن الصبر
  - "الذين آمنوا" - يجد الآيات التي تحتوي على هذه العبارة
  - "الصلاة" - يجد الآيات عن الصلاة
- **استخدم هذا عندما يسأل المستخدمون "ماذا يقول القرآن عن X؟"**

**`search_quran_by_topic`** - البحث حسب المواضيع الإسلامية المحددة مسبقاً
- المعاملات: `topic`، `translation`، `max_results`
- المواضيع: prayer, patience, charity, faith, paradise, hell, prophet, allah, mercy, justice, knowledge, family, death, creation, guidance
- مثال: البحث عن آيات حول "الصدقة"

**`search_hadith`** - البحث في مجموعات الأحاديث بالكلمات المفتاحية
- المعاملات: `query`، `collections` (مصفوفة اختيارية)، `max_results`
- المجموعات: bukhari, muslim, abudawud, tirmidhi, nasai, ibnmajah
- مثال: البحث عن أحاديث حول "أوقات الصلاة"

**`search_hadith_by_topic`** - البحث في الأحاديث حسب المواضيع المحددة مسبقاً
- المعاملات: `topic`، `collections` (اختياري)، `max_results`
- المواضيع: prayer, fasting, charity, hajj, faith, prophet, companions, knowledge, manners, family, marriage, death, jihad, repentance

#### 3. أدوات الحديث

**`get_hadith`** - الحصول على حديث محدد بالرقم
- المعاملات: `collection`، `hadith_number`
- مثال: الحصول على الحديث رقم 1 من صحيح البخاري

**`get_random_hadith`** - الحصول على حديث عشوائي للإلهام
- المعاملات: `collection` (اختياري)

**`list_hadith_collections`** - عرض جميع مجموعات الأحاديث المتاحة
- لا توجد معاملات مطلوبة

#### 4. أدوات التفسير

**`get_tafsir`** - الحصول على التفسير العلمي لآية
- المعاملات: `surah`، `ayah`، `tafsir` (افتراضي: en-tafisr-ibn-kathir)
- حالة الاستخدام: عندما يريد المستخدمون فهماً أعمق لآية

**`list_tafsir_sources`** - عرض جميع مصادر التفسير المتاحة
- لا توجد معاملات مطلوبة

#### 5. أدوات التلاوة الصوتية

**`get_recitation_url`** - الحصول على رابط MP3 الصوتي لآية
- المعاملات: `surah`، `ayah`، `reciter` (افتراضي: Maher_AlMuaiqly_64kbps)
- يُرجع: رابط MP3 مباشر للاستماع

**`list_reciters`** - عرض جميع القراء المتاحين للقرآن
- لا توجد معاملات مطلوبة

#### 6. أدوات النظام

**`get_cache_stats`** - الحصول على إحصائيات أداء الخادم
- لا توجد معاملات مطلوبة

---

### ⚠️ إرشادات الدقة الحرجة

1. **تحقق دائماً من أرقام السور والآيات** - أرقام السور من 1-114، أرقام الآيات تختلف حسب السورة
2. **استخدم أدوات البحث عندما لا يعرف المستخدمون المراجع الدقيقة** - لا تخمن أرقام الآيات
3. **احترم المصطلحات الإسلامية** - استخدم النقل الحرفي الصحيح واللغة المحترمة
4. **قدم السياق** - عند مشاركة الآيات، اشرح السياق إذا كان ذا صلة
5. **ترجمات متعددة** - اعرض إظهار ترجمات مختلفة عندما يكون المعنى دقيقاً
6. **صحة الحديث** - جميع المجموعات المقدمة من مصادر أصيلة (صحيح البخاري، صحيح مسلم، إلخ)
7. **لا تختلق أبداً** - إذا لم تتمكن من العثور على شيء، قل ذلك. لا تختلق آيات أو أحاديث
8. **النص العربي** - قم دائماً بتضمين النص العربي عند توفره إلى جانب الترجمات

---

### 💡 حالات الاستخدام الشائعة والأمثلة

**المستخدم يسأل: "ماذا يقول القرآن عن الصبر؟"**
→ استخدم `search_quran` مع query "patience" أو `search_quran_by_topic` مع topic "patience"

**المستخدم يسأل: "أرني آية الكرسي"**
→ استخدم `get_quran_verse` مع surah=2، ayah=255

**المستخدم يسأل: "أعطني آية عشوائية لليوم"**
→ استخدم `get_random_verse` مع include_translation=true

**المستخدم يسأل: "ما الأحاديث التي تتحدث عن أوقات الصلاة؟"**
→ استخدم `search_hadith` مع query "prayer times"

**المستخدم يسأل: "اشرح سورة الفاتحة الآية 5"**
→ أولاً استخدم `get_quran_verse` (surah=1، ayah=5)، ثم استخدم `get_tafsir` (surah=1، ayah=5)

---

### 🎯 أفضل الممارسات

1. **ابدأ بالبحث** عندما يطرح المستخدمون أسئلة موضوعية
2. **ادمج الأدوات** - احصل على الآية + التفسير + التلاوة للحصول على إجابات شاملة
3. **قدم خيارات** - "هل تريد رؤية المزيد من الآيات حول هذا الموضوع؟"
4. **كن تعليمياً** - اشرح أسماء السور، سياق النزول، إلخ
5. **احترم الحساسية** - المحتوى الإسلامي يتطلب معاملة محترمة ودقيقة
6. **استخدم التنسيق الصحيح** - قدم النص العربي بوضوح، منفصلاً عن الترجمة
7. **اذكر المصادر** - اذكر دائماً أي ترجمة أو مجموعة أحاديث تستخدمها

---

## 🔐 Final Reminder for AI Agents

**ACCURACY IS PARAMOUNT** - Islamic texts are sacred. Always:
- Verify before presenting
- Use search tools when uncertain
- Never fabricate or guess
- Provide proper attribution
- Handle with respect and care

**الدقة هي الأهم** - النصوص الإسلامية مقدسة. دائماً:
- تحقق قبل العرض
- استخدم أدوات البحث عند عدم التأكد
- لا تختلق أو تخمن أبداً
- قدم الإسناد الصحيح
- تعامل بالاحترام والعناية

