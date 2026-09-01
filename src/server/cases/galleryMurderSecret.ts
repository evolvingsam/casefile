/**
 * galleryMurderSecret.ts
 *
 * SERVER-ONLY Secret Case Data for Case #047 — The Gallery Murder.
 *
 * This file lives exclusively on the Node.js server process.
 * It is NEVER imported into client components or bundled into client JavaScript.
 */

import type { CaseSolution, DeductionRequirement, Evidence, Suspect, TimelineEvent, HiddenRelationship } from '@/game/types';

export interface SecretCaseData {
  id: string;
  caseNumber: string;
  title: string;
  subtitle: string;
  victim: string;
  victimDescription: string;
  briefing: string;
  objective: string;
  solution: CaseSolution;
  deductions: DeductionRequirement[];
  hiddenSignificances: Record<string, string>;
  detailedFindings: Record<string, string>;
  suspectSecrets: Record<string, string[]>;
  killerSuspectId: string;
  hiddenRelationships: HiddenRelationship[];
}

export const GALLERY_MURDER_SECRET: SecretCaseData = {
  id: 'gallery-murder-047',
  caseNumber: '#047',
  title: 'The Gallery Murder',
  subtitle: 'A crime behind closed doors',
  victim: 'Daniel Adeyemi',
  victimDescription:
    'Wealthy art dealer and co-founder of Adeyemi & Bello Fine Art. Found dead in his private office at 11:47 PM during a members-only evening showing. Time of death estimated between 10:30 PM and 11:00 PM.',
  briefing:
    'Daniel Adeyemi, 52, was found slumped behind his private office desk by security guard Michael Grant during a routine 11:45 PM check. The gallery had been hosting an exclusive members evening — five people were still on the premises when the body was found. A crystal whiskey tumbler sat on the desk. There were no signs of forced entry. Everyone had a reason to be there. One of them had a reason to want Daniel dead.',
  objective: 'Determine who killed Daniel Adeyemi, how, why, and when.',
  killerSuspectId: 'victoria-adeyemi',

  solution: {
    killerId: 'victoria-adeyemi',
    method: 'Potassium cyanide administered in Daniel\'s private crystal whiskey tumbler',
    motive: 'Preventing Daniel from executing a divorce filing and cutting her out of his estate after discovering he fathered a child with Sarah Okafor',
    opportunity: 'Accessed private office using keycard at 10:19 PM and paid Michael Grant £3,000 to delete 8 minutes of CCTV footage',
    fullExplanation:
      'Victoria Adeyemi discovered Daniel\'s secret divorce draft and draft will revision reducing her inheritance to zero. On the evening of the showing, she accessed his private office at 10:19 PM using her electronic keycard, slipped high-purity potassium cyanide into his whiskey tumbler, and left. She paid security guard Michael Grant £3,000 cash to delete the 8-minute corridor CCTV clip covering her entry.',
    keyEvidenceIds: ['whiskey-glass', 'keycard-log', 'cyanide-vial', 'cctv-gap', 'pharmacy-order', 'divorce-filing'],
  },

  deductions: [
    {
      id: 'deduction_method',
      title: 'Poison Source Traced',
      description: 'Established that Daniel was poisoned with potassium cyanide matching pharmaceutical stock.',
      requiredEvidenceIds: ['whiskey-glass'],
      requiredInspectedEvidenceIds: ['cyanide-vial'],
    },
    {
      id: 'deduction_opportunity',
      title: 'Office Access & Keycard Verification',
      description: 'Verified keycard access log placing Victoria inside the private office during the murder window.',
      requiredEvidenceIds: ['keycard-log'],
      requiredInspectedEvidenceIds: ['keycard-log'],
    },
    {
      id: 'deduction_motive',
      title: 'Divorce & Will Revision Motive Established',
      description: 'Discovered economic and personal motive regarding Daniel\'s impending divorce filing.',
      requiredEvidenceIds: ['divorce-filing'],
      requiredInspectedEvidenceIds: ['divorce-filing'],
    },
    {
      id: 'deduction_contradiction',
      title: 'Alibi Contradiction & Security Bribe Uncovered',
      description: 'Exposed contradiction between Victoria\'s stated arrival time, keycard logs, and deleted CCTV footage.',
      requiredEvidenceIds: ['cctv-gap', 'keycard-log'],
      requiredInspectedEvidenceIds: ['cctv-gap'],
      requiredInterviewQuestionIds: ['va-q4'],
    },
  ],

  hiddenSignificances: {
    'whiskey-glass':
      'Chemical residue analysis confirms high-concentration potassium cyanide dissolved in the single malt Scotch. Residue includes smudged right-hand prints.',
    'keycard-log':
      'Electronic access log confirms Victoria Adeyemi\'s personal keycard opened the private office door at 10:19 PM — directly contradicting her claim of arriving at 10:45 PM.',
    'cyanide-vial':
      'Empty chemical vial marked with batch code KCN-8802. Pharmaceutical supply records trace this exact batch code to Adeyemi Medical Clinic — Victoria\'s private practice.',
    'cctv-gap':
      'Corridor camera system shows an 8-minute gap from 10:15 PM to 10:23 PM where video data was manually overwritten from the security console.',
    'bank-transfer':
      'Bank deposit slip showing £3,000 cash deposit into security guard Michael Grant\'s account at 9:15 AM on the day of the murder, originating from Victoria Adeyemi.',
    'pharmacy-order':
      'Supply order invoice from Apex Chemical Co. for 50g potassium cyanide, ordered under Dr. Victoria Adeyemi\'s medical license.',
    'divorce-filing':
      'Draft divorce petition prepared by Daniel\'s solicitor citing irretrievable breakdown and proposing sole ownership of gallery assets to Daniel.',
    'cctv-argument':
      'CCTV recording from 8:45 PM showing Marcus Cole in a loud argument with Daniel. Marcus exited the gallery forecourt by cab at 9:28 PM.',
    'torn-letter':
      'Draft review manuscript written by Marcus Cole criticizing a forged painting. Not a threat letter.',
  },

  detailedFindings: {
    'whiskey-glass':
      'Crystal whiskey tumbler containing 1.5 oz of Macallan 18. Lab analysis detected 450mg of potassium cyanide — a lethal dose. Smudged right-hand fingerprints recovered from the glass base.',
    'keycard-log':
      'Server audit log from the encrypted door lock controller. Private Office Log:\n• 10:19 PM — Keycard #04 (Victoria Adeyemi) UNLOCKED\n• 10:22 PM — Keycard #04 DOOR CLOSED\n• 11:45 PM — Keycard #01 (Michael Grant) UNLOCKED',
    'cyanide-vial':
      'Clear 10ml glass vial found hidden inside the storage room cleaning bin. Traces of potassium cyanide powder. Batch label reads Apex Chem KCN-8802.',
    'cctv-gap':
      'Security Room DVR log inspection: System clock shows manual override at 10:15:02 PM. Camera #3 (Office Corridor) disabled for 480 seconds. User login ID: MGRANT.',
    'bank-transfer':
      'Bank deposit slip dated same afternoon: £3,000 cash deposited into Michael Grant\'s account. Counterfoil signed by V. Adeyemi.',
    'pharmacy-order':
      'Apex Chemical Co. Invoice #8802-K. Billed to Dr. Victoria Adeyemi, St. Jude\'s Medical Clinic. Item: Potassium Cyanide 99% Pure, 50g. Delivered 4 days prior to crime.',
    'divorce-filing':
      'Confidential document stamped DRAFT. Petitioner: Daniel Adeyemi. Respondent: Victoria Adeyemi. Includes revised will draft removing spouse as beneficiary.',
  },

  suspectSecrets: {
    'marcus-cole': [
      'The exposé was accurate — Daniel\'s Hartley painting was a forgery.',
      'Marcus had a cab booking receipt confirming he left the forecourt at 9:28 PM.',
    ],
    'sarah-okafor': [
      'Sarah and Daniel have a secret 12-year-old daughter, Emma.',
      'Sarah\'s 10:55 PM phone call attempt proves she did not know Daniel was dead.',
    ],
    'james-bello': [
      'James embezzled £160,000 from gallery accounts.',
      'James was in the main gallery continuously from 9:00 PM to 11:30 PM with eyewitnesses.',
    ],
    'victoria-adeyemi': [
      'Discovered Daniel\'s divorce filing and revised will 3 days before the murder.',
      'Ordered potassium cyanide using her clinic license.',
      'Bribed Michael Grant £3,000 cash to overwrite the 10:15 PM corridor CCTV footage.',
    ],
    'michael-grant': [
      'Accepted £3,000 bribe from Victoria Adeyemi to turn off Camera #3 for 8 minutes.',
      'Did not kill Daniel himself.',
    ],
  },

  hiddenRelationships: [
    {
      sourceId: 'victoria-adeyemi',
      targetId: 'cyanide-vial',
      relationshipType: 'Purchaser of Poison Batch KCN-8802',
      description: 'Apex Chemical supply invoice links batch KCN-8802 directly to Dr. Victoria Adeyemi\'s medical license.',
      requiresEvidenceIds: ['cyanide-vial', 'pharmacy-order'],
    },
    {
      sourceId: 'victoria-adeyemi',
      targetId: 'michael-grant',
      relationshipType: 'Bribe Payee for CCTV Overwrite',
      description: 'Victoria paid Michael Grant £3,000 cash to disable Camera #3 covering the private office corridor between 10:15 PM and 10:23 PM.',
      requiresEvidenceIds: ['cctv-gap', 'bank-transfer'],
    },
  ],
};
