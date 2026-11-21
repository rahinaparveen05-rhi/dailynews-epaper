import { NewspaperArticle, NewspaperCategory, NewspaperEdition } from '../types/newspaper';

export const NEWSPAPER_CATEGORIES: NewspaperCategory[] = [
  'Front Page',
  'Nation',
  'World',
  'Business',
  'Editorial',
  'Science & Tech',
  'Sports',
  'Arts & Culture',
];

const IMG_PARLIAMENT = '/src/assets/images/news_parliament_summit_1795184945038.jpg';
const IMG_SOLAR = '/src/assets/images/news_solar_grid_1795184943960.jpg';
const IMG_METRO = '/src/assets/images/news_metro_transit_1795184944581.jpg';
const IMG_LAB = '/src/assets/images/news_quantum_lab_1795184944250.jpg';

const BASE_EDITIONS: NewspaperEdition[] = [
  {
    id: '2026-11-20',
    isoDate: '2026-11-20',
    formattedDate: 'Nov 20, 2026',
    dayOfWeek: 'Friday',
    volumeLabel: 'Vol. 148 · No. 276',
    cityEdition: 'Chennai · New Delhi · Bengaluru · Mumbai',
    totalPages: 8,
    pages: [
      {
        pageNumber: 1,
        section: 'Front Page',
        pageTitle: 'Front Page · National & Policy',
        leadHeadline: 'Twelve States Formalize Unified Clean Power Grid Pact',
        articles: [
          {
            id: '2026-11-20-p1-lead',
            editionId: '2026-11-20',
            editionDate: 'Nov 20, 2026',
            pageNumber: 1,
            section: 'Front Page',
            headline: 'Twelve States Formalize Unified Clean Power Grid Pact',
            deck: 'Regional transmission operators agree on shared solar balancing reserves and automated peak dispatch protocols.',
            byline: 'By Special Correspondent',
            location: 'New Delhi',
            readMinutes: 4,
            isLead: true,
            imageUrl: IMG_PARLIAMENT,
            imageCaption: 'Delegates convene at the National Energy & Infrastructure Conclave in New Delhi on Thursday morning.',
            paragraphs: [
              'Energy ministers and transmission planners from twelve states signed a landmark interstate balancing agreement on Thursday, creating a unified dispatch corridor for utility-scale solar and wind generation across regional grids.',
              'Under the five-year framework, participating utilities will pool spinning reserves and adopt millisecond-level automated frequency control, curbing evening curtailment by an estimated 28 percent during peak summer and winter demand windows.',
              'Senior grid engineers noted that high-voltage direct current links connecting western solar parks with southern manufacturing belts will enter full synchronized operation by early next quarter, lowering wholesale peak tariffs for municipal distribution companies.',
              'The pact also establishes an open transparency ledger publishing hourly renewable absorption metrics and transmission congestion costs for independent power producers and state regulators.',
            ],
          },
          {
            id: '2026-11-20-p1-sec1',
            editionId: '2026-11-20',
            editionDate: 'Nov 20, 2026',
            pageNumber: 1,
            section: 'Front Page',
            headline: 'Coastal Solar Corridors Double Storage Backing',
            deck: 'Battery-coupled substations near major industrial ports complete commissioning trials.',
            byline: 'By Infrastructure Bureau',
            location: 'Chennai',
            readMinutes: 3,
            imageUrl: IMG_SOLAR,
            imageCaption: 'High-voltage transmission lines cross utility-scale solar arrays at sunrise.',
            paragraphs: [
              'Utility engineers commissioned 1.4 gigawatt-hours of grid-scale battery storage adjacent to coastal solar arrays this week, ensuring steady voltage support for desalination plants and freight terminals.',
              'Officials confirmed that two additional feeder substations will connect to the regional grid ahead of the industrial manufacturing season.',
            ],
          },
          {
            id: '2026-11-20-p1-sec2',
            editionId: '2026-11-20',
            editionDate: 'Nov 20, 2026',
            pageNumber: 1,
            section: 'Front Page',
            headline: 'Public Libraries Cross Two Million Digital Loans',
            deck: 'State-wide open eBook and academic journal lending initiative expands to rural reading rooms.',
            byline: 'By Education Desk',
            location: 'Bengaluru',
            readMinutes: 2,
            paragraphs: [
              'District public library networks recorded over two million digital monograph and newspaper archive loans this year following the rollout of multilingual reading terminals across 640 taluk centres.',
              'Librarians reported strong student adoption of exam preparation collections and regional literature archives.',
            ],
          },
        ],
      },
      {
        pageNumber: 2,
        section: 'Nation',
        pageTitle: 'Nation · Urban Infrastructure & Governance',
        leadHeadline: 'Urban Rail Corridors Expand Peak Commuter Capacity by 40%',
        articles: [
          {
            id: '2026-11-20-p2-lead',
            editionId: '2026-11-20',
            editionDate: 'Nov 20, 2026',
            pageNumber: 2,
            section: 'Nation',
            headline: 'Urban Rail Corridors Expand Peak Commuter Capacity by 40%',
            deck: 'Automated signalling upgrades trim morning headways to under three minutes across elevated metro viaducts.',
            byline: 'By Metro Desk',
            location: 'Chennai',
            readMinutes: 4,
            isLead: true,
            imageUrl: IMG_METRO,
            imageCaption: 'A commuter metro train crosses an elevated coastal viaduct during morning peak hours.',
            paragraphs: [
              'Metropolitan transit authorities completed communication-based train control trials on two high-density commuter corridors, enabling three-minute intervals during morning and evening rush hours without adding rolling stock.',
              'Ridership telemetry collected over the past ninety days showed average door-to-door commute durations dropping by 19 minutes for passengers transferring from suburban rail hubs.',
              'Municipal planners are pairing the faster rail schedules with dedicated shaded pedestrian walkways and unified smart-card fare integration across feeder electric buses.',
            ],
          },
          {
            id: '2026-11-20-p2-sec1',
            editionId: '2026-11-20',
            editionDate: 'Nov 20, 2026',
            pageNumber: 2,
            section: 'Nation',
            headline: 'River Basin Telemetry Sensors Track Groundwater Recovery',
            deck: 'Open hydrological dashboards give district councils real-time aquifer readings.',
            byline: 'By Civic Affairs Reporter',
            location: 'Hyderabad',
            readMinutes: 3,
            paragraphs: [
              'Hydrologists deployed 850 automated piezometer stations across semi-arid agricultural blocks, streaming hourly water-table depth measurements to district panchayats.',
              'Early readings confirm strong post-monsoon recharge along check-dam belts rehabilitated over the past two years.',
            ],
          },
        ],
      },
      {
        pageNumber: 3,
        section: 'World',
        pageTitle: 'World · Diplomacy & Maritime Trade',
        leadHeadline: 'Maritime Trade Pact Sets Unified Electronic Customs Standards',
        articles: [
          {
            id: '2026-11-20-p3-lead',
            editionId: '2026-11-20',
            editionDate: 'Nov 20, 2026',
            pageNumber: 3,
            section: 'World',
            headline: 'Maritime Trade Pact Sets Unified Electronic Customs Standards',
            deck: 'Eighteen port authorities adopt interoperable bills of lading to cut container dwell times.',
            byline: 'By Diplomatic Editor',
            location: 'Singapore',
            readMinutes: 4,
            isLead: true,
            paragraphs: [
              'Trade delegates representing eighteen Indo-Pacific and European maritime hubs finalized a common electronic manifest standard designed to clear perishable cargo shipments before vessels dock.',
              'Port economists estimate the paperless verification protocol could shave up to fourteen hours off average container dwell time, easing supply chain costs for medium-sized exporters.',
              'Pilot corridors linking Chennai, Colombo, Rotterdam, and Singapore will transition to full digital clearance next month.',
            ],
          },
          {
            id: '2026-11-20-p3-sec1',
            editionId: '2026-11-20',
            editionDate: 'Nov 20, 2026',
            pageNumber: 3,
            section: 'World',
            headline: 'Alpine Rail Tunnel Completes Cross-Border Freight Trial',
            deck: 'Electric locomotives haul 1,600-tonne freight consist along low-gradient alignment.',
            byline: 'By International Desk',
            location: 'Zurich',
            readMinutes: 3,
            paragraphs: [
              'European rail operators completed continuous high-load freight testing along the newly electrified trans-alpine corridor, shifting thousands of long-haul truck journeys onto zero-emission rail.',
            ],
          },
        ],
      },
      {
        pageNumber: 4,
        section: 'Business',
        pageTitle: 'Business · Industry & Markets',
        leadHeadline: 'Semiconductor Packaging Clusters Attract Fresh Capital',
        articles: [
          {
            id: '2026-11-20-p4-lead',
            editionId: '2026-11-20',
            editionDate: 'Nov 20, 2026',
            pageNumber: 4,
            section: 'Business',
            headline: 'Semiconductor Packaging Clusters Attract Fresh Capital',
            deck: 'Outsourced assembly and test plants expand capacity for automotive power electronics.',
            byline: 'By Business Bureau',
            location: 'Mumbai',
            readMinutes: 4,
            isLead: true,
            paragraphs: [
              'Domestic electronics manufacturing consortia announced ₹14,200 crore in fresh capital commitments for chiplet packaging and power-module testing lines across three industrial corridors.',
              'Industry analysts noted rising global demand for silicon-carbide inverters used in electric transit buses, industrial robotics, and grid-scale solar installations.',
              'Engineering universities near the clusters are introducing specialized cleanroom instrumentation fellowships for graduating B.Tech cohorts.',
            ],
          },
          {
            id: '2026-11-20-p4-sec1',
            editionId: '2026-11-20',
            editionDate: 'Nov 20, 2026',
            pageNumber: 4,
            section: 'Business',
            headline: 'Cooperative Dairy Exports Rise on Cold-Chain Upgrades',
            deck: 'Solar-powered village chilling units preserve milk quality across remote districts.',
            byline: 'By Agri-Business Desk',
            location: 'Anand',
            readMinutes: 3,
            paragraphs: [
              'Village dairy cooperatives reported a 16 percent jump in value-added exports after deploying off-grid solar chilling stations that cut spoilage during summer afternoon collections.',
            ],
          },
        ],
      },
      {
        pageNumber: 5,
        section: 'Editorial',
        pageTitle: 'Editorial & Opinion',
        leadHeadline: 'Investing in Resilient Public Transit for Growing Cities',
        articles: [
          {
            id: '2026-11-20-p5-lead',
            editionId: '2026-11-20',
            editionDate: 'Nov 20, 2026',
            pageNumber: 5,
            section: 'Editorial',
            headline: 'Investing in Resilient Public Transit for Growing Cities',
            deck: 'High-capacity rail lines yield their greatest civic dividend when paired with reliable neighbourhood buses and walkable streets.',
            byline: 'Editorial Board',
            location: 'Chennai',
            readMinutes: 5,
            isLead: true,
            paragraphs: [
              'Elevated metro lines have reshaped the skylines of India’s fastest-growing urban centres, offering air-conditioned predictability across congested arterial roads. Yet rail viaducts alone cannot solve metropolitan mobility.',
              'For commuters living three kilometres from the nearest station, the true test of public transport lies in the quality of the first and last mile. Frequent electric feeder buses, safe continuous footpaths, and a single fare card across modes are what convert occasional riders into lifelong transit users.',
              'Municipal transport authorities should publish quarterly corridor integration scorecards alongside ridership milestones, treating street-level accessibility with the same engineering rigour applied to underground tunnelling.',
            ],
          },
          {
            id: '2026-11-20-p5-sec1',
            editionId: '2026-11-20',
            editionDate: 'Nov 20, 2026',
            pageNumber: 5,
            section: 'Editorial',
            headline: 'Open Data as Civic Infrastructure',
            deck: 'Transparent environmental and transit telemetry strengthens public accountability.',
            byline: 'By Guest Columnist · Dr. Kavitha Rao',
            location: 'Bengaluru',
            readMinutes: 4,
            paragraphs: [
              'When air-quality monitors, groundwater sensors, and bus arrival feeds are published in open machine-readable formats, university researchers and civic volunteers become active partners in urban problem-solving.',
            ],
          },
        ],
      },
      {
        pageNumber: 6,
        section: 'Science & Tech',
        pageTitle: 'Science & Technology',
        leadHeadline: 'Indigenous Photonics Lab Demonstrates Room-Temp Optical Sensor',
        articles: [
          {
            id: '2026-11-20-p6-lead',
            editionId: '2026-11-20',
            editionDate: 'Nov 20, 2026',
            pageNumber: 6,
            section: 'Science & Tech',
            headline: 'Indigenous Photonics Lab Demonstrates Room-Temp Optical Sensor',
            deck: 'Compact waveguide chip detects trace waterborne contaminants in under ninety seconds without cryogenic cooling.',
            byline: 'By Science Correspondent',
            location: 'Bengaluru',
            readMinutes: 4,
            isLead: true,
            imageUrl: IMG_LAB,
            imageCaption: 'Researchers align precision optical benches inside the photonics testing laboratory.',
            paragraphs: [
              'A multidisciplinary team of physicists and electrical engineers has validated a palm-sized silicon-nitride photonics sensor capable of identifying heavy-metal traces and bacterial markers in rural drinking-water samples within ninety seconds.',
              'Unlike legacy laboratory spectrometers that require bulky cooling modules and trained technicians, the prototype operates on a standard USB-C battery pack and streams diagnostic spectra to a tablet companion app.',
              'Field validation trials across forty primary health centres are scheduled to begin in January.',
            ],
          },
          {
            id: '2026-11-20-p6-sec1',
            editionId: '2026-11-20',
            editionDate: 'Nov 20, 2026',
            pageNumber: 6,
            section: 'Science & Tech',
            headline: 'Open-Source Compiler Tooling Cuts Embedded Firmware Footprint',
            deck: 'Student maintainers release deterministic static analyzer for microcontroller boards.',
            byline: 'By Technology Desk',
            location: 'Pune',
            readMinutes: 3,
            paragraphs: [
              'A coalition of university systems groups released an open-source linker optimization pass that trims binary sizes by 18 percent on resource-constrained IoT sensor nodes.',
            ],
          },
        ],
      },
      {
        pageNumber: 7,
        section: 'Sports',
        pageTitle: 'Sports · Cricket, Athletics & Chess',
        leadHeadline: 'Patience and Seam Discipline Seal Crucial Test Series Lead',
        articles: [
          {
            id: '2026-11-20-p7-lead',
            editionId: '2026-11-20',
            editionDate: 'Nov 20, 2026',
            pageNumber: 7,
            section: 'Sports',
            headline: 'Patience and Seam Discipline Seal Crucial Test Series Lead',
            deck: 'Relentless fourth-stump lines and a measured century on a wearing surface turn the final session decisively.',
            byline: 'By Sports Correspondent',
            location: 'Mumbai',
            readMinutes: 4,
            isLead: true,
            paragraphs: [
              'On a fifth-day pitch offering uneven bounce and subtle reverse swing, disciplined seam bowling in the post-tea session wrapped up the final four wickets inside eleven overs to seal a 94-run victory.',
              'Earlier in the match, an unbroken 142-run fourth-wicket partnership built on soft hands and brisk running between the wickets established the decisive cushion.',
              'The teams travel south next week for the third Test under cooler coastal conditions.',
            ],
          },
          {
            id: '2026-11-20-p7-sec1',
            editionId: '2026-11-20',
            editionDate: 'Nov 20, 2026',
            pageNumber: 7,
            section: 'Sports',
            headline: 'Teenage Grandmasters Share Lead at Classical Open',
            deck: 'Bold central pawn sacrifices highlight round six encounters in Chennai.',
            byline: 'By Chess Desk',
            location: 'Chennai',
            readMinutes: 2,
            paragraphs: [
              'Three teenage grandmasters remain tied atop the standings after round six following sharp tactical endgames that stretched past five hours.',
            ],
          },
        ],
      },
      {
        pageNumber: 8,
        section: 'Arts & Culture',
        pageTitle: 'Arts, Literature & Weekend Digest',
        leadHeadline: 'Restored Heritage Printing Press Opens Typographic Archive',
        articles: [
          {
            id: '2026-11-20-p8-lead',
            editionId: '2026-11-20',
            editionDate: 'Nov 20, 2026',
            pageNumber: 8,
            section: 'Arts & Culture',
            headline: 'Restored Heritage Printing Press Opens Typographic Archive',
            deck: 'Century-old metal typefaces and broadsheet specimen sheets go on public display for design students.',
            byline: 'By Culture Correspondent',
            location: 'Kochi',
            readMinutes: 3,
            isLead: true,
            paragraphs: [
              'Conservators have restored a nineteenth-century letterpress workshop into a living typographic museum housing over 1,200 drawers of multilingual lead and wood movable type.',
              'Weekend workshops invite typography students and journalists to examine how early broadsheet grid geometry evolved alongside mechanical typesetting.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: '2026-11-19',
    isoDate: '2026-11-19',
    formattedDate: 'Nov 19, 2026',
    dayOfWeek: 'Thursday',
    volumeLabel: 'Vol. 148 · No. 275',
    cityEdition: 'Chennai · New Delhi · Bengaluru · Mumbai',
    totalPages: 4,
    pages: [
      {
        pageNumber: 1,
        section: 'Front Page',
        pageTitle: 'Front Page · Water & Climate',
        leadHeadline: 'Monsoon Reservoir Levels Reach Five-Year High Across Southern Basins',
        articles: [
          {
            id: '2026-11-19-p1-lead',
            editionId: '2026-11-19',
            editionDate: 'Nov 19, 2026',
            pageNumber: 1,
            section: 'Front Page',
            headline: 'Monsoon Reservoir Levels Reach Five-Year High Across Southern Basins',
            deck: 'Sustained catchment inflows bolster municipal drinking water supply and winter rabi irrigation.',
            byline: 'By State Bureau',
            location: 'Chennai',
            readMinutes: 4,
            isLead: true,
            imageUrl: IMG_SOLAR,
            imageCaption: 'Solar-assisted canal pump stations operate alongside replenished southern catchment reservoirs.',
            paragraphs: [
              'Water resources engineers confirmed that major reservoirs across the southern peninsula stand at 89 percent combined storage capacity following steady late-season catchment rains.',
              'Municipal planners noted that urban drinking-water reserves are secured through next summer, allowing agricultural boards to release timely canal schedules for winter crops.',
            ],
          },
        ],
      },
      {
        pageNumber: 2,
        section: 'Nation',
        pageTitle: 'Nation · Heritage Digitization',
        leadHeadline: 'Public Libraries Digitize 40,000 Rare Regional Manuscripts',
        articles: [
          {
            id: '2026-11-19-p2-lead',
            editionId: '2026-11-19',
            editionDate: 'Nov 19, 2026',
            pageNumber: 2,
            section: 'Nation',
            headline: 'Public Libraries Digitize 40,000 Rare Regional Manuscripts',
            deck: 'High-resolution optical scanning makes centuries-old palm-leaf treatises searchable online.',
            byline: 'By Culture & Archival Desk',
            location: 'Thanjavur',
            readMinutes: 3,
            isLead: true,
            paragraphs: [
              'Archivists completed high-resolution multispectral imaging of 40,000 historical manuscripts, publishing open-access catalogues for scholars worldwide.',
            ],
          },
        ],
      },
      {
        pageNumber: 3,
        section: 'Business',
        pageTitle: 'Business · Trade & FinTech',
        leadHeadline: 'Small Exporters Adopt Instant Cross-Border Invoice Settlement',
        articles: [
          {
            id: '2026-11-19-p3-lead',
            editionId: '2026-11-19',
            editionDate: 'Nov 19, 2026',
            pageNumber: 3,
            section: 'Business',
            headline: 'Small Exporters Adopt Instant Cross-Border Invoice Settlement',
            deck: 'Bilateral payment rails compress settlement cycles from four days to under fifteen minutes.',
            byline: 'By Finance Correspondent',
            location: 'Mumbai',
            readMinutes: 3,
            isLead: true,
            paragraphs: [
              'Textile and precision-engineering exporters in tier-two hubs reported lower working-capital costs after adopting instant cross-border trade settlement corridors.',
            ],
          },
        ],
      },
      {
        pageNumber: 4,
        section: 'Sports',
        pageTitle: 'Sports · National Athletics',
        leadHeadline: 'Junior Athletics Meet Sees Three National Youth Records Fall',
        articles: [
          {
            id: '2026-11-19-p4-lead',
            editionId: '2026-11-19',
            editionDate: 'Nov 19, 2026',
            pageNumber: 4,
            section: 'Sports',
            headline: 'Junior Athletics Meet Sees Three National Youth Records Fall',
            deck: 'Middle-distance runners shine on cool evening track conditions in Bhubaneswar.',
            byline: 'By Athletics Desk',
            location: 'Bhubaneswar',
            readMinutes: 3,
            isLead: true,
            paragraphs: [
              'Under-20 track athletes shattered three long-standing national marks in the 1,500m, 400m hurdles, and javelin throw during Thursday’s finals.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: '2026-11-18',
    isoDate: '2026-11-18',
    formattedDate: 'Nov 18, 2026',
    dayOfWeek: 'Wednesday',
    volumeLabel: 'Vol. 148 · No. 274',
    cityEdition: 'Chennai · New Delhi · Bengaluru · Mumbai',
    totalPages: 4,
    pages: [
      {
        pageNumber: 1,
        section: 'Front Page',
        pageTitle: 'Front Page · Higher Education & R&D',
        leadHeadline: 'University Innovation Hubs Double Patent Filings in 2026',
        articles: [
          {
            id: '2026-11-18-p1-lead',
            editionId: '2026-11-18',
            editionDate: 'Nov 18, 2026',
            pageNumber: 1,
            section: 'Front Page',
            headline: 'University Innovation Hubs Double Patent Filings in 2026',
            deck: 'Engineering campuses lead applied research in clean water filtration and embedded medical hardware.',
            byline: 'By Education Correspondent',
            location: 'Bengaluru',
            readMinutes: 4,
            isLead: true,
            imageUrl: IMG_LAB,
            imageCaption: 'Student engineers test optical water filtration prototypes inside a campus innovation bay.',
            paragraphs: [
              'Public and autonomous engineering institutes recorded a two-fold rise in granted utility patents this year, driven by final-year capstone teams partnering directly with rural clinics and municipal water boards.',
              'Faculty mentors credited shared fabrication workshops and open testing grants for turning student prototypes into deployable hardware.',
            ],
          },
        ],
      },
      {
        pageNumber: 2,
        section: 'Nation',
        pageTitle: 'Nation · Railways & Logistics',
        leadHeadline: 'Dedicated Freight Corridors Cut Port-to-Inland Transit Times',
        articles: [
          {
            id: '2026-11-18-p2-lead',
            editionId: '2026-11-18',
            editionDate: 'Nov 18, 2026',
            pageNumber: 2,
            section: 'Nation',
            headline: 'Dedicated Freight Corridors Cut Port-to-Inland Transit Times',
            deck: 'Double-stack electric container rakes maintain 75 km/h average schedule speed.',
            byline: 'By Transport Desk',
            location: 'New Delhi',
            readMinutes: 3,
            isLead: true,
            paragraphs: [
              'Double-stack electrified freight trains operating on separated corridors trimmed inland container transit schedules by 35 percent compared to mixed-traffic tracks.',
            ],
          },
        ],
      },
      {
        pageNumber: 3,
        section: 'Editorial',
        pageTitle: 'Editorial & Opinion',
        leadHeadline: 'Bridging Classroom Theory and Applied Engineering',
        articles: [
          {
            id: '2026-11-18-p3-lead',
            editionId: '2026-11-18',
            editionDate: 'Nov 18, 2026',
            pageNumber: 3,
            section: 'Editorial',
            headline: 'Bridging Classroom Theory and Applied Engineering',
            deck: 'Undergraduate projects flourish when students build software and hardware for real civic problems.',
            byline: 'Editorial Board',
            location: 'Chennai',
            readMinutes: 4,
            isLead: true,
            paragraphs: [
              'When computer science and engineering undergraduates tackle tangible civic challenges—from accessible public transit planners to offline educational readers—their coursework gains lasting purpose.',
            ],
          },
        ],
      },
      {
        pageNumber: 4,
        section: 'Science & Tech',
        pageTitle: 'Science & Tech',
        leadHeadline: 'Open Meteorological Models Improve Coastal Cyclone Tracking',
        articles: [
          {
            id: '2026-11-18-p4-lead',
            editionId: '2026-11-18',
            editionDate: 'Nov 18, 2026',
            pageNumber: 4,
            section: 'Science & Tech',
            headline: 'Open Meteorological Models Improve Coastal Cyclone Tracking',
            deck: 'Ensemble forecasting narrows 72-hour landfall error cone by twenty kilometres.',
            byline: 'By Science Desk',
            location: 'Pune',
            readMinutes: 3,
            isLead: true,
            paragraphs: [
              'Atmospheric physicists combined buoy telemetry with high-resolution satellite scatterometry to deliver sharper rainfall alerts to coastal fishing harbours.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: '2026-11-17',
    isoDate: '2026-11-17',
    formattedDate: 'Nov 17, 2026',
    dayOfWeek: 'Tuesday',
    volumeLabel: 'Vol. 148 · No. 273',
    cityEdition: 'Chennai · New Delhi · Bengaluru · Mumbai',
    totalPages: 4,
    pages: [
      {
        pageNumber: 1,
        section: 'Front Page',
        pageTitle: 'Front Page · Civic & Urban Mobility',
        leadHeadline: 'Electric Bus Fleets Cross Five Thousand Daily Routes Nationwide',
        articles: [
          {
            id: '2026-11-17-p1-lead',
            editionId: '2026-11-17',
            editionDate: 'Nov 17, 2026',
            pageNumber: 1,
            section: 'Front Page',
            headline: 'Electric Bus Fleets Cross Five Thousand Daily Routes Nationwide',
            deck: 'Low-floor zero-emission coaches cut urban diesel consumption across thirty-two cities.',
            byline: 'By Urban Transport Bureau',
            location: 'Pune',
            readMinutes: 4,
            isLead: true,
            imageUrl: IMG_METRO,
            imageCaption: 'Modernized rapid transit corridors integrate metro viaducts with electric bus bays.',
            paragraphs: [
              'State transport undertakings surpassed five thousand scheduled zero-emission bus routes on Tuesday, backed by fast-charging depot transformers powered by daytime solar contracts.',
              'Commuter surveys highlight quieter cabin acoustics and real-time arrival displays at major interchanges.',
            ],
          },
        ],
      },
      {
        pageNumber: 2,
        section: 'World',
        pageTitle: 'World · Global Science',
        leadHeadline: 'Arctic Climate Observatory Publishes Decadal Ice-Core Dataset',
        articles: [
          {
            id: '2026-11-17-p2-lead',
            editionId: '2026-11-17',
            editionDate: 'Nov 17, 2026',
            pageNumber: 2,
            section: 'World',
            headline: 'Arctic Climate Observatory Publishes Decadal Ice-Core Dataset',
            deck: 'Open archive aids atmospheric researchers modelling polar jet-stream shifts.',
            byline: 'By Science & World Desk',
            location: 'Oslo',
            readMinutes: 3,
            isLead: true,
            paragraphs: [
              'International glaciologists released ten years of continuous isotopic ice-core measurements into the public domain for climate researchers.',
            ],
          },
        ],
      },
      {
        pageNumber: 3,
        section: 'Business',
        pageTitle: 'Business · Manufacturing',
        leadHeadline: 'Precision Tooling Exports Register Steady Quarterly Growth',
        articles: [
          {
            id: '2026-11-17-p3-lead',
            editionId: '2026-11-17',
            editionDate: 'Nov 17, 2026',
            pageNumber: 3,
            section: 'Business',
            headline: 'Precision Tooling Exports Register Steady Quarterly Growth',
            deck: 'Mid-sized machine shops win multi-year medical and aerospace component contracts.',
            byline: 'By Industry Correspondent',
            location: 'Coimbatore',
            readMinutes: 3,
            isLead: true,
            paragraphs: [
              'Precision CNC machining clusters in southern India expanded export order books by 14 percent year-on-year following ISO clean-room certifications.',
            ],
          },
        ],
      },
      {
        pageNumber: 4,
        section: 'Arts & Culture',
        pageTitle: 'Arts & Culture',
        leadHeadline: 'December Music Season Announces Young Artist Fellowship Series',
        articles: [
          {
            id: '2026-11-17-p4-lead',
            editionId: '2026-11-17',
            editionDate: 'Nov 17, 2026',
            pageNumber: 4,
            section: 'Arts & Culture',
            headline: 'December Music Season Announces Young Artist Fellowship Series',
            deck: 'Forty-eight vocalists and instrumentalists selected for morning acoustic recitals.',
            byline: 'By Arts Desk',
            location: 'Chennai',
            readMinutes: 3,
            isLead: true,
            paragraphs: [
              'Sabha organizers unveiled an expanded morning concert series dedicated to emerging classical musicians and rare compositional archives.',
            ],
          },
        ],
      },
    ],
  },
];

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const SHORT_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function getLocalDateKey(referenceDate: Date = new Date()): string {
  const year = referenceDate.getFullYear();
  const month = String(referenceDate.getMonth() + 1).padStart(2, '0');
  const day = String(referenceDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function buildDateInfo(referenceDate: Date, daysAgo: number) {
  const d = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate() - daysAgo,
  );
  const year = d.getFullYear();
  const monthIdx = d.getMonth();
  const dayNum = d.getDate();
  const isoDate = getLocalDateKey(d);
  const formattedDate = `${SHORT_MONTHS[monthIdx]} ${dayNum}, ${year}`;
  const dayOfWeek = DAY_NAMES[d.getDay()];
  const startOfYear = new Date(year, 0, 1);
  const dayOfYear = Math.floor((d.getTime() - startOfYear.getTime()) / 86_400_000) + 1;
  const volumeNum = 148 + (year - 2026);
  const volumeLabel = `Vol. ${volumeNum} · No. ${dayOfYear}`;
  return { isoDate, formattedDate, dayOfWeek, volumeLabel };
}

export function buildEditionsForDate(referenceDate: Date = new Date()): NewspaperEdition[] {
  return BASE_EDITIONS.map((edition, index) => {
    const info = buildDateInfo(referenceDate, index);
    return {
      ...edition,
      isoDate: info.isoDate,
      formattedDate: info.formattedDate,
      dayOfWeek: info.dayOfWeek,
      volumeLabel: info.volumeLabel,
      pages: edition.pages.map((page) => ({
        ...page,
        articles: page.articles.map((article) => ({
          ...article,
          editionDate: info.formattedDate,
        })),
      })),
    };
  });
}

export const EDITIONS: NewspaperEdition[] = buildEditionsForDate();

export function getAllArticles(editionsList: NewspaperEdition[] = EDITIONS): NewspaperArticle[] {
  return editionsList.flatMap((edition) =>
    edition.pages.flatMap((page) => page.articles),
  );
}
