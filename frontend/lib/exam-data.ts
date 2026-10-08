export interface ExamDetails {
  id: string;
  name: string;
  category: string;
  board: string;
  officialSite: string;
  notificationStatus: string;
  notificationReleaseDate?: string;
  applicationDeadline?: string;
  examDate: string;
  examDateDisplay: string;
  vacancies: string;
  syllabus: string[];
  duration: string;
  readiness: number;
  studyPlan: {
    day: string;
    tasks: { time: string; title: string; done: boolean; subject: string }[];
  };
  youtubeVideos: {
    title: string;
    channel: string;
    duration: string;
    url: string;
    thumbnailColor: string;
    views: string;
    viewsCount: number;
    rating: string;
    rankBadge?: string;
  }[];
  pyqs: {
    year: string;
    title: string;
    downloadUrl: string;
    winmeenUrl?: string;
    vetriiUrl?: string;
    size: string;
    questions: number;
  }[];
  mockTests: {
    id: string;
    title: string;
    type: string;
    questions: number;
    durationMinutes: number;
    score?: string;
  }[];
  studyNotes: {
    topic: string;
    subject: string;
    summary: string;
    keyPoints: string[];
    pyqTip: string;
  };
}

export const ALL_TN_EXAMS: Record<string, ExamDetails> = {
  "TNPSC Group 4 & VAO": {
    id: "tnpsc-group4",
    name: "TNPSC Group 4 & VAO",
    category: "General & Administrative",
    board: "Tamil Nadu Public Service Commission (TNPSC)",
    officialSite: "https://www.tnpsc.gov.in",
    notificationStatus: "Official Notification Released (Advt No. 01/2026, Oct 6, 2026) • Apply online till Nov 5, 2026",
    notificationReleaseDate: "October 6, 2026",
    applicationDeadline: "November 5, 2026",
    examDate: "2027-01-10",
    examDateDisplay: "January 10, 2027 (Official Forenoon 09:30 AM – 12:30 PM)",
    vacancies: "6,574+ Posts (VAO, Junior Assistant, Typist, Steno-Typist)",
    syllabus: ["General Tamil (பொதுத்தமிழ்)", "General Studies (10th Std)", "Aptitude & Mental Ability", "Current Events"],
    duration: "4-6 Months",
    readiness: 74,
    studyPlan: {
      day: "Today's Schedule (Group 4 Focus)",
      tasks: [
        { time: "06:00 - 07:30", title: "பொதுத்தமிழ் - இலக்கணம் (எதுகை, மோனை, இயைபு)", done: true, subject: "Tamil" },
        { time: "09:00 - 10:30", title: "Indian Polity - Fundamental Rights & DPSP", done: true, subject: "GS" },
        { time: "11:00 - 12:30", title: "Aptitude - Simplification & Percentage (Samacheer 8th)", done: false, subject: "Aptitude" },
        { time: "14:30 - 16:00", title: "TN History (Unit 8) - Sangam Age Literature", done: false, subject: "Unit 8" },
        { time: "19:00 - 20:00", title: "Daily Current Affairs Quiz & Revision", done: false, subject: "CA" }
      ]
    },
    youtubeVideos: [
      { title: "TNPSC Group 4 General Tamil Complete Marathon (100/100 Target)", channel: "Suresh IAS Academy", duration: "3 hrs 45 mins", url: "https://www.youtube.com/results?search_query=tnpsc+group+4+general+tamil+suresh+ias", thumbnailColor: "from-blue-600 to-indigo-800", views: "1.4M views", viewsCount: 1400000, rating: "4.9 ★", rankBadge: "#1 Most Viewed" },
      { title: "Unit 8 & Unit 9 Tamil Society Full Revision Marathon", channel: "Vetrii IAS Study Circle", duration: "2 hrs 15 mins", url: "https://www.youtube.com/results?search_query=tnpsc+group+4+unit+8+vetrii+ias", thumbnailColor: "from-purple-600 to-pink-800", views: "890K views", viewsCount: 890000, rating: "4.8 ★", rankBadge: "#2 Trending" },
      { title: "Aptitude & Maths 25/25 All Shortcut Formulas", channel: "We Shine Academy", duration: "1 hr 30 mins", url: "https://www.youtube.com/results?search_query=tnpsc+group+4+aptitude+we+shine", thumbnailColor: "from-emerald-600 to-teal-800", views: "650K views", viewsCount: 650000, rating: "4.9 ★", rankBadge: "#3 Top Rated" },
      { title: "10th Samacheer Kalvi Science All Units Rapid Revision", channel: "Kingmakers IAS Academy", duration: "2 hrs 10 mins", url: "https://www.youtube.com/results?search_query=samacheer+10th+science+tnpsc", thumbnailColor: "from-amber-600 to-orange-800", views: "480K views", viewsCount: 480000, rating: "4.7 ★" }
    ],
    pyqs: [
      {
        year: "2024",
        title: "TNPSC Group 4 Official Question Paper & Master Key",
        downloadUrl: "https://www.tnpsc.gov.in/English/previous_question_papers.aspx",
        winmeenUrl: "https://www.winmeen.com/tnpsc-group-4-previous-year-question-paper/",
        vetriiUrl: "https://www.padasalai.net/2024/06/tnpsc-group-4-exam-2024-question-paper-answer-key.html",
        size: "4.8 MB",
        questions: 200
      },
      {
        year: "2022",
        title: "TNPSC Group 4 & VAO Master Question Paper (GS + Tamil)",
        downloadUrl: "https://www.tnpsc.gov.in/English/previous_question_papers.aspx",
        winmeenUrl: "https://www.winmeen.com/tnpsc-group-4-previous-year-question-paper/",
        vetriiUrl: "https://www.padasalai.net/",
        size: "3.9 MB",
        questions: 200
      },
      {
        year: "2019",
        title: "TNPSC Group 4 General Tamil & GS Solved Paper",
        downloadUrl: "https://www.tnpsc.gov.in/English/previous_question_papers.aspx",
        winmeenUrl: "https://www.winmeen.com/tnpsc-group-4-previous-year-question-paper/",
        vetriiUrl: "https://www.padasalai.net/",
        size: "3.2 MB",
        questions: 200
      },
      {
        year: "2018",
        title: "TNPSC Group 4 & VAO Solved Paper with Explanations",
        downloadUrl: "https://www.tnpsc.gov.in/English/previous_question_papers.aspx",
        winmeenUrl: "https://www.winmeen.com/tnpsc-group-4-previous-year-question-paper/",
        vetriiUrl: "https://www.padasalai.net/",
        size: "5.1 MB",
        questions: 200
      },
      {
        year: "2016",
        title: "TNPSC Group 4 Official Question Paper & Final Answer Key",
        downloadUrl: "https://www.tnpsc.gov.in/English/previous_question_papers.aspx",
        winmeenUrl: "https://www.winmeen.com/tnpsc-group-4-previous-year-question-paper/",
        vetriiUrl: "https://www.padasalai.net/",
        size: "4.3 MB",
        questions: 200
      },
      {
        year: "2014",
        title: "TNPSC Group 4 & VAO Master Question Paper",
        downloadUrl: "https://www.tnpsc.gov.in/English/previous_question_papers.aspx",
        winmeenUrl: "https://www.winmeen.com/tnpsc-group-4-previous-year-question-paper/",
        vetriiUrl: "https://www.padasalai.net/",
        size: "3.7 MB",
        questions: 200
      }
    ],
    mockTests: [
      { id: "g4-mock-1", title: "TNPSC Group 4 Full Mock Examination", type: "Full Mock Test", questions: 200, durationMinutes: 180, score: "168 / 200" },
      { id: "g4-mock-2", title: "General Tamil (பொதுத்தமிழ்) 100 Qs Marathon", type: "Subject Test", questions: 100, durationMinutes: 90, score: "92 / 100" },
      { id: "g4-mock-3", title: "Unit 8 & Unit 9 State Administration Test", type: "Topic Test", questions: 50, durationMinutes: 45, score: "41 / 50" },
      { id: "g4-mock-4", title: "Mental Ability & Aptitude Speed Test", type: "Speed Test", questions: 25, durationMinutes: 20, score: "Pending" }
    ],
    studyNotes: {
      topic: "Fundamental Rights (அடிப்படை உரிமைகள்)",
      subject: "Indian Polity & Constitution",
      summary: "Enshrined in Part III of the Constitution of India (Articles 12-35). Inspired by the US Bill of Rights. Known as the Magna Carta of India.",
      keyPoints: [
        "Right to Equality (Articles 14–18)",
        "Right to Freedom (Articles 19–22)",
        "Right against Exploitation (Articles 23–24)",
        "Right to Freedom of Religion (Articles 25–28)",
        "Cultural and Educational Rights (Articles 29–30)",
        "Right to Constitutional Remedies (Article 32 - Heart & Soul according to Dr. Ambedkar)"
      ],
      pyqTip: "Repeated in Group 4 2019 & 2022: Article 21A (Right to Education) added by 86th Constitutional Amendment Act 2002."
    }
  },

  "TNPSC Group 2 / 2A": {
    id: "tnpsc-group2",
    name: "TNPSC Group 2 / 2A",
    category: "Gazetted & Executive",
    board: "Tamil Nadu Public Service Commission (TNPSC)",
    officialSite: "https://www.tnpsc.gov.in",
    notificationStatus: "Official Notification Active • Combined Civil Services - II",
    examDate: "2026-11-01",
    examDateDisplay: "November 1, 2026 (Prelims Exam)",
    vacancies: "2,327+ Posts (Sub-Registrar, Municipal Commissioner, Assistant)",
    syllabus: ["General Studies (Degree Std)", "Tamil Eligibility Test", "Mains: Tamil to English Translation, Essay & GS", "Aptitude"],
    duration: "6-9 Months",
    readiness: 68,
    studyPlan: {
      day: "Comprehensive Group 2 Prelims & Mains Schedule",
      tasks: [
        { time: "06:30 - 08:30", title: "Mains Essay & Translation Writing Practice (திருக்குறள்)", done: true, subject: "Mains" },
        { time: "09:30 - 11:30", title: "Modern Indian History & Tamil Nadu Freedom Struggle", done: true, subject: "History" },
        { time: "14:00 - 15:30", title: "Indian Economy - Five Year Plans & NITI Aayog", done: false, subject: "Economy" },
        { time: "16:00 - 17:30", title: "TN Administration (Unit 9) - Social Welfare Schemes", done: false, subject: "Unit 9" },
        { time: "20:00 - 21:00", title: "Prelims 50 Qs Timed Mock Drill", done: false, subject: "Practice" }
      ]
    },
    youtubeVideos: [
      { title: "TNPSC Group 2 & 2A Mains Descriptive Writing Masterclass", channel: "Shankar IAS Academy", duration: "1 hr 45 mins", url: "https://www.youtube.com/results?search_query=tnpsc+group+2+mains+shankar+ias", thumbnailColor: "from-blue-700 to-indigo-900", views: "980K views", viewsCount: 980000, rating: "4.9 ★", rankBadge: "#1 Most Viewed" },
      { title: "Unit 9 Tamil Nadu Development Administration", channel: "Suresh IAS Academy", duration: "2 hrs 20 mins", url: "https://www.youtube.com/results?search_query=tnpsc+group+2+unit+9+suresh+ias", thumbnailColor: "from-cyan-600 to-blue-800", views: "740K views", viewsCount: 740000, rating: "4.8 ★", rankBadge: "#2 Trending" },
      { title: "Thirukkural for TNPSC Mains - Key Essays & Concepts", channel: "Manidhaneyam Free IAS Academy", duration: "1 hr 15 mins", url: "https://www.youtube.com/results?search_query=thirukkural+tnpsc+group+2+mains", thumbnailColor: "from-rose-600 to-orange-800", views: "410K views", viewsCount: 410000, rating: "4.8 ★" }
    ],
    pyqs: [
      { year: "2024", title: "TNPSC Group 2 Prelims Official Paper & Key", downloadUrl: "https://www.tnpsc.gov.in/english/previous_question_papers.html", size: "4.2 MB", questions: 200 },
      { year: "2022", title: "TNPSC Group 2 Mains Question Paper (Paper I & II)", downloadUrl: "https://www.tnpsc.gov.in/english/previous_question_papers.html", size: "6.5 MB", questions: 100 },
      { year: "2018", title: "TNPSC Group 2 Prelims Previous Year Paper", downloadUrl: "https://www.tnpsc.gov.in/english/previous_question_papers.html", size: "3.8 MB", questions: 200 }
    ],
    mockTests: [
      { id: "g2-mock-1", title: "TNPSC Group 2 Prelims Full Mock", type: "Full Mock Test", questions: 200, durationMinutes: 180, score: "142 / 200" },
      { id: "g2-mock-2", title: "Unit 9 Development Administration in TN", type: "Subject Test", questions: 50, durationMinutes: 45, score: "Pending" },
      { id: "g2-mock-3", title: "Mains Paper I Tamil Eligibility Mock Test", type: "Mains Test", questions: 100, durationMinutes: 180, score: "Pending" }
    ],
    studyNotes: {
      topic: "Tamil Nadu Welfare Schemes & Social Justice",
      subject: "Unit 9: Development Administration in Tamil Nadu",
      summary: "Tamil Nadu leads the country in Human Development Index, Gross Enrollment Ratio in Higher Education (51.4%), and Social Safety Net initiatives.",
      keyPoints: [
        "Moovalur Ramamirtham Ammaiyar Pudhumai Penn Scheme (Rs 1000/mo for college girls)",
        "Chief Minister's Breakfast Scheme (முதலமைச்சரின் காலை உணவுத் திட்டம்)",
        "Kalaignar Magalir Urimai Thogai (Rs 1000/mo to women heads of families)",
        "Illam Thedi Kalvi & Makkalai Thedi Maruthuvam initiatives"
      ],
      pyqTip: "Mains 2022 Question: Evaluate the role of Dravidian movement in women empowerment in Tamil Nadu."
    }
  },

  "TNPSC Group 1": {
    id: "tnpsc-group1",
    name: "TNPSC Group 1 (Deputy Collector / DSP)",
    category: "Top Civil Services",
    board: "Tamil Nadu Public Service Commission (TNPSC)",
    officialSite: "https://www.tnpsc.gov.in",
    notificationStatus: "Official Notification Active • Group 1 Services",
    examDate: "2026-09-27",
    examDateDisplay: "September 27, 2026 (Prelims Exam)",
    vacancies: "90+ Executive Posts (Deputy Collector, DSP, Assistant Commissioner)",
    syllabus: ["Prelims: GS (175 Qs) + Aptitude (25 Qs)", "Mains Paper 1: Tamil Eligibility", "Mains Paper 2: Modern India, Social Issues, Science & Tech", "Mains Paper 3: Indian Polity, Environment, Indian Economy", "Mains Paper 4: Geography of TN, Ethics & Integrity, Unit 8"],
    duration: "10-14 Months",
    readiness: 62,
    studyPlan: {
      day: "Intensive Group 1 Officer Track",
      tasks: [
        { time: "05:30 - 07:30", title: "Mains Paper 2 - Science & Technology in National Development", done: true, subject: "SciTech" },
        { time: "08:30 - 11:00", title: "Ethics, Integrity & Aptitude (Case Studies Practice)", done: true, subject: "Ethics" },
        { time: "13:00 - 15:00", title: "Tamil Society, Culture & Heritage (Unit 8 In-Depth)", done: false, subject: "Unit 8" },
        { time: "16:00 - 18:00", title: "National & State Economic Indicators (The Hindu Analysis)", done: false, subject: "Economy" },
        { time: "19:30 - 21:00", title: "Answer Writing Evaluation with AI Coach", done: false, subject: "Review" }
      ]
    },
    youtubeVideos: [
      { title: "TNPSC Group 1 Topper Strategy & Booklist", channel: "Kingmakers IAS Academy", duration: "1 hr 10 mins", url: "https://www.youtube.com/results?search_query=tnpsc+group+1+topper+strategy", thumbnailColor: "from-amber-700 to-red-900", views: "1.1M views", viewsCount: 1100000, rating: "4.9 ★", rankBadge: "#1 Most Viewed" },
      { title: "Ethics & Integrity for TNPSC Group 1 Mains", channel: "Shankar IAS Academy", duration: "2 hrs 00 mins", url: "https://www.youtube.com/results?search_query=tnpsc+group+1+mains+ethics+shankar+ias", thumbnailColor: "from-blue-900 to-indigo-950", views: "520K views", viewsCount: 520000, rating: "4.8 ★" },
      { title: "Science & Tech Breakthroughs for Group 1 Mains", channel: "Vetrii IAS Academy", duration: "1 hr 30 mins", url: "https://www.youtube.com/results?search_query=group+1+science+and+tech+vetrii+ias", thumbnailColor: "from-emerald-700 to-teal-900", views: "380K views", viewsCount: 380000, rating: "4.7 ★" }
    ],
    pyqs: [
      { year: "2024", title: "TNPSC Group 1 Prelims Official Question Paper", downloadUrl: "https://www.tnpsc.gov.in/english/previous_question_papers.html", size: "4.5 MB", questions: 200 },
      { year: "2023", title: "TNPSC Group 1 Mains Full Papers (Papers I to IV)", downloadUrl: "https://www.tnpsc.gov.in/english/previous_question_papers.html", size: "8.2 MB", questions: 400 },
      { year: "2021", title: "TNPSC Group 1 Prelims & Mains Solved Papers", downloadUrl: "https://www.tnpsc.gov.in/english/previous_question_papers.html", size: "9.1 MB", questions: 600 }
    ],
    mockTests: [
      { id: "g1-mock-1", title: "Group 1 All-Tamil Nadu Open Mock Prelims", type: "Full Prelims Mock", questions: 200, durationMinutes: 180, score: "138 / 200" },
      { id: "g1-mock-2", title: "Mains Paper 3: Indian Polity & Economy Mock", type: "Descriptive Mock", questions: 30, durationMinutes: 180, score: "Pending" }
    ],
    studyNotes: {
      topic: "Science & Technology: Space & Defence Missions of ISRO & DRDO",
      subject: "Mains Paper II - Science & Technology",
      summary: "Recent milestones including Chandrayaan-3 landing on Lunar South Pole, Aditya-L1 Solar Mission, and Gaganyaan human spaceflight mission.",
      keyPoints: [
        "Kulasekarapattinam Spaceport in Thoothukudi, Tamil Nadu for SSLV launches",
        "Vikram Sarabhai Space Centre (VSSC) & Propulsion Complex at Mahendragiri (IPRC, TN)",
        "Indigenous Cryogenic Engine (CE-20) testing at Mahendragiri",
        "Applications of remote sensing in Tamil Nadu disaster management and water resource planning"
      ],
      pyqTip: "Direct Group 1 Mains 2023 Question: Discuss the strategic importance of the upcoming spaceport at Kulasekarapattinam for Tamil Nadu."
    }
  },

  "Tamil Nadu Housing Board (TNHB) / Slum Clearance": {
    id: "tnhb-exam",
    name: "Tamil Nadu Housing Board (TNHB) / Slum Clearance",
    category: "State Board & Public Sector",
    board: "Tamil Nadu Housing Board (TNHB)",
    officialSite: "https://www.tnhb.tn.gov.in",
    notificationStatus: "Direct Recruitment Active • Assistant Engineer, Junior Assistant & Typist",
    examDate: "2026-12-19",
    examDateDisplay: "December 19, 2026",
    vacancies: "277+ Posts (AE Civil, Junior Assistant, Surveyor, Typist)",
    syllabus: ["Part A: General Studies (Degree / Diploma Std)", "Part B: Aptitude & Mental Ability", "Part C: General Tamil / English Eligibility", "Part D: Civil Engineering / Administrative Domain Knowledge"],
    duration: "3-5 Months",
    readiness: 72,
    studyPlan: {
      day: "TNHB Special Preparation Track",
      tasks: [
        { time: "06:30 - 08:30", title: "General Studies - Samacheer Social Science & TN Geography", done: true, subject: "GS" },
        { time: "09:30 - 11:30", title: "Civil Engineering / Building Materials & Construction (Or Admin Rules)", done: true, subject: "Domain" },
        { time: "14:00 - 15:30", title: "Aptitude - Time & Work, Mensuration, Percentages", done: false, subject: "Aptitude" },
        { time: "16:30 - 18:00", title: "Tamil Eligibility & Grammar Revision", done: false, subject: "Tamil" },
        { time: "19:30 - 20:30", title: "TNHB 100 Qs Model Practice Test", done: false, subject: "Mock" }
      ]
    },
    youtubeVideos: [
      { title: "Tamil Nadu Housing Board (TNHB) Exam Complete Syllabus & Strategy", channel: "Suresh IAS Academy", duration: "1 hr 40 mins", url: "https://www.youtube.com/results?search_query=tamil+nadu+housing+board+exam+preparation", thumbnailColor: "from-blue-700 to-indigo-900", views: "340K views", viewsCount: 340000, rating: "4.8 ★", rankBadge: "#1 Most Viewed" },
      { title: "TNHB Assistant Engineer Civil Engineering Marathon Class", channel: "Spark Institute for Competitive Exams", duration: "3 hrs 10 mins", url: "https://www.youtube.com/results?search_query=tnhb+ae+civil+engineering", thumbnailColor: "from-amber-600 to-orange-900", views: "210K views", viewsCount: 210000, rating: "4.9 ★", rankBadge: "#2 Trending" },
      { title: "TNHB Junior Assistant & Typist General Studies Revision", channel: "Aram IAS Academy", duration: "2 hrs 15 mins", url: "https://www.youtube.com/results?search_query=tnhb+junior+assistant+exam", thumbnailColor: "from-emerald-700 to-teal-900", views: "165K views", viewsCount: 165000, rating: "4.7 ★" }
    ],
    pyqs: [
      { year: "2021", title: "TNHB Assistant Engineer (Civil) Official Question Paper & Key", downloadUrl: "https://www.tnhb.tn.gov.in", size: "4.2 MB", questions: 150 },
      { year: "2019", title: "TNHB Junior Assistant & Typist Question Paper with Solved Key", downloadUrl: "https://www.tnhb.tn.gov.in", size: "3.7 MB", questions: 100 },
      { year: "2017", title: "Tamil Nadu Slum Clearance Board Technical Assistant Solved Paper", downloadUrl: "https://www.tnhb.tn.gov.in", size: "3.1 MB", questions: 100 }
    ],
    mockTests: [
      { id: "tnhb-mock-1", title: "TNHB Full Length Mock Examination (150 Questions)", type: "Full Mock Test", questions: 150, durationMinutes: 180, score: "119 / 150" },
      { id: "tnhb-mock-2", title: "Civil Engineering & Building Materials Test", type: "Domain Test", questions: 75, durationMinutes: 90, score: "62 / 75" },
      { id: "tnhb-mock-3", title: "General Studies & Aptitude Speed Test", type: "Sectional Test", questions: 50, durationMinutes: 45, score: "Pending" }
    ],
    studyNotes: {
      topic: "Urban Development & Housing Policies in Tamil Nadu",
      subject: "General Studies & State Infrastructure",
      summary: "Tamil Nadu Housing Board (constituted in 1961) provides planned residential housing. Tamil Nadu Urban Habitat Development Board (formerly Slum Clearance Board, established in 1970) ensures slum-free cities under 'Housing for All'.",
      keyPoints: [
        "TNHB was formed under Tamil Nadu State Housing Board Act, 1961",
        "TN Slum Clearance Board renamed to Tamil Nadu Urban Habitat Development Board (TNUHDB) in 2021",
        "Kalaignar Veetu Vasathi Thittam (housing for rural poor)",
        "Chief Minister's Urban Housing Scheme (CMUHS) in municipal areas"
      ],
      pyqTip: "Frequently asked question: In which year was the Tamil Nadu Housing Board formed? (1961)."
    }
  },

  "TNUSRB Sub-Inspector of Police": {
    id: "tnusrb-si",
    name: "TNUSRB Sub-Inspector of Police (Taluk, AR, TSP)",
    category: "Uniformed Services",
    board: "Tamil Nadu Uniformed Services Recruitment Board (TNUSRB)",
    officialSite: "https://www.tnusrb.tn.gov.in",
    notificationStatus: "Official Notification Active • Joint Recruitment",
    examDate: "2026-11-20",
    examDateDisplay: "November 20, 2026 (Written Exam)",
    vacancies: "750+ Sub-Inspector Posts",
    syllabus: ["Part A: General Knowledge (80 Marks)", "Part B: Psychology, Logical Analysis, Numerical Ability (60 Marks)", "Tamil Eligibility Test", "Physical Measurement & Endurance (PET/PMT)"],
    duration: "4-6 Months",
    readiness: 79,
    studyPlan: {
      day: "TN Police Sub-Inspector Mission 2024",
      tasks: [
        { time: "05:00 - 06:30", title: "Physical Training (1500m Run / 400m Sprint & Long Jump)", done: true, subject: "Fitness" },
        { time: "08:00 - 10:00", title: "Psychology - Number Series, Syllogism & Blood Relations", done: true, subject: "Psychology" },
        { time: "11:00 - 13:00", title: "Indian Penal Code (IPC), CrPC & Constitution Basics", done: false, subject: "Law/GK" },
        { time: "15:00 - 17:00", title: "General Science (Physics & Biology Samacheer 6th to 10th)", done: false, subject: "Science" },
        { time: "19:00 - 20:30", title: "TNUSRB 140 Questions Speed Practice Test", done: false, subject: "Mock" }
      ]
    },
    youtubeVideos: [
      { title: "TNUSRB SI Psychology 60/60 Full Marks Shortcut Tricks", channel: "Suresh IAS Academy", duration: "2 hrs 40 mins", url: "https://www.youtube.com/results?search_query=tnusrb+si+psychology+tricks", thumbnailColor: "from-red-600 to-rose-900", views: "1.2M views", viewsCount: 1200000, rating: "4.9 ★", rankBadge: "#1 Most Viewed" },
      { title: "TNUSRB SI GK & Science 6th-10th Book Back Questions", channel: "Muppadai Training Academy", duration: "3 hrs 10 mins", url: "https://www.youtube.com/results?search_query=tnusrb+si+muppadai+training+academy", thumbnailColor: "from-blue-800 to-slate-900", views: "850K views", viewsCount: 850000, rating: "4.8 ★", rankBadge: "#2 Trending" },
      { title: "Physical Endurance Test (PET) Rope Climbing & 1500m Strategy", channel: "Sub Inspector Physical Academy", duration: "45 mins", url: "https://www.youtube.com/results?search_query=tnusrb+si+physical+test+tips", thumbnailColor: "from-emerald-700 to-slate-900", views: "420K views", viewsCount: 420000, rating: "4.7 ★" }
    ],
    pyqs: [
      { year: "2023", title: "TNUSRB SI Official Written Exam Question Paper & Key", downloadUrl: "https://www.tnusrb.tn.gov.in", size: "3.4 MB", questions: 140 },
      { year: "2022", title: "TNUSRB SI Taluk & Armed Reserve Question Paper", downloadUrl: "https://www.tnusrb.tn.gov.in", size: "3.1 MB", questions: 140 },
      { year: "2019", title: "TNUSRB Sub-Inspector (Open & Departmental) Paper", downloadUrl: "https://www.tnusrb.tn.gov.in", size: "4.0 MB", questions: 140 }
    ],
    mockTests: [
      { id: "si-mock-1", title: "TNUSRB SI Full Written Test (140 Questions - 70 Marks)", type: "Full Mock Test", questions: 140, durationMinutes: 150, score: "61 / 70" },
      { id: "si-mock-2", title: "Psychology & Reasoning Mastery Drill", type: "Sectional Test", questions: 60, durationMinutes: 60, score: "54 / 60" },
      { id: "si-mock-3", title: "General Science & History Rapid Fire", type: "Topic Test", questions: 80, durationMinutes: 60, score: "Pending" }
    ],
    studyNotes: {
      topic: "Psychology: Coding-Decoding, Syllogism & Venn Diagrams",
      subject: "Part B: Psychology & Mental Ability",
      summary: "Part B carries 60 questions (30 marks) in TNUSRB SI. High accuracy here is decisive for securing open quota top rank.",
      keyPoints: [
        "Alphabet position memorization (A=1 ... Z=26, reverse order Z=1 ... A=26)",
        "Direction sense: Pythagoras theorem applications in displacement",
        "Venn diagrams: Classification of sets (e.g. Police, Officers, Citizens)",
        "Statements and Conclusions / Assumptions logic"
      ],
      pyqTip: "In SI 2022 & 2023, 12 questions were directly based on Blood Relations and Direction Sense."
    }
  },

  "TNUSRB Police Constable (PC)": {
    id: "tnusrb-pc",
    name: "TNUSRB Police Constable (PC / Jail Warder / Fireman)",
    category: "Uniformed Services",
    board: "Tamil Nadu Uniformed Services Recruitment Board (TNUSRB)",
    officialSite: "https://www.tnusrb.tn.gov.in",
    notificationStatus: "Official Notification Active • Grade II Recruitment",
    examDate: "2026-12-10",
    examDateDisplay: "December 10, 2026 (Written Exam)",
    vacancies: "3,359+ Grade II Constables & Firemen",
    syllabus: ["Part A: General Knowledge (45 Marks)", "Part B: Psychology (25 Marks)", "Tamil Eligibility Test (80 Marks - Qualifying)", "Physical Tests"],
    duration: "3-5 Months",
    readiness: 81,
    studyPlan: {
      day: "TN Police Constable Fast Track",
      tasks: [
        { time: "05:30 - 07:00", title: "Morning Running & Endurance Training", done: true, subject: "Physical" },
        { time: "08:30 - 10:30", title: "Samacheer Kalvi 6th to 10th Social Science Highlights", done: true, subject: "GK" },
        { time: "11:30 - 13:00", title: "Psychology - Number Puzzles & Direction Tests", done: false, subject: "Psychology" },
        { time: "15:00 - 16:30", title: "Tamil Eligibility 80 Questions Practice", done: false, subject: "Tamil" },
        { time: "18:00 - 19:30", title: "TN Police Constable 70 Qs Mock Paper", done: false, subject: "Mock" }
      ]
    },
    youtubeVideos: [
      { title: "TN Police PC Exam 2024 Complete Revision", channel: "Muppadai Training Academy", duration: "4 hrs 15 mins", url: "https://www.youtube.com/results?search_query=tnusrb+pc+exam+muppadai", thumbnailColor: "from-blue-700 to-indigo-900", views: "1.5M views", viewsCount: 1500000, rating: "4.9 ★", rankBadge: "#1 Most Viewed" },
      { title: "PC Exam Tamil Eligibility 80/80 Target", channel: "Suresh IAS Academy", duration: "2 hrs 10 mins", url: "https://www.youtube.com/results?search_query=tnusrb+pc+tamil+eligibility", thumbnailColor: "from-emerald-700 to-teal-900", views: "780K views", viewsCount: 780000, rating: "4.8 ★" }
    ],
    pyqs: [
      { year: "2023", title: "TNUSRB Police Constable Official Question Paper & Key", downloadUrl: "https://www.tnusrb.tn.gov.in", size: "2.8 MB", questions: 70 },
      { year: "2022", title: "TN Police Constable Question Paper (Grade II PC)", downloadUrl: "https://www.tnusrb.tn.gov.in", size: "2.5 MB", questions: 70 },
      { year: "2020", title: "TNUSRB PC / Fireman Solved Paper", downloadUrl: "https://www.tnusrb.tn.gov.in", size: "3.1 MB", questions: 70 }
    ],
    mockTests: [
      { id: "pc-mock-1", title: "TNUSRB Police Constable Full Mock Exam", type: "Full Mock Test", questions: 70, durationMinutes: 80, score: "64 / 70" },
      { id: "pc-mock-2", title: "Tamil Eligibility Qualifying Test (80 Qs)", type: "Qualifying", questions: 80, durationMinutes: 80, score: "74 / 80" }
    ],
    studyNotes: {
      topic: "General Science: Nutrition, Diseases & Vitamins",
      subject: "Part A: General Knowledge (Samacheer Science)",
      summary: "Key facts on vitamin deficiency diseases (Vitamin A - Night Blindness, Vitamin C - Scurvy, Vitamin D - Rickets).",
      keyPoints: [
        "Balanced diet and macronutrients (Carbohydrates, Proteins, Fats)",
        "Bacterial vs Viral diseases (Cholera, Typhoid vs Dengue, Polio)",
        "Human organ systems (Heart circulation, Kidney excretion)",
        "Basic physics units: Force (Newton), Work (Joule), Pressure (Pascal)"
      ],
      pyqTip: "Direct questions appear every year on deficiency diseases and SI units."
    }
  },

  "TRB Teachers Eligibility Test (TNTET)": {
    id: "trb-tet",
    name: "TRB Teachers Eligibility Test (TNTET Paper 1 & 2)",
    category: "Teaching & Education",
    board: "Teachers Recruitment Board (TRB)",
    officialSite: "https://trb.tn.gov.in",
    notificationStatus: "Official Notification Active • Paper I & II",
    examDate: "2026-11-28",
    examDateDisplay: "November 28, 2026",
    vacancies: "State-Wide Eligibility Certification",
    syllabus: ["Child Development and Pedagogy (30 Qs)", "Language I - Tamil (30 Qs)", "Language II - English (30 Qs)", "Mathematics & Science OR Social Science (60 Qs)"],
    duration: "4-6 Months",
    readiness: 71,
    studyPlan: {
      day: "TNTET Paper II Teaching Special",
      tasks: [
        { time: "06:30 - 08:30", title: "Child Psychology (Piaget, Vygotsky, Kohlberg Theories)", done: true, subject: "Pedagogy" },
        { time: "09:30 - 11:30", title: "Tamil Grammar (இலக்கணம், இலக்கியம், உரைநடை)", done: true, subject: "Tamil" },
        { time: "14:00 - 16:00", title: "Mathematics & Science (Samacheer 6th to 10th)", done: false, subject: "Maths/Sci" },
        { time: "17:00 - 18:30", title: "English Pedagogy & Comprehension Rules", done: false, subject: "English" },
        { time: "20:00 - 21:00", title: "TNTET 150 Qs Sectional Practice", done: false, subject: "Mock" }
      ]
    },
    youtubeVideos: [
      { title: "TNTET Child Development & Pedagogy Complete Marathon", channel: "Kaviyan Academy TNTET", duration: "3 hrs 30 mins", url: "https://www.youtube.com/results?search_query=tntet+child+development+pedagogy", thumbnailColor: "from-amber-600 to-yellow-800", views: "620K views", viewsCount: 620000, rating: "4.9 ★", rankBadge: "#1 Most Viewed" },
      { title: "TNTET Paper 2 Social Science 6th-10th Complete Revision", channel: "Aram IAS / TRB Academy", duration: "2 hrs 45 mins", url: "https://www.youtube.com/results?search_query=tntet+paper+2+social+science", thumbnailColor: "from-blue-700 to-indigo-900", views: "390K views", viewsCount: 390000, rating: "4.8 ★" }
    ],
    pyqs: [
      { year: "2023", title: "TNTET Paper II Computer Based Examination Papers", downloadUrl: "https://trb.tn.gov.in", size: "5.4 MB", questions: 150 },
      { year: "2022", title: "TNTET Paper I Official Question Paper with Key", downloadUrl: "https://trb.tn.gov.in", size: "4.8 MB", questions: 150 },
      { year: "2019", title: "TNTET Paper I & II Solved Question Bank", downloadUrl: "https://trb.tn.gov.in", size: "6.2 MB", questions: 300 }
    ],
    mockTests: [
      { id: "tet-mock-1", title: "TNTET Paper II Full Length Mock Test (150 Questions)", type: "Full Mock Test", questions: 150, durationMinutes: 180, score: "112 / 150" },
      { id: "tet-mock-2", title: "Child Development & Pedagogy 30 Qs Speed Drill", type: "Pedagogy Test", questions: 30, durationMinutes: 30, score: "26 / 30" }
    ],
    studyNotes: {
      topic: "Theories of Child Learning: Piaget vs Vygotsky",
      subject: "Child Development and Pedagogy",
      summary: "Piaget emphasized cognitive constructivism through four stages (Sensorimotor, Pre-operational, Concrete, Formal). Vygotsky emphasized Social Constructivism, Zone of Proximal Development (ZPD) and Scaffolding.",
      keyPoints: [
        "Jean Piaget: Schema, Assimilation, Accommodation, Equilibrium",
        "Lev Vygotsky: ZPD, More Knowledgeable Other (MKO), Scaffolding",
        "Kohlberg's Stages of Moral Development (Pre-conventional, Conventional, Post-conventional)",
        "Gardner's Theory of Multiple Intelligences (8 types)"
      ],
      pyqTip: "Questions on Piaget's stages and Vygotsky's ZPD appear in every single TNTET examination."
    }
  },

  "TRB Post Graduate Assistants (PG TRB)": {
    id: "trb-pg",
    name: "TRB Post Graduate Assistants (PG TRB)",
    category: "Teaching & Education",
    board: "Teachers Recruitment Board (TRB)",
    officialSite: "https://trb.tn.gov.in",
    notificationStatus: "Annual Planner Scheduled • Direct Recruitment",
    examDate: "2026-12-14",
    examDateDisplay: "December 14, 2026",
    vacancies: "2,200+ Post Graduate Teacher Posts",
    syllabus: ["Main Subject (PG Level - 110 Marks)", "Educational Methodology / Pedagogy (30 Marks)", "General Knowledge (10 Marks)", "Tamil Eligibility Test"],
    duration: "6-8 Months",
    readiness: 65,
    studyPlan: {
      day: "PG TRB Core Subject & Methodology Plan",
      tasks: [
        { time: "06:00 - 08:30", title: "Core PG Subject Unit 1 & 2 Revision", done: true, subject: "Main Subject" },
        { time: "09:30 - 11:30", title: "Educational Psychology & Teaching Methodology", done: true, subject: "Pedagogy" },
        { time: "14:00 - 16:00", title: "Core Subject Previous Year Question Solving", done: false, subject: "PYQ" },
        { time: "17:00 - 18:30", title: "General Knowledge & Current Educational Policies (NEP)", done: false, subject: "GK" },
        { time: "20:00 - 21:30", title: "150 Qs Full Test Drill", done: false, subject: "Mock" }
      ]
    },
    youtubeVideos: [
      { title: "PG TRB Educational Psychology Complete Revision", channel: "Suresh TRB Academy", duration: "2 hrs 30 mins", url: "https://www.youtube.com/results?search_query=pg+trb+educational+psychology", thumbnailColor: "from-purple-700 to-indigo-900", views: "490K views", viewsCount: 490000, rating: "4.9 ★", rankBadge: "#1 Most Viewed" },
      { title: "PG TRB Tamil / English / Maths Subject Guidance", channel: "TN TRB Aspirants Forum", duration: "1 hr 45 mins", url: "https://www.youtube.com/results?search_query=pg+trb+subject+revision", thumbnailColor: "from-blue-700 to-cyan-900", views: "280K views", viewsCount: 280000, rating: "4.8 ★" }
    ],
    pyqs: [
      { year: "2022", title: "PG TRB Official Question Paper (All Subjects) & Master Key", downloadUrl: "https://trb.tn.gov.in", size: "7.8 MB", questions: 150 },
      { year: "2019", title: "PG TRB Examination Question Paper & Answer Key", downloadUrl: "https://trb.tn.gov.in", size: "6.9 MB", questions: 150 }
    ],
    mockTests: [
      { id: "pgtrb-mock-1", title: "PG TRB Full Length Mock Test (150 Marks)", type: "Full Mock Test", questions: 150, durationMinutes: 180, score: "108 / 150" }
    ],
    studyNotes: {
      topic: "Educational Psychology: Learning Theories & Curriculum Design",
      subject: "Educational Methodology (30 Marks)",
      summary: "Focus on Thorndike's Laws of Learning, Skinner's Operant Conditioning, Bloom's Taxonomy of Educational Objectives, and National Curriculum Framework.",
      keyPoints: [
        "Bloom's Taxonomy Cognitive Domain: Remember, Understand, Apply, Analyze, Evaluate, Create",
        "Thorndike's Primary Laws: Law of Readiness, Law of Exercise, Law of Effect",
        "Formative vs Summative Assessment techniques",
        "Inclusive Education and handling gifted and slow learners"
      ],
      pyqTip: "Bloom's taxonomy revised levels is asked in almost all PG TRB methodology sections."
    }
  },

  "TNEB / TANGEDCO Assistant Engineer (AE)": {
    id: "tneb-ae",
    name: "TNEB / TANGEDCO Assistant Engineer (AE - EEE / ECE / Civil / Mech)",
    category: "Technical & Engineering",
    board: "Tamil Nadu Generation and Distribution Corporation (TANGEDCO)",
    officialSite: "https://www.tangedco.gov.in",
    notificationStatus: "State Board Direct Recruitment Announced",
    examDate: "2026-11-15",
    examDateDisplay: "November 15, 2026",
    vacancies: "600+ Assistant Engineer Posts",
    syllabus: ["Part I: Engineering Mathematics (20 Marks)", "Part II: Basic Engineering & Sciences (20 Marks)", "Part III: Core Discipline - EEE/ECE/Civil/Mech (60 Marks)"],
    duration: "4-6 Months",
    readiness: 70,
    studyPlan: {
      day: "TNEB AE Engineering Core & Math Strategy",
      tasks: [
        { time: "06:30 - 08:30", title: "Engineering Mathematics - Linear Algebra & Calculus", done: true, subject: "Maths" },
        { time: "09:30 - 11:30", title: "Basic Engineering - Applied Mechanics & Electrical Circuits", done: true, subject: "Basic Engg" },
        { time: "14:00 - 16:30", title: "Core Subject - Power Systems / Machines / Electronics", done: false, subject: "Core" },
        { time: "17:30 - 19:00", title: "Numerical Problems Practice (TNEB Standard)", done: false, subject: "Problems" },
        { time: "20:00 - 21:00", title: "100 Qs Timed Technical Mock", done: false, subject: "Mock" }
      ]
    },
    youtubeVideos: [
      { title: "TNEB AE Electrical Engineering Complete Marathon", channel: "Spark Institute for Competitive Exams", duration: "3 hrs 20 mins", url: "https://www.youtube.com/results?search_query=tneb+ae+electrical+engineering", thumbnailColor: "from-amber-600 to-red-800", views: "510K views", viewsCount: 510000, rating: "4.9 ★", rankBadge: "#1 Most Viewed" },
      { title: "TNEB AE Engineering Mathematics Shortcut Formulas", channel: "GateForum / TN Technical Exams", duration: "2 hrs 00 mins", url: "https://www.youtube.com/results?search_query=tneb+ae+engineering+mathematics", thumbnailColor: "from-blue-700 to-indigo-900", views: "320K views", viewsCount: 320000, rating: "4.8 ★" }
    ],
    pyqs: [
      { year: "2018", title: "TNEB TANGEDCO AE (EEE / ECE / Civil / Mech) Official Paper", downloadUrl: "https://www.tangedco.gov.in", size: "5.2 MB", questions: 100 },
      { year: "2016", title: "TANGEDCO Assistant Engineer Solved Papers with Key", downloadUrl: "https://www.tangedco.gov.in", size: "4.7 MB", questions: 100 }
    ],
    mockTests: [
      { id: "tneb-mock-1", title: "TNEB AE Full Technical Mock (100 Questions - 100 Marks)", type: "Full Technical Mock", questions: 100, durationMinutes: 120, score: "78 / 100" }
    ],
    studyNotes: {
      topic: "Network Analysis & Power System Basics",
      subject: "Part III: Core Electrical Engineering",
      summary: "Kirchhoff's Laws, Thevenin's and Norton's Theorems, Maximum Power Transfer Theorem, AC circuit analysis with phasors, and power factor correction.",
      keyPoints: [
        "Maximum Power Transfer Theorem: Z_load = Z_source conjugate",
        "Per-Unit system calculation for single line diagram",
        "Transmission line parameters (Ferranti effect, Skin effect, Proximity effect)",
        "Circuit breaker ratings and symmetrical fault analysis"
      ],
      pyqTip: "Direct numericals on Ferranti Effect and Thevenin equivalent resistance appear in almost every TNEB AE exam."
    }
  },

  "Madras High Court Recruitment": {
    id: "mhc-exam",
    name: "Madras High Court (Examiner / Reader / Typist / OA)",
    category: "Judicial & High Court",
    board: "Judicial Recruitment Cell, High Court of Madras",
    officialSite: "https://www.mhc.tn.gov.in",
    notificationStatus: "Official Notification Active • MHC Recruitment Portal",
    examDate: "2026-10-31",
    examDateDisplay: "October 31, 2026",
    vacancies: "2,329+ Posts Across Tamil Nadu Subordinate Courts",
    syllabus: ["Part A: General Tamil / General English (50 Marks)", "Part B: General Knowledge & Numerical Ability (100 Marks)", "Skill Test (Typing / Computer Literacy where applicable)"],
    duration: "3-5 Months",
    readiness: 76,
    studyPlan: {
      day: "MHC Judicial Administration Mission",
      tasks: [
        { time: "06:30 - 08:30", title: "General Tamil - இலக்கணம் & திருக்குறள்", done: true, subject: "Tamil" },
        { time: "09:30 - 11:30", title: "Indian Polity & High Court / Subordinate Courts Jurisdiction", done: true, subject: "Polity" },
        { time: "14:00 - 15:30", title: "Aptitude & Mental Ability (Percentages, Time & Work)", done: false, subject: "Aptitude" },
        { time: "16:30 - 18:00", title: "Tamil Nadu District Courts General Knowledge", done: false, subject: "GK" },
        { time: "19:30 - 20:30", title: "MHC 150 Qs Full Speed Test", done: false, subject: "Mock" }
      ]
    },
    youtubeVideos: [
      { title: "Madras High Court Exam Complete GK & Tamil Class", channel: "Suresh IAS Academy", duration: "2 hrs 15 mins", url: "https://www.youtube.com/results?search_query=madras+high+court+exam+preparation", thumbnailColor: "from-purple-800 to-indigo-950", views: "680K views", viewsCount: 680000, rating: "4.9 ★", rankBadge: "#1 Most Viewed" },
      { title: "MHC Examiner / Typist Exam Syllabus & Model Questions", channel: "Tamil Thadam Academy", duration: "1 hr 30 mins", url: "https://www.youtube.com/results?search_query=madras+high+court+model+question+paper", thumbnailColor: "from-blue-700 to-slate-900", views: "340K views", viewsCount: 340000, rating: "4.7 ★" }
    ],
    pyqs: [
      { year: "2024", title: "Madras High Court Examiner / Reader Official Question Paper", downloadUrl: "https://www.mhc.tn.gov.in", size: "3.5 MB", questions: 150 },
      { year: "2022", title: "MHC Driver / Office Assistant / Typist Solved Paper", downloadUrl: "https://www.mhc.tn.gov.in", size: "3.2 MB", questions: 100 }
    ],
    mockTests: [
      { id: "mhc-mock-1", title: "Madras High Court Full Mock Exam (150 Questions)", type: "Full Mock Test", questions: 150, durationMinutes: 150, score: "124 / 150" }
    ],
    studyNotes: {
      topic: "High Court Jurisdiction & Judicial System in India",
      subject: "Part B: Indian Polity & Judicial System",
      summary: "Articles 214-231 of the Constitution govern High Courts in India. Madras High Court was established on 15 August 1862 by Queen Victoria's Letters Patent.",
      keyPoints: [
        "Writ Jurisdiction of High Court under Article 226 (broader than Supreme Court's Art 32)",
        "Madras High Court has jurisdiction over Tamil Nadu and Puducherry",
        "Madurai Bench of Madras High Court established in 2004",
        "Types of Writs: Habeas Corpus, Mandamus, Prohibition, Quo-Warranto, Certiorari"
      ],
      pyqTip: "Frequent MHC exam question: When was the Madras High Court established? (1862)."
    }
  },

  "TN Forest Guard / Forester (TNFUSRC)": {
    id: "tnfusrc",
    name: "TNFUSRC Forest Guard & Forester",
    category: "Forest & Environment",
    board: "Tamil Nadu Forest Uniformed Services Recruitment Committee",
    officialSite: "https://www.forests.tn.gov.in",
    notificationStatus: "Recruitment Notification Active • Forest Dept",
    examDate: "2026-11-25",
    examDateDisplay: "November 25, 2026",
    vacancies: "1,161+ Forester & Forest Guard Posts",
    syllabus: ["General Studies (100 Marks)", "General Science & Environment (100 Marks - Botany, Zoology, Ecology)", "Tamil Eligibility Test", "Physical Endurance Walking Test (25 km in 4 hrs for Men)"],
    duration: "4-6 Months",
    readiness: 73,
    studyPlan: {
      day: "TNFUSRC Forestry & Science Special",
      tasks: [
        { time: "05:00 - 06:30", title: "Long Distance Endurance Walk / Jogging Practice", done: true, subject: "Fitness" },
        { time: "08:00 - 10:30", title: "Botany & Zoology (Samacheer 10th & 11th - Forest Ecology)", done: true, subject: "Environment" },
        { time: "11:30 - 13:00", title: "National Parks & Wildlife Sanctuaries in Tamil Nadu", done: false, subject: "TN Ecology" },
        { time: "15:00 - 16:30", title: "General Knowledge & Aptitude", done: false, subject: "GK" },
        { time: "18:00 - 19:30", title: "TNFUSRC 150 Qs Online Mock Test", done: false, subject: "Mock" }
      ]
    },
    youtubeVideos: [
      { title: "TNFUSRC Forest Guard Full Science & Environment Class", channel: "Suresh IAS Academy", duration: "2 hrs 40 mins", url: "https://www.youtube.com/results?search_query=tnfusrc+forest+guard+science", thumbnailColor: "from-emerald-700 to-green-950", views: "560K views", viewsCount: 560000, rating: "4.9 ★", rankBadge: "#1 Most Viewed" }
    ],
    pyqs: [
      { year: "2019", title: "TNFUSRC Forester & Forest Guard Official Paper & Key", downloadUrl: "https://www.forests.tn.gov.in", size: "4.1 MB", questions: 150 },
      { year: "2018", title: "TNFUSRC Forest Guard with Driving License Solved Paper", downloadUrl: "https://www.forests.tn.gov.in", size: "3.8 MB", questions: 150 }
    ],
    mockTests: [
      { id: "forest-mock-1", title: "TNFUSRC Forest Guard Full Length Mock", type: "Full Mock Test", questions: 150, durationMinutes: 180, score: "118 / 150" }
    ],
    studyNotes: {
      topic: "Wildlife Sanctuaries, Tiger Reserves & Biosphere Reserves in Tamil Nadu",
      subject: "Ecology & Environmental Studies",
      summary: "Tamil Nadu has 5 Tiger Reserves (Kalakkad Mundanthurai, Anamalai, Mudumalai, Sathyamangalam, Srivilliputhur Megamalai), 3 Biosphere Reserves (Nilgiris, Gulf of Mannar, Agasthyamalai).",
      keyPoints: [
        "State Animal: Nilgiri Tahr (வரையாடு) - Eravikulam & Nilgiris habitat",
        "State Bird: Emerald Dove (மரகதப் புறா)",
        "State Tree: Palmyra Palm (பனை मரம்)",
        "State Flower: Gloriosa Superba (காந்தள் பூ)"
      ],
      pyqTip: "Repeated TNFUSRC question: Which is the latest 5th Tiger Reserve in Tamil Nadu? (Srivilliputhur Megamalai)."
    }
  },

  "TN MRB (Medical Services Recruitment Board)": {
    id: "tn-mrb",
    name: "TN MRB (Assistant Surgeon / Staff Nurse / Pharmacist)",
    category: "Healthcare & Medical",
    board: "Medical Services Recruitment Board (MRB)",
    officialSite: "https://www.mrb.tn.gov.in",
    notificationStatus: "Direct Recruitment Active • MRB Notification 2026",
    examDate: "2026-11-12",
    examDateDisplay: "November 12, 2026",
    vacancies: "1,021+ Assistant Surgeon & Staff Nurse Posts",
    syllabus: ["Core Medical / Nursing / Pharmacy Subject (100 Marks)", "Tamil Eligibility Test (50 Marks)", "Basic Public Health & National Health Programmes in TN"],
    duration: "3-5 Months",
    readiness: 75,
    studyPlan: {
      day: "TN MRB Medical & Healthcare Plan",
      tasks: [
        { time: "06:30 - 08:30", title: "Core Medical/Nursing Subject Review (Anatomy & Pharmacology)", done: true, subject: "Core" },
        { time: "09:30 - 11:30", title: "Tamil Nadu Public Health Schemes & Epidemic Control", done: true, subject: "Health" },
        { time: "14:00 - 16:00", title: "Clinical Procedures & Diagnostic Guidelines", done: false, subject: "Clinical" },
        { time: "18:00 - 19:30", title: "MRB 100 Qs CBT Practice Exam", done: false, subject: "Mock" }
      ]
    },
    youtubeVideos: [
      { title: "TN MRB Staff Nurse & Pharmacist Exam Preparation Guide", channel: "Medical & Nursing Academy TN", duration: "2 hrs 10 mins", url: "https://www.youtube.com/results?search_query=tn+mrb+staff+nurse+exam+preparation", thumbnailColor: "from-cyan-700 to-blue-900", views: "430K views", viewsCount: 430000, rating: "4.8 ★", rankBadge: "#1 Most Viewed" }
    ],
    pyqs: [
      { year: "2023", title: "TN MRB Staff Nurse Official CBT Paper & Answer Key", downloadUrl: "https://www.mrb.tn.gov.in", size: "3.9 MB", questions: 100 },
      { year: "2020", title: "TN MRB Assistant Surgeon General Solved Question Paper", downloadUrl: "https://www.mrb.tn.gov.in", size: "4.2 MB", questions: 100 }
    ],
    mockTests: [
      { id: "mrb-mock-1", title: "TN MRB Full Length CBT Mock Test (100 Questions)", type: "CBT Mock", questions: 100, durationMinutes: 120, score: "82 / 100" }
    ],
    studyNotes: {
      topic: "Tamil Nadu Public Health Infrastructure & Maternal Health",
      subject: "State Health Systems",
      summary: "Tamil Nadu has the lowest Maternal Mortality Ratio (MMR) and Infant Mortality Rate (IMR) in India due to 24x7 PHCs and Dr. Muthulakshmi Reddy Maternity Benefit Scheme.",
      keyPoints: [
        "Dr. Muthulakshmi Reddy Maternity Financial Assistance (Rs 18,000 + Amma Baby Care Kit)",
        "Chief Minister's Comprehensive Health Insurance Scheme (CMCHIS)",
        "Makkalai Thedi Maruthuvam doorstep non-communicable disease screening",
        "Universal Immunization Schedule implementation across 38 districts"
      ],
      pyqTip: "Question in MRB 2023: What is the financial assistance provided under Dr. Muthulakshmi Reddy Maternity Scheme?"
    }
  },

  "Aavin Recruitment": {
    id: "aavin-exam",
    name: "Aavin (Tamil Nadu Co-operative Milk Producers' Federation)",
    category: "Co-operatives & Federation",
    board: "Aavin Recruitment Board",
    officialSite: "https://aavin.tn.gov.in",
    notificationStatus: "State Co-operative Recruitment Active",
    examDate: "2026-11-22",
    examDateDisplay: "November 22, 2026",
    vacancies: "460+ Manager, Executive & Technician Posts",
    syllabus: ["Part A: General Knowledge & Current Affairs (40 Marks)", "Part B: Co-operative Management & Dairy Science (40 Marks)", "Part C: General Tamil / English & Aptitude (20 Marks)"],
    duration: "3-4 Months",
    readiness: 72,
    studyPlan: {
      day: "Aavin Executive Preparation Schedule",
      tasks: [
        { time: "07:00 - 08:30", title: "Tamil Nadu Co-operative Societies Act 1983 Highlights", done: true, subject: "Co-op Law" },
        { time: "09:30 - 11:30", title: "General Knowledge & Tamil Nadu Economy", done: true, subject: "GK" },
        { time: "14:00 - 15:30", title: "Dairy Technology & Processing Fundamentals", done: false, subject: "Dairy" },
        { time: "18:00 - 19:30", title: "Aavin 100 Qs Model Test", done: false, subject: "Mock" }
      ]
    },
    youtubeVideos: [
      { title: "Aavin Exam Co-operative Law & Dairy Science Classes", channel: "TN Co-operative Training Academy", duration: "1 hr 50 mins", url: "https://www.youtube.com/results?search_query=aavin+exam+cooperative+law", thumbnailColor: "from-blue-600 to-indigo-800", views: "310K views", viewsCount: 310000, rating: "4.8 ★", rankBadge: "#1 Most Viewed" }
    ],
    pyqs: [
      { year: "2021", title: "Aavin Manager / Executive Official Question Paper & Key", downloadUrl: "https://aavin.tn.gov.in", size: "3.1 MB", questions: 100 }
    ],
    mockTests: [
      { id: "aavin-mock-1", title: "Aavin Full Mock Test (100 Questions)", type: "Full Mock Test", questions: 100, durationMinutes: 120, score: "79 / 100" }
    ],
    studyNotes: {
      topic: "Co-operative Movement in Tamil Nadu & Operation Flood",
      subject: "Co-operative Management",
      summary: "Three-tier structure of Dairy Co-operatives: Village Level Primary Milk Societies -> District Co-operative Milk Producers' Unions -> Apex State Federation (Aavin).",
      keyPoints: [
        "First Co-operative Society in India registered in Thirur, Tiruvallur district, Tamil Nadu (1904)",
        "National Dairy Development Board (NDDB) and Operation Flood (White Revolution)",
        "Pasteurization standards: HTST (High Temperature Short Time - 72°C for 15 sec)",
        "SNF (Solid-Not-Fat) and Fat percentage testing in milk"
      ],
      pyqTip: "Repeated question: Where was the first cooperative society founded in India? (Thirur, Tamil Nadu)."
    }
  }
};

export const DEFAULT_EXAM = ALL_TN_EXAMS["TNPSC Group 4 & VAO"];

export function getExamDetails(examName?: string): ExamDetails {
  if (!examName) return DEFAULT_EXAM;
  if (ALL_TN_EXAMS[examName]) return ALL_TN_EXAMS[examName];
  const found = Object.values(ALL_TN_EXAMS).find(e => 
    e.name.toLowerCase().includes(examName.toLowerCase()) || 
    examName.toLowerCase().includes(e.name.toLowerCase())
  );
  return found || DEFAULT_EXAM;
}
