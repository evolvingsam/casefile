import type { Case } from '@/game/types';

// ─────────────────────────────────────────────────────────────────────────────
// Case #052 — The Vanishing Manuscript (PUBLIC CLIENT MODEL)
//
// NOTE FOR SECURITY & INTEGRITY (Problem 3 & 4):
// Secret solution data, killer identity, hidden significances, secrets, and
// deduction requirements are stored ONLY on the server in src/server/cases/
// and are NEVER bundled into client JavaScript.
// ─────────────────────────────────────────────────────────────────────────────

export const THE_VANISHING_MANUSCRIPT: Case = {
  id: 'vanishing-manuscript-052',
  caseNumber: '#052',
  title: 'The Vanishing Manuscript',
  subtitle: 'A theft in the dark',
  difficulty: 'Advanced',
  estimatedTime: '25-35 mins',
  status: 'available',
  victim: '17th-Century Royal Manuscript',
  victimDescription:
    'An unpublished, historically priceless 17th-century manuscript containing unreleased royal correspondence and treaty drafts. Disappeared from Dr. Elias Okoro\'s restricted archival vault at approximately 10:40 PM.',
  objective:
    'Determine who removed the manuscript, how they accessed the vault, why they wanted it, when the removal actually occurred, and which evidence is misleading.',
  briefing:
    'Dr. Elias Okoro, a renowned historian, was hosting an exclusive evening preview of an unpublished 17th-century manuscript at his private research library. At 10:40 PM, Dr. Okoro unlocked the inner archival vault to present the manuscript to his publisher, only to find the glass display pedestal empty. There were no signs of forced entry. Five individuals were present in the building during the evening. One manuscript. Multiple motives. Zero obvious signs of break-in.',

  // ─── Suspects (Public Dossiers Only) ───────────────────────────────────────

  suspects: [
    {
      id: 'amara-nwosu',
      name: 'Amara Nwosu',
      title: 'Research Assistant',
      occupation: 'Graduate Research Assistant, Okoro Historical Institute',
      relationship: 'Employee & Protégée',
      description:
        'Diligent and attentive to detail. Amara has worked under Dr. Okoro for three years and assisted in preparing the manuscript transcriptions.',
      motive:
        'Amara was passed over for co-authorship credit on the manuscript introduction, creating professional friction.',
      alibi:
        '"I was in the reading library cataloguing secondary source boxes from 9:30 PM until 10:30 PM. I heard footsteps during the brief blackout, but I assumed it was Mr. Adekunle checking light switches."',
      initialStatement:
        '"I spent the whole evening in the reading hall processing catalogue cards. I didn\'t go near the archival vault door after 9:00 PM."',
      interviewResponses: [
        {
          id: 'an-q1',
          question: 'What were your duties during the evening preview?',
          answer:
            '"Dr. Okoro asked me to supervise the reading hall display tables and index secondary references. I was seated at table 4 most of the night."',
        },
        {
          id: 'an-q2',
          question: 'What did you observe during the power blackout at 10:12 PM?',
          answer:
            '"The overhead lights went completely black for about three minutes. I heard heavy footsteps in the corridor moving toward the service exit, followed by the soft latching of a door."',
        },
        {
          id: 'an-q3',
          question: 'Did you see Chinedu Okafor near the vault?',
          answer:
            '"Professor Okafor was examining the display casing at around 9:30 PM. He was writing furiously in his leather notebook and leaning close to the glass."',
        },
        {
          id: 'an-q4',
          question: 'What do you know about the package delivered at 9:45 PM?',
          answer:
            '"A courier brought a large padded crate to the security desk. Mr. Mensah signed for it, which surprised me because deliveries usually go through the mail room."',
        },
      ],
      relatedEvidenceIds: ['archival-catalog-notes', 'abandoned-wine-glass'],
    },

    {
      id: 'david-mensah',
      name: 'David Mensah',
      title: 'Publisher',
      occupation: 'Managing Director, Heritage Academic Press',
      relationship: 'Commercial Partner',
      description:
        'Ambitious and persuasive. Mensah has been pressing Dr. Okoro for months to secure exclusive commercial publication rights.',
      motive:
        'Exclusive publication of the manuscript would net Heritage Press over £250,000 in international licensing deals.',
      alibi:
        '"I arrived around 10:00 PM to negotiate terms with Dr. Okoro in his study. I remained in his office reviewing draft contracts until 10:35 PM."',
      initialStatement:
        '"I\'m here strictly for business. Dr. Okoro invited me to review publication terms. I had no access to the vault keys."',
      interviewResponses: [
        {
          id: 'dm-q1',
          question: 'When did you arrive at the Okoro Institute tonight?',
          answer:
            '"My driver dropped me off at the main entrance around 10:00 PM. I went straight to Dr. Okoro\'s private office on the second floor."',
        },
        {
          id: 'dm-q2',
          question: 'Did you receive a large delivery at 9:45 PM?',
          answer:
            '"Delivery? No, that must be a mix-up. My assistant sent over sample binding materials earlier in the afternoon, not at 9:45 PM."',
        },
        {
          id: 'dm-q3',
          question: 'Did you discuss commercial digitization with Miriam Bello?',
          answer:
            '"Ms. Bello is the conservator. We discussed digital preservation standards, nothing more. It\'s standard industry conversation."',
        },
        {
          id: 'dm-q4',
          question: 'The courier manifest lists your name for a 9:45 PM crate shipment. Explain.',
          answer:
            '"...I had specialized scanning equipment delivered for a different project. It was stored in the holding room. It has nothing to do with the vault."',
          requiresEvidenceIds: ['courier-delivery-manifest'],
        },
      ],
      relatedEvidenceIds: ['courier-delivery-manifest', 'publishers-contract', 'scanner-shipping-box'],
    },

    {
      id: 'miriam-bello',
      name: 'Miriam Bello',
      title: 'Senior Conservator',
      occupation: 'Head of Manuscript Conservation, Royal Historical Society',
      relationship: 'Guest Conservator & Consultant',
      description:
        'Reserved and highly skilled. Miriam was hired to assess the manuscript\'s physical preservation condition before the public announcement.',
      motive:
        'Miriam claims her family originally owned the manuscript prior to colonial acquisition and felt ethically justified in taking it.',
      alibi:
        '"I was working in the conservation lab on the basement level analyzing ink samples until 10:25 PM, when I came upstairs to join the guests for coffee."',
      initialStatement:
        '"My role was purely technical — assessing rag paper degradation. I had no key to the vault and no reason to touch the display pedestal."',
      interviewResponses: [
        {
          id: 'mb-q1',
          question: 'How often did you have access to the archival vault key?',
          answer:
            '"Dr. Okoro keeps the master brass key on his person at all times. Whenever I examined the manuscript, he unlocked the glass case himself."',
        },
        {
          id: 'mb-q2',
          question: 'Where were you during the 10:12 PM power blackout?',
          answer:
            '"Downstairs in the darkroom lab. The emergency backup lights didn\'t kick in down there, so I waited at my workbench until power returned."',
        },
        {
          id: 'mb-q3',
          question: 'A locksmith receipt shows a duplicate vault key ordered on your account. Why?',
          answer:
            '"...That was for a conservation cabinet lock in the basement. The key code reference was a coincidence."',
          requiresEvidenceIds: ['locksmith-receipt'],
        },
        {
          id: 'mb-q4',
          question: 'Why did the rear courtyard door sensor trigger at 10:15 PM?',
          answer:
            '"I cannot speak for courtyard door sensors. I was inside the building the entire evening."',
          requiresEvidenceIds: ['service-door-sensor'],
        },
      ],
      relatedEvidenceIds: [
        'duplicated-vault-key',
        'locksmith-receipt',
        'service-door-sensor',
        'scanner-shipping-box',
      ],
    },

    {
      id: 'chinedu-okafor',
      name: 'Chinedu Okafor',
      title: 'Visiting Scholar',
      occupation: 'Professor of African Colonial History, University of London',
      relationship: 'Academic Rival',
      description:
        'Passionate and outspoken. Okafor has publicly challenged Dr. Okoro\'s interpretations of 17th-century treaties in academic journals.',
      motive:
        'Preventing Dr. Okoro from publishing first would allow Okafor to release his own competing monograph.',
      alibi:
        '"I examined the manuscript in its display case between 9:20 PM and 9:40 PM under supervision. Afterwards, I spent the evening arguing history in the lounge with guests."',
      initialStatement:
        '"I came to verify Okoro\'s claims. The manuscript is genuine, but his translation notes are flawed. I left the vault area before 9:45 PM."',
      interviewResponses: [
        {
          id: 'co-q1',
          question: 'Did you touch the vault display glass during your examination at 9:30 PM?',
          answer:
            '"I leaned against the casing to inspect the marginalia with my magnifying loupe. I may have left palm prints, but I certainly didn\'t open it."',
        },
        {
          id: 'co-q2',
          question: 'Why was a torn page from your notebook found near the vault entrance?',
          answer:
            '"I tore out a page of notes to hand to Dr. Okoro regarding a translation error in paragraph three. He dropped it, not me."',
        },
        {
          id: 'co-q3',
          question: 'Where were you at 10:12 PM when the power failed?',
          answer:
            '"In the library lounge sipping scotch with two visiting fellows. We were discussing 17th-century trade routes when the lights went out."',
        },
        {
          id: 'co-q4',
          question: 'Did you see anyone near the service stairs during the blackout?',
          answer:
            '"I saw a figure carrying a dark rectangle toward the rear corridor right when the emergency power flickered, but I couldn\'t identify them."',
        },
      ],
      relatedEvidenceIds: ['vault-glass-casing', 'torn-notebook-page', 'academic-critique-draft'],
    },

    {
      id: 'samuel-adekunle',
      name: 'Samuel Adekunle',
      title: 'Facility Manager',
      occupation: 'Head of Building Operations, Okoro Institute',
      relationship: 'Employee',
      description:
        'Practical and blunt. Samuel manages physical security, electrical systems, and building maintenance for the historical institute.',
      motive:
        'Samuel was bribed to facilitate access by resetting the sub-panel breaker during the event.',
      alibi:
        '"I was in the basement control room resetting circuit breaker 4 after a line spike at 10:12 PM. The rest of the night I was patrolling the ground floor."',
      initialStatement:
        '"The power trip at 10:12 PM was a transformer fluctuation on the street line. I went straight to the panel, flipped the breaker, and restored main power within three minutes."',
      interviewResponses: [
        {
          id: 'sa-q1',
          question: 'What caused the power outage at 10:12 PM?',
          answer:
            '"Sub-panel breaker 4 tripped due to an overload. Old wiring in this wing. I had to manually reset the coil in the breaker room."',
        },
        {
          id: 'sa-q2',
          question: 'Why is page 14 missing from the visitor register binder?',
          answer:
            '"Missing page? Guests tear out sheets sometimes when signing in. I don\'t monitor the sign-in book page by page."',
          requiresEvidenceIds: ['visitor-register-log'],
        },
        {
          id: 'sa-q3',
          question: 'Did the mag-locks on the archival vault disengage during the blackout?',
          answer:
            '"Electronic mag-locks release when power cuts — safety code requirement. But the mechanical key lock stays locked unless someone has a key."',
          requiresEvidenceIds: ['power-substation-log'],
        },
        {
          id: 'sa-q4',
          question: 'Did David Mensah pay you to alter the guest log?',
          answer:
            '"I\'m not answering any more questions without an attorney."',
          requiresEvidenceIds: ['visitor-register-log', 'courier-delivery-manifest'],
        },
      ],
      relatedEvidenceIds: ['power-substation-log', 'visitor-register-log', 'digital-access-log'],
    },
  ],

  // ─── Locations ─────────────────────────────────────────────────────────────

  locations: [
    {
      id: 'archival-vault',
      name: 'Restricted Archival Vault',
      description:
        'A climate-controlled inner vault with reinforced steel doors, electronic magnetic locks, and a central glass display pedestal.',
      investigatorNote:
        'Crime scene. Glass display case empty. Pedestal mag-lock released during blackout. Mechanical backup keyway shows recent use.',
      icon: 'lock',
      evidenceIds: ['display-pedestal', 'vault-glass-casing', 'duplicated-vault-key'],
    },
    {
      id: 'reading-hall',
      name: 'Grand Reading Hall',
      description:
        'A high-ceilinged timber hall with study tables, secondary exhibition displays, and cataloguing cabinets where guests gathered.',
      investigatorNote:
        'Amara and Chinedu were present here. Waste bin contained torn notebook page.',
      icon: 'book-open',
      evidenceIds: ['torn-notebook-page', 'archival-catalog-notes', 'preview-photograph'],
    },
    {
      id: 'conservation-lab',
      name: 'Basement Conservation Lab',
      description:
        'A technical laboratory fitted with chemical sinks, darkroom equipment, and restoration workbenches.',
      investigatorNote:
        'Miriam Bello\'s workbench. Locksmith receipt recovered from drawer binder.',
      icon: 'flask',
      evidenceIds: ['locksmith-receipt', 'abandoned-wine-glass'],
    },
    {
      id: 'service-corridor',
      name: 'Service Corridor & Rear Exit',
      description:
        'A narrow concrete hallway leading from the vault rear door past the breaker room to the courtyard loading gate.',
      investigatorNote:
        'Infrared door sensor logged exit during blackout. Shipping box discarded in holding bay.',
      icon: 'door-open',
      evidenceIds: ['power-substation-log', 'service-door-sensor', 'scanner-shipping-box'],
    },
    {
      id: 'security-desk',
      name: 'Front Security & Reception',
      description:
        'The main entrance reception hub featuring the visitor sign-in register and digital access logging terminal.',
      investigatorNote:
        'Visitor sign-in log missing page 14. Courier delivery waybill recovered from counter drawer.',
      icon: 'shield',
      evidenceIds: ['visitor-register-log', 'courier-delivery-manifest', 'digital-access-log'],
    },
  ],

  // ─── Evidence (Public Descriptions Only — Zero Solution Leakage) ───────────

  evidence: [
    {
      id: 'display-pedestal',
      name: 'Empty Glass Display Pedestal',
      description: 'The mahogany and velvet pedestal inside the vault where the manuscript was displayed.',
      detailedDescription: 'Forensic inspection details available upon investigation.',
      location: 'archival-vault',
      tags: ['crime scene', 'physical'],
      relatedSuspectIds: ['miriam-bello', 'chinedu-okafor'],
      relatedEvidenceIds: ['vault-glass-casing', 'duplicated-vault-key'],
    },
    {
      id: 'duplicated-vault-key',
      name: 'Duplicate Brass Master Key (#V-409)',
      description: 'A brass key found tucked inside a velvet pouch beneath a workbench in the conservation lab.',
      detailedDescription: 'Key stamp and milling details available upon inspection.',
      location: 'archival-vault',
      tags: ['physical', 'key', 'hidden'],
      relatedSuspectIds: ['miriam-bello'],
      relatedEvidenceIds: ['locksmith-receipt', 'preview-photograph'],
    },
    {
      id: 'locksmith-receipt',
      name: 'Metro Key Services Invoice #4401',
      description: 'Receipt for precision duplicate brass key milling found inside a desk folder.',
      detailedDescription: 'Invoice details available upon inspection.',
      location: 'conservation-lab',
      tags: ['document', 'financial', 'tracing'],
      relatedSuspectIds: ['miriam-bello'],
      relatedEvidenceIds: ['duplicated-vault-key'],
    },
    {
      id: 'power-substation-log',
      name: 'Sub-Panel Breaker Event Log',
      description: 'Diagnostic printout from electrical sub-panel 4 showing power trip timestamps.',
      detailedDescription: 'Log timestamps available upon inspection.',
      location: 'service-corridor',
      tags: ['digital', 'timeline', 'electrical'],
      relatedSuspectIds: ['samuel-adekunle'],
      relatedEvidenceIds: ['service-door-sensor', 'digital-access-log'],
    },
    {
      id: 'service-door-sensor',
      name: 'Courtyard Service Exit Infrared Sensor Log',
      description: 'Log of infrared beam breaks on the rear service door between 10:00 PM and 10:30 PM.',
      detailedDescription: 'Sensor timestamps available upon inspection.',
      location: 'service-corridor',
      tags: ['digital', 'security', 'timeline'],
      relatedSuspectIds: ['miriam-bello', 'david-mensah'],
      relatedEvidenceIds: ['power-substation-log', 'scanner-shipping-box'],
    },
    {
      id: 'courier-delivery-manifest',
      name: 'Express Shipment Courier Waybill #SE-9942',
      description: 'Delivery receipt for a padded shipping crate delivered to the rear gate at 9:45 PM.',
      detailedDescription: 'Courier waybill details available upon inspection.',
      location: 'security-desk',
      tags: ['document', 'delivery', 'motive'],
      relatedSuspectIds: ['david-mensah', 'samuel-adekunle'],
      relatedEvidenceIds: ['visitor-register-log', 'scanner-shipping-box'],
    },
    {
      id: 'visitor-register-log',
      name: 'Library Visitor Register Binder',
      description: 'Leather-bound guest sign-in register. Inspection reveals page 14 torn from the spine.',
      detailedDescription: 'Binder inspection details available upon examination.',
      location: 'security-desk',
      tags: ['document', 'tampering', 'access'],
      relatedSuspectIds: ['samuel-adekunle', 'david-mensah'],
      relatedEvidenceIds: ['courier-delivery-manifest'],
    },
    {
      id: 'vault-glass-casing',
      name: 'Fingerprint Lift from Pedestal Glass',
      description: 'Latent palm and finger impressions recovered from the front glass of the vault casing.',
      detailedDescription: 'Forensic print details available upon inspection.',
      location: 'archival-vault',
      tags: ['forensic', 'fingerprint'],
      relatedSuspectIds: ['chinedu-okafor'],
      relatedEvidenceIds: ['torn-notebook-page'],
    },
    {
      id: 'torn-notebook-page',
      name: 'Torn Academic Notebook Sheet',
      description: 'Handwritten research notes recovered from the reading hall waste bin.',
      detailedDescription: 'Notes text available upon inspection.',
      location: 'reading-hall',
      tags: ['document', 'academic'],
      relatedSuspectIds: ['chinedu-okafor'],
      relatedEvidenceIds: ['vault-glass-casing'],
    },
    {
      id: 'preview-photograph',
      name: 'Event Preview Photograph (9:15 PM)',
      description: 'Flash photograph taken during opening remarks showing Dr. Okoro at the vault entrance.',
      detailedDescription: 'Photo details available upon inspection.',
      location: 'reading-hall',
      tags: ['physical', 'photo', 'timeline'],
      relatedSuspectIds: ['miriam-bello'],
      relatedEvidenceIds: ['duplicated-vault-key'],
    },
    {
      id: 'scanner-shipping-box',
      name: 'High-Speed Book Digitizer Cardboard Crate',
      description: 'Discarded packing crate found in the rear service holding bay.',
      detailedDescription: 'Crate label details available upon inspection.',
      location: 'service-corridor',
      tags: ['physical', 'equipment'],
      relatedSuspectIds: ['david-mensah', 'miriam-bello'],
      relatedEvidenceIds: ['courier-delivery-manifest', 'service-door-sensor'],
    },
  ],

  // ─── Timeline ───────────────────────────────────────────────────────────────

  timeline: [
    {
      id: 'vm-tl-1',
      time: '9:00 PM',
      description: 'Private preview evening opens in the Grand Reading Hall.',
      source: 'Event program',
      suspectIds: ['amara-nwosu', 'miriam-bello'],
      evidenceIds: [],
      isContradiction: false,
      alwaysVisible: true,
    },
    {
      id: 'vm-tl-2',
      time: '9:15 PM',
      description: 'Dr. Okoro presents manuscript overview; photo shows master key V-400 around his neck.',
      source: 'Preview photograph',
      suspectIds: ['miriam-bello'],
      evidenceIds: ['preview-photograph'],
      isContradiction: false,
      alwaysVisible: true,
    },
    {
      id: 'vm-tl-3',
      time: '9:30 PM',
      description: 'Prof. Chinedu Okafor examines manuscript display casing with magnifying loupe.',
      source: 'Witness account',
      suspectIds: ['chinedu-okafor'],
      evidenceIds: ['vault-glass-casing', 'torn-notebook-page'],
      isContradiction: false,
      alwaysVisible: true,
    },
    {
      id: 'vm-tl-4',
      time: '9:45 PM',
      description: 'Express courier delivers padded shipment crate to rear security entrance.',
      source: 'Waybill #SE-9942',
      suspectIds: ['david-mensah', 'samuel-adekunle'],
      evidenceIds: ['courier-delivery-manifest', 'scanner-shipping-box'],
      isContradiction: true,
      contradictsSuspectId: 'david-mensah',
    },
    {
      id: 'vm-tl-5',
      time: '10:00 PM',
      description: 'Samuel Adekunle tears out page 14 from the visitor register binder at security desk.',
      source: 'Security desk inspection',
      suspectIds: ['samuel-adekunle'],
      evidenceIds: ['visitor-register-log'],
      isContradiction: true,
      contradictsSuspectId: 'samuel-adekunle',
    },
    {
      id: 'vm-tl-6',
      time: '10:12 PM',
      description: 'Sub-panel breaker 4 manually tripped. Electrical blackout occurs across library sector.',
      source: 'Power Panel Log',
      suspectIds: ['samuel-adekunle', 'miriam-bello'],
      evidenceIds: ['power-substation-log', 'service-door-sensor'],
      isContradiction: true,
      contradictsSuspectId: 'samuel-adekunle',
    },
    {
      id: 'vm-tl-7',
      time: '10:15 PM',
      description: 'Courtyard motion sensor logs rear service exit door opening as digitizer crate is passed out.',
      source: 'Infrared sensor log',
      suspectIds: ['miriam-bello', 'david-mensah'],
      evidenceIds: ['service-door-sensor', 'scanner-shipping-box'],
      isContradiction: true,
      contradictsSuspectId: 'miriam-bello',
    },
    {
      id: 'vm-tl-8',
      time: '10:40 PM',
      description: 'Dr. Okoro unlocks archival vault to present manuscript and discovers pedestal empty.',
      source: 'Dr. Okoro statement',
      suspectIds: ['david-mensah'],
      evidenceIds: ['display-pedestal'],
      isContradiction: false,
      alwaysVisible: true,
    },
  ],
};
