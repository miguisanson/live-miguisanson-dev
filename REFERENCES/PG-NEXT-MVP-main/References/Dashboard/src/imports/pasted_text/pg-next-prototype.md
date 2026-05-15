# PG Next — Complete Prototype Implementation Prompt
### For Use in Figma Make / Lovable / v0

---

## OVERVIEW & CONTEXT

Build a fully functional, high-fidelity **web dashboard prototype** called **"PG Next"** — P&G Philippines' AI-powered consumer intelligence platform for Lazada Fabric Care data. This is a competitive case competition presentation prototype. It must look production-ready, polished, and investor-presentation quality.

---

## BRAND & DESIGN SYSTEM

### Color Palette
```
Primary Blue:     #003DA5   (P&G corporate blue — primary CTAs, sidebar, header)
Secondary Blue:   #0057C8   (hover states, active nav)
Light Blue:       #E8F0FC   (card backgrounds, chip fills)
P&G Red:          #DA291C   (alerts, critical flags, negative indicators)
Amber/Warning:    #F59E0B   (warning signals, medium priority)
Success Green:    #16A34A   (positive trends, improvements)
Dark Navy:        #0A1628   (sidebar background)
White:            #FFFFFF   (main content bg)
Surface Gray:     #F4F6FA   (page background)
Border Gray:      #E2E8F0   (card borders, dividers)
Text Primary:     #1A1A2E   (headings)
Text Secondary:   #64748B   (subtext, labels)
Text Muted:       #94A3B8   (timestamps, metadata)
```

### Typography
```
Font Family: "Inter", sans-serif (fallback: system-ui)
H1 (Page Title):    24px, weight 700, color #1A1A2E
H2 (Section):       18px, weight 600, color #1A1A2E
H3 (Card Title):    14px, weight 600, color #1A1A2E
Body:               13px, weight 400, color #64748B
Label/Caption:      11px, weight 500, color #94A3B8, letter-spacing 0.05em, UPPERCASE
Metric Value:       28px, weight 700, color #1A1A2E
Metric Delta:       13px, weight 600 (green/red based on direction)
```

### Component Styles
```
Border Radius:  Card=12px, Button=8px, Chip=20px, Badge=6px
Card Shadow:    0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)
Card Border:    1px solid #E2E8F0
Sidebar Width:  240px (collapsed: 64px)
Header Height:  60px
Spacing Unit:   8px grid
```

---

## LAYOUT ARCHITECTURE

### Global Shell
```
┌─────────────────────────────────────────────────────┐
│  HEADER (60px) — Logo + Search + User + Alerts      │
├──────────┬──────────────────────────────────────────┤
│          │  FILTER BAR (48px) — Sector / Sub-cat    │
│ SIDEBAR  │  / Date Range chips                      │
│ (240px)  ├──────────────────────────────────────────┤
│          │                                          │
│  Nav     │    MAIN CONTENT AREA                     │
│  Items   │    (scrollable, 16px padding)            │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

### Header (60px, white, border-bottom: 1px solid #E2E8F0)
- **Left:** P&G logo (blue square with "PG" monogram, 32px) + wordmark "PG Next" in #003DA5, weight 700, 16px
- **Center:** Search bar ("Search brands, products, reviews..."), width 400px, bg #F4F6FA, rounded 8px
- **Right:** 
  - Bell icon with badge "3" in red
  - Avatar circle (initials "MR") 
  - Label "Maria Reyes · Brand Manager"

### Sidebar (240px, bg: #0A1628, full height)
Navigation items with icon + label. Active state: bg #003DA5, left border 3px solid #4A9EFF. Hover: bg rgba(255,255,255,0.06).

```
Navigation Items (in order):
─────────────────────────────
[Grid icon]      Brand Overview          ← DEFAULT ACTIVE
[Brain icon]     Intelligence Command    
[Target icon]    Competitor Intel        
[Settings icon]  Operations Dashboard   
─────────────────────────────
[divider]
WORKSPACE
[Database icon]  Data Sources
[BookOpen icon]  Documentation
─────────────────────────────
[bottom]
[HelpCircle]     Help & Support
```

Each nav item: 44px height, 16px horizontal padding, icon 18px in #94A3B8 (active: white), label 13px weight 500 in #94A3B8 (active: white).

Sidebar footer: small text "Last sync: 2 min ago · 75,618 records" in muted blue-gray.

### Global Filter Bar (48px, bg white, border-bottom 1px solid #E2E8F0, sticky)
Displayed below header, above content. Shows:
```
SECTOR:    [● Fabric Care ▼]   
CATEGORY:  [Laundry Detergents ▼]  [Fabric Enhancer ▼]  [Bleach ▼]
DATE:      [Last 30 Days ▼]
           [Mar 2022 – Jun 2024 (Full Dataset)]
