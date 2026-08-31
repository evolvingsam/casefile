import type { Case } from '@/game/types';

// ─────────────────────────────────────────────────────────────────────────────
// Case #047 — The Gallery Murder
//
// SOLUTION (do not surface directly in UI):
//   Killer  : Victoria Adeyemi (victim's wife)
//   Method  : Potassium cyanide dissolved in the victim's whiskey
//   Motive  : Discovered Daniel's secret plan to divorce her and cut her from
//             his will — and that he fathered a daughter with Sarah Okafor
//   Opportunity: Used her own keycard to access the private office at 10:19 PM
//               while the gallery crowd was distracted. Bribed the security
//               guard (Michael Grant) to delete 8 minutes of CCTV footage.
// ─────────────────────────────────────────────────────────────────────────────

export const THE_GALLERY_MURDER: Case = {
  id: 'gallery-murder-047',
  caseNumber: '#047',
  title: 'The Gallery Murder',
  subtitle: 'A crime behind closed doors',
  victim: 'Daniel Adeyemi',
  victimDescription:
    'Wealthy art dealer and co-founder of Adeyemi & Bello Fine Art. Found dead in his private office at 11:47 PM during a members-only evening showing. Time of death estimated between 10:30 PM and 11:00 PM.',
  briefing:
    'Daniel Adeyemi, 52, was found slumped behind his private office desk by security guard Michael Grant during a routine 11:45 PM check. The gallery had been hosting an exclusive members evening — five people were still on the premises when the body was found. A crystal whiskey tumbler sat on the desk. There were no signs of forced entry. Everyone had a reason to be there. One of them had a reason to want Daniel dead.',

  // ─── Suspects ──────────────────────────────────────────────────────────────

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
      secrets: [
        'The exposé was accurate — Daniel\'s Hartley was a forgery. Marcus had proof.',
        'Marcus had a personal grudge dating back twelve years when Daniel outbid him for a rare sculpture at auction.',
        'The torn letter found in the main gallery is from Marcus — it\'s a draft of his article, not a threat.',
      ],
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
      isKiller: false,
    },

    {
      id: 'sarah-okafor',
      name: 'Sarah Okafor',
      title: 'Gallery Assistant',
      occupation: 'Senior Gallery Assistant, Adeyemi & Bello Fine Art',
      relationship: 'Former lover, mother of his secret daughter',
      description:
        'Composed and meticulous. Sarah has worked at the gallery for nine years and was intensely loyal to Daniel — some said too loyal. She was one of the last people to speak to him before his death.',
      motive:
        'Daniel had promised to publicly acknowledge their daughter, Emma (now 12), and amend his will. Sarah had a strong reason to keep him alive — not to kill him.',
      alibi:
        '"I was in the main gallery supervising the showing from 9:00 PM onwards. Guests saw me constantly. I called Daniel at 10:55 — he didn\'t answer, which worried me."',
      secrets: [
        'She and Daniel had a secret daughter together: Emma, age 12, whom Daniel had been supporting financially but never acknowledged publicly.',
        'Daniel had promised to change his will to include Emma. Sarah feared Victoria would contest it.',
        'Her phone record at 10:55 PM proves she did not know Daniel was already dead — supporting her innocence.',
      ],
      initialStatement:
        '"I\'ve worked for Daniel for nine years. I\'d never hurt him. Emma needs him. Needed him."',
      interviewResponses: [
        {
          id: 'so-q1',
          question: 'What is your relationship with the victim beyond work?',
          answer:
            '"We were... close. A long time ago. We have a daughter. Daniel was going to make things right. He told me that week."',
        },
        {
          id: 'so-q2',
          question: 'Did Victoria know about Emma?',
          answer:
            '"I don\'t know. I hope not. If she found out — " [pauses] "Daniel said he\'d handle it carefully."',
        },
        {
          id: 'so-q3',
          question: 'Why did you call Daniel at 10:55 PM?',
          answer:
            '"He\'d been in his office over an hour. That wasn\'t like him during a gallery event. I was worried. He didn\'t pick up."',
        },
        {
          id: 'so-q4',
          question: 'Did you go to the private office that evening?',
          answer:
            '"No. My keycard doesn\'t access the private wing. Only senior staff and family."',
        },
      ],
      relatedEvidenceIds: ['emma-photograph', 'phone-record-sarah', 'will-amendment'],
      isKiller: false,
    },

    {
      id: 'james-bello',
      name: 'James Bello',
      title: 'Business Partner',
      occupation: 'Co-founder, Adeyemi & Bello Fine Art',
      relationship: 'Business partner of 14 years',
      description:
        'Outwardly jovial and warm — a natural charmer who worked the room at the showing all evening. Behind the smile, he was sweating. Daniel had discovered the discrepancy in their accounts that morning.',
      motive:
        'James had been siphoning money from gallery sales into a personal account for two years — £160,000 in total. Daniel confronted him by email that afternoon, threatening to dissolve the partnership and involve the police.',
      alibi:
        '"I was with guests all night. I personally poured drinks in the main gallery from 9:00 PM to past 11:00 PM. A dozen people can confirm."',
      secrets: [
        'He embezzled £160,000 from gallery accounts over 24 months.',
        'He received Daniel\'s confrontation email at 4:17 PM — hours before the evening event.',
        'His fingerprints are on the whiskey decanter because he was serving drinks earlier — not because he poured the fatal glass.',
        'He had begun secretly consulting a lawyer about buying Daniel out.',
      ],
      initialStatement:
        '"Fourteen years we built this together. Whatever problems we had, we would have sorted it. I didn\'t need him dead."',
      interviewResponses: [
        {
          id: 'jb-q1',
          question: 'Did Daniel contact you about financial irregularities?',
          answer:
            '"He sent an email. We were going to talk about it this week. Calmly. Professionally."',
        },
        {
          id: 'jb-q2',
          question: 'Your fingerprints are on the whiskey decanter. Explain.',
          answer:
            '"I was serving drinks. I touched everything behind that counter. That\'s not suspicious — that\'s hospitality."',
        },
        {
          id: 'jb-q3',
          question: 'Where were you between 10:00 PM and 11:00 PM?',
          answer:
            '"Main gallery. In plain sight. I didn\'t leave. You can ask anyone."',
        },
        {
          id: 'jb-q4',
          question: 'Did you know about the divorce plans?',
          answer:
            '"The divorce? No. That\'s news to me."',
        },
      ],
      relatedEvidenceIds: ['bank-transfer', 'confrontation-email', 'whiskey-decanter-prints'],
      isKiller: false,
    },

    {
      id: 'victoria-adeyemi',
      name: 'Victoria Adeyemi',
      title: "Victim's Wife",
      occupation: 'Director, Vitae Wellness Clinic',
      relationship: "Wife of 19 years",
      description:
        'Impeccably dressed, composed, and almost unnervingly calm for a woman who has just lost her husband. She runs Vitae Wellness Clinic, a high-end private practice with access to a broad range of controlled pharmaceutical compounds.',
      motive:
        'Victoria discovered, via documents in Daniel\'s briefcase, that he had begun divorce proceedings — and planned to leave the majority of his estate to Sarah Okafor\'s daughter. She stood to lose everything: the marriage, the money, and her social standing.',
      alibi:
        '"I was in the main gallery from 9:30 PM until Michael found Daniel. I never went near the private office."',
      secrets: [
        'Her keycard log shows she accessed the private office at 10:19 PM — directly contradicting her alibi.',
        'She bribed Michael Grant to delete 8 minutes of corridor CCTV footage covering her entry and exit.',
        'She runs a wellness clinic with access to potassium cyanide used in certain controlled therapies.',
        'She found the divorce filing and the will amendment listing Emma as a beneficiary four days before the murder.',
        'She purchased a trace amount of potassium cyanide through a falsified clinical order two weeks before the murder.',
      ],
      initialStatement:
        '"I didn\'t even know anything was wrong until Michael called out. I\'ve been in that gallery all evening. Everyone saw me."',
      interviewResponses: [
        {
          id: 'va-q1',
          question: 'Did you visit the private office at any point this evening?',
          answer:
            '"No. I had no reason to. Daniel said he needed an hour alone to review documents. I respected that."',
        },
        {
          id: 'va-q2',
          question: 'Are you aware of Daniel\'s plans to file for divorce?',
          answer:
            '[long pause] "Where did you hear that? Our marriage was strong."',
        },
        {
          id: 'va-q3',
          question: 'Your clinic works with controlled pharmaceutical compounds. Do you have access to cyanide compounds?',
          answer:
            '"We use a range of compounds under strict clinical conditions. All fully licensed and logged. I resent the implication."',
        },
        {
          id: 'va-q4',
          question: 'Your keycard was used to access the private office at 10:19 PM. How do you explain that?',
          answer:
            '[visibly shaken] "That\'s — that must be an error in the system. I was in the gallery. People saw me."',
        },
      ],
      relatedEvidenceIds: [
        'keycard-log',
        'cctv-gap',
        'cyanide-vial',
        'whiskey-glass',
        'broken-watch',
        'divorce-filing',
        'will-amendment',
        'pharmacy-order',
      ],
      isKiller: true,
    },

    {
      id: 'michael-grant',
      name: 'Michael Grant',
      title: 'Security Guard',
      occupation: 'Head of Security, Adeyemi & Bello Fine Art',
      relationship: 'Employee (security)',
      description:
        'A large, quiet man with a history that doesn\'t bear close inspection — two counts of petty theft in his twenties, sealed. He discovered the body and claims he immediately called for help. He is evasive about the CCTV gap.',
      motive:
        'No direct motive to kill Daniel — but was paid £3,000 in cash by Victoria to tamper with the security footage for the office corridor between 10:22 and 10:30 PM.',
      alibi:
        '"I was doing rounds. Standard procedure. I check every area on a rotation."',
      secrets: [
        'He deleted 8 minutes of CCTV footage from the private office corridor under Victoria\'s instruction.',
        'The £3,000 cash deposit in his account two weeks before the murder is traceable.',
        'He has a prior criminal record — not disclosed when he was hired.',
        'He genuinely discovered the body during his routine round and was not involved in the murder itself.',
      ],
      initialStatement:
        '"I found him on my 11:45 check. Door was unlocked. I went in to tell him the event was winding down. He was just... slumped there."',
      interviewResponses: [
        {
          id: 'mg-q1',
          question: 'Why is there an 8-minute gap in the office corridor CCTV footage?',
          answer:
            '"System glitch. Happens sometimes. I logged it."',
        },
        {
          id: 'mg-q2',
          question: 'Were you paid to interfere with the footage?',
          answer:
            '"No. Absolutely not."',
        },
        {
          id: 'mg-q3',
          question: 'There is a £3,000 cash deposit in your bank account two weeks ago. What was it for?',
          answer:
            '[long pause] "Private work. Nothing to do with this."',
        },
        {
          id: 'mg-q4',
          question: 'Did you see anyone near the private office between 10:00 and 11:00 PM?',
          answer:
            '"I was doing external perimeter checks at that time. I wouldn\'t have seen the corridor."',
        },
      ],
      relatedEvidenceIds: ['cctv-gap', 'cash-deposit'],
      isKiller: false,
    },
  ],

  // ─── Locations ─────────────────────────────────────────────────────────────

  locations: [
    {
      id: 'main-gallery',
      name: 'Main Gallery',
      icon: '🖼️',
      description:
        'The heart of Adeyemi & Bello Fine Art. High ceilings, track lighting, and paintings worth more than most people\'s homes. Tonight it hosted an exclusive members showing. Guests milled freely — which means alibis are abundant but verifiable.',
      investigatorNote:
        'Most of the evening\'s activity was centred here. A torn piece of paper was found near the north entrance. The whiskey counter shows multiple fingerprint sets. The room is full of people who all claim to have been here — but some windows of time are unaccounted for.',
      evidenceIds: ['torn-letter', 'whiskey-decanter-prints', 'cctv-argument'],
    },
    {
      id: 'private-office',
      name: 'Private Office',
      icon: '🚪',
      description:
        'Daniel\'s inner sanctum — accessible only via keycard to senior staff and family. The body was found here. A crystal whiskey tumbler sits on the desk. Financial documents are spread across the surface. The door was unlocked when the body was discovered.',
      investigatorNote:
        'This is the murder scene. The whiskey glass has residue worth analysing. The desk holds documents Daniel was reviewing — a divorce filing draft and a will amendment are among them. The broken watch on the floor gives an estimated time of death. The CCTV covering the corridor outside has an 8-minute gap.',
      evidenceIds: ['whiskey-glass', 'broken-watch', 'divorce-filing', 'will-amendment'],
    },
    {
      id: 'storage-room',
      name: 'Storage Room',
      icon: '📦',
      description:
        'Climate-controlled, packed with framed works not currently on display. Also used for supplies — and apparently for discarding things. A small waste bin contains items that were meant to disappear.',
      investigatorNote:
        'The waste bin here yielded a small glass vial with chemical residue. The label has been scraped off — but the manufacturer\'s batch code is still partially legible. There\'s also an artists\' supply catalogue with handwritten notes in the margin.',
      evidenceIds: ['cyanide-vial'],
    },
    {
      id: 'courtyard',
      name: 'Courtyard',
      icon: '🌿',
      description:
        'A quiet outdoor space accessed via the gallery\'s side exit. Benches, a small fountain, and a smoking area. The door from the courtyard leads directly to the private office corridor — bypassing the main gallery entirely.',
      investigatorNote:
        'This is the route Victoria used. The courtyard connects to the private office corridor through a side door — one that is rarely monitored. The side door access log shows it was opened from the inside at 10:18 PM.',
      evidenceIds: ['side-door-log'],
    },
    {
      id: 'security-room',
      name: 'Security Room',
      icon: '📹',
      description:
        'A cramped back office housing the gallery\'s CCTV monitors, access control terminals, and Michael Grant\'s personal effects. The monitors show live feeds — and the playback reveals a conspicuous gap.',
      investigatorNote:
        'The CCTV system shows an 8-minute deletion in the private office corridor feed: 10:22 to 10:30 PM. System logs confirm this was a manual deletion, not a technical fault. There is also a bank statement in Grant\'s jacket showing a recent large cash deposit.',
      evidenceIds: ['cctv-gap', 'cash-deposit'],
    },
  ],

  // ─── Evidence ──────────────────────────────────────────────────────────────

  evidence: [
    {
      id: 'whiskey-glass',
      name: 'Crystal Whiskey Tumbler',
      description:
        'A crystal tumbler found on Daniel\'s desk. Residue remains in the glass.',
      detailedDescription:
        'Lab analysis of the residue confirms the presence of potassium cyanide — a lethal dose sufficient to cause death within 15–30 minutes of ingestion. The glass bears Daniel\'s fingerprints and one partial, smudged print on the base consistent with a right-handed person who attempted to wipe the surface. The smudge pattern suggests the print was deliberately obscured after the drink was poured.',
      location: 'private-office',
      tags: ['physical', 'forensic', 'murder weapon'],
      relatedSuspectIds: ['victoria-adeyemi'],
      relatedEvidenceIds: ['cyanide-vial', 'broken-watch', 'keycard-log'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Confirms the method of murder. The smudged partial print is consistent with Victoria\'s right hand. Combined with the cyanide vial, establishes how the poison was administered.',
    },
    {
      id: 'cyanide-vial',
      name: 'Empty Chemical Vial',
      description:
        'A small, unlabelled glass vial discarded in the storage room waste bin.',
      detailedDescription:
        'The vial contained traces of potassium cyanide — the same compound found in Daniel\'s whiskey glass. The batch code on the bottom (partially intact despite label removal) traces to a pharmaceutical supplier whose only local client is Vitae Wellness Clinic, registered to Victoria Adeyemi. The attempt to remove the label was imperfect: the edge of the supplier\'s logo remains visible under UV light.',
      location: 'storage-room',
      tags: ['physical', 'forensic', 'poison'],
      relatedSuspectIds: ['victoria-adeyemi'],
      relatedEvidenceIds: ['whiskey-glass', 'pharmacy-order'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Traces the poison source directly to Victoria\'s clinic. Combined with the pharmacy order, proves she had access to the murder weapon.',
    },
    {
      id: 'pharmacy-order',
      name: 'Pharmaceutical Supply Order',
      description:
        'A printed clinical supply order found in the victim\'s briefcase.',
      detailedDescription:
        'A supply order from Vitae Wellness Clinic for potassium cyanide (clinical grade) dated two weeks before the murder. The order was authorised under Victoria\'s clinical director signature. The quantity ordered (2ml) is consistent with the amount required for a fatal dose in a drink. Daniel had obtained a copy — possibly from his briefcase, suggesting he may have discovered this himself.',
      location: 'private-office',
      tags: ['document', 'forensic'],
      relatedSuspectIds: ['victoria-adeyemi'],
      relatedEvidenceIds: ['cyanide-vial', 'divorce-filing'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Proves Victoria had motive and access to the murder weapon. The date (two weeks prior) shows premeditation rather than a crime of passion.',
    },
    {
      id: 'keycard-log',
      name: 'Electronic Keycard Access Log',
      description:
        'The gallery\'s electronic access log for the private office door.',
      detailedDescription:
        'The security system\'s keycard log records all swipes by time, user, and door. On the night of the murder, the private office door was accessed at 10:10 PM by Daniel Adeyemi (entry), and at 10:19 PM by Victoria Adeyemi (entry). Victoria\'s card was not used to exit — suggesting she left via the courtyard side door. This directly contradicts Victoria\'s statement that she never went near the private office.',
      location: 'security-room',
      tags: ['digital', 'forensic'],
      relatedSuspectIds: ['victoria-adeyemi'],
      relatedEvidenceIds: ['cctv-gap', 'side-door-log', 'whiskey-glass'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Places Victoria inside the private office at 10:19 PM — the murder window. Directly contradicts her alibi. The most damning single piece of evidence.',
    },
    {
      id: 'cctv-gap',
      name: 'CCTV Corridor Gap (8 minutes)',
      description:
        'Security footage from the private office corridor shows an 8-minute deletion.',
      detailedDescription:
        'The corridor CCTV feed covering the private office entrance shows a manual deletion between 10:22 PM and 10:30 PM. System logs confirm this was not a technical failure — it was deliberately removed by someone with access to the security terminal. Only Michael Grant and Daniel Adeyemi had access credentials to the security room that evening. The deletion window perfectly brackets Victoria\'s entry and likely exit from the office.',
      location: 'security-room',
      tags: ['digital', 'forensic'],
      relatedSuspectIds: ['michael-grant', 'victoria-adeyemi'],
      relatedEvidenceIds: ['keycard-log', 'cash-deposit', 'side-door-log'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Proves the murder was premeditated and that Michael Grant assisted Victoria by deleting the footage. The 8-minute window covers Victoria\'s time inside the office.',
    },
    {
      id: 'cash-deposit',
      name: 'Bank Statement — £3,000 Cash Deposit',
      description:
        'A bank statement in Michael Grant\'s jacket showing a recent £3,000 cash deposit.',
      detailedDescription:
        'Michael Grant\'s bank statement shows a £3,000 cash deposit 14 days before the murder — unusual for a security guard on a £28,000 annual salary. The deposit date matches the week Victoria ordered the cyanide from her clinic supplier. No documented source for the cash. Combined with the CCTV deletion, this strongly suggests Grant was paid to suppress evidence.',
      location: 'security-room',
      tags: ['document', 'financial'],
      relatedSuspectIds: ['michael-grant', 'victoria-adeyemi'],
      relatedEvidenceIds: ['cctv-gap'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Establishes the financial link between Victoria and Michael Grant, proving the CCTV deletion was paid for — not a spontaneous act.',
    },
    {
      id: 'broken-watch',
      name: "Daniel's Broken Wristwatch",
      description:
        'An expensive wristwatch found on the office floor, face cracked, hands stopped.',
      detailedDescription:
        'The watch — a Patek Philippe worth approximately £18,000 — was found face-down on the floor beside the desk. The crystal is cracked and the mechanical movement has stopped, freezing the hands at 10:47 PM. This is consistent with the watch striking the floor as Daniel collapsed, establishing the latest possible time of death. The pathologist\'s initial estimate of 10:30–11:00 PM is consistent with this.',
      location: 'private-office',
      tags: ['physical', 'forensic', 'timeline'],
      relatedSuspectIds: [],
      relatedEvidenceIds: ['whiskey-glass', 'keycard-log'],
      isRedHerring: false,
      contributesToSolution: false,
      hiddenSignificance:
        'Establishes time of death at no later than 10:47 PM — confirms the murder occurred within the window covered by the CCTV gap (10:22–10:30 PM) and after Victoria\'s keycard entry (10:19 PM).',
    },
    {
      id: 'torn-letter',
      name: 'Torn Document Fragment',
      description:
        'A torn piece of paper found on the main gallery floor near the north entrance.',
      detailedDescription:
        'A fragment of a printed document. The visible text reads: "…the provenance documents for the Hartley work are inconsistent with authenticated records held at the…". This is a draft section of Marcus Cole\'s article about the suspected forged painting. It was torn — possibly during the confrontation at 8:45 PM. This is editorial journalism, not a threat or a confession.',
      location: 'main-gallery',
      tags: ['document'],
      relatedSuspectIds: ['marcus-cole'],
      relatedEvidenceIds: ['cctv-argument'],
      isRedHerring: true,
      contributesToSolution: false,
      hiddenSignificance:
        'RED HERRING. This creates a strong impression that Marcus is dangerous, but the fragment is from a journalism draft — not a threat. Marcus had genuine motive (defamation lawsuit) but left at 9:30 PM.',
    },
    {
      id: 'cctv-argument',
      name: 'CCTV Footage — 8:45 PM Confrontation',
      description:
        'Gallery CCTV shows a heated confrontation between Daniel and Marcus at 8:45 PM.',
      detailedDescription:
        'The main gallery CCTV clearly shows Marcus Cole and Daniel Adeyemi arguing near the east wall at 8:45 PM. The argument lasts approximately 19 minutes before Marcus walks toward the exit. Marcus is visibly angry and points his finger at Daniel. However, the footage also clearly shows Marcus leaving the building at 9:28 PM and not returning — his cab was logged exiting the forecourt at 9:31 PM.',
      location: 'main-gallery',
      tags: ['digital', 'witness', 'timeline'],
      relatedSuspectIds: ['marcus-cole'],
      relatedEvidenceIds: ['torn-letter'],
      isRedHerring: true,
      contributesToSolution: false,
      hiddenSignificance:
        'RED HERRING. Marcus is clearly confirmed leaving at 9:28 PM — 80 minutes before the estimated murder. The confrontation is a strong distraction but Marcus had neither opportunity nor access after leaving.',
    },
    {
      id: 'bank-transfer',
      name: 'Gallery Account Transfer Records',
      description:
        'Financial documents showing irregular transfers from the gallery account.',
      detailedDescription:
        'Accounting records show 23 irregular transfers totalling £160,347 from Adeyemi & Bello Fine Art\'s operating account to a personal account registered to James Bello\'s private holding company. Transfers occurred over 24 months, each individually small enough to escape automated alerts. Daniel\'s confrontation email (drafted at 4:17 PM on the day of the murder) references these exact figures.',
      location: 'private-office',
      tags: ['document', 'financial'],
      relatedSuspectIds: ['james-bello'],
      relatedEvidenceIds: ['confrontation-email', 'whiskey-decanter-prints'],
      isRedHerring: true,
      contributesToSolution: false,
      hiddenSignificance:
        'RED HERRING. James had strong motive and was in the gallery all evening. But multiple witnesses place him in the main gallery continuously during the murder window. The embezzlement is real — he is guilty of fraud, not murder.',
    },
    {
      id: 'confrontation-email',
      name: 'Confrontation Email (Draft)',
      description:
        'A draft email from Daniel to James found in Daniel\'s open laptop.',
      detailedDescription:
        '"James — I have reviewed the accounts with our auditor and the irregularities are no longer deniable. I am consulting counsel tomorrow regarding dissolution of the partnership. I strongly advise you to retain your own legal representation. I will not be going to the police if this is resolved cleanly. — D" Sent at 4:17 PM. Seen by James at 4:32 PM (read receipt).',
      location: 'private-office',
      tags: ['digital', 'document'],
      relatedSuspectIds: ['james-bello'],
      relatedEvidenceIds: ['bank-transfer'],
      isRedHerring: true,
      contributesToSolution: false,
      hiddenSignificance:
        'RED HERRING. This dramatically implicates James but also shows Daniel was willing to settle the matter quietly — reducing James\'s urgency to kill. James\'s alibi in the main gallery is corroborated by multiple independent witnesses.',
    },
    {
      id: 'whiskey-decanter-prints',
      name: "James Bello's Fingerprints on Decanter",
      description:
        "James Bello's fingerprints are found on the whiskey decanter behind the main gallery bar.",
      detailedDescription:
        'Forensic analysis of the whiskey decanter at the main gallery bar identifies James Bello\'s fingerprints clearly on the body and stopper. The decanter is the same brand as the crystal tumbler in Daniel\'s private office — but this is the main gallery\'s bar decanter, not the private office one. James was observed serving drinks to guests from 9:00 PM–10:30 PM.',
      location: 'main-gallery',
      tags: ['physical', 'forensic'],
      relatedSuspectIds: ['james-bello'],
      relatedEvidenceIds: ['bank-transfer'],
      isRedHerring: true,
      contributesToSolution: false,
      hiddenSignificance:
        'RED HERRING. James\'s prints on the main gallery decanter are fully explained by his role serving drinks. This is not the office tumbler used in the murder.',
    },
    {
      id: 'emma-photograph',
      name: "Photograph in Victim's Wallet",
      description:
        "A small photograph found in Daniel's wallet of a young girl, aged approximately 12.",
      detailedDescription:
        'A well-worn photograph of a girl — approximately 12 years old — smiling at the camera. On the back, in Daniel\'s handwriting: "Emma — June 2024". This is Emma Okafor, Sarah\'s daughter and Daniel\'s unacknowledged child. The will amendment document confirms Daniel was in the process of including Emma as a beneficiary.',
      location: 'private-office',
      tags: ['physical', 'document'],
      relatedSuspectIds: ['sarah-okafor', 'victoria-adeyemi'],
      relatedEvidenceIds: ['will-amendment', 'divorce-filing'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Establishes the existence of the secret daughter — the knowledge of which gave Victoria her motive. Combined with the divorce filing, explains why Victoria acted when she did.',
    },
    {
      id: 'phone-record-sarah',
      name: "Sarah Okafor's Phone Record",
      description:
        "Phone records show Sarah called Daniel at 10:55 PM. The call was unanswered.",
      detailedDescription:
        'Sarah\'s mobile phone records confirm an outgoing call to Daniel\'s number at 10:55 PM, lasting 0 seconds (unanswered). This places Sarah in the main gallery — she would not have called him if she had just poisoned him, and the call timestamp is after the estimated time of death. The call is consistent with her statement that she was worried about his absence from the event.',
      location: 'main-gallery',
      tags: ['digital', 'timeline'],
      relatedSuspectIds: ['sarah-okafor'],
      relatedEvidenceIds: ['broken-watch'],
      isRedHerring: false,
      contributesToSolution: false,
      hiddenSignificance:
        'EXCULPATORY. Supports Sarah\'s innocence — calling the victim after poisoning him would serve no purpose. Helps the player eliminate Sarah as a suspect.',
    },
    {
      id: 'divorce-filing',
      name: 'Divorce Petition (Draft)',
      description:
        'A partial draft divorce petition found among documents on Daniel\'s desk.',
      detailedDescription:
        'A 4-page draft divorce petition from Daniel\'s solicitors, citing "irreconcilable differences". Dated two weeks before the murder. Key provisions include: the primary residence and gallery stake to be retained by Daniel, limited settlement for Victoria, and a clause establishing Emma Okafor as a named beneficiary in a new will structure. The draft bears a handwritten annotation in Daniel\'s hand: "Final review Friday."',
      location: 'private-office',
      tags: ['document', 'legal'],
      relatedSuspectIds: ['victoria-adeyemi', 'sarah-okafor'],
      relatedEvidenceIds: ['will-amendment', 'emma-photograph', 'pharmacy-order'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Establishes Victoria\'s motive conclusively. She would lose everything: house, gallery share, social standing. Combined with the will amendment naming Emma, explains why she chose to act before "Final review Friday."',
    },
    {
      id: 'will-amendment',
      name: 'Will Amendment Document',
      description:
        "A document amending Daniel's will to include a new beneficiary.",
      detailedDescription:
        'A partially-executed amendment to Daniel\'s last will and testament. The amendment names "Emma Christine Okafor, born 14th March 2014, daughter of Daniel Adeyemi" as a named beneficiary, receiving 35% of the estate. Victoria\'s allocation is reduced from 60% to 25%. The document was prepared but not yet witnessed — suggesting Daniel was close to finalising it but had not done so.',
      location: 'private-office',
      tags: ['document', 'legal'],
      relatedSuspectIds: ['victoria-adeyemi', 'sarah-okafor'],
      relatedEvidenceIds: ['divorce-filing', 'emma-photograph'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Shows the full financial scale of Victoria\'s motive. Her inheritance cut from 60% to 25%. The combination of divorce and will amendment would have left her with almost nothing.',
    },
    {
      id: 'side-door-log',
      name: 'Courtyard Side Door Access Log',
      description:
        'Electronic log showing the courtyard-to-corridor side door was opened at 10:18 PM.',
      detailedDescription:
        'The gallery\'s access control system logs all door events. The courtyard side door — which opens from the courtyard directly into the private office corridor, bypassing the main gallery — was opened from the inside at 10:18 PM. This door has no exterior handle and can only be opened from the courtyard or from inside the corridor. It was next opened at 10:31 PM — Victoria\'s exit route after committing the murder and before the CCTV resumed.',
      location: 'courtyard',
      tags: ['digital', 'forensic'],
      relatedSuspectIds: ['victoria-adeyemi'],
      relatedEvidenceIds: ['keycard-log', 'cctv-gap'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Establishes Victoria\'s entry and exit route — she came in through the courtyard at 10:18, used her keycard at 10:19, committed the murder, then left via the same side door at 10:31 — exactly when CCTV resumed.',
    },
  ],

  // ─── Timeline ──────────────────────────────────────────────────────────────

  timeline: [
    {
      id: 'tl-1',
      time: '7:00 PM',
      description: 'Gallery opens for the private members evening. Staff and catering in place. All five suspects arrive within the next 30 minutes.',
      source: 'CCTV / Staff log',
      suspectIds: [],
      evidenceIds: [],
      isContradiction: false,
      alwaysVisible: true,
    },
    {
      id: 'tl-2',
      time: '7:30 PM',
      description: 'All five suspects confirmed on the premises. Daniel greets guests in the main gallery.',
      source: 'CCTV',
      suspectIds: ['marcus-cole', 'sarah-okafor', 'james-bello', 'victoria-adeyemi', 'michael-grant'],
      evidenceIds: [],
      isContradiction: false,
      alwaysVisible: true,
    },
    {
      id: 'tl-3',
      time: '8:45 PM',
      description: 'Marcus Cole confronts Daniel Adeyemi near the east wall. Heated argument visible on CCTV for 19 minutes.',
      source: 'CCTV',
      suspectIds: ['marcus-cole'],
      evidenceIds: ['cctv-argument', 'torn-letter'],
      isContradiction: false,
    },
    {
      id: 'tl-4',
      time: '9:00 PM',
      description: 'James Bello begins serving whiskey to guests from the main gallery bar. His prints will later be found on the decanter.',
      source: 'Multiple witnesses',
      suspectIds: ['james-bello'],
      evidenceIds: ['whiskey-decanter-prints'],
      isContradiction: false,
    },
    {
      id: 'tl-5',
      time: '9:28 PM',
      description: 'Marcus Cole exits the gallery. Cab booking confirmed at 9:28 PM, vehicle clears the forecourt at 9:31 PM. Marcus does not return.',
      source: 'CCTV / Cab record',
      suspectIds: ['marcus-cole'],
      evidenceIds: ['cctv-argument'],
      isContradiction: false,
    },
    {
      id: 'tl-6',
      time: '9:30 PM',
      description: 'Victoria later claims she was in the main gallery from 9:30 PM "for the rest of the evening." This will be contradicted by the keycard log.',
      source: 'Victoria\'s statement',
      suspectIds: ['victoria-adeyemi'],
      evidenceIds: ['keycard-log'],
      isContradiction: true,
      contradictsSuspectId: 'victoria-adeyemi',
    },
    {
      id: 'tl-7',
      time: '10:10 PM',
      description: 'Daniel Adeyemi retreats to his private office alone. Keycard log confirms entry at 10:10 PM.',
      source: 'Keycard log',
      suspectIds: [],
      evidenceIds: ['keycard-log'],
      isContradiction: false,
    },
    {
      id: 'tl-8',
      time: '10:18 PM',
      description: 'The courtyard side door is opened from the courtyard side — someone enters the private office corridor without going through the main gallery.',
      source: 'Door access log',
      suspectIds: ['victoria-adeyemi'],
      evidenceIds: ['side-door-log'],
      isContradiction: false,
    },
    {
      id: 'tl-9',
      time: '10:19 PM',
      description: "Victoria Adeyemi's keycard is used to access the private office. This directly contradicts her statement that she never went near the office.",
      source: 'Keycard log',
      suspectIds: ['victoria-adeyemi'],
      evidenceIds: ['keycard-log'],
      isContradiction: true,
      contradictsSuspectId: 'victoria-adeyemi',
    },
    {
      id: 'tl-10',
      time: '10:22 PM',
      description: '8-minute gap in the private office corridor CCTV begins. System logs confirm this is a manual deletion, not a technical error.',
      source: 'CCTV system log',
      suspectIds: ['michael-grant', 'victoria-adeyemi'],
      evidenceIds: ['cctv-gap'],
      isContradiction: true,
      contradictsSuspectId: 'michael-grant',
    },
    {
      id: 'tl-11',
      time: '10:30 PM',
      description: 'CCTV in the private office corridor resumes. Victoria is spotted in the main gallery moments later — having entered via the courtyard.',
      source: 'CCTV',
      suspectIds: ['victoria-adeyemi'],
      evidenceIds: ['cctv-gap', 'side-door-log'],
      isContradiction: false,
    },
    {
      id: 'tl-12',
      time: '10:47 PM',
      description: "Daniel's watch stops — he collapses. Estimated time of death, consistent with cyanide poisoning after ingestion at approximately 10:20–10:25 PM.",
      source: 'Physical evidence / Pathologist estimate',
      suspectIds: [],
      evidenceIds: ['broken-watch', 'whiskey-glass'],
      isContradiction: false,
    },
    {
      id: 'tl-13',
      time: '10:55 PM',
      description: 'Sarah Okafor calls Daniel\'s mobile from the main gallery. No answer. She later tells investigators she was worried about his long absence.',
      source: 'Phone record',
      suspectIds: ['sarah-okafor'],
      evidenceIds: ['phone-record-sarah'],
      isContradiction: false,
    },
    {
      id: 'tl-14',
      time: '11:20 PM',
      description: 'James Bello comments to guests that Daniel has been in his office a long time. He does not go to check.',
      source: 'Witness account',
      suspectIds: ['james-bello'],
      evidenceIds: [],
      isContradiction: false,
    },
    {
      id: 'tl-15',
      time: '11:47 PM',
      description: 'Michael Grant discovers Daniel\'s body during his 11:45 PM routine security sweep. He calls emergency services immediately. The private office door was unlocked.',
      source: 'Michael Grant / Emergency call log',
      suspectIds: ['michael-grant'],
      evidenceIds: ['broken-watch'],
      isContradiction: false,
      alwaysVisible: true,
    },
  ],

  // ─── Solution ──────────────────────────────────────────────────────────────

  solution: {
    killerId: 'victoria-adeyemi',
    method: 'Potassium cyanide dissolved in Daniel\'s whiskey, administered personally in the private office.',
    motive:
      'Victoria discovered Daniel\'s plans to divorce her and amend his will to benefit his secret daughter, Emma Okafor. She stood to lose the marriage, the majority of the estate, and her social standing.',
    opportunity:
      'Victoria used her senior staff keycard to access the private office at 10:19 PM via the courtyard side entrance — avoiding the main gallery. She had already paid Michael Grant to delete 8 minutes of corridor CCTV footage.',
    fullExplanation:
      'Four days before the murder, Victoria found the draft divorce petition and will amendment in Daniel\'s briefcase. She had already ordered potassium cyanide through her wellness clinic two weeks prior — either as preparation or insurance. On the night of the gallery event, she waited until Daniel retired to his office at 10:10 PM. At 10:18 PM she entered via the courtyard side door (bypassing the main gallery), used her keycard to enter the office at 10:19 PM, poured the cyanide into his whiskey glass while he reviewed documents, and exited via the side door at 10:31 PM — immediately before CCTV resumed. Michael Grant, whom she had paid £3,000 two weeks earlier, deleted the 8-minute footage window on her instruction. Daniel collapsed at approximately 10:47 PM. The key evidence: keycard log (places her in the office), cyanide vial batch code (traces to her clinic), pharmacy order (proves she sourced the poison), side door log (establishes her route), CCTV gap (shows premeditation), cash deposit (links Grant to her).',
    keyEvidenceIds: [
      'keycard-log',
      'cyanide-vial',
      'pharmacy-order',
      'side-door-log',
      'cctv-gap',
      'cash-deposit',
      'divorce-filing',
      'will-amendment',
    ],
  },
};
