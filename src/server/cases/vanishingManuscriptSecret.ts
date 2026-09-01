/**
 * vanishingManuscriptSecret.ts
 *
 * SERVER-ONLY Secret Case Data for Case #052 — The Vanishing Manuscript.
 *
 * This file lives exclusively on the Node.js server process.
 * It is NEVER imported into client components or bundled into client JavaScript.
 */

import type { SecretCaseData } from './galleryMurderSecret';

export const VANISHING_MANUSCRIPT_SECRET: SecretCaseData = {
  id: 'vanishing-manuscript-052',
  caseNumber: '#052',
  title: 'The Vanishing Manuscript',
  subtitle: 'A theft in the dark',
  victim: '17th-Century Royal Manuscript',
  victimDescription:
    'An unpublished, historically priceless 17th-century manuscript containing unreleased royal correspondence and treaty drafts. Disappeared from Dr. Elias Okoro\'s restricted archival vault at approximately 10:40 PM.',
  briefing:
    'Dr. Elias Okoro, a renowned historian, was hosting an exclusive evening preview of an unpublished 17th-century manuscript at his private research library. At 10:40 PM, Dr. Okoro unlocked the inner archival vault to present the manuscript to his publisher, only to find the glass display pedestal empty. There were no signs of forced entry. Five individuals were present in the building during the evening. One manuscript. Multiple motives. Zero obvious signs of break-in.',
  objective:
    'Determine who removed the manuscript, how they accessed the vault, why they wanted it, when the removal actually occurred, and which evidence is misleading.',
  killerSuspectId: 'miriam-bello',

  solution: {
    killerId: 'miriam-bello',
    method:
      'Miriam Bello used a duplicated brass key (#V-409) during the 3-minute electrical power outage (10:12–10:15 PM) when electronic mag-locks disengaged. The manuscript was digitized using a high-speed scanner delivered to David Mensah at 9:45 PM.',
    motive:
      'Miriam Bello believed the manuscript originated from her family\'s estate and was wrongfully acquired. She partnered with publisher David Mensah for a £50,000 secret payment to digitize and publish the text commercially before Dr. Okoro\'s planned public museum donation.',
    opportunity:
      'Exploited the 3-minute breaker reset at 10:12 PM when mag-locks dropped. Used her duplicated mechanical key to enter the vault, remove the manuscript, digitize it, and pass the equipment out through the rear courtyard service door at 10:15 PM.',
    fullExplanation:
      'Ten days before the preview, Miriam Bello ordered a duplicate brass key matching master code V-409 from a local locksmith (proven by locksmith receipt billed to her conservation account). On the night of the preview, publisher David Mensah arranged for a high-speed book digitizer to be delivered to the library service gate at 9:45 PM (waybill #SE-9942). At 10:00 PM, security officer Samuel Adekunle removed page 14 from the visitor register binder to cover Mensah\'s arrival. At 10:12 PM, Adekunle reset the main sub-panel breaker, causing a 3-minute power outage across the building. During the blackout (10:12–10:15 PM), the electronic mag-locks dropped. Miriam used her duplicated mechanical key to enter the vault, remove the manuscript, and take it to the service room where the pages were scanned. At 10:15 PM, the courtyard motion sensor logged the service door opening as the scanner box was passed out. The fingerprints on the display glass and the torn notebook page were left by Prof. Chinedu Okafor during his legitimate 9:30 PM inspection (red herring).',
    keyEvidenceIds: [
      'duplicated-vault-key',
      'locksmith-receipt',
      'power-substation-log',
      'courier-delivery-manifest',
      'service-door-sensor',
      'visitor-register-log',
      'preview-photograph',
      'scanner-shipping-box',
    ],
  },

  deductions: [
    {
      id: 'req-access-method',
      title: 'Vault Access & Key Duplication',
      description: 'Establish that Dr. Okoro retained his original key, while Miriam used a duplicated key cut 10 days prior.',
      requiredEvidenceIds: ['preview-photograph', 'duplicated-vault-key', 'locksmith-receipt'],
      requiredInspectedEvidenceIds: ['locksmith-receipt'],
    },
    {
      id: 'req-removal-window',
      title: 'Power Outage & Removal Window',
      description: 'Identify the 10:12–10:15 PM power interruption as the window when mag-locks dropped and courtyard exit occurred.',
      requiredEvidenceIds: ['power-substation-log', 'digital-access-log', 'service-door-sensor'],
      requiredInspectedEvidenceIds: ['service-door-sensor'],
    },
    {
      id: 'req-red-herring',
      title: 'Red Herring Identification',
      description: 'Recognize that Chinedu Okafor\'s fingerprints and torn page were left during his 9:30 PM examination.',
      requiredEvidenceIds: ['vault-glass-casing', 'torn-notebook-page', 'academic-critique-draft'],
      requiredInspectedEvidenceIds: ['vault-glass-casing'],
    },
  ],

  hiddenSignificances: {
    'duplicated-vault-key': 'Solid brass key stamped V-409. Microscopic tool marks indicate recent machine cutting.',
    'locksmith-receipt': 'Receipt from Metro Key Services billed to Miriam Bello\'s account, dated 10 days prior.',
    'power-substation-log': 'Log shows main breaker #4 manually tripped at 10:12:05 PM and reset at 10:15:12 PM.',
    'service-door-sensor': 'Infrared beam sensor logged service exit opened at 10:14:48 PM during the blackout.',
    'courier-delivery-manifest': 'Waybill #SE-9942 for padded crate delivered to David Mensah at 9:45 PM.',
    'visitor-register-log': 'Binder spine shows missing page 14 covering entries between 9:35 PM and 9:55 PM.',
    'preview-photograph': 'Photo at 9:15 PM shows Dr. Okoro wearing vault key V-400 around neck while display is locked.',
    'scanner-shipping-box': 'Cardboard shipping box marked "A3 High-Speed Book Digitizer — Express Rental".',
  },

  detailedFindings: {
    'duplicated-vault-key': 'Key matches the mechanical backup lock on the archival vault. Cut by Metro Key Services.',
    'locksmith-receipt': 'Invoice #4401 for 1x High-Security Duplicate Key (#V-409). Paid by M. Bello.',
    'power-substation-log': 'Electrical log confirms manual trip at 10:12 PM disengaging magnetic locks for 3 minutes.',
    'service-door-sensor': 'Rear courtyard entrance opened twice between 10:12 PM and 10:15 PM.',
    'courier-delivery-manifest': 'Crate delivered to rear gate containing commercial scanning hardware.',
    'visitor-register-log': 'Page 14 torn out cleanly. Substation key residue found on binder clips.',
  },

  suspectSecrets: {
    'miriam-bello': [
      'Ordered duplicate vault key 10 days before the preview.',
      'Partnered with David Mensah for £50,000 payment.',
    ],
    'david-mensah': [
      'Brought high-speed scanner into library at 9:45 PM.',
      'Offered Miriam £50,000 for early manuscript access.',
    ],
    'samuel-adekunle': [
      'Tripped main power breaker at 10:12 PM for 3 minutes.',
      'Tore out register page 14 to hide Mensah\'s arrival.',
    ],
    'chinedu-okafor': [
      'Inspected manuscript at 9:30 PM and left fingerprints on glass (red herring).',
    ],
    'amara-nwosu': [
      'Overheard Mensah and Miriam conspiring near rear stairwell.',
    ],
  },

  hiddenRelationships: [
    {
      sourceId: 'miriam-bello',
      targetId: 'david-mensah',
      relationshipType: 'Illicit Digitization Pact',
      description: 'Miriam Bello agreed to digitize the manuscript for David Mensah in exchange for £50,000.',
      requiresEvidenceIds: ['locksmith-receipt', 'courier-delivery-manifest', 'publishers-contract'],
    },
  ],
};