```

Chips style: bg #E8F0FC, border 1px solid #C7D9F8, text #003DA5, font 12px weight 500, height 28px, border-radius 20px, with dropdown chevron. Active/selected chip: bg #003DA5, text white.

---

## SCREEN 1: BRAND OVERVIEW DASHBOARD (Default/Home)

### Page Title Row
```
Brand Overview Dashboard                    [Export ↓]  [Share]  [Refresh ↻]
Lazada PH · Fabric Care · Last 30 days · 75,618 reviews ingested
```

### Row 1 — KPI Metric Cards (4 cards, equal width)

#### Card 1: Total Reviews Ingested
```
TOTAL REVIEWS INGESTED
75,618
↑ +12.4% vs prior period
[sparkline: upward trend line, 8 weeks, blue]
Subtitle: "Across 3 subcategories · Lazada PH"
```

#### Card 2: P&G Portfolio Avg Rating
```
P&G PORTFOLIO AVG RATING
4.95 ★
↑ +0.03 vs prior 4 weeks
[5-star visual: 4.95 filled, mini stars row]
Subtitle: "Ariel · Tide · Downy · Breeze"
```

#### Card 3: Active Issues in Queue
```
ACTIVE ISSUE FLAGS
14
↓ -3 resolved this week
[small badge row: 4 Critical 🔴, 6 Warning 🟡, 4 Watch 🔵]
Subtitle: "Across all P&G brands"
```

#### Card 4: Review Velocity (24h)
```
REVIEW VELOCITY
1,247 reviews / 24h
↑ Spike detected on Ariel (+38%)
[mini bar chart: 7-day volume, highlight today]
Subtitle: "vs 7-day avg: 891/day"
```

Each metric card: white bg, 12px border-radius, 20px padding, subtle left accent bar (4px, #003DA5 for neutral, #DA291C for flagged). Bottom row: "What this means →" link in #003DA5, 12px — clicking expands a 2-sentence AI interpretation tooltip.

---

### Row 2 — Brand Rating Trend Chart (full width)

**Card Title:** "Brand Rating Trend — 4-Week Rolling Average"  
**Subtitle:** "P&G vs Competitor Brands · Fabric Care"  
**Chart Type:** Multi-line chart, 16 weeks of data  
**Chart height:** 260px

**Data to plot (use these exact values):**
```
Week ending →   W1    W2    W3    W4    W5    W6    W7    W8
Ariel           4.94  4.95  4.97  4.93  4.96  4.95  4.97  4.95
Tide            4.91  4.90  4.93  4.92  4.94  4.93  4.92  4.93
Downy           4.94  4.96  4.95  4.94  4.97  4.95  4.94  4.96
Breeze          4.95  4.96  4.98  4.97  4.96  4.96  4.97  4.97
Surf            4.94  4.95  4.96  4.94  4.97  4.96  4.95  4.96
Mighty Clean    4.89  4.91  4.92  4.90  4.93  4.91  4.92  4.93
Champion        4.93  4.94  4.95  4.93  4.96  4.95  4.94  4.96
```

**Line colors:**
- Ariel: #003DA5 (solid, 2.5px, P&G)
- Tide: #0057C8 (solid, 2px, P&G)
- Downy: #4A9EFF (solid, 2px, P&G)
- Breeze: #7FBFFF (solid, 2px, P&G)
- Surf: #F59E0B (dashed, 1.5px, Competitor)
- Mighty Clean: #94A3B8 (dashed, 1.5px, Competitor)
- Champion: #CBD5E1 (dashed, 1.5px, Competitor)

Legend below chart: P&G brands grouped left (solid lines), Competitors grouped right (dashed). Legend pills with line preview.

Top-right of card: toggle buttons [P&G Only] [Competitors Only] [All Brands] — selected state bg #003DA5 text white, default bg #F4F6FA.

---

### Row 3 — Left 60% + Right 40% Split

#### LEFT: Issue Priority Queue
**Card Title:** "Issue Priority Queue"  
**Subtitle:** "Ranked by Urgency Score = Severity × Volume"

Display as ranked list, 5 items visible, scrollable:

```
Rank  Brand    Issue                   Severity  Vol   Score   Owner
#1 🔴  Downy   Scent complaints        HIGH      47    141     R&D
        "masyadong malakas ang amoy, hindi ko type yung bango"
        [View Reviews] [Generate Brief →]
        
