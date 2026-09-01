/**
 * deathOnPlatform6Secret.ts
 *
 * SERVER-ONLY Secret Case Data for Case #061 — Death on Platform 6.
 *
 * This file lives exclusively on the Node.js server process.
 * It is NEVER imported into client components or bundled into client JavaScript.
 */

import type { SecretCaseData } from './galleryMurderSecret';

export const DEATH_ON_PLATFORM_6_SECRET: SecretCaseData = {
  id: 'death-on-platform-6-061',
  caseNumber: '#061',
  title: 'Death on Platform 6',
  subtitle: 'Poison at the terminal',
  victim: 'Ibrahim Kareem',
  victimDescription:
    'Technology entrepreneur and CEO of Novus Dynamics (age 42). Found dead inside Platform 6 private waiting lounge shortly before an important £10M investor buyout meeting.',
  briefing:
    'Technology entrepreneur Ibrahim Kareem was found dead inside a private waiting lounge at Platform 6 of Central Railway Station shortly before an important investor meeting. Initial assumptions of natural cardiac arrest were overturned by preliminary toxicology indicating delayed-action poison. Five individuals had significant interactions with Ibrahim that evening. Method, opportunity, timeline, motive, and contradiction must be combined to reveal the killer.',
  objective:
    'Determine who poisoned Ibrahim Kareem, how the poison was administered, why they did it, when the poisoning occurred, and which evidence is misleading.',
  killerSuspectId: 'nadia-yusuf',

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

  deductions: [
    {
      id: 'req-flask-substitution',
      title: 'Flask Substitution Method',
      description: 'Establish that Nadia purchased a duplicate thermos flask and swapped it with Hassan\'s catering delivery.',
      requiredEvidenceIds: ['metro-hardware-receipt', 'thermos-flask-trio', 'locker-thermos-flask'],
      requiredInspectedEvidenceIds: ['metro-hardware-receipt'],
    },
    {
      id: 'req-blackout-opportunity',
      title: 'CCTV Blackout & Keycard Opportunity',
      description: 'Identify the 6:42–6:48 PM CCTV blackout and 6:44 PM keycard swipe as the exact substitution window.',
      requiredEvidenceIds: ['cctv-corridor-gap', 'lounge-keycard-log', 'locker-rental-ticket'],
      requiredInspectedEvidenceIds: ['cctv-corridor-gap'],
    },
    {
      id: 'req-ip-buyout-motive',
      title: 'IP Buyout Freeze-out Motive',
      description: 'Prove that Ibrahim\'s death before 7:30 PM prevented the IP buyback and defaulted £10M equity to Nadia.',
      requiredEvidenceIds: ['ownership-restructuring-draft', 'investor-buyout-agreement'],
      requiredInspectedEvidenceIds: ['ownership-restructuring-draft'],
    },
    {
      id: 'req-espionage-red-herring',
      title: 'Espionage Red Herring Identification',
      description: 'Recognize that Victor Danjuma\'s door fingerprint and audio bug were left during corporate surveillance, not murder.',
      requiredEvidenceIds: ['danjuma-corridor-fingerprint', 'audio-bug-casing'],
      requiredInspectedEvidenceIds: ['audio-bug-casing'],
    },
  ],

  hiddenSignificances: {
    'metro-hardware-receipt': 'Hardware store receipt for 1x Stainless Thermos Flask Pro-500, purchased 2:14 PM.',
    'cctv-corridor-gap': 'Camera #4 power loss logged between 6:42:10 PM and 6:48:33 PM.',
    'lounge-keycard-log': 'Keycard #09 (Grace Okoro) swiped lounge door at 6:44 PM.',
    'locker-thermos-flask': 'Clean, unpoisoned thermos flask found inside station locker #108 containing hot Espresso.',
    'locker-rental-ticket': 'Locker #108 rental ticket time-stamped 6:52 PM.',
    'ownership-restructuring-draft': 'Draft agreement Section 4.2: Option for CEO to repurchase co-founder shares for nominal £100 prior to acquisition.',
    'espresso-cup-residue': 'Residue in Ibrahim\'s cup contains organophosphate carbamate pesticide.',
  },

  detailedFindings: {
    'metro-hardware-receipt': 'Item: Metro Pro-500 Thermos. Purchased at Metro Station Plaza branch. Payment method: Corporate Amex (N. Yusuf).',
    'cctv-corridor-gap': 'System log confirms manual cable disconnect at main distribution box in Platform 6 corridor.',
    'lounge-keycard-log': 'Door log records entry using Grace Okoro\'s keycard at 6:44 PM during the CCTV outage.',
    'locker-thermos-flask': 'Original catering thermos flask delivered by Hassan at 6:15 PM, placed in locker #108 at 6:52 PM.',
    'ownership-restructuring-draft': 'Section 4.2 clause triggers automatic forfeiture of co-founder shares if exercise notice served prior to 7:30 PM buyout.',
    'espresso-cup-residue': 'Fatal concentration of toxic organophosphate compound detected in coffee dregs.',
  },

  suspectSecrets: {
    'nadia-yusuf': [
      'Purchased duplicate thermos flask at 2:14 PM.',
      'Borrowed Grace\'s keycard and swapped thermoses at 6:44 PM.',
      'Deposited original thermos in locker #108 at 6:52 PM.',
    ],
    'victor-danjuma': [
      'Attempted corporate espionage by placing audio bug near door (red herring).',
    ],
    'grace-okoro': [
      'Lent keycard to Nadia at 6:40 PM believing Nadia was dropping off slides.',
    ],
    'hassan-bello': [
      'Delivered three harmless coffee thermoses at 6:15 PM.',
    ],
    'tunde-adebayo': [
      'Entered lounge at 7:00 PM; did not touch Ibrahim\'s coffee.',
    ],
  },

  hiddenRelationships: [
    {
      sourceId: 'nadia-yusuf',
      targetId: 'grace-okoro',
      relationshipType: 'Borrowed Keycard Access',
      description: 'Nadia borrowed Grace\'s keycard at 6:40 PM under the guise of dropping off slides, using it to access the lounge during the CCTV blackout.',
      requiresEvidenceIds: ['lounge-keycard-log', 'grace-schedule-binder', 'cctv-corridor-gap'],
    },
  ],
};
