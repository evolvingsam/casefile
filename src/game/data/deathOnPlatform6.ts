import type { Case } from '@/game/types';

// ─────────────────────────────────────────────────────────────────────────────
// Case #061 — Death on Platform 6 (PUBLIC CLIENT MODEL)
//
// NOTE FOR SECURITY & INTEGRITY (Problem 3 & 4):
// Secret solution data, killer identity, hidden significances, secrets, and
// deduction requirements are stored ONLY on the server in src/server/cases/
// and are NEVER bundled into client JavaScript.
// ─────────────────────────────────────────────────────────────────────────────

export const DEATH_ON_PLATFORM_6: Case = {
  id: 'death-on-platform-6-061',
  caseNumber: '#061',
  title: 'Death on Platform 6',
  subtitle: 'Poison at the terminal',
  difficulty: 'Expert',
  estimatedTime: '30-40 mins',
  status: 'available',
  victim: 'Ibrahim Kareem',
  victimDescription:
    'Technology entrepreneur and CEO of Novus Dynamics (age 42). Found dead inside Platform 6 private waiting lounge shortly before an important £10M investor buyout meeting.',
  objective:
    'Determine who poisoned Ibrahim Kareem, how the poison was administered, why they did it, when the poisoning occurred, and which evidence is misleading.',
  briefing:
    'Technology entrepreneur Ibrahim Kareem was found dead inside a private waiting lounge at Platform 6 of Central Railway Station shortly before an important investor meeting. Initial assumptions of natural cardiac arrest were overturned by preliminary toxicology indicating delayed-action poison. Five individuals had significant interactions with Ibrahim that evening. Method, opportunity, timeline, motive, and contradiction must be combined to reveal the killer.',

  // ─── Suspects (Public Dossiers Only) ───────────────────────────────────────

  suspects: [
    {
      id: 'nadia-yusuf',
      name: 'Nadia Yusuf',
      title: 'Co-Founder & Director',
      occupation: 'Co-Founder & Chief Product Officer, Novus Dynamics',
      relationship: 'Former Business Partner & Equal Co-Founder',
      description:
        'Sharp, pragmatic, and highly knowledgeable about Novus Dynamics\' patent portfolio. Co-founded the company with Ibrahim four years ago.',
      motive:
        'Ibrahim was planning to trigger an IP buyback clause at 7:30 PM to freeze Nadia out of the £10M buyout deal. His death before signing defaulted full ownership to Nadia as surviving co-founder.',
      alibi:
        '"I arrived at the station at 6:20 PM and met Ibrahim briefly in the concourse at 6:40 PM to review presentation slides. I then waited in the main concourse cafe until the 7:30 PM meeting started."',
      initialStatement:
        '"Ibrahim and I built Novus Dynamics from scratch. We had our disagreements over buyout valuation, but I would never harm him."',
      interviewResponses: [
        {
          id: 'ny-q1',
          question: 'What was your discussion with Ibrahim at 6:40 PM about?',
          answer:
            '"We reviewed the acquisition slide deck. He seemed calm, sipping coffee from his flask. We agreed to meet in the lounge at 7:30 PM when the investors arrived."',
        },
        {
          id: 'ny-q2',
          question: 'Why did you purchase a Metro Pro-500 thermos at 2:14 PM today?',
          answer:
            '"I bought a thermos for my personal use. I keep it in my handbag. Thermoses are completely common items."',
        },
        {
          id: 'ny-q3',
          question: 'Did you borrow Grace Okoro\'s keycard around 6:40 PM?',
          answer:
            '"I asked Grace for her keycard to drop off the presentation clicker in the lounge. I returned it to her desk five minutes later."',
        },
        {
          id: 'ny-q4',
          question: 'Why was the original harmless coffee thermos found in station locker #108?',
          answer:
            '"I know nothing about station lockers. I was in the concourse cafe until 7:30 PM."',
          requiresEvidenceIds: ['locker-thermos-flask'],
        },
      ],
      relatedEvidenceIds: [
        'metro-hardware-receipt',
        'cctv-corridor-gap',
        'lounge-keycard-log',
        'locker-thermos-flask',
        'locker-rental-ticket',
        'ownership-restructuring-draft',
      ],
    },

    {
      id: 'victor-danjuma',
      name: 'Victor Danjuma',
      title: 'Corporate Intelligence Consultant',
      occupation: 'Managing Partner, Aegis Corporate Risk',
      relationship: 'Investigative Operative hired by rival firm',
      description:
        'Intense, observant, and discreet. Danjuma was hired by a rival tech conglomerate to gather intelligence on Novus Dynamics\' valuation metrics.',
      motive:
        'Securing proprietary valuation figures would net Danjuma a £75,000 intelligence fee from his corporate client.',
      alibi:
        '"I was on Platform 6 observing passenger traffic from 6:15 PM until 7:15 PM. I never entered the private lounge."',
      initialStatement:
        '"I was conducting routine competitive research. I stayed on the public platform platform area at all times."',
      interviewResponses: [
        {
          id: 'vd-q1',
          question: 'Why were your fingerprints found on the lounge door frame?',
          answer:
            '"I leaned against the door frame at 6:35 PM trying to hear if the meeting had started. Leaning against a door is not a crime."',
        },
        {
          id: 'vd-q2',
          question: 'Explain the miniature audio transmitter casing recovered outside the lounge.',
          answer:
            '"I drop things occasionally. It was an unpowered listening device casing. It wasn\'t even transmitting."',
        },
        {
          id: 'vd-q3',
          question: 'Did you see anyone enter the lounge during the 6:42 PM CCTV gap?',
          answer:
            '"I saw a woman in a dark coat swipe a keycard and enter at 6:44 PM carrying a black tote bag, exiting two minutes later."',
        },
        {
          id: 'vd-q4',
          question: 'Did you enter the lounge yourself?',
          answer:
            '"No. My contract was strictly observation. I never went inside."',
        },
      ],
      relatedEvidenceIds: ['danjuma-corridor-fingerprint', 'audio-bug-casing'],
    },

    {
      id: 'grace-okoro',
      name: 'Grace Okoro',
      title: 'Executive Assistant',
      occupation: 'Executive Assistant to CEO, Novus Dynamics',
      relationship: 'Employee & Confidential Assistant',
      description:
        'Highly organized and loyal. Grace managed Ibrahim\'s schedule, lounge bookings, and travel logistics.',
      motive:
        'Grace was recently informed by Ibrahim that her position would be eliminated following the investor acquisition.',
      alibi:
        '"I was at the Platform 6 reception desk from 6:00 PM onwards checking in arriving investors and coordinating catering."',
      initialStatement:
        '"I set up the lounge at 6:00 PM, verified the catering delivery from Hassan at 6:15 PM, and handed Mr. Kareem his tablet at 6:30 PM."',
      interviewResponses: [
        {
          id: 'go-q1',
          question: 'Did Nadia Yusuf borrow your lounge keycard tonight?',
          answer:
            '"Yes, Ms. Yusuf asked to borrow my keycard at 6:40 PM to drop off presentation slides in the lounge. She brought it back around 6:46 PM."',
        },
        {
          id: 'go-q2',
          question: 'Who delivered coffee to the private lounge?',
          answer:
            '"Hassan Bello delivered three identical stainless steel thermoses from Station Coffee Co. at 6:15 PM. I placed them directly on the conference table."',
        },
        {
          id: 'go-q3',
          question: 'Were you aware of the restructuring draft on Ibrahim\'s desk?',
          answer:
            '"I typed the draft agreement. Section 4.2 exercised the IP buyback clause. Nadia was furious when she found out about it yesterday."',
        },
        {
          id: 'go-q4',
          question: 'Did Ibrahim drink coffee after entering the lounge?',
          answer:
            '"He always poured espresso from the thermos right after entering. He had his first cup around 7:05 PM."',
        },
      ],
      relatedEvidenceIds: ['lounge-keycard-log', 'thermos-flask-trio', 'ownership-restructuring-draft'],
    },

    {
      id: 'hassan-bello',
      name: 'Hassan Bello',
      title: 'Catering Operations Manager',
      occupation: 'Station Coffee Co. Catering Supervisor',
      relationship: 'Catering Vendor',
      description:
        'Punctual and customer-focused. Hassan provides VIP coffee service for private lounge bookings at Central Station.',
      motive:
        'Hassan had a dispute with Ibrahim over an unpaid £4,500 VIP catering bill from previous station events.',
      alibi:
        '"I delivered the three thermos flasks at 6:15 PM, handed them to Grace Okoro, and returned to my main station shop at 6:22 PM."',
      initialStatement:
        '"We provide standard high-grade espresso. I delivered three sealed thermoses at 6:15 PM. Everything left my kitchen 100% clean and fresh."',
      interviewResponses: [
        {
          id: 'hb-q1',
          question: 'Were all three thermoses identical when delivered?',
          answer:
            '"Yes. Standard Metro Pro-500 stainless steel thermoses with blue silicone rings. We use them for all VIP orders."',
        },
        {
          id: 'hb-q2',
          question: 'Did anyone touch the coffee tray between your shop and Platform 6?',
          answer:
            '"No one. I carried the tray directly from my concourse shop to Grace\'s desk at 6:15 PM."',
        },
        {
          id: 'hb-q3',
          question: 'Was there any chemical residue in your coffee preparation machines?',
          answer:
            '"Inspectors tested our machines an hour ago — completely clean. The poison didn\'t come from my shop."',
        },
        {
          id: 'hb-q4',
          question: 'What about the unpaid catering invoice?',
          answer:
            '"Ibrahim owed us £4,500. He promised to settle it tonight after his buyout meeting. I wouldn\'t kill a man who owes me money!"',
        },
      ],
      relatedEvidenceIds: ['thermos-flask-trio', 'catering-invoice-receipt'],
    },

    {
      id: 'tunde-adebayo',
      name: 'Tunde Adebayo',
      title: 'Lead Investor Representative',
      occupation: 'Partner, Apex Capital Ventures',
      relationship: 'Prospective Buyer',
      description:
        'Sharply dressed and pragmatic. Tunde was representing Apex Capital in the £10M buyout negotiation.',
      motive:
        'Ibrahim was threatening to pull out of the buyout deal at the last minute unless valuation terms were raised by £2M.',
      alibi:
        '"I arrived at Platform 6 at 7:00 PM, greeted Grace at reception, and walked into the lounge at 7:02 PM. Ibrahim was sitting at the table drinking coffee."',
      initialStatement:
        '"I entered the lounge at 7:02 PM for our scheduled 7:30 PM presentation setup. Ibrahim appeared fine initially, but collapsed twenty minutes later."',
      interviewResponses: [
        {
          id: 'ta-q1',
          question: 'What happened when you entered the lounge at 7:02 PM?',
          answer:
            '"Ibrahim was reviewing slides on his tablet. He poured himself espresso from the thermos on the table, drank it, and complained about a bitter aftertaste."',
        },
        {
          id: 'ta-q2',
          question: 'Did you touch the coffee thermos or espresso cups?',
          answer:
            '"No. I don\'t drink espresso. I was setting up my laptop at the far end of the conference table."',
        },
        {
          id: 'ta-q3',
          question: 'Were there disagreements over the £10M buyout figure?',
          answer:
            '"Standard negotiations. Ibrahim wanted £12M, we offered £10M. It was business, nothing personal."',
        },
        {
          id: 'ta-q4',
          question: 'Did you see anyone else in the corridor before 7:00 PM?',
          answer:
            '"I saw Nadia Yusuf sitting in the main concourse cafe when I walked past at 6:55 PM. She waved to me."',
        },
      ],
      relatedEvidenceIds: ['investor-buyout-agreement', 'espresso-cup-residue'],
    },
  ],

  // ─── Locations ─────────────────────────────────────────────────────────────

  locations: [
    {
      id: 'platform6-lounge',
      name: 'Platform 6 VIP Lounge',
      description:
        'An exclusive private waiting suite equipped with a conference table, leather seating, and direct access to Platform 6.',
      investigatorNote:
        'Crime scene. Ibrahim collapsed here at 7:30 PM. Spiked espresso cup and thermos flask recovered from table.',
      icon: 'coffee',
      evidenceIds: ['espresso-cup-residue', 'thermos-flask-trio', 'ownership-restructuring-draft'],
    },
    {
      id: 'lounge-corridor',
      name: 'Platform 6 Corridor',
      description:
        'The main hallway connecting Platform 6 concourse to the lounge. Secured by electronic keycard door lock and Camera 4 CCTV.',
      investigatorNote:
        'CCTV Camera 4 recorded a 6-minute power gap between 6:42 PM and 6:48 PM. Victor Danjuma\'s print recovered from door frame.',
      icon: 'video',
      evidenceIds: ['cctv-corridor-gap', 'lounge-keycard-log', 'danjuma-corridor-fingerprint', 'audio-bug-casing'],
    },
    {
      id: 'station-lockers',
      name: 'Concourse Luggage Lockers',
      description:
        'Self-service automated locker bay located near Central Station main concourse.',
      investigatorNote:
        'Locker #108 rental ticket time-stamped 6:52 PM. Contains original clean catering thermos flask.',
      icon: 'package',
      evidenceIds: ['locker-thermos-flask', 'locker-rental-ticket', 'concourse-cleaner-statement'],
    },
    {
      id: 'concourse-cafe',
      name: 'Station Concourse Cafe',
      description:
        'An open-plan concourse coffee shop overlooking the main arrival boards.',
      investigatorNote:
        'Nadia Yusuf claims she waited here between 6:45 PM and 7:30 PM.',
      icon: 'coffee',
      evidenceIds: ['metro-hardware-receipt'],
    },
    {
      id: 'reception-desk',
      name: 'Platform 6 Reception Desk',
      description:
        'The administrative check-in desk operated by assistant Grace Okoro.',
      investigatorNote:
        'Keycard audit logs and investor sign-in sheets managed from this terminal.',
      icon: 'clipboard',
      evidenceIds: ['grace-schedule-binder', 'catering-invoice-receipt'],
    },
  ],

  // ─── Evidence (Public Descriptions Only — Zero Solution Leakage) ───────────

  evidence: [
    {
      id: 'espresso-cup-residue',
      name: 'Spiked Espresso Cup Residue',
      description: 'Single ceramic espresso cup found on the lounge table containing dark liquid dregs.',
      detailedDescription: 'Forensic toxicology analysis available upon investigation.',
      location: 'platform6-lounge',
      tags: ['physical', 'toxicology', 'crime scene'],
      relatedSuspectIds: ['nadia-yusuf', 'ibrahim-kareem'],
      relatedEvidenceIds: ['metro-hardware-receipt', 'locker-thermos-flask'],
    },
    {
      id: 'metro-hardware-receipt',
      name: 'Metro Hardware Receipt #SE-402',
      description: 'Receipt for 1x Metro Pro-500 Stainless Thermos Flask purchased at 2:14 PM.',
      detailedDescription: 'Receipt payment and store details available upon inspection.',
      location: 'concourse-cafe',
      tags: ['document', 'financial', 'tracing'],
      relatedSuspectIds: ['nadia-yusuf'],
      relatedEvidenceIds: ['espresso-cup-residue', 'locker-thermos-flask'],
    },
    {
      id: 'cctv-corridor-gap',
      name: 'CCTV Camera 4 Recording Gap Log',
      description: 'DVR system audit log showing Camera 4 power drop between 6:42 PM and 6:48 PM.',
      detailedDescription: 'DVR timestamps available upon inspection.',
      location: 'lounge-corridor',
      tags: ['digital', 'security', 'timeline'],
      relatedSuspectIds: ['nadia-yusuf', 'grace-okoro'],
      relatedEvidenceIds: ['lounge-keycard-log'],
    },
    {
      id: 'lounge-keycard-log',
      name: 'Lounge Electronic Access Door Log',
      description: 'Audit printout from the electronic door lock securing the VIP lounge.',
      detailedDescription: 'Door swipe timestamps available upon inspection.',
      location: 'lounge-corridor',
      tags: ['document', 'digital', 'access control'],
      relatedSuspectIds: ['grace-okoro', 'nadia-yusuf'],
      relatedEvidenceIds: ['cctv-corridor-gap'],
    },
    {
      id: 'locker-thermos-flask',
      name: 'Station Locker #108 Thermos Flask',
      description: 'Stainless steel thermos flask recovered from luggage locker #108 containing hot coffee.',
      detailedDescription: 'Forensic inspection details available upon examination.',
      location: 'station-lockers',
      tags: ['physical', 'catering', 'hidden'],
      relatedSuspectIds: ['nadia-yusuf', 'hassan-bello'],
      relatedEvidenceIds: ['locker-rental-ticket', 'metro-hardware-receipt'],
    },
    {
      id: 'locker-rental-ticket',
      name: 'Concourse Locker #108 Rental Receipt',
      description: 'Time-stamped automated rental counterfoil dated 6:52 PM.',
      detailedDescription: 'Ticket timestamps available upon inspection.',
      location: 'station-lockers',
      tags: ['document', 'digital', 'timeline'],
      relatedSuspectIds: ['nadia-yusuf'],
      relatedEvidenceIds: ['locker-thermos-flask'],
    },
    {
      id: 'concourse-cleaner-statement',
      name: 'Concourse Cleaner Witness Statement',
      description: 'Written statement from cleaner Marcus Vance regarding locker bay activity at 6:50 PM.',
      detailedDescription: 'Witness statement text available upon inspection.',
      location: 'station-lockers',
      tags: ['document', 'witness'],
      relatedSuspectIds: ['nadia-yusuf'],
      relatedEvidenceIds: ['locker-rental-ticket'],
    },
    {
      id: 'ownership-restructuring-draft',
      name: 'Novus Dynamics Draft Restructuring Agreement',
      description: 'Legal agreement draft containing Section 4.2 IP buyback option clause.',
      detailedDescription: 'Agreement clause details available upon inspection.',
      location: 'platform6-lounge',
      tags: ['document', 'legal', 'motive'],
      relatedSuspectIds: ['nadia-yusuf', 'ibrahim-kareem'],
      relatedEvidenceIds: [],
    },
    {
      id: 'thermos-flask-trio',
      name: 'Catering Thermos Delivery Set',
      description: 'Three stainless steel thermoses delivered by Hassan Bello at 6:15 PM.',
      detailedDescription: 'Catering delivery details available upon inspection.',
      location: 'platform6-lounge',
      tags: ['physical', 'catering'],
      relatedSuspectIds: ['hassan-bello', 'grace-okoro'],
      relatedEvidenceIds: ['catering-invoice-receipt'],
    },
    {
      id: 'danjuma-corridor-fingerprint',
      name: 'Fingerprint Lift from Door Frame',
      description: 'Latent fingerprint lift taken from the VIP lounge exterior door frame.',
      detailedDescription: 'Print match details available upon inspection.',
      location: 'lounge-corridor',
      tags: ['forensic', 'fingerprint'],
      relatedSuspectIds: ['victor-danjuma'],
      relatedEvidenceIds: ['audio-bug-casing'],
    },
    {
      id: 'audio-bug-casing',
      name: 'Dropped Audio Transmitter Casing',
      description: 'Miniature plastic housing for a listening device found near the corridor skirting board.',
      detailedDescription: 'Device inspection details available upon examination.',
      location: 'lounge-corridor',
      tags: ['physical', 'espionage'],
      relatedSuspectIds: ['victor-danjuma'],
      relatedEvidenceIds: ['danjuma-corridor-fingerprint'],
    },
  ],

  // ─── Timeline ───────────────────────────────────────────────────────────────

  timeline: [
    {
      id: 'dep6-tl-1',
      time: '6:00 PM',
      description: 'Grace Okoro unlocks VIP lounge and prepares conference room table.',
      source: 'Grace Okoro statement',
      suspectIds: ['grace-okoro'],
      evidenceIds: [],
      isContradiction: false,
      alwaysVisible: true,
    },
    {
      id: 'dep6-tl-2',
      time: '6:15 PM',
      description: 'Hassan Bello delivers three identical thermos flasks of fresh coffee to reception desk.',
      source: 'Catering delivery receipt',
      suspectIds: ['hassan-bello', 'grace-okoro'],
      evidenceIds: ['thermos-flask-trio'],
      isContradiction: false,
      alwaysVisible: true,
    },
    {
      id: 'dep6-tl-3',
      time: '6:30 PM',
      description: 'Ibrahim Kareem arrives at station and unlocks VIP lounge using his master keycard.',
      source: 'Lounge electronic keycard audit log',
      suspectIds: ['ibrahim-kareem'],
      evidenceIds: ['lounge-keycard-log'],
      isContradiction: false,
      alwaysVisible: true,
    },
    {
      id: 'dep6-tl-4',
      time: '6:40 PM',
      description: 'Nadia Yusuf borrows assistant Grace Okoro\'s keycard near reception desk.',
      source: 'Grace Okoro interview response',
      suspectIds: ['nadia-yusuf', 'grace-okoro'],
      evidenceIds: ['lounge-keycard-log'],
      isContradiction: true,
      contradictsSuspectId: 'nadia-yusuf',
    },
    {
      id: 'dep6-tl-5',
      time: '6:42 PM',
      description: 'CCTV Camera 4 in Platform 6 corridor power supply drops for 6 minutes.',
      source: 'CCTV Diagnostic log',
      suspectIds: ['nadia-yusuf'],
      evidenceIds: ['cctv-corridor-gap'],
      isContradiction: true,
      contradictsSuspectId: 'nadia-yusuf',
    },
    {
      id: 'dep6-tl-6',
      time: '6:44 PM',
      description: 'Keycard #09 (Grace Okoro) swiped lounge door during CCTV blackout.',
      source: 'Lounge electronic keycard audit log',
      suspectIds: ['grace-okoro', 'nadia-yusuf'],
      evidenceIds: ['lounge-keycard-log', 'cctv-corridor-gap'],
      isContradiction: true,
      contradictsSuspectId: 'nadia-yusuf',
    },
    {
      id: 'dep6-tl-7',
      time: '6:52 PM',
      description: 'Station luggage locker #108 rented and loaded with clean thermos flask.',
      source: 'Locker rental receipt & cleaner statement',
      suspectIds: ['nadia-yusuf'],
      evidenceIds: ['locker-thermos-flask', 'locker-rental-ticket', 'concourse-cleaner-statement'],
      isContradiction: true,
      contradictsSuspectId: 'nadia-yusuf',
    },
    {
      id: 'dep6-tl-8',
      time: '7:02 PM',
      description: 'Tunde Adebayo enters lounge for scheduled buyout presentation setup.',
      source: 'Tunde Adebayo statement',
      suspectIds: ['tunde-adebayo'],
      evidenceIds: ['lounge-keycard-log'],
      isContradiction: false,
      alwaysVisible: true,
    },
    {
      id: 'dep6-tl-9',
      time: '7:30 PM',
      description: 'Ibrahim Kareem collapses during buyout presentation; emergency services called.',
      source: 'Emergency 999 dispatch log',
      suspectIds: ['ibrahim-kareem', 'nadia-yusuf'],
      evidenceIds: ['espresso-cup-residue'],
      isContradiction: false,
      alwaysVisible: true,
    },
  ],
};