#2 🔴  Ariel   Packaging leaks         HIGH      31    93      Supply
        "natanggap ko na may leak, butas yung pakete"
        [View Reviews] [Generate Brief →]
        
#3 🟡  Tide    Texture/consistency     MED       28    56      R&D
        "malapot, hindi natutunaw agad sa tubig"
        [View Reviews] [Generate Brief →]
        
#4 🟡  Breeze  Price/value perception  MED       22    44      Marketing
        "mahal na ngayon, hindi na sulit"
        [View Reviews] [Generate Brief →]
        
#5 🔵  Downy   Stock availability      LOW       18    18      Supply
        "wala sa tindahan, out of stock palagi"
        [View Reviews] [Generate Brief →]
```

Each row: white card within card, 8px padding, left colored accent bar (red/amber/blue). Hover: slight bg tint. "Generate Brief →" is a blue text button. Show "NEW" badge (green) on items appearing in past 7 days.

#### RIGHT: Fastest-Moving Issues This Week
**Card Title:** "Fastest-Moving Issues"  
**Subtitle:** "New themes gaining volume this week vs last"

Display as a vertical list of theme pills with delta bars:

```
🔺 Scent complaint (Downy)
   ████████████████  +127% WoW  [238 mentions]

🔺 Dispenser/pump issues
   ████████████  +89% WoW   [156 mentions]

🔺 Reorder/out-of-stock
   ████████  +64% WoW    [98 mentions]

▼  Packaging damage
   ████  -31% WoW     [72 mentions] (improving)

▼  Price complaints  
   ███  -18% WoW      [64 mentions] (improving)
```

Up-trend bars in #DA291C (risk rising), down-trend bars in #16A34A (improving).

---

### Row 4 — 5 Vectors of Superiority

**Card Title:** "5 Vectors of Superiority Scores — P&G Portfolio"  
**Layout:** 5 equal columns, each a mini "vector card"

```
PRODUCT          PACKAGING        COMMUNICATION    RETAIL EXEC      VALUE
★ 4.92/5         ★ 4.71/5         ★ 4.65/5         ★ 4.44/5         ★ 4.38/5

[radial %: 92%]  [radial %: 84%]  [radial %: 79%]  [radial %: 71%]  [radial %: 67%]

▲ +0.04          ▼ -0.08 ⚠️       → Stable         ▼ -0.12 ⚠️       ▼ -0.11 ⚠️
vs prior month   vs prior month   vs prior month   vs prior month   vs prior month

Top keyword:     Top keyword:     Top keyword:     Top keyword:     Top keyword:
"works/epekto"   "butas/leak"     "label claims"   "out of stock"   "mahal/sulit"
```

Each vector card: white bg with thin top border in #003DA5 (or warning color). Radial/donut mini chart for the %, 60px diameter. Warning icon on declining vectors.

---

### Row 5 — Market Operations Strip

**Card Title:** "Market Operations Signals"  

Three signal cards side by side:

**Card A: Competitor In-Market Alert** (red-tinted bg)
```
⚠️ COMPETITOR PROMO DETECTED
Surf — Fabric Enhancer subcategory
Review volume +58% WoW (847 vs 535 avg)
Likely: Campaign or flash sale event
Week of May 20–26, 2024
[Investigate →]
```

**Card B: Clearance/Promo Response Signal** (amber-tinted bg)
```
⚠️ VALUE PERCEPTION GAP
Ariel Laundry — Promo-tagged reviews
Promo reviews avg: 4.71 ★
Non-promo reviews avg: 4.97 ★
Gap: -0.26 pts — Investigate messaging
[View breakdown →]
```

**Card C: Review Velocity Normal** (green-tinted bg)
```
✓ REVIEW VELOCITY NORMAL
Downy Fabric Enhancer
Current: 824 reviews/month
vs 3-month avg: 801 reviews/month
No unusual spike or drop detected
[View trend →]
```

---

## SCREEN 2: INTELLIGENCE COMMAND CENTER

### Page Title Row
```
Intelligence Command Center              [Agent Status: Active 🟢]
Agentic AI Layer · Last action: 4 minutes ago
```

### Top Warning Banner (if any active escalations)
```
🔴  ESCALATION ACTIVE — Downy Scent Complaint Cluster: 47 verified buyers flagged. 
    Revenue at risk: ₱124,300. Agent awaiting approval on retention action.
    [View Full Signal] [Approve Action]
