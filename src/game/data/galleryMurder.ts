import type { Case } from '@/game/types';

// ─────────────────────────────────────────────────────────────────────────────
// Case #047 — The Gallery Murder (PUBLIC CLIENT MODEL)
//
// NOTE FOR SECURITY & INTEGRITY (Problem 3 & 4):
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
          question: 'What was your relationship with Daniel?',
          answer:
            '"We were close. Professional partners, mostly, but yes — there was history. He promised things were going to change soon."',
        },
        {
          id: 'so-q4',
          question: 'Do you know Victoria Adeyemi well?',
          answer:
            '"Well enough. She rarely came to showings. When she did, she barely spoke to anyone."',
        },
      ],
      relatedEvidenceIds: ['divorce-filing'],
    },

    {
      id: 'james-bello',
      name: 'James Bello',
      title: 'Business Partner',
      occupation: 'Co-Founder & Director, Adeyemi & Bello Fine Art',
      relationship: 'Co-owner & co-founder',
      description:
        'Flamboyant and image-conscious. James handles the commercial buying side of the gallery while Daniel handled private client sales. Tensions had risen between them over gallery finances.',
      motive:
        'James had secretly transferred gallery funds to cover personal trading losses. An upcoming forensic audit initiated by Daniel would have exposed the missing £160,000.',
      alibi:
        '"I was entertaining our top collectors in the main exhibition room from 8:30 PM until 11:30 PM. Ask any of them. I never went near the back corridor."',
      initialStatement:
        '"Daniel and I built this place from nothing. I loved the man like a brother. I\'m utterly shattered by this."',
      interviewResponses: [
        {
          id: 'jb-q1',
          question: 'Were there financial disagreements between you and Daniel?',
          answer:
            '"Disagreements? We ran a multi-million-pound business. Of course we argued. About acquisitions, about pricing. Normal business stuff."',
        },
        {
          id: 'jb-q2',
          question: 'What about the forensic audit Daniel ordered?',
          answer:
            '"Standard corporate governance. Nothing to hide. Every penny is accounted for."',
        },
        {
          id: 'jb-q3',
          question: 'Where were you between 10:00 PM and 11:00 PM?',
          answer:
            '"In the main hall, talking to Lady Vance and her party. We were looking at the Turner watercolors. I didn\'t leave that room."',
        },
        {
          id: 'jb-q4',
          question: 'Did you see Michael Grant during the showing?',
          answer:
            '"Michael was doing his rounds. Saw him near the main entrance around ten. Seemed nervous, now that I think about it."',
        },
      ],
      relatedEvidenceIds: [],
    },

    {
      id: 'victoria-adeyemi',
      name: 'Victoria Adeyemi',
      title: 'Wife',
      occupation: 'Consultant Cardiologist, St. Jude\'s Private Hospital',
      relationship: 'Estranged spouse',
      description:
        'Calculated, controlled, and formidable. Victoria married Daniel twelve years ago. Though living in separate wings of their townhouse, they maintained a public image of solidarity.',
      motive:
        'Victoria discovered Daniel was filing for divorce and revising his will. Under the draft terms, she would receive nothing from the gallery business or his personal estate.',
      alibi:
        '"I was at home until 10:30 PM, then drove to the gallery to pick up Daniel. I arrived at 10:45 PM and waited in the courtyard car park until security called me inside."',
      initialStatement:
        '"I arrived at 10:45 PM to collect my husband. I didn\'t enter the building until Michael came out looking pale at 11:47 PM. I never saw Daniel alive that night."',
      interviewResponses: [
        {
          id: 'va-q1',
          question: 'Why did you come to collect Daniel if you were estranged?',
          answer:
            '"We had an agreement. We maintained appearances for the gallery\'s sake. I always collected him after major showings."',
        },
        {
          id: 'va-q2',
          question: 'Did you know Daniel was planning to file for divorce?',
          answer:
            '"Daniel talked about many things when stressed. Talk is cheap. We hadn\'t served any papers."',
        },
        {
          id: 'va-q3',
          question: 'Do you have access to pharmaceutical compounds in your work?',
          answer:
            '"I am a cardiologist. I prescribe medication according to strict hospital protocols. What are you insinuating?"',
        },
        {
          id: 'va-q4',
          question: 'Your keycard registered access to the office at 10:19 PM. How?',
          answer:
            '"...That is impossible. My keycard was in my handbag all evening. Someone must have stolen it or the reader glitched."',
          requiresEvidenceIds: ['keycard-log'],
        },
      ],
      relatedEvidenceIds: [
        'whiskey-glass',
        'keycard-log',
        'cyanide-vial',
        'cctv-gap',
        'pharmacy-order',
        'divorce-filing',
        'bank-transfer',
      ],
    },

    {
      id: 'michael-grant',
      name: 'Michael Grant',
      title: 'Security Guard',
      occupation: 'Night Security Supervisor, Apex Security Services',
      relationship: 'Employee',
      description:
        'Former police officer turned private security guard. Michael had worked night shifts at the gallery for three years. He discovered Daniel\'s body at 11:47 PM.',
      motive:
        'Deeply in debt from gambling. Michael was vulnerable to financial pressure.',
      alibi:
        '"I was monitoring the CCTV console in the security room and making 30-minute patrols of the perimeter. Found Mr. Adeyemi at 11:47 PM during my final check."',
      initialStatement:
        '"I did my rounds every half hour. At 11:45 PM I unlocked the private corridor for my final walk-through. I opened Mr. Adeyemi\'s office door and saw him over his desk. I checked for a pulse immediately. Nothing."',
      interviewResponses: [
        {
          id: 'mg-q1',
          question: 'Why was there an 8-minute gap in Camera 3 recording at 10:15 PM?',
          answer:
            '"The DVR system has been glitching for weeks. Management knows about it. Power supply unit overheating, cuts out randomly."',
          requiresEvidenceIds: ['cctv-gap'],
        },
        {
          id: 'mg-q2',
          question: 'Did you see Victoria Adeyemi before 10:45 PM?',
          answer:
            '"I... I don\'t recall seeing her car until around quarter to eleven. It was dark in the courtyard."',
        },
        {
          id: 'mg-q3',
          question: 'How do you explain the £3,000 cash deposit into your bank account today?',
          answer:
            '"That\'s... personal savings. I sold a watch. Private sale. Nothing to do with the gallery."',
          requiresEvidenceIds: ['bank-transfer'],
        },
        {
          id: 'mg-q4',
          question: 'Did anyone ask you to alter the CCTV footage?',
          answer:
            '"I want a solicitor before I answer any more questions about the security system."',
          requiresEvidenceIds: ['cctv-gap', 'bank-transfer'],
        },
      ],
      relatedEvidenceIds: ['cctv-gap', 'bank-transfer', 'keycard-log'],
    },
  ],

  // ─── Locations ─────────────────────────────────────────────────────────────

  locations: [
    {
      id: 'main-gallery',
      name: 'Main Gallery Hall',
      description:
        'The spacious primary exhibition space featuring high ceilings, hardwood floors, and ambient track lighting. Dozens of guests circulated here during the showing.',
      investigatorNote:
        'CCTV Camera 1 covers the main floor. Fingerprints and discarded items recovered near the waste bin.',
      icon: 'landmark',
      evidenceIds: ['cctv-argument', 'torn-letter'],
    },
    {
      id: 'private-office',
      name: 'Daniel\'s Private Office',
      description:
        'A mahogany-paneled room behind a heavy oak door secured by an electronic keycard lock. Features a large executive desk, floor-to-ceiling bookshelves, and a private liquor cabinet.',
      investigatorNote:
        'Crime scene. Body was found here. Crystal whiskey tumbler on desk. Door secured by keycard audit trail.',
      icon: 'door-closed',
      evidenceIds: ['whiskey-glass', 'keycard-log', 'divorce-filing'],
    },
    {
      id: 'security-room',
      name: 'Security Control Room',
      description:
        'A cramped room off the service entrance containing four CCTV monitors, an encrypted DVR rack, and security guard Michael Grant\'s desk.',
      investigatorNote:
        'DVR logs reveal Camera 3 gap. Guard\'s personal desk drawer contained bank receipt.',
      icon: 'shield-alert',
      evidenceIds: ['cctv-gap', 'bank-transfer'],
    },
    {
      id: 'storage-room',
      name: 'Archive & Cleaning Storage',
      description:
        'A windowless utility corridor behind the main gallery used for storing spare frames, cleaning chemical supplies, and maintenance equipment.',
      investigatorNote:
        'Trash bin contains empty chemical container. Invoices stored in file cabinet.',
      icon: 'box',
      evidenceIds: ['cyanide-vial', 'pharmacy-order'],
    },
    {
      id: 'courtyard',
      name: 'Courtyard & Car Park',
      description:
        'A cobble-paved private courtyard behind security gates. Used for guest parking and staff access.',
      investigatorNote:
        'Victoria\'s Mercedes logged entering gates. CCTV covers outer gate only.',
      icon: 'car',
      evidenceIds: [],
    },
  ],

  // ─── Discovered & Discoverable Evidence (Public Descriptions Only) ──────────

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
