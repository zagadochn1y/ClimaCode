export type Language = "en" | "ru" | "kk";

export const languageNames: Record<Language, string> = {
  en: "EN",
  ru: "RU",
  kk: "KZ",
};

const translations = {
  // Header
  "nav.climascan": { en: "ClimaScan", ru: "ClimaScan", kk: "ClimaScan" },
  "nav.ecodev": { en: "EcoDev School", ru: "EcoDev School", kk: "EcoDev School" },
  "nav.offset": { en: "ClimaOffset", ru: "ClimaOffset", kk: "ClimaOffset" },
  "nav.profile": { en: "Profile", ru: "Профиль", kk: "Профиль" },
  "nav.signout": { en: "Sign Out", ru: "Выйти", kk: "Шығу" },
  "nav.ranking": { en: "Carbon Ranking", ru: "Carbon Ranking", kk: "Carbon Ranking" },
  "nav.login": { en: "Login", ru: "Войти", kk: "Кіру" },

  // Hero
  "hero.title": {
    en: "ClimaCode — <span>measure and reduce</span> the carbon of digital and real-world activities",
    ru: "ClimaCode — <span>измеряй и снижай</span> углеродный след цифровых и реальных активностей",
    kk: "ClimaCode — цифрлық және нақты әрекеттердің көміртегі ізін <span>өлше және азайт</span>",
  },
  "hero.subtitle": {
    en: "Calculate your carbon footprint and get recommendations on how to reduce emissions.",
    ru: "Рассчитайте свой углеродный след и получите рекомендации по снижению выбросов.",
    kk: "Көміртегі ізіңізді есептеп, шығарындыларды азайту бойынша кеңестер алыңыз.",
  },
  "hero.start": { en: "Start Scanning", ru: "Начать сканирование", kk: "Сканерлеуді бастау" },
  "hero.learn": { en: "Learn More", ru: "Подробнее", kk: "Толығырақ" },

  // Stats
  "stats.tons": { en: "Tons CO₂ from internet yearly", ru: "Тонн CO₂ от интернета в год", kk: "Интернеттен жылына CO₂ тоннасы" },
  "stats.avg": { en: "Average CO₂ per page view", ru: "Средний CO₂ на просмотр страницы", kk: "Бет қарауға орташа CO₂" },
  "stats.global": { en: "Of global emissions from digital", ru: "Мировых выбросов от цифровых технологий", kk: "Цифрлық технологиялардан жаһандық шығарындылар" },

  // Why ClimaCode
  "why.title": { en: "Why ClimaCode?", ru: "Почему ClimaCode?", kk: "Неге ClimaCode?" },
  "why.tracking.title": { en: "Real-Time Carbon Tracking", ru: "Отслеживание углерода в реальном времени", kk: "Нақты уақытта көміртегіні бақылау" },
  "why.tracking.desc": { en: "Monitor the CO₂ impact of your browsing, streaming, and cloud usage", ru: "Отслеживайте влияние CO₂ от вашего браузинга, стриминга и облачных сервисов", kk: "Браузинг, стриминг және бұлттық сервистердің CO₂ әсерін бақылаңыз" },
  "why.insights.title": { en: "Detailed Insights", ru: "Детальная аналитика", kk: "Егжей-тегжейлі талдау" },
  "why.insights.desc": { en: "Understand exactly where your digital carbon emissions come from", ru: "Точно узнайте, откуда идут ваши цифровые выбросы углерода", kk: "Цифрлық көміртегі шығарындыларыңыздың қайдан келетінін нақты біліңіз" },
  "why.tips.title": { en: "Actionable Tips", ru: "Практические советы", kk: "Тәжірибелік кеңестер" },
  "why.tips.desc": { en: "Get tailored recommendations to reduce your carbon footprint", ru: "Получите персональные рекомендации по снижению углеродного следа", kk: "Көміртегі ізін азайту бойынша жеке кеңестер алыңыз" },

  // How it works
  "how.title": { en: "How It Works", ru: "Как это работает", kk: "Қалай жұмыс істейді" },
  "how.subtitle": { en: "Four simple steps to understand and reduce your website's carbon footprint", ru: "Четыре простых шага для понимания и снижения углеродного следа вашего сайта", kk: "Сайтыңыздың көміртегі ізін түсіну және азайту үшін төрт қарапайым қадам" },
  "how.step1.title": { en: "Enter your URL", ru: "Введите URL", kk: "URL енгізіңіз" },
  "how.step1.desc": { en: "Paste the website link you want to analyze", ru: "Вставьте ссылку на сайт для анализа", kk: "Талдағыңыз келген сайт сілтемесін қойыңыз" },
  "how.step2.title": { en: "Run the scan", ru: "Запустите сканирование", kk: "Сканерлеуді іске қосыңыз" },
  "how.step2.desc": { en: "We calculate page weight, CO₂ emissions using the SWD model", ru: "Мы рассчитываем вес страницы и выбросы CO₂ по модели SWD", kk: "Біз SWD моделі бойынша беттің салмағын және CO₂ шығарындыларын есептейміз" },
  "how.step3.title": { en: "Get your report", ru: "Получите отчёт", kk: "Есепті алыңыз" },
  "how.step3.desc": { en: "Receive a detailed report with AI-powered recommendations", ru: "Получите детальный отчёт с рекомендациями от ИИ", kk: "ЖИ кеңестерімен егжей-тегжейлі есеп алыңыз" },
  "how.step4.title": { en: "Earn a certificate", ru: "Получите сертификат", kk: "Сертификат алыңыз" },
  "how.step4.desc": { en: "High-scoring sites receive a Green Website Certificate", ru: "Сайты с высоким баллом получают Зелёный сертификат", kk: "Жоғары балл жинаған сайттар Жасыл сертификат алады" },

  // Tools
  "tools.title": { en: "Our Tools", ru: "Наши инструменты", kk: "Біздің құралдар" },
  "tools.subtitle": { en: "A suite of tools for sustainable digital development", ru: "Набор инструментов для устойчивой цифровой разработки", kk: "Тұрақты цифрлық даму құралдарының жиынтығы" },
  "tools.climascan.desc": { en: "Scan any website and calculate its CO₂ emissions per visit. Get AI-powered optimization tips.", ru: "Сканируйте любой сайт и рассчитайте выбросы CO₂ за визит. Получите советы от ИИ.", kk: "Кез келген сайтты сканерлеп, бір кіру үшін CO₂ шығарындыларын есептеңіз." },
  "tools.ecodev.desc": { en: "Learn energy-efficient coding practices. Earn achievements and track your progress.", ru: "Изучите энергоэффективные практики программирования. Получайте достижения.", kk: "Энергия тиімді кодтау тәжірибелерін үйреніңіз. Жетістіктер жинаңыз." },
  "tools.offset.desc": { en: "Visualize your impact and track your contribution to reducing digital carbon emissions.", ru: "Визуализируйте ваш вклад в снижение цифровых выбросов углерода.", kk: "Цифрлық көміртегі шығарындыларын азайтуға қосқан үлесіңізді көрсетіңіз." },
  "tools.try": { en: "Try Now", ru: "Попробовать", kk: "Қолданып көру" },
  "tools.coming": { en: "Coming Soon", ru: "Скоро", kk: "Жақында" },

  // CTA
  "cta.title": { en: "Ready to make the web greener?", ru: "Готовы сделать интернет зеленее?", kk: "Интернетті жасылдандыруға дайынсыз ба?" },
  "cta.subtitle": { en: "Start scanning your website today and get actionable insights to reduce its carbon footprint.", ru: "Начните сканирование вашего сайта сегодня и получите практические рекомендации.", kk: "Сайтыңызды бүгін сканерлеп, көміртегі ізін азайту кеңестерін алыңыз." },
  "cta.button": { en: "Start Free Scan", ru: "Бесплатное сканирование", kk: "Тегін сканерлеу" },

  // About
  "about.title": { en: "About Us", ru: "О нас", kk: "Біз туралы" },
  "about.desc": { en: "Our team was established in 2024. We work on technological and social projects, participated and won in international competitions, implemented several significant initiatives.", ru: "Наша команда была основана в 2024 году. Мы работаем над технологическими и социальными проектами, участвовали и побеждали в международных конкурсах.", kk: "Біздің команда 2024 жылы құрылды. Біз технологиялық және әлеуметтік жобалармен жұмыс істейміз, халықаралық конкурстарға қатысып, жеңіске жеттік." },
  "about.photo": { en: "Photo placeholder", ru: "Место для фото", kk: "Фото орны" },
  "about.cofounder": { en: "Co-Founder", ru: "Сооснователь", kk: "Құрылтайшы" },

  // ClimaScan page
  "scan.title": { en: "ClimaScan — site audit\n& CO₂ calculator", ru: "ClimaScan — аудит сайта\nи калькулятор CO₂", kk: "ClimaScan — сайт аудиті\nжәне CO₂ калькуляторы" },
  "scan.subtitle": { en: "Enter a website URL to run a full audit. You'll get CO₂ per visit, year and your sustainable score.", ru: "Введите URL сайта для полного аудита. Вы получите CO₂ за визит, за год и ваш балл устойчивости.", kk: "Толық аудит үшін сайт URL-ін енгізіңіз. Бір кіру, жыл бойынша CO₂ және тұрақтылық баллыңызды аласыз." },
  "scan.placeholder": { en: "https://example.com", ru: "https://example.com", kk: "https://example.com" },
  "scan.country": { en: "Country", ru: "Страна", kk: "Ел" },
  "scan.start": { en: "Start Scanning", ru: "Начать сканирование", kk: "Сканерлеуді бастау" },
  "scan.analyzing": { en: "Analyzing website...", ru: "Анализируем сайт...", kk: "Сайтты талдауда..." },
  "scan.perView": { en: "per view", ru: "за просмотр", kk: "қарау үшін" },
  "scan.perYear": { en: "per year", ru: "за год", kk: "жылына" },
  "scan.score": { en: "Sustainability Score", ru: "Балл устойчивости", kk: "Тұрақтылық балы" },
  "scan.breakdown": { en: "Breakdown", ru: "Разбивка", kk: "Бөлшектеу" },
  "scan.images": { en: "Images", ru: "Изображения", kk: "Суреттер" },
  "scan.javascript": { en: "JavaScript", ru: "JavaScript", kk: "JavaScript" },
  "scan.other": { en: "Other", ru: "Другое", kk: "Басқа" },
  "scan.recommendations": { en: "AI Recommendations", ru: "Рекомендации ИИ", kk: "ЖИ ұсыныстары" },
  "scan.report": { en: "Download Report", ru: "Скачать отчёт", kk: "Есепті жүктеу" },
  "scan.certificate": { en: "Get Green Certificate", ru: "Получить Зелёный сертификат", kk: "Жасыл сертификат алу" },
  "scan.error": { en: "Scan error", ru: "Ошибка сканирования", kk: "Сканерлеу қатесі" },
  "scan.reportError": { en: "Report error", ru: "Ошибка отчёта", kk: "Есеп қатесі" },
  "scan.certError": { en: "Certificate error", ru: "Ошибка сертификата", kk: "Сертификат қатесі" },
  "scan.urlError": { en: "Please enter a valid URL (e.g. https://example.com)", ru: "Введите корректный URL (например https://example.com)", kk: "Жарамды URL енгізіңіз (мысалы https://example.com)" },
  "scan.serverCountry": { en: "Server location", ru: "Расположение сервера", kk: "Сервер орны" },

  // Login page
  "login.welcome": { en: "Welcome Back", ru: "С возвращением", kk: "Қош келдіңіз" },
  "login.create": { en: "Create Account", ru: "Создать аккаунт", kk: "Тіркелгі жасау" },
  "login.signupDesc": { en: "Sign up to track your carbon footprint", ru: "Зарегистрируйтесь для отслеживания углеродного следа", kk: "Көміртегі ізін бақылау үшін тіркеліңіз" },
  "login.signinDesc": { en: "Sign in to your account", ru: "Войдите в ваш аккаунт", kk: "Тіркелгіңізге кіріңіз" },
  "login.email": { en: "Email", ru: "Email", kk: "Email" },
  "login.password": { en: "Password", ru: "Пароль", kk: "Құпия сөз" },
  "login.submit.login": { en: "Login", ru: "Войти", kk: "Кіру" },
  "login.submit.signup": { en: "Sign Up", ru: "Зарегистрироваться", kk: "Тіркелу" },
  "login.loading": { en: "Loading...", ru: "Загрузка...", kk: "Жүктелуде..." },
  "login.hasAccount": { en: "Already have an account?", ru: "Уже есть аккаунт?", kk: "Тіркелгіңіз бар ма?" },
  "login.noAccount": { en: "Don't have an account?", ru: "Нет аккаунта?", kk: "Тіркелгіңіз жоқ па?" },
  "login.checkEmail": { en: "Check your email to confirm your account!", ru: "Проверьте почту для подтверждения аккаунта!", kk: "Тіркелгіні растау үшін поштаңызды тексеріңіз!" },
  "login.welcomeBack": { en: "Welcome back!", ru: "С возвращением!", kk: "Қош келдіңіз!" },

  // Profile page
  "profile.title": { en: "My Profile", ru: "Мой профиль", kk: "Менің профилім" },
  "profile.joined": { en: "Joined", ru: "Присоединился", kk: "Қосылды" },
  "profile.totalScans": { en: "Total Scans", ru: "Всего сканов", kk: "Барлық сканерлер" },
  "profile.co2measured": { en: "CO₂ Measured", ru: "CO₂ измерено", kk: "CO₂ өлшенді" },
  "profile.avgScore": { en: "Avg Score", ru: "Ср. балл", kk: "Орт. балл" },
  "profile.modulesDone": { en: "Modules Done", ru: "Модулей пройдено", kk: "Аяқталған модульдер" },
  "profile.achievements": { en: "Achievements", ru: "Достижения", kk: "Жетістіктер" },
  "profile.scanHistory": { en: "Scan History", ru: "История сканирований", kk: "Сканерлеу тарихы" },
  "profile.noScans": { en: "No scans yet", ru: "Пока нет сканов", kk: "Сканерлер жоқ" },
  "profile.noScansDesc": { en: "Start scanning websites to see your history here", ru: "Начните сканировать сайты, чтобы увидеть историю здесь", kk: "Тарихты көру үшін сайттарды сканерлеуді бастаңыз" },
  "profile.startScanning": { en: "Start Scanning", ru: "Начать сканирование", kk: "Сканерлеуді бастау" },
  "profile.usernameUpdated": { en: "Username updated!", ru: "Имя пользователя обновлено!", kk: "Пайдаланушы аты жаңартылды!" },
  "profile.avatarUpdated": { en: "Avatar updated!", ru: "Аватар обновлён!", kk: "Аватар жаңартылды!" },
  "profile.enterUsername": { en: "Enter username", ru: "Введите имя пользователя", kk: "Пайдаланушы атын енгізіңіз" },

  // ClimaOffset
  "offset.badge": { en: "Impact Dashboard", ru: "Панель влияния", kk: "Әсер тақтасы" },
  "offset.title": { en: "ClimaOffset", ru: "ClimaOffset", kk: "ClimaOffset" },
  "offset.subtitle": { en: "Track your contribution to measuring digital carbon emissions. Every scan helps build awareness.", ru: "Отслеживайте ваш вклад в измерение цифровых выбросов. Каждое сканирование повышает осведомлённость.", kk: "Цифрлық шығарындыларды өлшеуге қосқан үлесіңізді бақылаңыз." },
  "offset.co2measured": { en: "CO₂ Measured", ru: "CO₂ измерено", kk: "CO₂ өлшенді" },
  "offset.scanned": { en: "Sites Scanned", ru: "Сайтов просканировано", kk: "Сканерленген сайттар" },
  "offset.trees": { en: "Trees Equivalent", ru: "Эквивалент деревьев", kk: "Ағаш эквиваленті" },
  "offset.water": { en: "Water Equivalent", ru: "Эквивалент воды", kk: "Су эквиваленті" },
  "offset.milestones": { en: "Milestones", ru: "Вехи", kk: "Кезеңдер" },
  "offset.ecoTips": { en: "Eco Tips", ru: "Эко-советы", kk: "Эко-кеңестер" },
  "offset.quickWin": { en: "Quick Win", ru: "Быстрая победа", kk: "Жылдам жеңіс" },
  "offset.quickWinText": { en: "Compress images on your most-visited pages to save up to 60% in emissions.", ru: "Сожмите изображения на самых посещаемых страницах, чтобы сократить до 60% выбросов.", kk: "Ең көп кірілетін беттердегі суреттерді қысып, шығарындыларды 60%-ға дейін азайтыңыз." },
  "offset.dailyHabit": { en: "Daily Habit", ru: "Ежедневная привычка", kk: "Күнделікті әдет" },
  "offset.dailyHabitText": { en: "Use dark mode — OLED screens consume 60% less energy with dark backgrounds.", ru: "Используйте тёмный режим — OLED-экраны потребляют на 60% меньше энергии.", kk: "Қараңғы режимді қолданыңыз — OLED экрандар 60% аз энергия жұмсайды." },
  "offset.longTerm": { en: "Long Term", ru: "Долгосрочно", kk: "Ұзақ мерзімді" },
  "offset.longTermText": { en: "Switch to green hosting providers powered by renewable energy.", ru: "Перейдите на зелёный хостинг, работающий на возобновляемой энергии.", kk: "Жаңартылатын энергиямен жұмыс істейтін жасыл хостингке ауысыңыз." },
  "offset.impactSummary": { en: "Your Impact Summary", ru: "Итоги вашего влияния", kk: "Сіздің әсеріңіздің қорытындысы" },
  "offset.impactSubtitle": { en: "Every scan contributes to understanding digital carbon", ru: "Каждое сканирование помогает понять цифровой углерод", kk: "Әр сканерлеу цифрлық көміртегіні түсінуге көмектеседі" },
  "offset.totalMeasured": { en: "Total CO₂ Measured", ru: "Всего CO₂ измерено", kk: "Барлық CO₂ өлшенді" },
  "offset.scansPerformed": { en: "Scans Performed", ru: "Выполнено сканирований", kk: "Орындалған сканерлер" },
  "offset.signIn": { en: "Sign in to track your impact", ru: "Войдите, чтобы отслеживать ваш вклад", kk: "Үлесіңізді бақылау үшін кіріңіз" },
  "offset.signInDesc": { en: "Your scan history and impact data will be saved to your account", ru: "Ваша история сканирований и данные будут сохранены в вашем аккаунте", kk: "Сканерлеу тарихыңыз бен деректеріңіз тіркелгіңізде сақталады" },
  "offset.signInBtn": { en: "Sign In", ru: "Войти", kk: "Кіру" },

  // EcoDev School
  "ecodev.title": { en: "EcoDev School", ru: "EcoDev School", kk: "EcoDev School" },
  "ecodev.subtitle": { en: "Master green web development through interactive lessons", ru: "Освойте зелёную веб-разработку через интерактивные уроки", kk: "Интерактивті сабақтар арқылы жасыл веб-әзірлеуді меңгеріңіз" },
  "ecodev.yourProgress": { en: "Your Progress", ru: "Ваш прогресс", kk: "Сіздің прогрессіңіз" },
  "ecodev.complete": { en: "complete", ru: "завершено", kk: "аяқталды" },
  "ecodev.completed": { en: "Completed", ru: "Завершён", kk: "Аяқталды" },
  "ecodev.lessons": { en: "lessons", ru: "уроков", kk: "сабақ" },
  "ecodev.continue": { en: "Continue", ru: "Продолжить", kk: "Жалғастыру" },
  "ecodev.start": { en: "Start", ru: "Начать", kk: "Бастау" },
  "ecodev.prev": { en: "Previous", ru: "Назад", kk: "Алдыңғы" },
  "ecodev.next": { en: "Next Lesson", ru: "Следующий урок", kk: "Келесі сабақ" },
  "ecodev.finish": { en: "Finish Module", ru: "Завершить модуль", kk: "Модульді аяқтау" },
  "ecodev.quiz": { en: "Quiz", ru: "Тест", kk: "Тест" },
  "ecodev.check": { en: "Check Answer", ru: "Проверить", kk: "Тексеру" },
  "ecodev.correct": { en: "Correct!", ru: "Правильно!", kk: "Дұрыс!" },
  "ecodev.wrong": { en: "Incorrect. Try again!", ru: "Неверно. Попробуйте ещё!", kk: "Қате. Қайталап көріңіз!" },
  "ecodev.back": { en: "Back to modules", ru: "К модулям", kk: "Модульдерге оралу" },
  "ecodev.loginPrompt": { en: "Sign in to save your progress", ru: "Войдите, чтобы сохранить прогресс", kk: "Прогресті сақтау үшін кіріңіз" },
  "ecodev.aiTool": { en: "AI Code Optimizer", ru: "AI Оптимизатор кода", kk: "AI Код оптимизаторы" },

  // Footer
  "footer.navigation": { en: "Navigation", ru: "Навигация", kk: "Навигация" },
  "footer.contact": { en: "Contact", ru: "Контакты", kk: "Байланыс" },
  "footer.home": { en: "Home", ru: "Главная", kk: "Басты бет" },
  "footer.copyright": { en: "Developed with care for the planet", ru: "Разработано с заботой о планете", kk: "Ғаламшарға қамқорлықпен жасалған" },

  // 404
  "notfound.title": { en: "Page not found", ru: "Страница не найдена", kk: "Бет табылмады" },
  "notfound.desc": { en: "doesn't exist.", ru: "не существует.", kk: "жоқ." },
  "notfound.home": { en: "Home", ru: "Главная", kk: "Басты бет" },
  "notfound.back": { en: "Go Back", ru: "Назад", kk: "Артқа" },

  // Achievements
  "ach.firstScan": { en: "First Scan", ru: "Первое сканирование", kk: "Бірінші сканерлеу" },
  "ach.firstScanDesc": { en: "Complete your first scan", ru: "Завершите первое сканирование", kk: "Бірінші сканерлеуді аяқтаңыз" },
  "ach.carbonTracker": { en: "Carbon Tracker", ru: "Углеродный трекер", kk: "Көміртегі трекері" },
  "ach.carbonTrackerDesc": { en: "Complete 5 scans", ru: "Завершите 5 сканирований", kk: "5 сканерлеуді аяқтаңыз" },
  "ach.greenChampion": { en: "Green Champion", ru: "Зелёный чемпион", kk: "Жасыл чемпион" },
  "ach.greenChampionDesc": { en: "Avg score ≥ 0.7", ru: "Ср. балл ≥ 0.7", kk: "Орт. балл ≥ 0.7" },
  "ach.ecoExplorer": { en: "Eco Explorer", ru: "Эко-исследователь", kk: "Эко-зерттеуші" },
  "ach.ecoExplorerDesc": { en: "Scan 10+ different sites", ru: "Просканируйте 10+ разных сайтов", kk: "10+ түрлі сайтты сканерлеңіз" },
  "ach.firstLesson": { en: "First Lesson", ru: "Первый урок", kk: "Бірінші сабақ" },
  "ach.firstLessonDesc": { en: "Complete a lesson in EcoDev", ru: "Завершите урок в EcoDev", kk: "EcoDev-те сабақ аяқтаңыз" },
  "ach.earned": { en: "Earned ✓", ru: "Получено ✓", kk: "Алынды ✓" },

  // Milestone targets
  "milestone.1kg": { en: "1kg CO₂ measured", ru: "1кг CO₂ измерено", kk: "1кг CO₂ өлшенді" },
  "milestone.10sites": { en: "10 sites scanned", ru: "10 сайтов просканировано", kk: "10 сайт сканерленді" },
  "milestone.50scans": { en: "50 scans completed", ru: "50 сканирований выполнено", kk: "50 сканерлеу орындалды" },
  "milestone.100scans": { en: "100 scans completed", ru: "100 сканирований выполнено", kk: "100 сканерлеу орындалды" },

  // Global Emissions Dashboard
  "global.live": { en: "LIVE DATA", ru: "LIVE ДАННЫЕ", kk: "LIVE ДЕРЕКТЕР" },
  "global.title": { en: "Global Digital Emissions", ru: "Глобальные цифровые выбросы", kk: "Жаһандық цифрлық шығарындылар" },
  "global.subtitle": { en: "Real-time visualization of the internet's carbon footprint across continents", ru: "Визуализация углеродного следа интернета по континентам в реальном времени", kk: "Континенттер бойынша интернеттің көміртегі ізін нақты уақытта көрсету" },
  "global.counter": { en: "Estimated global IT emissions right now", ru: "Примерные глобальные IT-выбросы прямо сейчас", kk: "Қазір болжамды жаһандық IT шығарындылар" },
  "global.counterNote": { en: "Based on average global data center energy consumption models", ru: "На основе моделей среднего мирового энергопотребления дата-центров", kk: "Дата-орталықтардың орташа жаһандық энергия тұтыну модельдеріне негізделген" },
  "global.traffic": { en: "Data traffic", ru: "Трафик данных", kk: "Деректер трафигі" },
  "global.low": { en: "Low emissions", ru: "Низкие выбросы", kk: "Төмен шығарындылар" },
  "global.medium": { en: "Medium emissions", ru: "Средние выбросы", kk: "Орташа шығарындылар" },
  "global.high": { en: "High emissions", ru: "Высокие выбросы", kk: "Жоғары шығарындылар" },
  "global.stat1": { en: "Annual IT CO₂", ru: "Годовой IT CO₂", kk: "Жылдық IT CO₂" },
  "global.stat1unit": { en: "tons CO₂ per year", ru: "тонн CO₂ в год", kk: "жылына CO₂ тоннасы" },
  "global.stat2": { en: "Data Centers", ru: "Дата-центры", kk: "Дата-орталықтар" },
  "global.stat2unit": { en: "TWh energy per year", ru: "ТВт·ч энергии в год", kk: "жылына ТВт·сағ энергия" },
  "global.stat3": { en: "Global Share", ru: "Глобальная доля", kk: "Жаһандық үлес" },
  "global.stat3unit": { en: "of world emissions", ru: "мировых выбросов", kk: "әлемдік шығарындылар" },

  // Space Impact
  "space.title": { en: "Extended Analysis: Space Impact", ru: "Расширенный анализ: космическое влияние", kk: "Кеңейтілген талдау: ғарыштық әсер" },
  "space.subtitle": { en: "Satellite relay simulation for data transmission carbon impact", ru: "Симуляция спутниковой ретрансляции для оценки углеродного воздействия", kk: "Деректер тасымалдаудың көміртегі әсерін бағалау үшін спутниктік ретрансляция симуляциясы" },
  "space.raw": { en: "Raw Data", ru: "Исходные данные", kk: "Бастапқы деректер" },
  "space.optimized": { en: "Optimized", ru: "Оптимизировано", kk: "Оптималдандырылған" },
  "space.dataTransmitted": { en: "Data Transmitted", ru: "Переданные данные", kk: "Тасымалданған деректер" },
  "space.energyUsage": { en: "Energy Usage", ru: "Энергопотребление", kk: "Энергия тұтыну" },
  "space.co2emissions": { en: "CO₂ Emissions", ru: "Выбросы CO₂", kk: "CO₂ шығарындылары" },
  "space.saved": { en: "Optimization saved", ru: "Оптимизация сэкономила", kk: "Оптимизация үнемдеді" },
  "space.howCalculated": { en: "How this is calculated", ru: "Как это рассчитывается", kk: "Бұл қалай есептеледі" },
  "space.calc1Title": { en: "Data Transfer", ru: "Передача данных", kk: "Деректерді тасымалдау" },
  "space.calc1Desc": { en: "Page weight in bytes measured from actual HTTP response, converted to GB for energy calculations", ru: "Вес страницы в байтах из HTTP-ответа, конвертированный в ГБ для расчёта энергии", kk: "HTTP жауабынан алынған беттің байттағы салмағы, энергияны есептеу үшін ГБ-қа айырбасталады" },
  "space.calc2Title": { en: "Energy per GB", ru: "Энергия на ГБ", kk: "ГБ-қа энергия" },
  "space.calc2Desc": { en: "0.06 kWh/GB (network + data center average) × 1.3 satellite relay overhead factor", ru: "0.06 кВт·ч/ГБ (среднее сети + ЦОД) × 1.3 коэффициент спутниковой ретрансляции", kk: "0.06 кВт·сағ/ГБ (желі + дата-орталық орташа) × 1.3 спутниктік ретрансляция коэффициенті" },
  "space.calc3Title": { en: "CO₂ Intensity", ru: "Интенсивность CO₂", kk: "CO₂ қарқындылығы" },
  "space.calc3Desc": { en: "CO₂ per view from SWD model × satellite overhead factor × regional grid carbon intensity", ru: "CO₂ на просмотр из модели SWD × коэффициент спутника × региональная интенсивность углерода в сети", kk: "SWD моделінен қарау үшін CO₂ × спутник коэффициенті × аймақтық желі көміртегі қарқындылығы" },
  "space.calcNote": { en: "Note: Satellite relay overhead is an estimation based on LEO satellite energy consumption research.", ru: "Примечание: накладные расходы на спутниковую ретрансляцию — оценка на основе исследований энергопотребления LEO-спутников.", kk: "Ескерту: спутниктік ретрансляция шығындары LEO спутниктерінің энергия тұтыну зерттеулеріне негізделген бағалау." },

  // AI Code Optimizer
  "codeopt.title": { en: "AI Code Carbon Optimizer", ru: "AI Оптимизатор углеродного следа кода", kk: "AI Код көміртегі оптимизаторы" },
  "codeopt.subtitle": { en: "Paste your code and get an eco-optimized version with carbon impact analysis", ru: "Вставьте код и получите эко-оптимизированную версию с анализом углеродного воздействия", kk: "Кодыңызды қойыңыз және көміртегі әсерін талдаумен эко-оптималдандырылған нұсқаны алыңыз" },
  "codeopt.input": { en: "Your Code", ru: "Ваш код", kk: "Сіздің кодыңыз" },
  "codeopt.example": { en: "Load Example", ru: "Загрузить пример", kk: "Мысалды жүктеу" },
  "codeopt.placeholder": { en: "Paste your JavaScript/TypeScript code here...", ru: "Вставьте ваш JavaScript/TypeScript код здесь...", kk: "JavaScript/TypeScript кодыңызды осы жерге қойыңыз..." },
  "codeopt.analyzing": { en: "Analyzing...", ru: "Анализируем...", kk: "Талдауда..." },
  "codeopt.analyze": { en: "Analyze & Optimize", ru: "Анализ и оптимизация", kk: "Талдау және оптимизациялау" },
  "codeopt.before": { en: "Before", ru: "До", kk: "Бұрын" },
  "codeopt.after": { en: "After", ru: "После", kk: "Кейін" },
  "codeopt.co2reduction": { en: "Estimated CO₂ Reduction", ru: "Расчётное снижение CO₂", kk: "Болжамды CO₂ азаюы" },
  "codeopt.improvements": { en: "Improvements Applied", ru: "Применённые улучшения", kk: "Қолданылған жақсартулар" },
  "codeopt.optimizedCode": { en: "Optimized Code", ru: "Оптимизированный код", kk: "Оптималдандырылған код" },
  "codeopt.calcComplexity": { en: "Complexity Analysis", ru: "Анализ сложности", kk: "Күрделілік талдауы" },
  "codeopt.calcComplexityDesc": { en: "We count loops, nested loops, DOM queries, and unused patterns to derive a complexity score", ru: "Мы подсчитываем циклы, вложенные циклы, DOM-запросы и неиспользуемые паттерны для получения оценки сложности", kk: "Біз күрделілік балын алу үшін циклдерді, кірістірілген циклдерді, DOM сұрауларын және пайдаланылмаған үлгілерді санаймыз" },
  "codeopt.calcOperations": { en: "Operation Count", ru: "Количество операций", kk: "Операция саны" },
  "codeopt.calcOperationsDesc": { en: "Each operation requires CPU cycles. Fewer operations = less energy = less CO₂", ru: "Каждая операция требует тактов CPU. Меньше операций = меньше энергии = меньше CO₂", kk: "Әр операция CPU циклдерін қажет етеді. Аз операция = аз энергия = аз CO₂" },
  "codeopt.calcCarbon": { en: "Carbon Mapping", ru: "Углеродное отображение", kk: "Көміртегі картасы" },
  "codeopt.calcCarbonDesc": { en: "Green Score maps to estimated CO₂ per 10,000 executions using average server energy consumption data", ru: "Green Score отображается в расчётный CO₂ на 10 000 выполнений на основе среднего энергопотребления серверов", kk: "Green Score серверлердің орташа энергия тұтыну деректерін пайдаланып 10 000 орындауға болжамды CO₂-ге сәйкестендіріледі" },
} as const;

export type TranslationKey = keyof typeof translations;

export function getTranslation(key: TranslationKey, lang: Language): string {
  return translations[key]?.[lang] ?? translations[key]?.en ?? key;
}

export default translations;