```
Banner: red-tinted bg #FEF2F2, border #DA291C, full width, 48px.

---

### Row 1 — Agentic Signal Cards (3 cards)

#### Card 1: Brand Switching Early Warning 🔴
```
BRAND SWITCHING EARLY WARNING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Verified buyers with rating drop (1–2★)
in last 14 days by brand:

Brand           Buyers   Revenue at Risk
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Downy           47       ₱124,300
Breeze          12       ₱28,800
Ariel           9        ₱21,600
Tide            6        ₱14,400
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL           74       ₱189,100

⚠️ Downy threshold exceeded (>40 buyers)
```

#### Card 2: Share Shift Predictor 🟡
```
SHARE SHIFT PREDICTOR
━━━━━━━━━━━━━━━━━━━━━━━
4-week rolling avg · 2-week window delta

Brand           Avg Rating    Δ 2-Week
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔺 Surf          4.96         +0.24 ⚠️
   Mighty Clean  4.93         +0.18
   Champion      4.95         +0.12
   Ariel         4.95         +0.02
   Breeze        4.97         +0.01
   Downy         4.94         -0.03

⚠️ Surf gaining >+0.2 — market share risk
```

#### Card 3: Promo Opportunity Signal 🟢
```
PROMO OPPORTUNITY SIGNAL
━━━━━━━━━━━━━━━━━━━━━━━━━
ARM co-occurrence mining · top pairs

Brand + Theme Pair          Confidence
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ariel + Bundle Deal         87% ✓
Downy + Loyalty Reward      84% ✓
Breeze + Sachet Promo       81% ✓
Tide + Flash Sale            76%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Threshold: 80% confidence
[Generate Promo Brief →]
```

---

### Row 2 — Autonomous Decision Log (full width)

**Card Title:** "Autonomous Decision Log"  
**Subtitle:** "Timestamped agent actions — last 24 hours"

```
TIMESTAMP           TYPE              ACTION                              STATUS
────────────────────────────────────────────────────────────────────────────────────
Today 09:14 AM   ⚙️ ESCALATION     Downy scent cluster flagged (47      🔴 AWAITING
                                   buyers, ₱124K at risk). Retention   APPROVAL
                                   promo generated. Awaiting approval.
                                   [Approve] [Modify] [Dismiss]

Today 08:47 AM   📊 MODEL REFRESH  Sentiment model refreshed.           ✅ COMPLETE
                                   1,247 new reviews classified.
                                   Avg confidence: 0.91

Today 07:30 AM   📥 INGESTION      Batch ingested: 3,412 records from   ✅ COMPLETE
                                   Lazada PH. 0 schema errors.

Today 06:15 AM   🔗 ARM RECOMPUTE  Association rule mining complete.    ✅ COMPLETE
                                   14 brand-theme pairs updated.

Yesterday 11:48 PM ⚠️ SCHEMA PATCH  2 new product columns detected.     ✅ AUTO-
                                   Schema auto-patched (low risk).      PATCHED

Yesterday 10:00 PM 📥 INGESTION     Batch ingested: 2,891 records.      ✅ COMPLETE
                                   1 duplicate key quarantined.
────────────────────────────────────────────────────────────────────────────────────
```

Alternating row shading. Type badge colored: escalation=red, model refresh=blue, ingestion=green, schema=amber. Status badges with colored dot.

---

### Row 3 — Recommended Action Widget (full width, highlighted)

**Card:** bg #EFF6FF, border 2px solid #003DA5, border-radius 12px

```
🤖  RECOMMENDED ACTION  ·  Agent Confidence: 91%

