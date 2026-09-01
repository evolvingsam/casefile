import type { Case } from '@/game/types';

// ─────────────────────────────────────────────────────────────────────────────
// Case #052 — The Vanishing Manuscript
//
// NARRATIVE & SOLUTION TRUTH (Internal only — zero leakage to WebMCP):
//   Culprit    : Miriam Bello (Archivist) collaborating with David Mensah (Publisher)
//   Method     : Used a duplicated mechanical key during the 3-minute power outage
//                (10:12-10:15 PM) when electronic mag-locks disengaged.
//   Motive     : Agreed to digitize the manuscript for David Mensah in exchange for
//                £50,000 before Dr. Okoro donated the original to the National Museum.
//   Red Herring: Chinedu Okafor's fingerprints on display casing and torn notebook page
//                left during his 9:30 PM academic examination.
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

  // ─── Suspects ──────────────────────────────────────────────────────────────

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
      secrets: [
        'She overheard Miriam Bello and David Mensah whispering near the rear stairwell at 9:40 PM.',
        'She saw Samuel Adekunle holding a torn paper scrap near the security desk at 10:05 PM.',
      ],
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
      isKiller: false,
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
      secrets: [
        'He offered Miriam Bello £50,000 to scan the manuscript pages before Okoro\'s planned donation to the museum.',
        'He arrived at 9:40 PM (not 10:00 PM) and arranged for a portable high-speed scanner delivery under a false shipment manifest.',
      ],
      initialStatement:
        '"I\'m here strictly for business. Dr. Okoro invited me to review publication terms. I had no access to the vault keys."',
      interviewResponses: [
        {
          id: 'dm-q1',
          question: 'What time did you arrive at the library preview?',
          answer:
            '"My car dropped me off around 10:00 PM. I went straight to Dr. Okoro\'s private study to discuss contract terms."',
        },
        {
          id: 'dm-q2',
          question: 'Why does the delivery manifest list a package received for you at 9:45 PM?',
          answer:
            '"[pauses] Ah, that was sample binding materials sent by my production team. Routine delivery."',
        },
        {
          id: 'dm-q3',
          question: 'What were your negotiations with Miriam Bello about?',
          answer:
            '"As head archivist, she was advising on high-resolution image licensing. Entirely professional consultation."',
        },
        {
          id: 'dm-q4',
          question: 'Did you know Dr. Okoro intended to donate the manuscript for free?',
          answer:
            '"Elias is a idealist. Public donation means zero royalties. Naturally, I preferred a commercial release first."',
        },
      ],
      relatedEvidenceIds: ['publishers-contract', 'courier-delivery-manifest', 'scanner-shipping-box'],
      isKiller: false,
    },

    {
      id: 'chinedu-okafor',
      name: 'Chinedu Okafor',
      title: 'Historian & Academic Rival',
      occupation: 'Professor of West African History, St. Jude College',
      relationship: 'Professional Adversary',
      description:
        'Combative and passionate. Okafor published a sharp critique questioning Okoro\'s translation methodology three weeks ago.',
      motive:
        'Sought to inspect the original folios to prove Okoro\'s translation contained major errors before the manuscript went public.',
      alibi:
        '"I was in the main reading room between 9:15 PM and 10:35 PM discussing 17th-century typography with fellow guests. Dozens of people saw me."',
      secrets: [
        'He pressed his hand against the glass casing at 9:30 PM trying to read the lower margin folio text.',
        'He dropped a torn page from his research notebook near the pedestal when he jostled his coat.',
      ],
      initialStatement:
        '"Okoro\'s scholarship is flawed, but I am an academic, not a burglar. I examined the display through the glass like everyone else."',
      interviewResponses: [
        {
          id: 'co-q1',
          question: 'Why are your fingerprints on the vault display glass casing?',
          answer:
            '"At 9:30 PM, Dr. Okoro briefly opened the vault door for guests. I leaned against the casing to examine the lower margin notes under magnification. I never touched the manuscript itself."',
        },
        {
          id: 'co-q2',
          question: 'Why was a torn page from your notebook found on the vault floor?',
          answer:
            '"I tore a citation page out of my pad at 9:25 PM to hand to a colleague. It must have slipped out of my pocket while I was looking into the vault."',
        },
        {
          id: 'co-q3',
          question: 'Did you see anyone enter the vault during the power outage?',
          answer:
            '"When the lights cut at 10:12 PM, I was near the refreshments table in the reading hall. I heard the service door latch click, but could see nothing in the dark."',
        },
        {
          id: 'co-q4',
          question: 'What is your opinion of Dr. Okoro\'s manuscript analysis?',
          answer:
            '"His dating of folio 14 is mistaken by at least twenty years. The manuscript belongs in an open university archive, not locked in his private vault."',
        },
      ],
      relatedEvidenceIds: ['torn-notebook-page', 'vault-glass-casing', 'academic-critique-draft'],
      isKiller: false,
    },

    {
      id: 'miriam-bello',
      name: 'Miriam Bello',
      title: 'Archivist',
      occupation: 'Senior Archivist & Conservation Specialist',
      relationship: 'Keyholder & Custodian',
      description:
        'Quiet, precise, and highly knowledgeable about historical preservation. She possesses deep technical knowledge of the library\'s vault locks.',
      motive:
        'Believes the manuscript originates from her ancestral family estate and was unlawfully acquired. Partnered with Mensah for a £50,000 payment to digitize and preserve copies.',
      alibi:
        '"I was in the conservation lab updating climate control logs from 10:05 PM to 10:30 PM. The vault was securely locked when I left the archival area at 10:00 PM."',
      secrets: [
        'She duplicated the master mechanical archival key 10 days ago at a local locksmith.',
        'She used the 3-minute power outage (10:12–10:15 PM) to unlock the mechanical latch, remove the manuscript, and scan it in the service room.',
        'She passed the digitized files to David Mensah via the rear service courtyard exit.',
      ],
      initialStatement:
        '"I\'ve cared for these archives for six years. Only Dr. Okoro and I hold keycard credentials, and my card was logged in the conservation room all night."',
      interviewResponses: [
        {
          id: 'mb-q1',
          question: 'Did you enter the archival vault after 10:00 PM?',
          answer:
            '"No. My electronic keycard was not swiped at the vault door after 9:50 PM. The electronic access log will confirm that."',
        },
        {
          id: 'mb-q2',
          question: 'Why does a locksmith receipt list a duplicate brass key matching lock code V-409?',
          answer:
            '"[hesitates] We... we had duplicate keys cut months ago for conservation maintenance. That is standard archival protocol."',
        },
        {
          id: 'mb-q3',
          question: 'Where were you during the 10:12 PM power blackout?',
          answer:
            '"I was in the conservation room. When the lights went out, I checked the humidity sensors until power returned at 10:15 PM."',
        },
        {
          id: 'mb-q4',
          question: 'What is your relationship with David Mensah?',
          answer:
            '"He consulted me regarding document preservation requirements for potential high-resolution facsimiles. Nothing more."',
        },
      ],
      relatedEvidenceIds: ['duplicated-vault-key', 'locksmith-receipt', 'service-door-sensor', 'scanner-shipping-box'],
      isKiller: true,
    },

    {
      id: 'samuel-adekunle',
      name: 'Samuel Adekunle',
      title: 'Security Contractor',
      occupation: 'Lead Security Officer, Apex Protective Services',
      relationship: 'Contract Employee',
      description:
        'Retired police officer managing physical security, CCTV feeds, and building entry logs for the event.',
      motive:
        'Received a £1,000 cash bribe from David Mensah to tear out the 10:00 PM visitor register page to conceal Mensah\'s early arrival.',
      alibi:
        '"I remained at the security control desk all evening monitoring cameras and logging visitors. I left the desk briefly at 10:12 PM to reset the sub-panel breaker."',
      secrets: [
        'He manually reset the main breaker at 10:12 PM to resolve a transformer hum, inadvertently disabling the mag-locks for 3 minutes.',
        'He removed a page from the visitor register at Mensah\'s request.',
      ],
      initialStatement:
        '"I maintained strict control over the entry gates. No unauthorized person entered the building tonight."',
      interviewResponses: [
        {
          id: 'sa-q1',
          question: 'Why did the building power interrupt at 10:12 PM?',
          answer:
            '"The sub-station breaker in the security room was humming loudly and overheating. I performed a standard manual reset. Power was restored in under three minutes."',
        },
        {
          id: 'sa-q2',
          question: 'Why is a page missing from the paper visitor register between 9:30 PM and 10:15 PM?',
          answer:
            '"A guest spilled coffee over that sheet earlier. I tore it out to keep the binder clean. All legitimate guests are recorded digitally anyway."',
        },
        {
          id: 'sa-q3',
          question: 'What happens to the vault door during a main breaker reset?',
          answer:
            '"The electronic mag-lock drops during a blackout, but the mechanical deadbolt remains locked — unless someone uses a physical key."',
        },
        {
          id: 'sa-q4',
          question: 'Did you observe any activity in the rear service courtyard around 10:15 PM?',
          answer:
            '"The courtyard camera feed went dark during the breaker reset. When it came back up at 10:16 PM, the yard was clear."',
        },
      ],
      relatedEvidenceIds: ['digital-access-log', 'visitor-register-log', 'power-substation-log'],
      isKiller: false,
    },
  ],

  // ─── Locations ─────────────────────────────────────────────────────────────

  locations: [
    {
      id: 'archival-vault',
      name: 'Primary Archival Vault',
      icon: '🔐',
      description:
        'A climate-controlled, reinforced vault housing rare historical folios. Features an electronic mag-lock door and a heavy glass display pedestal.',
      investigatorNote:
        'The glass display casing is unlocked and empty. No signs of forced entry on the lock mechanism. Smudged fingerprints are visible on the casing glass.',
      evidenceIds: ['display-pedestal', 'vault-glass-casing', 'torn-notebook-page'],
    },
    {
      id: 'reading-library',
      name: 'Main Reading Hall',
      icon: '📚',
      description:
        'A grand wood-panelled library hall where guests gathered for the manuscript preview. Lined with reading tables and exhibit boards.',
      investigatorNote:
        'Guest wine glasses sit on table 4. An instant polaroid camera and preview snapshot are on the display podium.',
      evidenceIds: ['preview-photograph', 'abandoned-wine-glass', 'archival-catalog-notes'],
    },
    {
      id: 'okoro-study',
      name: 'Dr. Okoro\'s Research Study',
      icon: '🖋️',
      description:
        'Dr. Okoro\'s private office overlooking the library garden. Contains research files, correspondence, and draft publishing agreements.',
      investigatorNote:
        'A draft publishing contract from Heritage Academic Press sits on the desk alongside Okoro\'s briefcase and academic journals.',
      evidenceIds: ['academic-critique-draft', 'publishers-contract', 'okoro-briefcase'],
    },
    {
      id: 'security-station',
      name: 'Security & Control Station',
      icon: '🖥️',
      description:
        'The central security room housing camera monitors, electronic door access servers, and main electrical breaker panels.',
      investigatorNote:
        'The electronic access log export shows a gap in RFID records between 10:12 PM and 10:16 PM matching the breaker log. A visitor binder sits on the desk with a missing page.',
      evidenceIds: ['digital-access-log', 'visitor-register-log', 'power-substation-log', 'courier-delivery-manifest'],
    },
    {
      id: 'service-courtyard',
      name: 'Courtyard & Service Entrance',
      icon: '🌿',
      description:
        'A secluded rear alleyway and delivery bay used for archival shipments and staff access.',
      investigatorNote:
        'A discarded locksmith receipt was found in the service waste bin alongside a discarded shipping carton and a brass key hidden behind a rain pipe.',
      evidenceIds: ['duplicated-vault-key', 'locksmith-receipt', 'scanner-shipping-box', 'service-door-sensor'],
    },
  ],

  // ─── Evidence ──────────────────────────────────────────────────────────────

  evidence: [
    {
      id: 'display-pedestal',
      name: 'Velvet Display Pedestal',
      description:
        'The padded velvet pedestal inside the archival vault where the manuscript was displayed.',
      detailedDescription:
        'The dark blue velvet lining shows light dust indentations matching the dimensions of the manuscript folio (28cm x 40cm). No tearing or fabric snagging is observed, indicating the manuscript was lifted carefully rather than grabbed in haste.',
      location: 'archival-vault',
      tags: ['physical', 'crime scene'],
      relatedSuspectIds: ['miriam-bello', 'dr-elias-okoro'],
      relatedEvidenceIds: ['vault-glass-casing'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Proves the manuscript was removed carefully by someone with knowledge of archival handling.',
    },
    {
      id: 'vault-glass-casing',
      name: 'Smudged Glass Casing',
      description:
        'The hinged glass cover of the manuscript display pedestal.',
      detailedDescription:
        'Forensic powder reveals two clear partial palm prints on the front glass panel. Friction ridge comparison matches the left palm of Chinedu Okafor. Dust distribution indicates the prints were left while the glass lid was closed.',
      location: 'archival-vault',
      tags: ['physical', 'forensic', 'fingerprint'],
      relatedSuspectIds: ['chinedu-okafor'],
      relatedEvidenceIds: ['torn-notebook-page', 'academic-critique-draft'],
      isRedHerring: true,
      contributesToSolution: false,
      hiddenSignificance:
        'Red herring pointing toward Chinedu. The prints were left at 9:30 PM when he leaned against the casing while examining the text.',
    },
    {
      id: 'torn-notebook-page',
      name: 'Torn Academic Note Page',
      description:
        'A crumpled scrap of paper found near the base of the vault pedestal.',
      detailedDescription:
        'A lined page torn from a spiral notebook containing handwritten notes in black ink: "folio 14 translation erroneous — check royal seal date". Handwriting matches Professor Chinedu Okafor\'s research notes.',
      location: 'archival-vault',
      tags: ['document', 'paper'],
      relatedSuspectIds: ['chinedu-okafor'],
      relatedEvidenceIds: ['vault-glass-casing', 'academic-critique-draft'],
      isRedHerring: true,
      contributesToSolution: false,
      hiddenSignificance:
        'Red herring dropped accidentally by Chinedu during his 9:30 PM viewing. Initially leads investigators to suspect him.',
    },
    {
      id: 'preview-photograph',
      name: 'Polaroid Preview Snapshot',
      description:
        'A polaroid photograph taken in the main reading hall during the opening toast.',
      detailedDescription:
        'The snapshot shows Dr. Okoro speaking to guests at 9:15 PM. Visible in Dr. Okoro\'s left cardigan pocket is his primary brass key ring holding the master vault key (tag stamped #V-409). Dr. Okoro maintained possession of his key ring throughout the evening.',
      location: 'reading-library',
      tags: ['photograph', 'document'],
      relatedSuspectIds: ['dr-elias-okoro', 'miriam-bello'],
      relatedEvidenceIds: ['duplicated-vault-key', 'locksmith-receipt'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Establishes that Dr. Okoro never lost his original key, indicating the thief used a duplicated key.',
    },
    {
      id: 'abandoned-wine-glass',
      name: 'Abandoned Wine Tumbler',
      description:
        'A crystal wine tumbler left on reading table 4.',
      detailedDescription:
        'Contains trace residue of red wine. Fingerprint analysis reveals prints belonging to Amara Nwosu. Table 4 directly faces the archival room corridor.',
      location: 'reading-library',
      tags: ['physical', 'forensic'],
      relatedSuspectIds: ['amara-nwosu'],
      relatedEvidenceIds: ['archival-catalog-notes'],
      isRedHerring: false,
      contributesToSolution: false,
      hiddenSignificance:
        'Corroborates Amara\'s statement that she was working at reading table 4 during the evening.',
    },
    {
      id: 'archival-catalog-notes',
      name: 'Cataloguing Work Log Sheet',
      description:
        'A clip-board with handwritten index entries for reference volumes.',
      detailedDescription:
        'Contains entries in Amara Nwosu\'s handwriting timestamped sequentially from 9:35 PM to 10:30 PM. A note at 10:14 PM reads: "heavy footsteps near service hallway during light failure".',
      location: 'reading-library',
      tags: ['document', 'log'],
      relatedSuspectIds: ['amara-nwosu', 'miriam-bello'],
      relatedEvidenceIds: ['power-substation-log', 'service-door-sensor'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Corroborates the time of movement during the power failure.',
    },
    {
      id: 'academic-critique-draft',
      name: 'Annotated Article Draft',
      description:
        'A printed draft of a journal article titled "Errors in 17th Century Translation".',
      detailedDescription:
        'Author: Prof. Chinedu Okafor. Marginal annotations in red ink question Dr. Okoro\'s interpretation of the royal treaty seal. Found inside Dr. Okoro\'s desk drawer.',
      location: 'okoro-study',
      tags: ['document', 'academic'],
      relatedSuspectIds: ['chinedu-okafor', 'dr-elias-okoro'],
      relatedEvidenceIds: ['torn-notebook-page'],
      isRedHerring: false,
      contributesToSolution: false,
      hiddenSignificance:
        'Explains Chinedu\'s academic motive for closely inspecting the manuscript earlier in the evening.',
    },
    {
      id: 'publishers-contract',
      name: 'Draft Publishing Agreement',
      description:
        'A draft commercial publication contract from Heritage Academic Press.',
      detailedDescription:
        'Contract terms offer a £250,000 advance to Okoro Historical Institute for exclusive publication rights. A handwritten sticky note attached reads: "Elias refuses — insists on free public museum donation. Need alternative arrangement."',
      location: 'okoro-study',
      tags: ['document', 'financial'],
      relatedSuspectIds: ['david-mensah', 'dr-elias-okoro'],
      relatedEvidenceIds: ['courier-delivery-manifest', 'scanner-shipping-box'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Establishes David Mensah\'s strong financial motive to obtain digital copies before public donation.',
    },
    {
      id: 'okoro-briefcase',
      name: 'Unlocked Leather Briefcase',
      description:
        'Dr. Okoro\'s tan leather briefcase resting beside his desk.',
      detailedDescription:
        'Contains lecture notes, archival permission forms, and a spare master keycard for the building main entrance. The master keycard does not have vault clearance.',
      location: 'okoro-study',
      tags: ['container', 'physical'],
      relatedSuspectIds: ['dr-elias-okoro'],
      relatedEvidenceIds: ['digital-access-log'],
      isRedHerring: false,
      contributesToSolution: false,
      hiddenSignificance:
        'Confirms Okoro did not keep vault credentials in his briefcase.',
    },
    {
      id: 'digital-access-log',
      name: 'Electronic RFID Access Export',
      description:
        'A printed system log from the electronic security server.',
      detailedDescription:
        'Records RFID swipes for all perimeter and interior doors. Shows Miriam Bello\'s keycard swiped at the conservation room at 9:50 PM. Between 10:12 PM and 10:16 PM, system log entries read: "[COMMUNICATION FAILURE — MAIN BREAKER OFFLINE]".',
      location: 'security-station',
      tags: ['digital', 'log'],
      relatedSuspectIds: ['miriam-bello', 'samuel-adekunle'],
      relatedEvidenceIds: ['power-substation-log', 'service-door-sensor'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Establishes the 3-minute logging gap during the electrical breaker outage.',
    },
    {
      id: 'visitor-register-log',
      name: 'Visitor Registry Binder',
      description:
        'A hardcover guest sign-in binder resting on the security counter.',
      detailedDescription:
        'Page 14 (covering entry entries between 9:30 PM and 10:15 PM) has been neatly severed along the perforated binding. Microscopic paper fibers indicate a razor blade was used to remove the page.',
      location: 'security-station',
      tags: ['document', 'log'],
      relatedSuspectIds: ['samuel-adekunle', 'david-mensah'],
      relatedEvidenceIds: ['courier-delivery-manifest'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Proves intentional tampering with visitor arrival records to conceal David Mensah\'s early 9:40 PM arrival.',
    },
    {
      id: 'power-substation-log',
      name: 'Circuit Breaker Event Log',
      description:
        'An automated micro-controller event log from the electrical panel.',
      detailedDescription:
        'Timestamp 10:12:04 PM: "MANUAL TRIP — SUB-PANEL 3 BREAKER". Timestamp 10:15:22 PM: "MANUAL RESET — SUB-PANEL 3 BREAKER". Duration of power interruption: 3 minutes and 18 seconds.',
      location: 'security-station',
      tags: ['digital', 'technical'],
      relatedSuspectIds: ['samuel-adekunle'],
      relatedEvidenceIds: ['digital-access-log', 'service-door-sensor'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Pins the exact duration when electronic mag-locks were unpowered, allowing mechanical key entry.',
    },
    {
      id: 'courier-delivery-manifest',
      name: 'Courier Delivery Receipt',
      description:
        'A waybill receipt from Swift Express Logistics found on the security desk clip.',
      detailedDescription:
        'Waybill #SE-9942 dated tonight at 9:45 PM. Package weight: 14.2 kg. Sender: Apex Imaging Systems. Recipient: David Mensah c/o Research Library Service Gate. Signed by: S. Adekunle.',
      location: 'security-station',
      tags: ['document', 'financial'],
      relatedSuspectIds: ['david-mensah', 'samuel-adekunle'],
      relatedEvidenceIds: ['scanner-shipping-box', 'publishers-contract'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Links David Mensah to the arrival of high-speed scanning equipment under the guise of a routine delivery.',
    },
    {
      id: 'duplicated-vault-key',
      name: 'Brass Archival Key (#V-409)',
      description:
        'A brass lever-tumbler key recovered from behind a drainpipe in the service courtyard.',
      detailedDescription:
        'Stamped with lock code "#V-409" matching the mechanical secondary lock on the Primary Archival Vault door. Microscopic tool marks indicate the key was recently cut on a precision rotary machine. Lab examination reveals micro-traces of conservation cotton glove fibers on the bow.',
      location: 'service-courtyard',
      tags: ['physical', 'key', 'forensic'],
      relatedSuspectIds: ['miriam-bello'],
      relatedEvidenceIds: ['locksmith-receipt', 'preview-photograph'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'The physical tool used to unlock the vault during the power outage. Traces to Miriam Bello.',
    },
    {
      id: 'locksmith-receipt',
      name: 'Itemized Locksmith Receipt',
      description:
        'A carbon-copy receipt discarded in the courtyard waste bin.',
      detailedDescription:
        'Issued by "City Lock & Key" dated 10 days prior. Item: "Custom Bit Key Duplicate — Code V-409". Billed to account: "Vitae Conservation / M. Bello". Payment: £45 cash.',
      location: 'service-courtyard',
      tags: ['document', 'financial'],
      relatedSuspectIds: ['miriam-bello'],
      relatedEvidenceIds: ['duplicated-vault-key'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Directly links Miriam Bello to the duplication of the archival vault key code V-409.',
    },
    {
      id: 'scanner-shipping-box',
      name: 'Discarded Shipping Carton',
      description:
        'A heavy cardboard carton with foam inserts tucked behind service bins.',
      detailedDescription:
        'Shipping label matches Waybill #SE-9942. Product description on box side: "OptiScan Pro-900 Ultra-Fast Book Digitizer". Serial number matches Apex Imaging invoice.',
      location: 'service-courtyard',
      tags: ['physical', 'container'],
      relatedSuspectIds: ['david-mensah', 'miriam-bello'],
      relatedEvidenceIds: ['courier-delivery-manifest', 'publishers-contract'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Confirms the delivery contained portable high-speed scanning equipment used to copy the manuscript.',
    },
    {
      id: 'service-door-sensor',
      name: 'Courtyard Motion Sensor Log',
      description:
        'An independent battery-operated exterior motion log for the service door.',
      detailedDescription:
        'Timestamp 10:15:10 PM: "EXTERIOR MOTION DETECTED — REAR SERVICE DOOR OPENED". Timestamp 10:15:45 PM: "REAR SERVICE DOOR CLOSED".',
      location: 'service-courtyard',
      tags: ['digital', 'log'],
      relatedSuspectIds: ['miriam-bello', 'david-mensah'],
      relatedEvidenceIds: ['power-substation-log', 'duplicated-vault-key'],
      isRedHerring: false,
      contributesToSolution: true,
      hiddenSignificance:
        'Confirms exit through the rear service door at 10:15 PM — exactly at the conclusion of the power outage.',
    },
  ],

  // ─── Timeline Events ───────────────────────────────────────────────────────

  timeline: [
    {
      id: 'vm-tl-1',
      time: '8:30 PM',
      description: 'Private preview evening commences in the Main Reading Hall. Guests arrive and view display panels.',
      source: 'Guest invitations',
      suspectIds: ['amara-nwosu', 'miriam-bello', 'chinedu-okafor'],
      evidenceIds: [],
      isContradiction: false,
      alwaysVisible: true,
    },
    {
      id: 'vm-tl-2',
      time: '9:00 PM',
      description: 'Dr. Okoro unlocks the archival vault and places the 17th-century manuscript onto the velvet display pedestal.',
      source: 'Witness statements',
      suspectIds: ['amara-nwosu', 'miriam-bello'],
      evidenceIds: ['display-pedestal'],
      isContradiction: false,
    },
    {
      id: 'vm-tl-3',
      time: '9:15 PM',
      description: 'Polaroid snapshot taken in reading hall shows Dr. Okoro holding original master key ring (#V-409) in his cardigan pocket.',
      source: 'Polaroid photograph',
      suspectIds: ['miriam-bello'],
      evidenceIds: ['preview-photograph'],
      isContradiction: false,
    },
    {
      id: 'vm-tl-4',
      time: '9:25 PM',
      description: 'Prof. Chinedu Okafor tears a research note from his pad while discussing folio citations with colleagues.',
      source: 'Chinedu Okafor statement',
      suspectIds: ['chinedu-okafor'],
      evidenceIds: ['torn-notebook-page'],
      isContradiction: false,
    },
    {
      id: 'vm-tl-5',
      time: '9:30 PM',
      description: 'Prof. Chinedu Okafor leans against the vault display casing to inspect marginal annotations under magnification.',
      source: 'Witness account',
      suspectIds: ['chinedu-okafor'],
      evidenceIds: ['vault-glass-casing', 'torn-notebook-page'],
      isContradiction: false,
    },
    {
      id: 'vm-tl-6',
      time: '9:45 PM',
      description: 'Swift Express courier delivers a 14kg package (Waybill #SE-9942) to the security desk addressed to David Mensah.',
      source: 'Courier waybill',
      suspectIds: ['david-mensah', 'samuel-adekunle'],
      evidenceIds: ['courier-delivery-manifest', 'scanner-shipping-box'],
      isContradiction: false,
    },
    {
      id: 'vm-tl-7',
      time: '10:00 PM',
      description: 'David Mensah arrives at library building. Samuel Adekunle severs page 14 from the visitor register binder.',
      source: 'Security register binder',
      suspectIds: ['david-mensah', 'samuel-adekunle'],
      evidenceIds: ['visitor-register-log'],
      isContradiction: true,
      contradictsSuspectId: 'david-mensah',
    },
    {
      id: 'vm-tl-8',
      time: '10:10 PM',
      description: 'Amara Nwosu settles at reading table 4 to catalogue reference boxes. Miriam Bello steps into conservation room.',
      source: 'Catalog log sheet',
      suspectIds: ['amara-nwosu', 'miriam-bello'],
      evidenceIds: ['archival-catalog-notes', 'abandoned-wine-glass'],
      isContradiction: false,
    },
    {
      id: 'vm-tl-9',
      time: '10:12 PM',
      description: 'Samuel Adekunle resets sub-panel 3 breaker. Electrical outage begins; electronic mag-locks disengage across vault doors.',
      source: 'Power panel log',
      suspectIds: ['samuel-adekunle'],
      evidenceIds: ['power-substation-log', 'digital-access-log'],
      isContradiction: true,
      contradictsSuspectId: 'samuel-adekunle',
    },
    {
      id: 'vm-tl-10',
      time: '10:14 PM',
      description: 'Duplicated brass key #V-409 unlocks vault mechanical latch. Manuscript removed and taken to service annex for scanning.',
      source: 'Forensic reconstruction',
      suspectIds: ['miriam-bello'],
      evidenceIds: ['duplicated-vault-key', 'locksmith-receipt'],
      isContradiction: false,
    },
    {
      id: 'vm-tl-11',
      time: '10:15 PM',
      description: 'Courtyard motion sensor records service exit door opening and closing as digitized files and scanner are cleared.',
      source: 'Courtyard motion sensor',
      suspectIds: ['miriam-bello', 'david-mensah'],
      evidenceIds: ['service-door-sensor', 'scanner-shipping-box'],
      isContradiction: false,
    },
    {
      id: 'vm-tl-12',
      time: '10:16 PM',
      description: 'Circuit breaker reset completes. Main electrical power and digital RFID logging resume across all library sectors.',
      source: 'Power panel log',
      suspectIds: ['samuel-adekunle'],
      evidenceIds: ['power-substation-log', 'digital-access-log'],
      isContradiction: false,
    },
    {
      id: 'vm-tl-13',
      time: '10:25 PM',
      description: 'Miriam Bello re-enters main reading hall from rear conservation corridor and joins guests for refreshments.',
      source: 'Witness account',
      suspectIds: ['miriam-bello'],
      evidenceIds: [],
      isContradiction: false,
    },
    {
      id: 'vm-tl-14',
      time: '10:40 PM',
      description: 'Dr. Okoro enters archival vault with David Mensah to present manuscript and discovers glass pedestal empty.',
      source: 'Dr. Okoro statement',
      suspectIds: ['david-mensah'],
      evidenceIds: ['display-pedestal'],
      isContradiction: false,
    },
  ],

  // ─── Solution ──────────────────────────────────────────────────────────────

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

  // ─── Hidden Relationships ──────────────────────────────────────────────────

  hiddenRelationships: [
    {
      sourceId: 'miriam-bello',
      targetId: 'david-mensah',
      relationshipType: 'Illicit Digitization Pact',
      description: 'Miriam Bello agreed to digitize the manuscript for David Mensah in exchange for £50,000.',
      requiresEvidenceIds: ['locksmith-receipt', 'courier-delivery-manifest', 'publishers-contract'],
    },
    {
      sourceId: 'samuel-adekunle',
      targetId: 'david-mensah',
      relationshipType: 'Register Tampering Bribe',
      description: 'Samuel Adekunle tore out page 14 of the visitor register to conceal David Mensah\'s early 9:40 PM arrival.',
      requiresEvidenceIds: ['visitor-register-log', 'courier-delivery-manifest'],
    },
  ],

  // ─── Deduction Requirements ────────────────────────────────────────────────

  deductionRequirements: [
    {
      id: 'req-access-method',
      title: 'Vault Access & Key Duplication',
      description: 'Establish that Dr. Okoro retained his original key, while Miriam used a duplicated key cut 10 days prior.',
      requiredEvidenceIds: ['preview-photograph', 'duplicated-vault-key', 'locksmith-receipt'],
    },
    {
      id: 'req-removal-window',
      title: 'Power Outage & Removal Window',
      description: 'Identify the 10:12–10:15 PM power interruption as the window when mag-locks dropped and courtyard exit occurred.',
      requiredEvidenceIds: ['power-substation-log', 'digital-access-log', 'service-door-sensor'],
    },
    {
      id: 'req-red-herring',
      title: 'Red Herring Identification',
      description: 'Recognize that Chinedu Okafor\'s fingerprints and torn page were left during his 9:30 PM examination.',
      requiredEvidenceIds: ['vault-glass-casing', 'torn-notebook-page', 'academic-critique-draft'],
    },
  ],
};
