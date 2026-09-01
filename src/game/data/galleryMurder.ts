import type { Case } from '@/game/types';

// ─────────────────────────────────────────────────────────────────────────────
// Case #047 — The Gallery Murder (PUBLIC CLIENT MODEL)
//
// NOTE FOR SECURITY & INTEGRITY (Problem 4):
// Secret solution data, killer identity, hidden significances, secrets, and
// deduction requirements are stored ONLY on the server in src/server/cases/
// and are NEVER bundled into client JavaScript.
// ─────────────────────────────────────────────────────────────────────────────

export const THE_GALLERY_MURDER: Case = {
  id: 'gallery-murder-047',
  caseNumber: '#047',
  title: 'The Gallery Murder',
  subtitle: 'A crime behind closed doors',
  difficulty: 'Intermediate',
  estimatedTime: '20-30 mins',
  status: 'available',
  victim: 'Daniel Adeyemi',
  victimDescription:
    'Wealthy art dealer and co-founder of Adeyemi & Bello Fine Art. Found dead in his private office at 11:47 PM during a members-only evening showing. Time of death estimated between 10:30 PM and 11:00 PM.',
  objective: 'Determine who killed Daniel Adeyemi, how, why, and when.',
  briefing:
    'Daniel Adeyemi, 52, was found slumped behind his private office desk by security guard Michael Grant during a routine 11:45 PM check. The gallery had been hosting an exclusive members evening — five people were still on the premises when the body was found. A crystal whiskey tumbler sat on the desk. There were no signs of forced entry. Everyone had a reason to be there. One of them had a reason to want Daniel dead.',

  // ─── Suspects (Public Dossiers Only — Zero Solution Leakage) ───────────────

  suspects: [
    {
      id: 'marcus-cole',
      name: 'Marcus Cole',
      title: 'Art Critic',
      occupation: 'Senior Art Critic, The Cultural Review',
      relationship: 'Professional adversary',
      description:
        'Sharp-tongued and perpetually dissatisfied. Marcus arrived uninvited to the evening showing and got into a heated argument with Daniel at 8:45 PM — captured clearly on CCTV. He has written devastating reviews of Adeyemi\'s gallery in the past.',
      motive:
        'Marcus had written a damning exposé of a suspected forged Hartley painting in Daniel\'s collection. Daniel threatened him with a defamation lawsuit the morning of his death.',
      alibi:
        '"I left the gallery at 9:30 PM. Took a cab. Driver can confirm. I was furious, yes, but I\'m not a murderer."',
      initialStatement:
        '"We had words. It got loud. That\'s it. I walked out of that gallery at half past nine and I never looked back."',
      interviewResponses: [
        {
          id: 'mc-q1',
          question: 'What was your argument with Daniel about?',
          answer:
            '"He\'d learned I was publishing a piece about his Hartley. Called it slander. I called it journalism. We went in circles for twenty minutes and then I left."',
        },
        {
          id: 'mc-q2',
          question: 'Did you threaten him?',
          answer:
            '"I told him the truth would come out regardless of his lawyers. That\'s not a threat — that\'s a promise."',
        },
        {
          id: 'mc-q3',
          question: 'Can anyone confirm you left at 9:30?',
          answer:
            '"The cab booking is in my phone. Ethan\'s Cars, 9:28 PM. You can pull the record."',
        },
        {
          id: 'mc-q4',
          question: 'Did you know about the divorce plans?',
          answer:
            '"What divorce? I barely knew his wife."',
        },
      ],
      relatedEvidenceIds: ['torn-letter', 'cctv-argument'],
    },

    {
      id: 'sarah-okafor',
      name: 'Sarah Okafor',
      title: 'Gallery Assistant',
      occupation: 'Senior Gallery Assistant, Adeyemi & Bello Fine Art',
      relationship: 'Former lover',
      description:
        'Composed and meticulous. Sarah has worked at the gallery for nine years and was intensely loyal to Daniel — some said too loyal. She was one of the last people to speak to him before his death.',
      motive:
        'Daniel had promised to acknowledge their personal relationship and amend his financial affairs, creating complex personal expectations.',
      alibi:
        '"I was in the main gallery supervising the showing from 9:00 PM onwards. Guests saw me constantly. I called Daniel at 10:55 — he didn\'t answer, which worried me."',
      initialStatement:
        '"I was working the main floor all night. I spoke to Daniel at 9:15 PM when he brought guests in, and he seemed fine. A bit stressed, but fine."',
      interviewResponses: [
        {
          id: 'so-q1',
          question: 'When did you last see Daniel alive?',
          answer:
            '"At 9:15 PM in the main gallery. He asked me to keep the Champagne flowing and said he had private business to attend to in his office."',
        },
        {
          id: 'so-q2',
          question: 'Did you go near his office later that evening?',
          answer:
            '"No. The corridor was off-limits to guests. I stayed on the floor. At 10:55 PM I called his mobile from the front desk — it rang out."',
        },
        {
          id: 'so-q3',
          question: 'How was your relationship with Daniel recently?',
          answer:
            '"Professional. We had a past, years ago, but we moved beyond it. I respected him."',
        },
      ],
      relatedEvidenceIds: ['bank-transfer'],
    },

    {
      id: 'james-bello',
      name: 'James Bello',
      title: 'Business Partner',
      occupation: 'Co-Owner & Commercial Director, Adeyemi & Bello Fine Art',
      relationship: 'Business partner',
      description:
        'Flamboyant, well-connected, and under mounting financial pressure. James manages the gallery\'s acquisitions and sales. Rumours have circulated for months that he and Daniel were in a bitter dispute over gallery finances.',
      motive:
        'Audit records reveal James transferred £160,000 from gallery accounts to an off-shore entity over six months. Daniel was scheduled to meet the gallery accountant the following morning.',
      alibi:
        '"I was in the main gallery all evening talking to collectors. Dozens of people saw me. I never went back to the office suite after 8:00 PM."',
      initialStatement:
        '"Daniel and I had our disagreements — what partners don\'t? But he was the soul of this gallery. I am shattered by this."',
      interviewResponses: [
        {
          id: 'jb-q1',
          question: 'Were gallery finances in trouble?',
          answer:
            '"Cash flow is always tight in fine art. We had major acquisitions pending. Everything I did was for the gallery\'s survival."',
        },
        {
          id: 'jb-q2',
          question: 'Daniel was meeting the auditor tomorrow, wasn\'t he?',
          answer:
            '"A routine annual review. Standard practice. Nothing more."',
        },
        {
          id: 'jb-q3',
          question: 'Where were you between 10:00 PM and 11:00 PM?',
          answer:
            '"In the main gallery presenting the Impressionist collection to Lord and Lady Sterling. Check the guestbook."',
        },
      ],
      relatedEvidenceIds: ['bank-transfer'],
    },

    {
      id: 'victoria-adeyemi',
      name: 'Victoria Adeyemi',
      title: 'Wife',
      occupation: 'Consultant Physician, St. Jude\'s Private Hospital',
      relationship: 'Wife (14 years)',
      description:
        'Elegant, guarded, and formidable. Victoria married Daniel fourteen years ago. Their marriage appeared harmonious publicly, but close friends report they had been living virtually separate lives for two years.',
      motive:
        'Daniel\'s estate is valued at £4.2 million. Victoria stands to inherit the bulk of his estate — unless a pending divorce petition is executed.',
      alibi:
        '"I arrived at the gallery late, around 10:45 PM, to drive Daniel home. I waited in the courtyard. I never went inside his office suite."',
      initialStatement:
        '"I came to pick Daniel up as we agreed. When he didn\'t come out by 11:30 PM, I asked Michael to check on him. Then Michael screamed."',
      interviewResponses: [
        {
          id: 'va-q1',
          question: 'Was your marriage in trouble?',
          answer:
            '"We had our private difficulties, like any couple of fourteen years. But we maintained mutual respect and shared assets."',
        },
        {
          id: 'va-q2',
          question: 'Did you enter the office building before 11:45 PM?',
          answer:
            '"No. I stayed in the courtyard. The night air was pleasant. I had no reason to interrupt his work."',
        },
        {
          id: 'va-q3',
          question: 'What do you know about Daniel\'s whiskey habits?',
          answer:
            '"Daniel drank Macallan 18 every evening in his office. It was his routine. Everyone who knew him knew that."',
        },
        {
          id: 'va-q4',
          question: 'The door log shows your keycard was used at 10:19 PM. How do you explain that?',
          answer:
            '"My keycard? That\'s impossible. I must have mislaid it earlier in the week. Someone else must have used it."',
          requiresEvidenceIds: ['keycard-log'],
        },
      ],
      relatedEvidenceIds: ['keycard-log', 'cyanide-vial', 'divorce-filing', 'pharmacy-order'],
    },

    {
      id: 'michael-grant',
      name: 'Michael Grant',
      title: 'Security Officer',
      occupation: 'Head of Security, Apex Security Services',
      relationship: 'Employee',
      description:
        'Ex-military, quiet, and watchful. Michael has managed security at the gallery for three years. He controls access to the private office suite, keycard logs, and CCTV monitoring room.',
      motive:
        'Michael has severe personal debts from gambling. Bank records show an unexplained £3,000 cash deposit into his personal account earlier that week.',
      alibi:
        '"I was on duty in the security monitoring room all night, conducting hourly rounds. I found Daniel at 11:47 PM during my final check."',
      initialStatement:
        '"I did my rounds every hour on the dot. Office door was locked at 10:00 PM check. At 11:45 PM check, keycard opened it and I found Mr. Adeyemi slumped over."',
      interviewResponses: [
        {
          id: 'mg-q1',
          question: 'Who had access to the private office keycard?',
          answer:
            '"Only Daniel, Mr. Bello, Mrs. Adeyemi, and my master card. Nobody else."',
        },
        {
          id: 'mg-q2',
          question: 'Did the CCTV capture anyone entering between 10:00 and 11:00 PM?',
          answer:
            '"Camera 3 covers that corridor. I\'ve submitted the footage to the police. There was a glitch around 10:15 PM — power flicker, brief outage."',
        },
        {
          id: 'mg-q3',
          question: 'Where did the £3,000 cash deposit in your bank account come from?',
          answer:
            '"That\'s a personal financial matter. I sold a watch. It has nothing to do with Mr. Adeyemi\'s death."',
          requiresEvidenceIds: ['bank-transfer'],
        },
      ],
      relatedEvidenceIds: ['cctv-gap', 'bank-transfer'],
    },
  ],

  // ─── Locations ─────────────────────────────────────────────────────────────

  locations: [
    {
      id: 'main-gallery',
      name: 'Main Gallery',
      description:
        'The primary exhibition space, featuring high ceilings, hardwood floors, and track lighting. The walls display contemporary paintings. Guests gathered here throughout the evening showing.',
      investigatorNote:
        'High foot traffic area. Floor is clean except near the east wall exhibit where Marcus Cole and Daniel Adeyemi argued at 8:45 PM.',
      icon: 'gallery',
      evidenceIds: ['cctv-argument', 'torn-letter'],
    },
    {
      id: 'private-office',
      name: 'Private Office',
      description:
        'Daniel\'s personal office located at the end of a restricted corridor behind the main gallery. Features a heavy mahogany desk, leather armchair, private safe, and double-locked door.',
      investigatorNote:
        'Crime scene. Daniel was discovered slumped at his desk. A single crystal whiskey glass sat beside his elbow. No signs of struggle.',
      icon: 'office',
      evidenceIds: ['whiskey-glass', 'keycard-log', 'divorce-filing'],
    },
    {
      id: 'storage-room',
      name: 'Storage Room',
      description:
        'A narrow utility and archival storage room located off the service corridor behind the office suite. Houses art crates, cleaning supplies, and staff lockers.',
      investigatorNote:
        'Slight smell of industrial solvent. Cleaning bins and supply shelves warrant thorough forensic sweep.',
      icon: 'storage',
      evidenceIds: ['cyanide-vial', 'pharmacy-order'],
    },
    {
      id: 'courtyard',
      name: 'Courtyard',
      description:
        'A cobble-paved open courtyard at the rear of the gallery, used for private parking and guest fresh air during events. Surrounded by high brick walls.',
      investigatorNote:
        'Victoria Adeyemi claims she waited here in her vehicle from 10:45 PM until the body was discovered.',
      icon: 'courtyard',
      evidenceIds: [],
    },
    {
      id: 'security-room',
      name: 'Security Room',
      description:
        'Small monitoring room near the rear staff entrance containing the CCTV recorder rack, electronic keycard access controller, and guard desk.',
      investigatorNote:
        'CCTV monitors display live feeds. Access log printer and DVR recording units located on main console.',
      icon: 'security',
      evidenceIds: ['cctv-gap', 'bank-transfer'],
    },
  ],

  // ─── Evidence (Public Metadata — Zero Secret Significances) ───────────────

  evidence: [
    {
      id: 'whiskey-glass',
      name: 'Crystal Whiskey Tumbler',
      description: 'Found on Daniel\'s office desk beside his right hand containing amber liquid residue.',
      detailedDescription: 'Forensic inspection details available upon investigation.',
      location: 'private-office',
      tags: ['physical', 'forensic', 'crime scene'],
      relatedSuspectIds: ['victoria-adeyemi'],
      relatedEvidenceIds: ['cyanide-vial'],
      isRedHerring: false,
      contributesToSolution: true,
    },
    {
      id: 'keycard-log',
      name: 'Electronic Keycard Access Audit Log',
      description: 'Printout from the electronic door lock controller securing the private office corridor.',
      detailedDescription: 'Log entries available upon investigation.',
      location: 'private-office',
      tags: ['document', 'digital', 'access control'],
      relatedSuspectIds: ['victoria-adeyemi', 'michael-grant'],
      relatedEvidenceIds: ['cctv-gap'],
      isRedHerring: false,
      contributesToSolution: true,
    },
    {
      id: 'cyanide-vial',
      name: 'Empty Chemical Vial (Batch KCN-8802)',
      description: 'Clear 10ml glass vial found inside a cleaning supply bin in the storage room.',
      detailedDescription: 'Vial label and batch details available upon inspection.',
      location: 'storage-room',
      tags: ['physical', 'chemical', 'hidden'],
      relatedSuspectIds: ['victoria-adeyemi'],
      relatedEvidenceIds: ['whiskey-glass', 'pharmacy-order'],
      isRedHerring: false,
      contributesToSolution: true,
    },
    {
      id: 'cctv-gap',
      name: 'CCTV Recording Gap Log',
      description: 'DVR system diagnostic log showing Camera 3 recording history between 10:00 PM and 11:00 PM.',
      detailedDescription: 'DVR timestamps available upon inspection.',
      location: 'security-room',
      tags: ['digital', 'security', 'timeline'],
      relatedSuspectIds: ['michael-grant', 'victoria-adeyemi'],
      relatedEvidenceIds: ['keycard-log', 'bank-transfer'],
      isRedHerring: false,
      contributesToSolution: true,
    },
    {
      id: 'bank-transfer',
      name: 'Bank Cash Deposit Slip (£3,000)',
      description: 'Financial counterfoil found in the security room desk drawer.',
      detailedDescription: 'Bank transfer details available upon inspection.',
      location: 'security-room',
      tags: ['document', 'financial', 'motive'],
      relatedSuspectIds: ['michael-grant', 'victoria-adeyemi'],
      relatedEvidenceIds: ['cctv-gap'],
      isRedHerring: false,
      contributesToSolution: true,
    },
    {
      id: 'pharmacy-order',
      name: 'Chemical Supply Invoice #8802-K',
      description: 'Apex Chemical supply invoice located inside a binder in the storage room office file.',
      detailedDescription: 'Invoice details available upon inspection.',
      location: 'storage-room',
      tags: ['document', 'chemical', 'tracing'],
      relatedSuspectIds: ['victoria-adeyemi'],
      relatedEvidenceIds: ['cyanide-vial'],
      isRedHerring: false,
      contributesToSolution: true,
    },
    {
      id: 'divorce-filing',
      name: 'Draft Divorce Petition & Estate Revision',
      description: 'Legal documents found inside a locked drawer in Daniel\'s desk.',
      detailedDescription: 'Document text available upon inspection.',
      location: 'private-office',
      tags: ['document', 'legal', 'motive'],
      relatedSuspectIds: ['victoria-adeyemi', 'sarah-okafor'],
      relatedEvidenceIds: [],
      isRedHerring: false,
      contributesToSolution: true,
    },
    {
      id: 'cctv-argument',
      name: 'CCTV Footage: Gallery Argument (8:45 PM)',
      description: 'Video recording capturing a heated interaction near the east wall exhibit.',
      detailedDescription: 'Video timestamps available upon inspection.',
      location: 'main-gallery',
      tags: ['digital', 'cctv', 'timeline'],
      relatedSuspectIds: ['marcus-cole'],
      relatedEvidenceIds: ['torn-letter'],
      isRedHerring: true,
      contributesToSolution: false,
    },
    {
      id: 'torn-letter',
      name: 'Torn Draft Review Article',
      description: 'Scraps of paper recovered from the main gallery waste bin.',
      detailedDescription: 'Manuscript text available upon inspection.',
      location: 'main-gallery',
      tags: ['physical', 'document'],
      relatedSuspectIds: ['marcus-cole'],
      relatedEvidenceIds: ['cctv-argument'],
      isRedHerring: true,
      contributesToSolution: false,
    },
  ],

  // ─── Timeline (Public Chronology) ───────────────────────────────────────────

  timeline: [
    {
      id: 'tl-1',
      time: '8:00 PM',
      description: 'Gallery members-only showing begins. Guests arrive in main gallery.',
      source: 'Gallery guestbook & entrance logs',
      suspectIds: ['james-bello', 'sarah-okafor'],
      evidenceIds: [],
      isContradiction: false,
      alwaysVisible: true,
    },
    {
      id: 'tl-2',
      time: '8:45 PM',
      description: 'Marcus Cole arrives uninvited. Gets into loud argument with Daniel near east exhibit.',
      source: 'CCTV Footage Camera 1',
      suspectIds: ['marcus-cole'],
      evidenceIds: ['cctv-argument', 'torn-letter'],
      isContradiction: false,
      alwaysVisible: true,
    },
    {
      id: 'tl-3',
      time: '9:28 PM',
      description: 'Marcus Cole exits gallery forecourt via Ethan\'s Cars taxicab.',
      source: 'Cab booking confirmation & forecourt camera',
      suspectIds: ['marcus-cole'],
      evidenceIds: ['cctv-argument'],
      isContradiction: false,
      alwaysVisible: true,
    },
    {
      id: 'tl-4',
      time: '10:15 PM',
      description: 'CCTV Camera 3 (Office Corridor) recording disabled for 8 minutes.',
      source: 'CCTV Diagnostic Log',
      suspectIds: ['michael-grant', 'victoria-adeyemi'],
      evidenceIds: ['cctv-gap', 'bank-transfer'],
      isContradiction: true,
      contradictsSuspectId: 'michael-grant',
    },
    {
      id: 'tl-5',
      time: '10:19 PM',
      description: 'Keycard #04 (Victoria Adeyemi) unlocks private office door.',
      source: 'Electronic Door Lock Audit Log',
      suspectIds: ['victoria-adeyemi'],
      evidenceIds: ['keycard-log'],
      isContradiction: true,
      contradictsSuspectId: 'victoria-adeyemi',
    },
    {
      id: 'tl-6',
      time: '10:45 PM',
      description: 'Victoria Adeyemi claims to arrive at gallery courtyard.',
      source: 'Victoria Adeyemi initial statement',
      suspectIds: ['victoria-adeyemi'],
      evidenceIds: ['keycard-log'],
      isContradiction: true,
      contradictsSuspectId: 'victoria-adeyemi',
    },
    {
      id: 'tl-7',
      time: '10:55 PM',
      description: 'Sarah Okafor calls Daniel\'s mobile phone from main gallery desk — unanswered.',
      source: 'Mobile network call detail record',
      suspectIds: ['sarah-okafor'],
      evidenceIds: [],
      isContradiction: false,
    },
    {
      id: 'tl-8',
      time: '11:47 PM',
      description: 'Daniel Adeyemi found dead at office desk by Michael Grant.',
      source: 'Emergency 999 dispatch log',
      suspectIds: ['michael-grant', 'victoria-adeyemi'],
      evidenceIds: ['whiskey-glass'],
      isContradiction: false,
      alwaysVisible: true,
    },
  ],
};