Generate retention promo for Downy verified buyers showing scent complaints
Based on: 47 flagged buyers · Scent complaint cluster active · Rejoice bundle signal active

┌─────────────────────────────────────────────────────────┐
│  Action Preview:                                        │
│  "Dear valued Downy customer — enjoy an exclusive       │
│   ₱50 off your next Downy 900ml purchase. Valid        │
│   for 7 days. Redemption via Lazada voucher."          │
│                                                         │
│  Estimated reach: 47 buyers                            │
│  Estimated recovery: ₱94,300 (76% of at-risk value)   │
└─────────────────────────────────────────────────────────┘

[✓ Approve and Generate]   [✏️ Modify Parameters]   [✗ Dismiss]

If intervention succeeds → Agent logs as "successful" and increases confidence weight
If decline continues → "Root cause may be formulation, not price. Escalating to R&D."
```

---

## SCREEN 3: COMPETITOR INTELLIGENCE

### Page Title
```
Competitor Intelligence                    [Download Report ↓]
Market share signals · Fabric Care · Lazada PH
```

### Row 1 — 4 Competitor KPI Cards

```
CARD 1: Share Shift Leaders (This Month)
Surf: +0.24 pts ↑
Mighty Clean: +0.18 pts ↑
Champion: +0.12 pts ↑

CARD 2: P&G vs Market Avg Rating
P&G Portfolio: 4.95 ★
Market Average: 4.93 ★
P&G premium: +0.02 pts

CARD 3: New Entrants Detected
2 new SKUs detected
< 60 days on catalog, 20+ reviews
[See new entrant cards ↓]

CARD 4: Listing Velocity Gap
P&G avg days to first review: 23 days
Surf avg days to first review: 18 days
Gap: P&G slower by 5 days
```

---

### Row 2 — Brand Rating Trend (larger chart, all brands)

Full-width chart, same multi-line format as Brand Overview but showing 16 weeks (W1–W16). All 7 brands shown. Use same color coding as defined above. Add vertical dotted line at "Week 12" labeled "Surf Promo Event" in amber.

Include "Share Shift Delta" table to right of chart (30% width):
```
SHARE SHIFT DELTA
4-wk avg current vs prior 4-wk avg

Brand          Current   Prior   Δ
───────────────────────────────────
Surf           4.96      4.72    +0.24 ↑⚠️
Mighty Clean   4.93      4.75    +0.18 ↑
Champion       4.95      4.83    +0.12 ↑
Ariel          4.95      4.93    +0.02 →
Breeze         4.97      4.95    +0.02 →
Downy          4.94      4.97    -0.03 ↓
Tide           4.93      4.94    -0.01 →
```

Delta colors: positive >+0.2 = red with ⚠️, positive <+0.2 = amber, negative = blue, neutral = gray.

---

### Row 3 — Company-Brand-Product Mapping (left 55%) + Competitor Gap Analysis (right 45%)

#### LEFT: Brand-Product Mapping Table
```
COMPANY         BRAND          SUBCATEGORY         SKUs   Avg ★   Reviews
──────────────────────────────────────────────────────────────────────────
P&G             Ariel          Laundry Detergent    12     4.95    6,272
P&G             Tide           Laundry Detergent     8     4.93    1,407
P&G             Downy          Fabric Enhancer       9     4.94    2,023
P&G             Breeze         Laundry Detergent    11     4.96    5,106
──────────────────────────────────────────────────────────────────────────
Unilever        Surf           Laundry Detergent    15     4.96    5,888
Unknown         Mighty Clean   Laundry Detergent    10     4.92    3,948
Unknown         Champion       Fabric Enhancer       7     4.96    1,639
Unknown         Del            Laundry Detergent     6     4.96    1,656
──────────────────────────────────────────────────────────────────────────
Unclassified    [22 brands]    Various             104     4.88   25,483
                                          [Classify Manually →]
```

P&G rows: subtle blue-tinted bg. Competitor rows: white. Unclassified: amber-tinted. Sortable columns with arrow icons.

#### RIGHT: Competitor Gap Analysis
**Subtitle:** "Themes in competitor 4★+ reviews absent in P&G equivalents"

```
TOP POSITIVE THEMES COMPETITORS HAVE
THAT P&G IS MISSING:

                        Competitor    P&G
