import type { Case } from '@/game/types';

// ─────────────────────────────────────────────────────────────────────────────
// Case #061 — Death on Platform 6
//
// NARRATIVE & SOLUTION TRUTH (Internal only — zero leakage to WebMCP):
//   Culprit    : Nadia Yusuf (Co-founder)
//   Method     : Substituted a visually identical spiked thermos flask containing
//                delayed organophosphate toxin during the 6-minute CCTV gap (6:42–6:48 PM)
//                using Grace Okoro's keycard swiped at 6:44 PM.
//   Motive     : Ibrahim was exercising an IP buyback clause at 7:30 PM to freeze Nadia
//                out of a £10M buyout deal. His death before signing defaulted ownership
//                to Nadia as surviving co-founder under their 2021 partnership agreement.
//   Red Herring: Victor Danjuma's fingerprint on the door frame and dropped audio bug casing
//                left during a corporate espionage attempt to plant a listening device.
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

  // ─── Suspects ──────────────────────────────────────────────────────────────

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
      secrets: [
        'She purchased a matching stainless steel thermos flask at Metro Hardware earlier that afternoon.',
        'She borrowed Grace\'s keycard under the guise of grabbing draft slides, swiped into the lounge at 6:44 PM during the CCTV blackout, and swapped the thermos flask.',
        'She deposited the original unpoisoned thermos flask into station luggage locker 108 at 6:52 PM.',
      ],
      initialStatement:
        '"Ibrahim and I had professional differences regarding company direction, but we built this company together. I was waiting in the concourse when paramedics arrived."',
      interviewResponses: [
        {
          id: 'ny-q1',
          question: 'What were your discussions with Ibrahim at 6:40 PM about?',
          answer:
            '"We reviewed slide 12 of the investor pitch deck. Ibrahim insisted on handling the IP rights section alone during the 7:30 PM session."',
        },
        {
          id: 'ny-q2',
          question: 'Why was Grace Okoro\'s keycard swiped at the lounge door at 6:44 PM?',
          answer:
            '"Grace asked me to drop off her binder inside the lounge before 6:45 PM. I swiped in, left the folder on the side table, and left immediately."',
        },
        {
          id: 'ny-q3',
          question: 'Why does a receipt from Metro Hardware list a 500ml insulated travel flask purchased by your card today?',
          answer:
            '"[pauses] I bought a travel mug for personal use earlier today. That has nothing to do with station catering."',
        },
        {
          id: 'ny-q4',
          question: 'What happens to Novus Dynamics equity if Ibrahim dies prior to the buyout execution?',
          answer:
            '"Under our founding 2021 agreement, if either founder dies before an equity restructuring, their voting shares revert to the surviving co-founder. That is standard partnership law."',
        },
      ],
      relatedEvidenceIds: ['ownership-restructuring-draft', 'metro-hardware-receipt', 'locker-thermos-flask', 'locker-rental-ticket'],
      isKiller: true,
    },

    {
      id: 'tunde-adebayo',
      name: 'Tunde Adebayo',
      title: 'Lead Investor',
      occupation: 'Managing Partner, Apex Capital Partners',
      relationship: 'Primary Financial Backer',
      description:
        'Imposing and assertive venture capitalist who orchestrated the £10M buyout deal for Novus Dynamics.',
      motive:
        'Faces a potential £2M loss if Novus Dynamics fails to secure the buyout agreement before midnight.',
      alibi:
        '"I arrived at the lounge at 7:00 PM. Ibrahim was sitting alone at the table reviewing documents. He drank his coffee and collapsed shortly after 7:25 PM."',
      secrets: [
        'He knew Ibrahim was planning to drop Nadia from the board, but supported Ibrahim because Ibrahim held the primary patents.',
        'His account that Ibrahim entered the lounge at 7:00 PM is contradicted by station keycard logs showing Ibrahim entered at 6:30 PM.',
      ],
      initialStatement:
        '"I came to Platform 6 to close a multi-million pound acquisition. Ibrahim appeared healthy when I walked in at 7:00 PM."',
      interviewResponses: [
        {
          id: 'ta-q1',
          question: 'What time did you enter the Platform 6 lounge?',
          answer:
            '"Exactly at 7:00 PM. I walked in, saw Ibrahim at the table sipping coffee from a silver flask, and began unboxing my laptop."',
        },
        {
          id: 'ta-q2',
          question: 'Did you see anyone else enter or leave the lounge between 7:00 PM and 7:25 PM?',
          answer:
            '"No one entered. The lounge door was shut. Grace was outside checking attendee passes."',
        },
        {
          id: 'ta-q3',
          question: 'What was your financial stake in the 7:30 PM meeting?',
          answer:
            '"Apex Capital invested £2M three years ago. The buyout deal was designed to deliver a 4x return for our fund. Ibrahim\'s death puts the entire transaction in jeopardy."',
        },
      ],
      relatedEvidenceIds: ['tunde-financial-statement', 'investor-buyout-agreement', 'thermos-flask-trio'],
      isKiller: false,
    },

    {
      id: 'grace-okoro',
      name: 'Grace Okoro',
      title: 'Executive Assistant',
      occupation: 'Personal Assistant to CEO, Novus Dynamics',
      relationship: 'Direct Employee',
      description:
        'Meticulous and organized. Manages Ibrahim\'s travel schedules, lounge bookings, and personal belongings.',
      motive:
        'None. Grace was deeply loyal to Ibrahim and worked with him for five years.',
      alibi:
        '"I was outside the lounge door between 6:30 PM and 7:25 PM greeting incoming investors and managing name tags."',
      secrets: [
        'She lent her electronic keycard to Nadia at 6:40 PM when Nadia said she needed to drop off presentation files in the lounge.',
        'She did not notice Nadia swap the thermos flasks because she was helping a guest with luggage.',
      ],
      initialStatement:
        '"I set up Mr. Kareem\'s workspace at 6:30 PM. I placed his schedule binder on his desk and made sure catering was delivered."',
      interviewResponses: [
        {
          id: 'go-q1',
          question: 'Who had access to your electronic lounge keycard during the evening?',
          answer:
            '"I held my card all evening, except for a few minutes around 6:40 PM when Nadia asked to borrow it to put review documents on Ibrahim\'s desk."',
        },
        {
          id: 'go-q2',
          question: 'What catering was delivered to the lounge at 6:15 PM?',
          answer:
            '"Hassan Bello from the station cafe brought three identical stainless steel thermos flasks of dark roast coffee and bottled mineral water."',
        },
        {
          id: 'go-q3',
          question: 'Why does Ibrahim\'s smartwatch log show a lounge access notification at 7:10 PM?',
          answer:
            '"The station cellular network was jammed all evening. Background push notifications were delayed by up to 40 minutes across all our devices."',
        },
      ],
      relatedEvidenceIds: ['grace-schedule-binder', 'lounge-keycard-log', 'smartwatch-sync-log'],
      isKiller: false,
    },

    {
      id: 'victor-danjuma',
      name: 'Victor Danjuma',
      title: 'Rival Entrepreneur',
      occupation: 'CEO, Danjuma Quantum Systems',
      relationship: 'Direct Business Competitor',
      description:
        'Aggressive commercial competitor who lost a major £5M government defense software tender to Ibrahim two weeks ago.',
      motive:
        'Sought to obtain confidential buyout valuation metrics from Ibrahim\'s meeting to undermine Novus Dynamics\' market position.',
      alibi:
        '"I was at Platform 6 catching the 7:15 PM express train to Manchester. I never entered the private lounge."',
      secrets: [
        'He approached the lounge door frame at 6:45 PM to attach a miniature wireless audio listening bug.',
        'He accidentally dropped the plastic bug housing when he was startled by a station guard, leaving his fingerprint on the door frame.',
      ],
      initialStatement:
        '"Kareem and I were rivals, but I had a train to catch. I was nowhere near his private lounge area."',
      interviewResponses: [
        {
          id: 'vd-q1',
          question: 'Why were your fingerprints found on the Platform 6 lounge door frame?',
          answer:
            '"[sighs] Fine. At 6:45 PM I walked past the door. I touched the brass frame while looking inside through the frosted glass cutout. I wanted to see who Ibrahim was meeting."',
        },
        {
          id: 'vd-q2',
          question: 'Why was a plastic audio bug casing containing your DNA found near the lounge threshold?',
          answer:
            '"Look, it was corporate intelligence. I tried to plant a audio receiver under the exterior door seal to record buyout figures. I dropped the casing when security walked past. I never opened the door or touched his food!"',
        },
        {
          id: 'vd-q3',
          question: 'Did you see anyone inside the corridor at 6:45 PM?',
          answer:
            '"I saw Nadia walking away toward the main concourse carrying a dark leather handbag. She looked rushed."',
        },
      ],
      relatedEvidenceIds: ['danjuma-corridor-fingerprint', 'audio-bug-casing'],
      isKiller: false,
    },

    {
      id: 'hassan-bello',
      name: 'Restaurant Manager',
      title: 'Station Cafe Manager',
      occupation: 'General Manager, Concourse Grand Bistro',
      relationship: 'Catering Provider',
      description:
        'Experienced hospitality manager responsible for VIP lounge catering services across the railway terminal.',
      motive:
        'None. Ibrahim was a frequent VIP client who tipped generously.',
      alibi:
        '"I personally delivered the coffee service to Platform 6 Lounge at 6:15 PM, set the flasks on the side credenza, and returned to the main bistro kitchen."',
      secrets: [
        'He delivered three factory-standard 500ml stainless steel thermos flasks from the Bistro kitchen stock.',
        'He noticed a discarded hardware store receipt in the Bistro recycling bin at 6:50 PM.',
      ],
      initialStatement:
        '"Our coffee service is prepared under strict hygiene standards. We delivered three sealed stainless steel thermoses at 6:15 PM as requested."',
      interviewResponses: [
        {
          id: 'hb-q1',
          question: 'Describe the coffee containers delivered at 6:15 PM.',
          answer:
            '"We use standard 500ml brushed stainless steel thermos flasks with black silicone pouring spouts. All three flasks delivered at 6:15 PM came directly from our sanitized kitchen rack."',
        },
        {
          id: 'hb-q2',
          question: 'Were all three flasks identical in appearance?',
          answer:
            '"Visually identical. They are mass-manufactured Metro Pro-500 models. Dozens of retailers sell the exact same design."',
        },
        {
          id: 'hb-q3',
          question: 'Did anyone touch the coffee tray between 6:15 PM and 6:30 PM?',
          answer:
            '"Grace Okoro inspected the tray at 6:25 PM before Mr. Kareem arrived. The flasks were sealed when I left them."',
        },
      ],
      relatedEvidenceIds: ['catering-delivery-slip', 'thermos-flask-trio', 'metro-hardware-receipt'],
      isKiller: false,
    },
  ],

  // ─── Locations ─────────────────────────────────────────────────────────────

  locations: [
    {
      id: 'private-lounge',
      name: 'Platform 6 Private Lounge',
      icon: '🛋️',
      description:
        'A sound-proofed executive waiting room beside Platform 6 featuring leather seating, a mahogany meeting table, and a catering credenza.',
      investigatorNote:
        'Ibrahim Kareem was found slumped in an armchair beside the meeting table. An empty porcelain espresso cup and three stainless steel thermos flasks sit on the credenza.',
      evidenceIds: ['lounge-coffee-table', 'thermos-flask-trio', 'espresso-cup-residue', 'toxicology-preliminary-report', 'danjuma-corridor-fingerprint', 'audio-bug-casing'],
    },
    {
      id: 'concourse-cafe',
      name: 'Terminal Concourse & Restaurant',
      icon: '☕',
      description:
        'The bustling main terminal concourse housing retail shops, recycling stations, and the Concourse Grand Bistro.',
      investigatorNote:
        'A discarded hardware receipt was found in a recycling bin outside the Bistro. A station concourse cleaner was stationed near the platform entrance.',
      evidenceIds: ['metro-hardware-receipt', 'catering-delivery-slip', 'concourse-cleaner-statement'],
    },
    {
      id: 'executive-suite',
      name: 'Terminal Executive Offices',
      icon: '💼',
      description:
        'The administrative wing of the terminal used by Novus Dynamics executives to prepare investor pitch materials.',
      investigatorNote:
        'Draft legal restructuring agreements and investor buyout documents rest on the main desk alongside Grace Okoro\'s schedule binder.',
      evidenceIds: ['ownership-restructuring-draft', 'investor-buyout-agreement', 'grace-schedule-binder', 'smartwatch-sync-log', 'tunde-financial-statement'],
    },
    {
      id: 'security-cctv-room',
      name: 'Station Security Monitoring Office',
      icon: '📹',
      description:
        'The central station security hub housing digital video recorders, network switches, and electronic door access servers.',
      investigatorNote:
        'CCTV feed logs reveal a 6-minute recording gap on Camera 4 covering the lounge entrance between 6:42 PM and 6:48 PM.',
      evidenceIds: ['cctv-corridor-gap', 'lounge-keycard-log'],
    },
    {
      id: 'platform-luggage-area',
      name: 'Platform 6 Storage & Luggage Lockers',
      icon: '🧳',
      description:
        'A bank of automated self-service luggage lockers located at the far end of Platform 6.',
      investigatorNote:
        'Locker #108 was rented with cash at 6:52 PM. Inside, investigators discovered a stainless steel thermos flask matching the Bistro catering set.',
      evidenceIds: ['locker-thermos-flask', 'locker-rental-ticket'],
    },
  ],

  // ─── Evidence ──────────────────────────────────────────────────────────────

  evidence: [
    {
      id: 'lounge-coffee-table',
      name: 'Mahogany Meeting Table',
      description:
        'The primary conference table inside the Platform 6 private lounge.',
      detailedDescription:
        'The table surface is neatly arranged with pitch slides, an open laptop, and a notepad. Positioned to the right of the laptop is a single porcelain espresso cup with dark liquid residue.',
      location: 'private-lounge',
      tags: ['physical', 'crime scene'],
      relatedSuspectIds: ['ibrahim-kareem', 'tunde-adebayo'],
      relatedEvidenceIds: ['espresso-cup-residue', 'thermos-flask-trio'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Shows Ibrahim was actively working at his laptop when he drank from the cup.',
    },
    {
      id: 'thermos-flask-trio',
      name: 'Brushed Stainless Thermos Trio',
      description:
        'Three visually identical 500ml stainless steel thermos flasks resting on the lounge credenza.',
      detailedDescription:
        'Flask A (full), Flask B (half-full), and Flask C (empty). All three bear the manufacturer mark "Metro Pro-500". Chemical swab analysis of Flask C (the empty flask) indicates pure Ethiopian roast coffee with zero toxic additives. Flask C was the harmless flask delivered by Hassan Bello.',
      location: 'private-lounge',
      tags: ['physical', 'forensic', 'container'],
      relatedSuspectIds: ['hassan-bello', 'ibrahim-kareem'],
      relatedEvidenceIds: ['espresso-cup-residue', 'locker-thermos-flask'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Proves the coffee delivered by Hassan was uncontaminated, establishing that substitution occurred.',
    },
    {
      id: 'espresso-cup-residue',
      name: 'Porcelain Espresso Cup & Residue',
      description:
        'A white porcelain cup containing approximately 15ml of dark coffee residue.',
      detailedDescription:
        'Lab analysis of the residue confirms high concentrations of a synthetic delayed-action organophosphate toxin (carbamate derivative). Fingerprint analysis reveals Ibrahim Kareem\'s thumbprint on the handle and a smudged gloved print on the rim.',
      location: 'private-lounge',
      tags: ['physical', 'forensic', 'poison'],
      relatedSuspectIds: ['ibrahim-kareem', 'nadia-yusuf'],
      relatedEvidenceIds: ['thermos-flask-trio', 'toxicology-preliminary-report'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Confirms the poison was administered via the espresso drink ingested by Ibrahim.',
    },
    {
      id: 'toxicology-preliminary-report',
      name: 'Preliminary Toxicology Report',
      description:
        'An urgent lab report from the State Forensic Pathology Unit.',
      detailedDescription:
        'Pathology findings: Cause of death was acute respiratory inhibition and cardiac arrest triggered by a lipophilic organophosphate carbamate. Estimated ingestion window: 7:00 PM – 7:10 PM. Toxin onset delay: 20 to 30 minutes following ingestion.',
      location: 'private-lounge',
      tags: ['document', 'forensic', 'medical'],
      relatedSuspectIds: ['ibrahim-kareem'],
      relatedEvidenceIds: ['espresso-cup-residue'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Pins the ingestion time to approximately 7:05 PM, matching when Ibrahim drank in the lounge.',
    },
    {
      id: 'ownership-restructuring-draft',
      name: 'Ownership Restructuring Draft',
      description:
        'A confidential legal document drafted by Novus Dynamics legal counsel.',
      detailedDescription:
        'Section 4.2 ("Founder IP Buyback"): Authorizes Ibrahim Kareem to repurchase 100% of core patent rights from Nadia Yusuf for a nominal fee of £100 prior to 7:30 PM tonight. Section 9.1 states that if either founder dies prior to execution, all un-transferred equity reverts to the surviving co-founder.',
      location: 'executive-suite',
      tags: ['document', 'legal', 'financial'],
      relatedSuspectIds: ['nadia-yusuf', 'ibrahim-kareem'],
      relatedEvidenceIds: ['investor-buyout-agreement'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Establishes Nadia\'s motive: Ibrahim\'s death before 7:30 PM prevented the buyback and defaulted total ownership to Nadia.',
    },
    {
      id: 'investor-buyout-agreement',
      name: '£10M Investor Buyout Agreement',
      description:
        'A binding acquisition agreement between Novus Dynamics and Apex Capital Partners.',
      detailedDescription:
        'Valuation: £10,000,000. Under the terms, if Ibrahim Kareem executes Section 4.2 of the IP buyback, Apex Capital acquires 80% equity, yielding £8M to Ibrahim and £0 to Nadia. Unsigned.',
      location: 'executive-suite',
      tags: ['document', 'financial'],
      relatedSuspectIds: ['tunde-adebayo', 'nadia-yusuf'],
      relatedEvidenceIds: ['ownership-restructuring-draft'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Confirms the immense financial stakes (£8M shift) depending on whether Ibrahim signed before 7:30 PM.',
    },
    {
      id: 'grace-schedule-binder',
      name: 'Grace\'s Executive Schedule Binder',
      description:
        'A leather itinerary binder maintained by executive assistant Grace Okoro.',
      detailedDescription:
        'Contains Ibrahim\'s minute-by-minute timetable for the evening: 6:15 PM Catering Delivery; 6:30 PM Ibrahim Lounge Entry; 6:40 PM Concourse Briefing with Nadia; 7:00 PM Tunde Adebayo Arrival; 7:30 PM Buyout Signing.',
      location: 'executive-suite',
      tags: ['document', 'log'],
      relatedSuspectIds: ['grace-okoro', 'ibrahim-kareem'],
      relatedEvidenceIds: ['lounge-keycard-log', 'smartwatch-sync-log'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Establishes the intended schedule against which actual keycard swipes and CCTV gaps can be compared.',
    },
    {
      id: 'smartwatch-sync-log',
      name: 'Ibrahim\'s Smartwatch Activity Export',
      description:
        'A digital data export from Ibrahim Kareem\'s smartwatch synced to his cloud account.',
      detailedDescription:
        'Log shows a push notification: "Lounge Access Confirmed — 7:10 PM". However, system event metadata indicates the actual door swipe occurred at 6:30 PM, but the cloud push notification was delayed by 40 minutes due to terminal network congestion.',
      location: 'executive-suite',
      tags: ['digital', 'technical'],
      relatedSuspectIds: ['ibrahim-kareem', 'tunde-adebayo'],
      relatedEvidenceIds: ['lounge-keycard-log', 'grace-schedule-binder'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Resolves the misleading 7:10 PM notification timestamp, proving Ibrahim entered the lounge at 6:30 PM.',
    },
    {
      id: 'cctv-corridor-gap',
      name: 'CCTV Corridor Camera 4 Audit Log',
      description:
        'System diagnostic logs for Camera 4 covering the corridor leading to Platform 6 Lounge.',
      detailedDescription:
        'Camera 4 video feed shows a 6-minute recording gap from 6:42:10 PM to 6:48:15 PM. Network logs confirm the gap was caused by an automated switch reboot triggered from the security server maintenance panel.',
      location: 'security-cctv-room',
      tags: ['digital', 'technical', 'cctv'],
      relatedSuspectIds: ['nadia-yusuf', 'victor-danjuma'],
      relatedEvidenceIds: ['lounge-keycard-log', 'locker-rental-ticket'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Pins the exact window of unmonitored opportunity when the flask substitution occurred.',
    },
    {
      id: 'lounge-keycard-log',
      name: 'Electronic Lounge Keycard Access Log',
      description:
        'The electronic access log export for the Platform 6 Lounge mag-lock door.',
      detailedDescription:
        'Swipe records: 6:30:12 PM — Ibrahim Kareem (Keycard #01); 6:44:08 PM — Grace Okoro (Keycard #03); 7:00:15 PM — Tunde Adebayo (Keycard #02). Note: Grace Okoro\'s keycard was swiped at 6:44:08 PM during the CCTV blackout.',
      location: 'security-cctv-room',
      tags: ['digital', 'log'],
      relatedSuspectIds: ['grace-okoro', 'nadia-yusuf'],
      relatedEvidenceIds: ['cctv-corridor-gap', 'grace-schedule-binder'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Proves Grace\'s keycard was used to enter the lounge at 6:44 PM during the CCTV gap (borrowed by Nadia).',
    },
    {
      id: 'metro-hardware-receipt',
      name: 'Metro Hardware Store Receipt',
      description:
        'A discarded paper store receipt recovered from a concourse recycling bin.',
      detailedDescription:
        'Metro Hardware Store (Terminal Concourse Branch), dated today at 3:15 PM. Item: "Metro Pro-500 Insulated Travel Flask (Brushed Steel)". Payment: Visa Credit ending in #4092 (matching Nadia Yusuf\'s business card).',
      location: 'concourse-cafe',
      tags: ['document', 'financial'],
      relatedSuspectIds: ['nadia-yusuf'],
      relatedEvidenceIds: ['thermos-flask-trio', 'locker-thermos-flask'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Links Nadia Yusuf directly to the purchase of a duplicate Metro Pro-500 thermos flask earlier that afternoon.',
    },
    {
      id: 'catering-delivery-slip',
      name: 'Bistro Catering Delivery Slip',
      description:
        'A printed delivery voucher signed by lounge staff.',
      detailedDescription:
        'Concourse Grand Bistro, order #B-881 at 6:15 PM. Items: 3x Metro Pro-500 Thermos (Dark Roast), 1x Mineral Water Set. Signed received by G. Okoro.',
      location: 'concourse-cafe',
      tags: ['document', 'log'],
      relatedSuspectIds: ['hassan-bello', 'grace-okoro'],
      relatedEvidenceIds: ['thermos-flask-trio'],
      isRedHerring: false,
      contributesToSolution: false,
      hiddenSignificance:
        'Confirms Hassan delivered three harmless coffee thermoses at 6:15 PM.',
    },
    {
      id: 'danjuma-corridor-fingerprint',
      name: 'Smudged Door Frame Fingerprint',
      description:
        'A partial latent fingerprint lifted from the outer brass frame of the lounge door.',
      detailedDescription:
        'Forensic analysis matches the right index finger of Victor Danjuma. Print orientation indicates pressing against the exterior frame while standing outside the door.',
      location: 'private-lounge',
      tags: ['physical', 'forensic', 'fingerprint'],
      relatedSuspectIds: ['victor-danjuma'],
      relatedEvidenceIds: ['audio-bug-casing'],
      isRedHerring: true,
      contributesToSolution: false,
      hiddenSignificance:
        'Red herring. Left by Victor Danjuma while attempting corporate espionage (planting an audio bug).',
    },
    {
      id: 'audio-bug-casing',
      name: 'Crushed Plastic Bug Housing',
      description:
        'A miniature black plastic casing found near the lounge door threshold.',
      detailedDescription:
        'Contains miniature micro-circuitry for a short-range FM audio transmitter. Micro-swabs reveal DNA matching Victor Danjuma. The device was damaged when stepped on.',
      location: 'private-lounge',
      tags: ['physical', 'electronic'],
      relatedSuspectIds: ['victor-danjuma'],
      relatedEvidenceIds: ['danjuma-corridor-fingerprint'],
      isRedHerring: true,
      contributesToSolution: false,
      hiddenSignificance:
        'Red herring establishing Victor Danjuma\'s motive was corporate audio surveillance, not murder.',
    },
    {
      id: 'locker-thermos-flask',
      name: 'Recovered Stainless Thermos (#108)',
      description:
        'A brushed steel thermos flask recovered from Platform 6 Luggage Locker #108.',
      detailedDescription:
        'A Metro Pro-500 500ml thermos flask containing 450ml of dark Ethiopian roast coffee. Lab testing confirms zero toxic additives. Fingerprint examination reveals Nadia Yusuf\'s right thumbprint on the base and Hassan Bello\'s thumbprint on the lid.',
      location: 'platform-luggage-area',
      tags: ['physical', 'forensic', 'container'],
      relatedSuspectIds: ['nadia-yusuf', 'hassan-bello'],
      relatedEvidenceIds: ['locker-rental-ticket', 'thermos-flask-trio', 'metro-hardware-receipt'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'The original uncontaminated flask delivered by Hassan, which Nadia removed from the lounge and hid in locker 108.',
    },
    {
      id: 'locker-rental-ticket',
      name: 'Locker #108 Cash Rental Ticket',
      description:
        'An automated printed locker deposit ticket found on the luggage area counter.',
      detailedDescription:
        'Locker #108, deposit timestamp: 6:52:40 PM. Paid: £2.00 cash. Station system logs show Locker #108 was opened and locked once between 6:50 PM and 7:00 PM.',
      location: 'platform-luggage-area',
      tags: ['document', 'log'],
      relatedSuspectIds: ['nadia-yusuf'],
      relatedEvidenceIds: ['locker-thermos-flask', 'concourse-cleaner-statement'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Establishes the exact time (6:52 PM) when the original coffee flask was hidden in locker 108.',
    },
    {
      id: 'concourse-cleaner-statement',
      name: 'Concourse Cleaner Witness Statement',
      description:
        'A written statement from station sanitation worker Marcus Vance.',
      detailedDescription:
        '"At around 6:50 PM, I was emptying bins near Platform 6. I saw a woman wearing a dark navy trench coat and leather gloves carry a silver thermos flask into the luggage locker bay. She walked out two minutes later without the flask."',
      location: 'concourse-cafe',
      tags: ['witness', 'statement'],
      relatedSuspectIds: ['nadia-yusuf'],
      relatedEvidenceIds: ['locker-rental-ticket', 'locker-thermos-flask'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Eyewitness observation matching Nadia Yusuf\'s attire carrying the thermos to locker 108 at 6:50 PM.',
    },
    {
      id: 'tunde-financial-statement',
      name: 'Apex Capital Fund Audit Summary',
      description:
        'An audited financial overview of Apex Capital Partners Fund III.',
      detailedDescription:
        'Indicates Apex Capital fund covenants require a successful exit from Novus Dynamics by Q3. Tunde Adebayo\'s personal management bonus (£300,000) is tied directly to completing the £10M buyout deal.',
      location: 'executive-suite',
      tags: ['document', 'financial'],
      relatedSuspectIds: ['tunde-adebayo'],
      relatedEvidenceIds: ['investor-buyout-agreement'],
      isRedHerring: false,
      contributesToSolution: false,
      hiddenSignificance:
        'Explains Tunde\'s financial interest in closing the deal, but confirms he needed Ibrahim alive to sign.',
    },
  ],

  // ─── Timeline Events ───────────────────────────────────────────────────────

  timeline: [
    {
      id: 'dep6-tl-1',
      time: '5:30 PM',
      description: 'Ibrahim Kareem arrives at Central Railway Terminal for 7:30 PM investor buyout meeting.',
      source: 'Station arrival camera',
      suspectIds: ['ibrahim-kareem'],
      evidenceIds: [],
      isContradiction: false,
      alwaysVisible: true,
    },
    {
      id: 'dep6-tl-2',
      time: '6:00 PM',
      description: 'Grace Okoro sets up executive suite documents and hands master lounge keycard to Nadia Yusuf.',
      source: 'Executive Assistant statement',
      suspectIds: ['grace-okoro', 'nadia-yusuf'],
      evidenceIds: ['grace-schedule-binder'],
      isContradiction: false,
    },
    {
      id: 'dep6-tl-3',
      time: '6:15 PM',
      description: 'Hassan Bello delivers three identical 500ml stainless steel thermos flasks to Platform 6 Lounge.',
      source: 'Bistro delivery slip',
      suspectIds: ['hassan-bello', 'grace-okoro'],
      evidenceIds: ['catering-delivery-slip', 'thermos-flask-trio'],
      isContradiction: false,
    },
    {
      id: 'dep6-tl-4',
      time: '6:30 PM',
      description: 'Ibrahim Kareem swipes into Platform 6 Lounge (Keycard #01). Smartwatch queued push notification.',
      source: 'Electronic keycard log',
      suspectIds: ['ibrahim-kareem'],
      evidenceIds: ['lounge-keycard-log', 'smartwatch-sync-log'],
      isContradiction: false,
    },
    {
      id: 'dep6-tl-5',
      time: '6:40 PM',
      description: 'Nadia Yusuf meets Ibrahim briefly in main concourse before he returns to the lounge.',
      source: 'Witness account',
      suspectIds: ['nadia-yusuf', 'ibrahim-kareem'],
      evidenceIds: [],
      isContradiction: false,
    },
    {
      id: 'dep6-tl-6',
      time: '6:42 PM',
      description: 'Camera 4 outside Platform 6 Lounge experiences a 6-minute CCTV gap due to automated router reboot.',
      source: 'Security server log',
      suspectIds: ['nadia-yusuf', 'victor-danjuma'],
      evidenceIds: ['cctv-corridor-gap'],
      isContradiction: false,
    },
    {
      id: 'dep6-tl-7',
      time: '6:44 PM',
      description: 'Grace Okoro\'s keycard (#03) is swiped at lounge door during CCTV blackout; spiked thermos flask substituted.',
      source: 'Electronic keycard log',
      suspectIds: ['grace-okoro', 'nadia-yusuf'],
      evidenceIds: ['lounge-keycard-log', 'cctv-corridor-gap', 'metro-hardware-receipt'],
      isContradiction: true,
      contradictsSuspectId: 'nadia-yusuf',
    },
    {
      id: 'dep6-tl-8',
      time: '6:45 PM',
      description: 'Victor Danjuma approaches lounge door frame and accidentally drops plastic audio bug housing.',
      source: 'Forensic print & bug casing',
      suspectIds: ['victor-danjuma'],
      evidenceIds: ['danjuma-corridor-fingerprint', 'audio-bug-casing'],
      isContradiction: false,
    },
    {
      id: 'dep6-tl-9',
      time: '6:50 PM',
      description: 'Concourse cleaner observes woman in navy trench coat carrying silver flask into luggage locker bay.',
      source: 'Cleaner witness statement',
      suspectIds: ['nadia-yusuf'],
      evidenceIds: ['concourse-cleaner-statement'],
      isContradiction: false,
    },
    {
      id: 'dep6-tl-10',
      time: '6:52 PM',
      description: 'Platform 6 Locker #108 rented with cash deposit; original unpoisoned thermos flask deposited.',
      source: 'Locker deposit ticket',
      suspectIds: ['nadia-yusuf'],
      evidenceIds: ['locker-rental-ticket', 'locker-thermos-flask'],
      isContradiction: false,
    },
    {
      id: 'dep6-tl-11',
      time: '7:00 PM',
      description: 'Tunde Adebayo arrives at lounge; claims Ibrahim had just entered alone moments prior.',
      source: 'Tunde Adebayo statement',
      suspectIds: ['tunde-adebayo'],
      evidenceIds: ['lounge-keycard-log'],
      isContradiction: true,
      contradictsSuspectId: 'tunde-adebayo',
    },
    {
      id: 'dep6-tl-12',
      time: '7:05 PM',
      description: 'Ibrahim drinks spiked espresso from the substituted thermos flask on the meeting table.',
      source: 'Forensic pathology report',
      suspectIds: ['ibrahim-kareem'],
      evidenceIds: ['espresso-cup-residue', 'toxicology-preliminary-report'],
      isContradiction: false,
    },
    {
      id: 'dep6-tl-13',
      time: '7:10 PM',
      description: 'Delayed smartwatch push notification displays "Lounge Access Confirmed" on phone screen.',
      source: 'Smartwatch activity export',
      suspectIds: ['ibrahim-kareem'],
      evidenceIds: ['smartwatch-sync-log'],
      isContradiction: false,
    },
    {
      id: 'dep6-tl-14',
      time: '7:30 PM',
      description: 'Ibrahim collapses during buyout presentation; paramedics called. Pronounced dead at scene.',
      source: 'Emergency dispatch log',
      suspectIds: ['ibrahim-kareem', 'tunde-adebayo'],
      evidenceIds: ['toxicology-preliminary-report'],
      isContradiction: false,
    },
  ],

  // ─── Solution ──────────────────────────────────────────────────────────────

  solution: {
    killerId: 'nadia-yusuf',
    method:
      'Nadia Yusuf substituted a visually identical Metro Pro-500 thermos flask containing delayed organophosphate carbamate toxin during the 6-minute CCTV blackout (6:42–6:48 PM) using Grace Okoro\'s keycard swiped at 6:44 PM.',
    motive:
      'Ibrahim Kareem was triggering Section 4.2 of the restructuring draft at 7:30 PM to buy back Nadia\'s IP rights for £100 and freeze her out of the £10M acquisition. Ibrahim\'s death before signing defaulted 100% company ownership to Nadia as surviving co-founder under their 2021 partnership agreement.',
    opportunity:
      'Borrowed Grace\'s keycard under the guise of dropping off slides, entered the lounge at 6:44 PM during the CCTV Camera 4 blackout, swapped the coffee thermos, and hidden the original harmless thermos in station locker #108 at 6:52 PM.',
    fullExplanation:
      'Nadia Yusuf purchased a matching Metro Pro-500 stainless steel thermos flask at Metro Hardware earlier that afternoon (proven by receipt #SE-402 billed to her business card). At 6:15 PM, Hassan Bello delivered three identical harmless thermoses to the lounge. At 6:40 PM, Nadia borrowed assistant Grace Okoro\'s keycard. During the 6:42–6:48 PM CCTV blackout on Camera 4, Nadia swiped into the lounge at 6:44 PM using Grace\'s card, swapped Hassan\'s harmless thermos with her spiked thermos, and carried the original thermos to station locker #108 where she deposited it at 6:52 PM (witnessed by concourse cleaner Marcus Vance). Ibrahim drank the poisoned espresso at 7:05 PM and collapsed at 7:30 PM. Tunde\'s statement that Ibrahim entered at 7:00 PM was contradicted by the electronic keycard log showing Ibrahim entered at 6:30 PM, and Victor Danjuma\'s fingerprint and audio bug were left during corporate espionage (red herring).',
    keyEvidenceIds: [
      'metro-hardware-receipt',
      'cctv-corridor-gap',
      'lounge-keycard-log',
      'locker-thermos-flask',
      'locker-rental-ticket',
      'concourse-cleaner-statement',
      'ownership-restructuring-draft',
      'espresso-cup-residue',
    ],
  },

  // ─── Hidden Relationships ──────────────────────────────────────────────────

  hiddenRelationships: [
    {
      sourceId: 'nadia-yusuf',
      targetId: 'grace-okoro',
      relationshipType: 'Borrowed Keycard Access',
      description: 'Nadia borrowed Grace\'s keycard at 6:40 PM under the guise of dropping off slides, using it to access the lounge during the CCTV blackout.',
      requiresEvidenceIds: ['lounge-keycard-log', 'grace-schedule-binder', 'cctv-corridor-gap'],
    },
    {
      sourceId: 'victor-danjuma',
      targetId: 'ibrahim-kareem',
      relationshipType: 'Corporate Espionage Surveillance',
      description: 'Victor Danjuma attempted to plant an audio transmitter near the lounge door to record buyout valuation metrics.',
      requiresEvidenceIds: ['danjuma-corridor-fingerprint', 'audio-bug-casing'],
    },
  ],

  // ─── Deduction Requirements ────────────────────────────────────────────────

  deductionRequirements: [
    {
      id: 'req-flask-substitution',
      title: 'Flask Substitution Method',
      description: 'Establish that Nadia purchased a duplicate thermos flask and swapped it with Hassan\'s catering delivery.',
      requiredEvidenceIds: ['metro-hardware-receipt', 'thermos-flask-trio', 'locker-thermos-flask'],
    },
    {
      id: 'req-blackout-opportunity',
      title: 'CCTV Blackout & Keycard Opportunity',
      description: 'Identify the 6:42–6:48 PM CCTV blackout and 6:44 PM keycard swipe as the exact substitution window.',
      requiredEvidenceIds: ['cctv-corridor-gap', 'lounge-keycard-log', 'locker-rental-ticket'],
    },
    {
      id: 'req-ip-buyout-motive',
      title: 'IP Buyout Freeze-out Motive',
      description: 'Prove that Ibrahim\'s death before 7:30 PM prevented the IP buyback and defaulted £10M equity to Nadia.',
      requiredEvidenceIds: ['ownership-restructuring-draft', 'investor-buyout-agreement'],
    },
    {
      id: 'req-espionage-red-herring',
      title: 'Espionage Red Herring Identification',
      description: 'Recognize that Victor Danjuma\'s door fingerprint and audio bug were left during corporate surveillance, not murder.',
      requiredEvidenceIds: ['danjuma-corridor-fingerprint', 'audio-bug-casing'],
    },
  ],
};