Theme                   Freq %        Freq %    Gap
─────────────────────────────────────────────────────
"Affordable / sulit"    34%           18%       -16% 🔴
"Long-lasting scent"    41%           29%       -12% 🟡
"Easy dissolve"         28%           18%       -10% 🟡
"Gentle on skin"        22%           15%        -7% 🔵
"Good packaging"        31%           25%        -6% 🔵
─────────────────────────────────────────────────────

P&G STRENGTHS (gaps in competitor reviews):
✓ "Effective / works"  P&G: 52% vs Comp: 38% +14%
✓ "Trusted brand"      P&G: 29% vs Comp: 11% +18%
✓ "Quality product"    P&G: 44% vs Comp: 30% +14%
```

---

### Row 4 — New Entrant Cards (horizontal scroll row)

**Section Title:** "New Entrant Detection — Listed < 60 days, ≥20 reviews"

Two cards displayed:
```
┌──────────────────────────────┐    ┌──────────────────────────────┐
│ 🆕 NEW ENTRANT               │    │ 🆕 NEW ENTRANT               │
│                              │    │                              │
│ BritePH Fabric Softener      │    │ OxyWash Laundry Powder       │
│ ★ 4.82 avg                   │    │ ★ 4.71 avg                   │
│ 829 reviews · 38 days        │    │ 689 reviews · 45 days        │
│ Listed: Apr 25, 2024         │    │ Listed: Apr 18, 2024         │
│ Category: Fabric Enhancer    │    │ Category: Laundry Detergent  │
│                              │    │                              │
│ Early signals:               │    │ Early signals:               │
│ "bango" · "sulit" · "mura"   │    │ "malakas" · "white" ·"puti"  │
│                              │    │                              │
│ [Monitor Brand →]            │    │ [Monitor Brand →]            │
└──────────────────────────────┘    └──────────────────────────────┘
```

---

## SCREEN 4: R&D DEEP DIVE (Sub-view under Brand Overview)

Accessible via tab/button within Brand Overview or nav. Shows R&D-specific data.

### Row 1 — Product Complaint Taxonomy (full width)

**Card Title:** "Product Complaint Taxonomy — P&G Fabric Care"  
**Subtitle:** "Keyword-classified review issues"

Display as a grouped horizontal bar chart with 6 categories:

```
Category           Reviews   Avg ★    Bar (length = volume)
───────────────────────────────────────────────────────────────
Scent              312       3.41     ████████████████████  🔴
Texture/Consistency 178      3.68     ████████████          🟡
Performance         156      3.54     ██████████            🟡
Packaging/Usability  98      3.72     ██████                🟡
Formulation          87      3.21     ████████              🔴
Durability/Longevity  64     3.89     ████                  🔵
```

Each bar: colored by severity (avg rating <3.5 = red, 3.5–4.0 = amber, >4.0 = blue). Hover shows sample reviews.

Below the chart, a small "Noise Separation" badge:
```
🔇 Noise Separated: 1,847 courier/seller reviews excluded from this analysis.
```

---

### Row 2 — Unmet Needs Detector (left 50%) + Repeat Complaint Tracker (right 50%)

#### LEFT: Unmet Needs Detector
```
UNMET NEEDS DETECTOR
"I wish / Sana / Kung may" patterns

Rank  Theme                        Products  Mentions
──────────────────────────────────────────────────────
#1    "Sana may mas mura"           Multiple    147
      (Wish it were cheaper)
#2    "I wish longer-lasting scent" Downy        89
#3    "Kung may refill pack"        Ariel         72
#4    "Sana pH-balanced formula"    Breeze        54
#5    "I wish Hindi malagkit"       Downy         43
──────────────────────────────────────────────────────
[Generate Product Brief from #1 →]
```

#### RIGHT: Repeat Complaint Tracker
```
REPEAT COMPLAINT TRACKER
Issues unresolved across 3+ months

Theme           First Seen    Still Active  Months
─────────────────────────────────────────────────────
Scent (Downy)   Feb 2023      ✗ YES         15 mo  🔴
Pump issues     Mar 2023      ✗ YES         14 mo  🔴
Packet leak     Jun 2023      ✗ YES         11 mo  🟡
Texture (Tide)  Aug 2023      ✗ YES          9 mo  🟡
Price concern   Oct 2023      ✗ YES          7 mo  🔵
─────────────────────────────────────────────────────
[Create R&D Ticket →] on each row
```

---

## SCREEN 5: OPERATIONS DASHBOARD (SRE View)

### Page Title
```
Operations Dashboard                    [All Systems ● Operational]
SRE Monitoring · PG Next Platform Health
```

### Row 1 — System Health KPIs (5 cards)

```
API LATENCY (p95)    PIPELINE SUCCESS    ERROR RATE        DATA FRESHNESS    AI CLASSIFICATION
1.24s                98.7%               0.14%             18 min ago        Confidence 0.91
● Healthy            ● Healthy           ● Healthy         ● Fresh (< 1hr)   ● Healthy
p50: 0.34s           Target: ≥95%        Target: <2%       SLA: 1hr          Uncateg: 3.2%
p99: 3.12s
```

Each card has a large status dot (green/amber/red), main metric in big bold type, and target/threshold in small caption below.

---

### Row 2 — Monitoring Grid (2x3)

Show 6 mini monitoring tiles:

```
Record Count Variance    Null Rate Monitor      Duplicate Rate
+8.3% vs 7-day avg       0.23%                 0.04%
● Normal (±20% thresh)   ● Healthy (<5% flag)  ● Healthy (<1% flag)
Last check: 12:00 PM     Last check: 12:00 PM  Last check: 12:00 PM

Schema Drift             Token Usage            Dashboard Availability
No drift detected        142K tokens/100 req   99.87%
● Healthy                ● Normal (25% thresh) ● Healthy (>99.5% SLA)
Last check: 08:00 AM     ↑+11% vs 14-day avg   30-day window
```

---

### Row 3 — Incident Command + Self-Healing Log (split)

#### LEFT: Incident Command Panel
```
OPEN INCIDENTS (1)

[🔴 P1] Downy sentiment spike alert
Service: Sentiment classifier
Start: Today 07:22 AM
Owner: @data-eng-team
Status: Investigating
Workaround: Last stable model serving
Target recovery: 30 min
[View Runbook →]
```

#### RIGHT: Self-Healing Action Log
```
SELF-HEALING LOG (last 24h)

09:14  ↻ Retry triggered — Lazada API timeout
       Action: Auto-retry (attempt 2/3). Success.

08:47  ✓ Worker restart — Classifier job hung
       Action: Auto-restart. 0 data loss.

06:15  ✓ Fallback activated — Source file delay
       Action: Prior-day dataset served.
       Trigger: Freshness SLA breach warning.

Yesterday 22:10  ⚠️ Quarantine routing
       Action: 1 duplicate record quarantined.
       Primary key hash collision detected.
```

---

## INTERACTION DETAILS

### Dropdowns
All filter dropdown menus:
- White bg, 8px border-radius, shadow: 0 4px 24px rgba(0,0,0,0.12)
- Max height 320px, scrollable
- Search input at top of dropdown for long lists
- Each option: 36px height, 12px horizontal padding, hover bg #F4F6FA
- Selected: checkmark + text in #003DA5
- "Clear" link at bottom right

**Sector dropdown options:** Fabric Care, Hair Care, Skin Care, Oral Care, Baby Care, Fem Care  
**Subcategory options (under Fabric Care):** All, Laundry Detergents, Fabric Enhancer, Bleach  
**Date range options:** Last 7 Days, Last 30 Days, Last 90 Days, Last 6 Months, Last 12 Months, Custom Range, Full Dataset (Jan 2022 – Jun 2024)

### "What This Means" AI Tooltip
Each metric card has a small link at bottom: `◎ What this means`  
Click → expands inline: light blue bg box, 2 sentences, italicized, close X button.  
Example for Review Velocity card:  
*"A 38% spike in Ariel reviews in the last 24 hours indicates an active promotional event or viral product moment on Lazada. Monitor whether review sentiment stays positive or declines — a spike with falling ratings signals a problematic promo execution."*

### Sidebar Chatbot Panel (Collapsible)
Accessible via chat icon at sidebar bottom. Slides in from right as a 340px panel:
```
┌─────────────────────────────────────────┐
│ 🤖 PG Next AI Assistant      [Close X] │
├─────────────────────────────────────────┤
│                                         │
│  Ask me anything about your brand       │
│  data, competitors, or trends.          │
│                                         │
│  Suggested:                             │
│  ● "Why is Downy flagged?"              │
│  ● "Compare Ariel vs Surf last month"   │
│  ● "Show me all scent complaints"       │
│                                         │
│  [Add context: + Ariel Brand]           │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  [  Ask a question...          ] [Send] │
└─────────────────────────────────────────┘
```
Context chips (like VSCode Copilot) appear above the input when the user adds brand/product/metric context.

---

## MICRO-INTERACTIONS & STATES

- **Card hover:** box-shadow deepens slightly, border brightens to #C7D9F8
- **Button hover:** primary blue darkens 10%
- **Active nav item:** solid blue bg + left accent line + icon + text white
- **Metric delta UP:** green text + ↑ arrow + green dot
- **Metric delta DOWN (bad):** red text + ↓ arrow + red dot
- **Metric delta DOWN (good/improving):** green text + ↓ arrow (e.g., issue count declining)
- **Loading skeleton:** gray shimmer animation on metric cards on page load
- **Alert banner:** slide-in from top with transition
- **Filter chip active:** bg #003DA5, text white, close × appears

---

## DATA NOTES FOR PROTOTYPE (GROUND TRUTH)

These stats are derived from the actual Lazada PH Fabric Care dataset (75,618 records, Jan 2022 – Jun 2024):

```
Total records:          75,618
Date range:             Jan 12, 2022 – Jun 2, 2024
Subcategories:          Laundry Detergents (41,127) · Fabric Enhancer (29,619) · Bleach (4,872)

P&G Brands:
  Ariel:    6,272 reviews · ★4.95 avg
  Breeze:   5,106 reviews · ★4.96 avg
  Downy:    2,023 reviews · ★4.94 avg
  Tide:     1,407 reviews · ★4.93 avg

Competitor Brands:
  Surf:         5,888 reviews · ★4.96 avg
  Mighty Clean: 3,948 reviews · ★4.92 avg
  Champion:     1,639 reviews · ★4.96 avg
  Del:          1,656 reviews · ★4.96 avg

Rating distributions (P&G):
  Ariel:  1★×40, 2★×19, 3★×23, 4★×43, 5★×6,147
  Breeze: 1★×19, 2★×11, 3★×27, 4★×31, 5★×5,018
  Downy:  1★×20, 2★×4,  3★×9,  4★×6,  5★×1,984
  Tide:   1★×9,  2★×11, 3★×9,  4★×9,  5★×1,369

Sample real reviewTexts (Tagalog/Taglish, use as demo review snippets):
  "Grabeeeee ang bango at ang lambot sa damit"
  "masyadong malakas ang amoy, hindi ko type yung bango"
  "natanggap ko na may leak, butas yung pakete"
  "mahal na ngayon, hindi na sulit"
  "wala sa tindahan, out of stock palagi"
  "sana may mas mura, pero maganda naman ang quality"
  "Quality:Maganda Value for Money:Worth the price Packaging:Maganda kaya hindi nag leak"
  "maayos ang pagbalot, legit, ang bango"
```

---

## FINAL QUALITY CHECKLIST

Before considering the prototype complete, verify:

- [ ] P&G color system applied consistently (#003DA5 as primary, #0A1628 sidebar)
- [ ] All 5 screens accessible from sidebar navigation (Brand Overview, Intelligence Command, Competitor Intel, R&D Deep Dive, Operations)
- [ ] Filter bar with Sector/Subcategory/Date dropdowns functional (or simulated)
- [ ] At least 1 chart per screen (line chart, bar chart, or visualization)
- [ ] All metric cards have delta indicators and "What this means" layer
- [ ] Issue Priority Queue shows ranked items with Generate Brief buttons
- [ ] Recommended Action widget with Approve/Modify/Dismiss CTAs
- [ ] Chatbot panel slide-in from sidebar
- [ ] Responsive layout (minimum 1280px desktop width)
- [ ] Data from the actual Lazada PH Fabric dataset used in all numbers
- [ ] Real Tagalog/Taglish reviewText snippets visible in complaint cards
- [ ] Professional enough for C-suite case competition presentation
```

---

*End of PG Next Prototype Implementation Prompt*  
*Version 1.0 · For use in Figma Make, Lovable, v0, or Bolt*