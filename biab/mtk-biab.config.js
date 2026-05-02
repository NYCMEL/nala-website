const MTK_BIAB_CONFIG = {
  component: "mtk-biab",
  version: "1.0.0",

  tabs: [
    {
      id: "website-maker",
      label: "Website Maker",
      icon: "language",
      active: false,
      type: "iframe",
      iframeUrl: "/repo_deploy/client/index.html"
    },
    {
      id: "business-guide",
      label: "Business Guide & Pricing",
      icon: "menu_book",
      active: true,
      type: "sidebar",
      sidebar: {
        menus: [
          {
            id: "templates-guides",
            label: "Templates & Guides",
            icon: "description",
            items: [
              {
                id: "business-plan-template",
                label: "Business Plan Template",
                icon: "article",
                content: {
                  title: "Business Plan Template",
                  body: `<div data-biab-tool="business-plan"></div><p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fbf4e5;color:#4a3a08;font-size:12px;font-weight:700;text-transform:uppercase;">Starter</span></p>
<h3>Purpose</h3>
<p>This template is for a locksmith who wants to build a real business, not just take occasional side jobs. Use it to decide what you will offer, how you will price it, how you will market it, and how you will stay profitable.</p>

<h3>1. Executive Summary</h3>
<ul>
  <li><strong>Business name:</strong></li>
  <li><strong>Owner name:</strong></li>
  <li><strong>City / State:</strong></li>
  <li><strong>Service area:</strong></li>
  <li><strong>Business phone:</strong></li>
  <li><strong>Business email:</strong></li>
  <li><strong>Website:</strong></li>
  <li><strong>Business model:</strong> mobile locksmith / storefront / hybrid</li>
  <li><strong>Main customer focus:</strong> residential / commercial / automotive / property managers / realtors / roadside / safes</li>
  <li><strong>Mission statement:</strong></li>
  <li><strong>12-month goal:</strong></li>
</ul>

<h3>2. Services Offered at Launch</h3>
<ul>
  <li>House lockouts</li>
  <li>Rekeys</li>
  <li>Lock changes</li>
  <li>Deadbolt installation</li>
  <li>Mailbox / cabinet locks</li>
  <li>Car lockouts</li>
  <li>Basic commercial lock service</li>
</ul>

<h3>3. Services to Add Later</h3>
<ul>
  <li>Master key systems</li>
  <li>Panic hardware</li>
  <li>Door closers</li>
  <li>Access control</li>
  <li>Safe work</li>
  <li>Automotive key programming</li>
</ul>

<h3>4. Who You Serve</h3>
<ul>
  <li>Homeowners</li>
  <li>Drivers</li>
  <li>Property managers</li>
  <li>Small businesses</li>
  <li>Realtors</li>
  <li>Commercial offices</li>
</ul>

<h3>5. What Makes You Different</h3>
<ul>
  <li>Clear pricing</li>
  <li>Professional arrival and communication</li>
  <li>Clean work</li>
  <li>Fast callback and ETA updates</li>
  <li>Detailed invoices</li>
  <li>Review follow-up system</li>
</ul>

<h3>6. Startup Needs</h3>
<ul>
  <li>Business registration</li>
  <li>EIN</li>
  <li>Business bank account</li>
  <li>Insurance</li>
  <li>Business phone</li>
  <li>Domain and website</li>
  <li>Google Business Profile</li>
  <li>Business email</li>
  <li>Logo and brand kit</li>
  <li>Vehicle setup</li>
  <li>Tools and starter inventory</li>
  <li>Payment processor</li>
  <li>Invoicing system</li>
  <li>Bookkeeping setup</li>
</ul>

<h3>7. Pricing Strategy</h3>
<p>Your prices must cover labor, travel time, fuel, tools, parts, processing fees, marketing cost, callback risk, taxes, and profit. Do not price jobs by guessing. Price them like a business owner.</p>

<h3>8. Marketing Plan</h3>
<ul>
  <li>Google Business Profile</li>
  <li>Google Ads and/or Local Services Ads if eligible</li>
  <li>Website SEO</li>
  <li>Review requests</li>
  <li>Referral partners</li>
  <li>Social proof content</li>
</ul>

<h3>9. Operations Plan</h3>
<ol>
  <li>Customer calls or submits a form.</li>
  <li>You confirm the issue, location, and urgency.</li>
  <li>You give a clear price range or dispatch policy.</li>
  <li>You send ETA updates.</li>
  <li>You verify authorization.</li>
  <li>You complete the work.</li>
  <li>You test everything with the customer.</li>
  <li>You collect payment.</li>
  <li>You send the invoice and ask for a review.</li>
  <li>You save job notes for future service.</li>
</ol>

<h3>10. Metrics to Track Weekly</h3>
<ul>
  <li>Calls received</li>
  <li>Booked jobs</li>
  <li>Completed jobs</li>
  <li>Average ticket</li>
  <li>Gross revenue</li>
  <li>Ad spend</li>
  <li>Cost per booked job</li>
  <li>Review count</li>
  <li>Repeat customers</li>
  <li>Net cash after expenses</li>
</ul>

<h3>11. 90-Day Launch Goals</h3>
<ul>
  <li>Go live with phone, website, and Google profile</li>
  <li>Get first 10 paying jobs</li>
  <li>Get first 10 Google reviews</li>
  <li>Build first referral partners</li>
  <li>Refine pricing from real-world results</li>
</ul>`
                }
              },
              {
                id: "startup-checklist",
                label: "Startup Checklist",
                icon: "checklist",
                content: {
                  title: "Startup Checklist",
                  body: `<div data-biab-tool="startup-checklist"></div><p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fbf4e5;color:#4a3a08;font-size:12px;font-weight:700;text-transform:uppercase;">Starter</span></p>
<h3>Before Launch</h3>
<ul>
  <li>Choose a business name</li>
  <li>Check domain availability</li>
  <li>Register your business entity as advised by your professional</li>
  <li>Apply for an EIN</li>
  <li>Open a business bank account</li>
  <li>Set up bookkeeping</li>
  <li>Get insurance quotes</li>
  <li>Check locksmith licensing and local business rules in your state and city</li>
  <li>Set up a business phone line</li>
  <li>Set up a business email</li>
  <li>Buy your domain and connect your website</li>
  <li>Create your Google Business Profile</li>
  <li>Create your logo and brand kit</li>
  <li>Order business cards</li>
  <li>Set up invoicing and payment processing</li>
  <li>Prepare your service vehicle</li>
  <li>Prepare your starter tool kit and inventory</li>
  <li>Write your starter price list and call script</li>
  <li>Prepare review request templates</li>
</ul>

<h3>Before Taking the First Job</h3>
<ul>
  <li>Confirm your hours of operation</li>
  <li>Confirm your service area</li>
  <li>Confirm who answers the phone and how</li>
  <li>Create ETA text templates</li>
  <li>Confirm accepted payment methods</li>
  <li>Confirm your scheduling method</li>
  <li>Set your authorization verification policy</li>
  <li>Set your photo documentation policy</li>
  <li>Set your notes and invoice workflow</li>
  <li>Set after-hours pricing</li>
  <li>Set cancellation policy</li>
  <li>Set review follow-up workflow</li>
</ul>

<h3>Weekly Operating Checklist</h3>
<ul>
  <li>Restock inventory</li>
  <li>Review missed calls</li>
  <li>Review unbooked quotes</li>
  <li>Review unpaid invoices</li>
  <li>Review ad spend</li>
  <li>Review job profitability</li>
  <li>Review Google reviews</li>
  <li>Clean the vehicle</li>
  <li>Check tool condition and batteries</li>
  <li>Plan next week’s schedule</li>
</ul>`
                }
              },
              {
                id: "legal-guide",
                label: "Legal Guide",
                icon: "gavel",
                content: {
                  title: "Legal Guide",
                  body: `<div data-biab-guided-setup="legal-guide"></div>`
                }
              },
              {
                id: "financial-guide",
                label: "Financial Planning Guide",
                icon: "account_balance",
                content: {
                  title: "Financial Planning Guide",
                  body: `<div data-biab-guided-setup="financial-guide"></div>`
                }
              }
            ]
          },
          {
            id: "zip-code-pricing",
            label: "Region Pricing Guides",
            icon: "sell",
            items: [
              {
                id: "pricing-northeast",
                label: "Northeast Region",
                icon: "map",
                content: {
                  title: "Northeast Region Pricing",
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fbf4e5;color:#4a3a08;font-size:12px;font-weight:700;text-transform:uppercase;">Starter</span></p>
<h3>How to Use This Page</h3>
<p>These are starter price bands for locksmith businesses operating in Northeast markets. Final pricing should be adjusted for travel radius, traffic, parking, hardware grade, job complexity, urgency, and local competition. Dense metro areas often justify pricing near the top of the range or above it.</p>
<p><em>These are starter bands, not guaranteed market prices.</em></p>

<table>
  <thead>
    <tr>
      <th>Service</th>
      <th>Starter Band</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Residential lockout</td><td>$90 – $220</td></tr>
    <tr><td>Residential rekey (per lock)</td><td>$60 – $145</td></tr>
    <tr><td>Lock change / replacement (per lock)</td><td>$165 – $550</td></tr>
    <tr><td>Deadbolt installation</td><td>$120 – $385</td></tr>
    <tr><td>Smart lock installation / swap</td><td>$120 – $385+</td></tr>
    <tr><td>Lock repair / key extraction</td><td>$65 – $220</td></tr>
    <tr><td>Basic key duplication</td><td>$5 – $22</td></tr>
    <tr><td>Safe opening</td><td>$165 – $550</td></tr>
    <tr><td>Car lockout</td><td>$75 – $275+</td></tr>
    <tr><td>Mechanical car key replacement</td><td>$30 – $110</td></tr>
    <tr><td>Transponder key replacement / programming</td><td>$70 – $275</td></tr>
    <tr><td>Smart key / fob replacement / programming</td><td>$165 – $550+</td></tr>
    <tr><td>Ignition rekey</td><td>$110 – $385+</td></tr>
    <tr><td>Commercial lockout</td><td>$110 – $220</td></tr>
    <tr><td>Commercial rekey (first door)</td><td>$105 – $215</td></tr>
    <tr><td>Commercial rekey (additional door)</td><td>$55 – $95</td></tr>
    <tr><td>Master key system setup</td><td>$350 – $900+</td></tr>
    <tr><td>Panic bar installation</td><td>$450 – $950+</td></tr>
    <tr><td>Door closer replacement / install</td><td>$225 – $525+</td></tr>
    <tr><td>Single-door access control starter install</td><td>$650 – $1,650+</td></tr>
  </tbody>
</table>

<p><strong>Tip:</strong> In high-density Northeast cities, parking, tolls, limited loading access, and traffic delays can materially change profitable pricing.</p>
<p>These are starter price bands for U.S. locksmith businesses. Final pricing should be adjusted for travel radius, hardware grade, job complexity, urgency, competition, and actual local operating cost. Emergency / after-hours work should typically be priced above daytime work.</p>
<p><em>Last updated: April 2026</em></p>`
                }
              },
              {
                id: "pricing-southeast",
                label: "Southeast Region",
                icon: "map",
                content: {
                  title: "Southeast Region Pricing",
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fbf4e5;color:#4a3a08;font-size:12px;font-weight:700;text-transform:uppercase;">Starter</span></p>
<h3>How to Use This Page</h3>
<p>These are starter price bands for locksmith businesses operating in Southeast and lower-cost Southern markets. Final pricing should be adjusted for travel radius, after-hours demand, suburban spread, hardware grade, and local competition.</p>
<p><em>These are starter bands, not guaranteed market prices.</em></p>

<table>
  <thead>
    <tr>
      <th>Service</th>
      <th>Starter Band</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Residential lockout</td><td>$70 – $180</td></tr>
    <tr><td>Residential rekey (per lock)</td><td>$50 – $120</td></tr>
    <tr><td>Lock change / replacement (per lock)</td><td>$135 – $450</td></tr>
    <tr><td>Deadbolt installation</td><td>$90 – $315</td></tr>
    <tr><td>Smart lock installation / swap</td><td>$90 – $315+</td></tr>
    <tr><td>Lock repair / key extraction</td><td>$50 – $180</td></tr>
    <tr><td>Basic key duplication</td><td>$4 – $18</td></tr>
    <tr><td>Safe opening</td><td>$135 – $450</td></tr>
    <tr><td>Car lockout</td><td>$60 – $225+</td></tr>
    <tr><td>Mechanical car key replacement</td><td>$25 – $95</td></tr>
    <tr><td>Transponder key replacement / programming</td><td>$60 – $225</td></tr>
    <tr><td>Smart key / fob replacement / programming</td><td>$135 – $450+</td></tr>
    <tr><td>Ignition rekey</td><td>$90 – $315+</td></tr>
    <tr><td>Commercial lockout</td><td>$95 – $195</td></tr>
    <tr><td>Commercial rekey (first door)</td><td>$85 – $185</td></tr>
    <tr><td>Commercial rekey (additional door)</td><td>$45 – $80</td></tr>
    <tr><td>Master key system setup</td><td>$295 – $795+</td></tr>
    <tr><td>Panic bar installation</td><td>$395 – $875+</td></tr>
    <tr><td>Door closer replacement / install</td><td>$195 – $475+</td></tr>
    <tr><td>Single-door access control starter install</td><td>$550 – $1,450+</td></tr>
  </tbody>
</table>

<p><strong>Tip:</strong> In many Southeast markets, wider suburban service areas make trip fees and mileage discipline especially important.</p>
<p>These are starter price bands for U.S. locksmith businesses. Final pricing should be adjusted for travel radius, hardware grade, job complexity, urgency, competition, and actual local operating cost. Emergency / after-hours work should typically be priced above daytime work.</p>
<p><em>Last updated: April 2026</em></p>`
                }
              },
              {
                id: "pricing-midwest",
                label: "Midwest Region",
                icon: "map",
                content: {
                  title: "Midwest Region Pricing",
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fbf4e5;color:#4a3a08;font-size:12px;font-weight:700;text-transform:uppercase;">Starter</span></p>
<h3>How to Use This Page</h3>
<p>These are starter price bands for locksmith businesses operating in Midwest markets. Final pricing should be adjusted for drive time, weather, hardware grade, urgency, and the density of your service territory.</p>
<p><em>These are starter bands, not guaranteed market prices.</em></p>

<table>
  <thead>
    <tr>
      <th>Service</th>
      <th>Starter Band</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Residential lockout</td><td>$80 – $195</td></tr>
    <tr><td>Residential rekey (per lock)</td><td>$55 – $130</td></tr>
    <tr><td>Lock change / replacement (per lock)</td><td>$145 – $485</td></tr>
    <tr><td>Deadbolt installation</td><td>$100 – $340</td></tr>
    <tr><td>Smart lock installation / swap</td><td>$100 – $340+</td></tr>
    <tr><td>Lock repair / key extraction</td><td>$55 – $195</td></tr>
    <tr><td>Basic key duplication</td><td>$5 – $20</td></tr>
    <tr><td>Safe opening</td><td>$145 – $485</td></tr>
    <tr><td>Car lockout</td><td>$65 – $240+</td></tr>
    <tr><td>Mechanical car key replacement</td><td>$25 – $100</td></tr>
    <tr><td>Transponder key replacement / programming</td><td>$60 – $240</td></tr>
    <tr><td>Smart key / fob replacement / programming</td><td>$145 – $485+</td></tr>
    <tr><td>Ignition rekey</td><td>$100 – $340+</td></tr>
    <tr><td>Commercial lockout</td><td>$100 – $205</td></tr>
    <tr><td>Commercial rekey (first door)</td><td>$95 – $195</td></tr>
    <tr><td>Commercial rekey (additional door)</td><td>$50 – $85</td></tr>
    <tr><td>Master key system setup</td><td>$325 – $850+</td></tr>
    <tr><td>Panic bar installation</td><td>$425 – $900+</td></tr>
    <tr><td>Door closer replacement / install</td><td>$210 – $495+</td></tr>
    <tr><td>Single-door access control starter install</td><td>$600 – $1,550+</td></tr>
  </tbody>
</table>

<p><strong>Tip:</strong> In the Midwest, seasonal weather, longer drive patterns, and commercial service clusters can change the right pricing strategy significantly.</p>
<p>These are starter price bands for U.S. locksmith businesses. Final pricing should be adjusted for travel radius, hardware grade, job complexity, urgency, competition, and actual local operating cost. Emergency / after-hours work should typically be priced above daytime work.</p>
<p><em>Last updated: April 2026</em></p>`
                }
              },
              {
                id: "pricing-west",
                label: "West Region",
                icon: "map",
                content: {
                  title: "West Region Pricing",
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fbf4e5;color:#4a3a08;font-size:12px;font-weight:700;text-transform:uppercase;">Starter</span></p>
<h3>How to Use This Page</h3>
<p>These are starter price bands for locksmith businesses operating in Western markets. Final pricing should be adjusted for metro density, regional cost of living, fuel cost, travel radius, hardware grade, and job complexity. Large Western metros often justify top-of-range pricing or above.</p>
<p><em>These are starter bands, not guaranteed market prices.</em></p>

<table>
  <thead>
    <tr>
      <th>Service</th>
      <th>Starter Band</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Residential lockout</td><td>$95 – $235</td></tr>
    <tr><td>Residential rekey (per lock)</td><td>$65 – $155</td></tr>
    <tr><td>Lock change / replacement (per lock)</td><td>$175 – $575</td></tr>
    <tr><td>Deadbolt installation</td><td>$120 – $400+</td></tr>
    <tr><td>Smart lock installation / swap</td><td>$120 – $400+</td></tr>
    <tr><td>Lock repair / key extraction</td><td>$65 – $235</td></tr>
    <tr><td>Basic key duplication</td><td>$5 – $22</td></tr>
    <tr><td>Safe opening</td><td>$175 – $575</td></tr>
    <tr><td>Car lockout</td><td>$75 – $290+</td></tr>
    <tr><td>Mechanical car key replacement</td><td>$30 – $115</td></tr>
    <tr><td>Transponder key replacement / programming</td><td>$70 – $290</td></tr>
    <tr><td>Smart key / fob replacement / programming</td><td>$175 – $575+</td></tr>
    <tr><td>Ignition rekey</td><td>$120 – $400+</td></tr>
    <tr><td>Commercial lockout</td><td>$110 – $230</td></tr>
    <tr><td>Commercial rekey (first door)</td><td>$105 – $225</td></tr>
    <tr><td>Commercial rekey (additional door)</td><td>$55 – $95</td></tr>
    <tr><td>Master key system setup</td><td>$375 – $950+</td></tr>
    <tr><td>Panic bar installation</td><td>$475 – $995+</td></tr>
    <tr><td>Door closer replacement / install</td><td>$235 – $550+</td></tr>
    <tr><td>Single-door access control starter install</td><td>$700 – $1,750+</td></tr>
  </tbody>
</table>

<p><strong>Tip:</strong> In many Western markets, price differences between major metros and smaller cities can be dramatic. Build travel, parking, and fuel into your pricing from day one.</p>
<p>These are starter price bands for U.S. locksmith businesses. Final pricing should be adjusted for travel radius, hardware grade, job complexity, urgency, competition, and actual local operating cost. Emergency / after-hours work should typically be priced above daytime work.</p>
<p><em>Last updated: April 2026</em></p>`
                }
              }
            ]
          }
        ]
      }
    },
    {
      id: "marketing",
      label: "Marketing",
      icon: "campaign",
      active: false,
      type: "sidebar",
      sidebar: {
        menus: [
          {
            id: "stationary-designer",
            label: "Stationary Designer",
            icon: "draw",
            items: [
              {
                id: "business-cards",
                label: "Business Cards",
                icon: "style",
                content: {
                  title: "Business Card Designer",
                  body: `<div data-stationery-designer-panel="business-card"></div><p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fbf4e5;color:#4a3a08;font-size:12px;font-weight:700;text-transform:uppercase;">Starter</span></p>
<h3>How this tool works</h3>
<p>Enter your business name, phone, email, website, city, logo, colors, and tagline once. The designer places those details into clean card layouts that are easy to read and ready to review.</p>

<h3>Choose and review</h3>
<ol>
  <li>Choose a card template.</li>
  <li>Use your uploaded logo or a simple text logo.</li>
  <li>Choose colors and a font pairing that match your brand.</li>
  <li>Review the front and back preview.</li>
  <li>Download the PDF or PNG when it looks right.</li>
</ol>

<h3>Fields to Include</h3>
<ul>
  <li>Business name</li>
  <li>Owner or technician name (optional)</li>
  <li>Phone</li>
  <li>Email</li>
  <li>Website</li>
  <li>Service area</li>
  <li>QR code to website or booking page</li>
  <li>License number if locally relevant</li>
</ul>

<h3>Design Rules</h3>
<ul>
  <li>One strong phone number</li>
  <li>Readable at arm’s length</li>
  <li>High contrast</li>
  <li>No clutter</li>
  <li>No fake claims or unnecessary badges</li>
</ul>

<p>Keep the card focused on contact and trust. A clean card is easier for customers to use later.</p>`
                }
              },
              {
                id: "letterhead",
                label: "Letterhead",
                icon: "note_alt",
                content: {
                  title: "Letterhead Designer",
                  body: `<div data-stationery-designer-panel="letterhead"></div><p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fbf4e5;color:#4a3a08;font-size:12px;font-weight:700;text-transform:uppercase;">Starter</span></p>
<h3>How this tool works</h3>
<p>Your brand details from setup fill the letterhead automatically, so quotes, proposals, and business paperwork stay consistent.</p>

<h3>Include These Fields</h3>
<ul>
  <li>Logo</li>
  <li>Business name</li>
  <li>Phone</li>
  <li>Email</li>
  <li>Website</li>
  <li>Mailing address if used</li>
  <li>License number if locally relevant</li>
</ul>

<h3>Best Uses</h3>
<ul>
  <li>Quotes</li>
  <li>Service confirmations</li>
  <li>B2B outreach</li>
  <li>Property manager proposals</li>
  <li>Account applications</li>
</ul>

<h3>Design Rules</h3>
<ul>
  <li>Keep it clean and readable</li>
  <li>Do not overcrowd the top margin</li>
  <li>Use strong hierarchy: logo, name, contact info</li>
  <li>Make sure it prints well in color and grayscale</li>
</ul>`
                }
              },
              {
                id: "envelopes",
                label: "Envelopes",
                icon: "mail",
                content: {
                  title: "Envelope Designer",
                  body: `<div data-stationery-designer-panel="envelope"></div><p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fbf4e5;color:#4a3a08;font-size:12px;font-weight:700;text-transform:uppercase;">Starter</span></p>
<h3>How this tool works</h3>
<p>Choose a simple branded envelope layout. The goal is a clean professional return area that prints clearly and keeps postal space open.</p>

<h3>Recommended Fields</h3>
<ul>
  <li>Logo</li>
  <li>Business name</li>
  <li>Return address</li>
  <li>Website</li>
  <li>Optional short tagline</li>
</ul>

<h3>Design Rules</h3>
<ul>
  <li>Keep it minimal</li>
  <li>Do not overload with a long services list</li>
  <li>Make sure postal areas remain clear</li>
  <li>Provide black-and-white print-safe option</li>
</ul>`
                }
              }
            ]
          },
          {
            id: "logo-designer",
            label: "Logo Designer",
            icon: "palette",
            items: [
              {
                id: "logo-concepts",
                label: "Logo Concepts",
                icon: "auto_awesome",
                content: {
                  title: "Logo Concepts",
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fbf4e5;color:#4a3a08;font-size:12px;font-weight:700;text-transform:uppercase;">Starter</span></p>
<p>Choose a simple logo direction that works on your website, invoices, Google profile, shirts, and vehicle graphics. Strong logos stay readable at small sizes and avoid extra detail.</p>
<div data-logo-designer-panel="concepts"></div>`
                }
              },
              {
                id: "brand-guidelines",
                label: "Brand Guidelines",
                icon: "color_lens",
                content: {
                  title: "Brand Guidelines",
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fff4e5;color:#8a4b00;font-size:12px;font-weight:700;text-transform:uppercase;">Intermediate</span></p>
<p>These guidelines are generated from your logo selections, colors, and business details so the brand kit stays consistent across your materials.</p>
<div data-logo-designer-panel="guidelines"></div>`
                }
              },
              {
                id: "logo-variations",
                label: "Logo Variations",
                icon: "grid_view",
                content: {
                  title: "Logo Variations",
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fff4e5;color:#8a4b00;font-size:12px;font-weight:700;text-transform:uppercase;">Intermediate</span></p>
<p>The variation pack below shows your logo adapted for light, dark, social, favicon, and one-color use.</p>
<div data-logo-designer-panel="variations"></div>`
                }
              },
              {
                id: "logo-downloads",
                label: "Logo Downloads",
                icon: "download",
                content: {
                  title: "Logo Downloads",
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fff4e5;color:#8a4b00;font-size:12px;font-weight:700;text-transform:uppercase;">Professional</span></p>
<p>Download SVG logo files, color notes, and usage guidance for your website, invoices, social profiles, and print materials.</p>
<div data-logo-designer-panel="downloads"></div>`
                }
              }
            ]
          },
          {
            id: "online-marketing",
            label: "Online Marketing Setup",
            icon: "ads_click",
            items: [
              {
                id: "google-business-profile",
                label: "Google Business Profile",
                icon: "storefront",
                content: {
                  title: "Google Business Profile Setup",
                  body: `<div data-biab-guided-setup="google-business-profile"></div>`
                }
              },
              {
                id: "seo-setup",
                label: "SEO & Search Console",
                icon: "search",
                content: {
                  title: "SEO & Search Console Setup",
                  body: `<div data-biab-guided-setup="seo-setup"></div>`
                }
              },
              {
                id: "local-services-ads",
                label: "Local Services Ads",
                icon: "verified",
                content: {
                  title: "Local Services Ads Setup",
                  body: `<div data-biab-guided-setup="local-services-ads"></div>`
                }
              },
              {
                id: "google-ads",
                label: "Google Search Ads",
                icon: "ads_click",
                content: {
                  title: "Google Search Ads Setup",
                  body: `<div data-biab-guided-setup="google-ads"></div>`
                }
              },
              {
                id: "analytics-tracking",
                label: "Analytics & Tracking",
                icon: "monitoring",
                content: {
                  title: "Analytics & Tracking Setup",
                  body: `<div data-biab-guided-setup="analytics-tracking"></div>`
                }
              },
              {
                id: "automation-options",
                label: "Automation Options",
                icon: "api",
                content: {
                  title: "Marketing API Automation Options",
                  body: `<div data-biab-tool="automation-options"></div>`
                }
              },
              {
                id: "social-media-setup",
                label: "Social Media Setup",
                icon: "share",
                content: {
                  title: "Social Media Setup",
                  body: `<div data-biab-guided-setup="social-media-setup"></div>`
                }
              },
              {
                id: "email-campaigns",
                label: "Email Campaigns",
                icon: "send",
                content: {
                  title: "Email Campaigns",
                  body: `<div data-biab-guided-setup="email-campaigns"></div>`
                }
              }
            ]
          }
        ]
      }
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: "rate_review",
      active: false,
      type: "simple",
      content: {
        title: "Customer Reviews",
        body: `<div data-biab-tool="reviews"></div>`
      }
    },
    {
      id: "invoicing",
      label: "Invoicing",
      icon: "receipt_long",
      active: false,
      type: "simple",
      content: {
        title: "Invoicing",
        body: `<div data-biab-tool="invoice-setup"></div><p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fff4e5;color:#8a4b00;font-size:12px;font-weight:700;text-transform:uppercase;">Starter</span></p>
<h3>Important Note</h3>
<p>There is no single universal U.S. federal invoice format for ordinary small businesses, but good recordkeeping matters. Your invoices should be clear, itemized, professional, and consistent with your tax, accounting, and local legal requirements.</p>
<p>State and local requirements may add more, especially for tax display, contractor work categories, or license disclosures.</p>

<h3>What Every Professional Locksmith Invoice Should Include</h3>
<ul>
  <li>Invoice number</li>
  <li>Invoice date</li>
  <li>Business legal name</li>
  <li>DBA if used</li>
  <li>Business address or mailing address</li>
  <li>Business phone</li>
  <li>Business email</li>
  <li>Business website</li>
  <li>Customer name</li>
  <li>Service address</li>
  <li>Billing address if different</li>
  <li>Clear description of work performed</li>
  <li>Itemized labor</li>
  <li>Itemized parts / hardware</li>
  <li>Taxes shown separately where applicable</li>
  <li>Subtotal</li>
  <li>Total</li>
  <li>Payment terms</li>
  <li>Payment method and payment status</li>
  <li>Technician name or ID if desired</li>
  <li>Warranty note if offered</li>
  <li>License number if required in the area</li>
</ul>

<h3>What a Good Service Description Looks Like</h3>
<p><strong>Weak:</strong> Locksmith service</p>
<p><strong>Better:</strong> Opened front entry door using non-destructive methods where possible, rekeyed 2 cylinders, cut 4 keys, tested operation with customer, and confirmed proper latch and key function before leaving.</p>

<h3>Recommended Payment Terms</h3>
<ul>
  <li>Due on receipt</li>
  <li>Net 7 for approved commercial accounts</li>
  <li>Net 15 only when intentionally offered</li>
</ul>

<h3>Disclosures to Consider</h3>
<ul>
  <li>Authorization confirmed by customer</li>
  <li>Destructive entry only with approval</li>
  <li>No warranty on customer-supplied parts unless stated</li>
  <li>Warranty scope for rekeys or parts installed</li>
  <li>After-hours fee disclosure</li>
</ul>

<h3>Professional Best Practices</h3>
<ul>
  <li>Keep numbering consistent</li>
  <li>Never use vague line items</li>
  <li>Do not bury taxes or fees</li>
  <li>Save invoices in an organized system</li>
  <li>Match invoice details to payment and job notes</li>
</ul>

<p><em>Last updated: April 2026</em></p>`
      }
    }
  ],

  guidedSetups: {
    "legal-guide": {
      badge: "Starter",
      title: "Legal Operating Setup",
      intro: "This is practical setup guidance, not legal advice. Locksmith rules vary by state, county, and city, so local requirements must be confirmed before launch.",
      done: "The business is formed, rules are checked, insurance is active, customer authorization is documented, and written policies are ready.",
      steps: [
        {
          icon: "business",
          title: "Form the business properly",
          summary: "Choose and register the legal structure the owner will actually use.",
          details: ["Register the business as advised by a qualified professional.", "Keep business and personal finances separate from day one.", "Use the same legal name consistently across banking, taxes, invoices, and ads."]
        },
        {
          icon: "fact_check",
          title: "Check licensing and registrations",
          summary: "Confirm the rules before advertising or taking jobs.",
          details: ["Check locksmith license requirements.", "Check local business license and contractor registration rules.", "Confirm whether access control work triggers alarm or low-voltage licensing.", "Register for sales tax where required."]
        },
        {
          icon: "verified_user",
          title: "Carry insurance",
          summary: "Protect the company before field work begins.",
          details: ["General liability.", "Commercial auto.", "Tools or inland marine coverage.", "Workers compensation if applicable.", "Any other coverage the owner's professional recommends."]
        },
        {
          icon: "badge",
          title: "Verify authorization before entry",
          summary: "Never unlock, rekey, or modify security hardware without confirming authorization.",
          details: ["Ask for ID when appropriate.", "Confirm the address, vehicle, or property connection.", "Document who approved the work.", "Record unusual circumstances in the job notes."]
        },
        {
          icon: "description",
          title: "Use written policies",
          summary: "Make the rules clear before there is a dispute.",
          details: ["Estimate and service authorization wording.", "Payment terms.", "Warranty terms.", "Cancellation policy.", "Destructive-entry authorization.", "Customer-supplied-parts disclaimer when appropriate."]
        },
        {
          icon: "folder",
          title: "Keep good records",
          summary: "The business needs organized proof of work, payment, and customer communication.",
          details: ["Save estimates, invoices, payments, photos, customer communications, tax records, and service notes.", "Match invoice details to payment and job notes.", "Protect names, addresses, phone numbers, gate codes, and other customer data."]
        },
        {
          icon: "campaign",
          title: "Advertise honestly",
          summary: "Trust is the business asset that protects the launch.",
          details: ["Do not advertise fake low prices.", "Do not use fake reviews or fake licensing claims.", "Do not promise emergency arrival times that cannot be met.", "Do not advertise services the locksmith cannot actually provide."]
        },
        {
          icon: "support_agent",
          title: "Know when to escalate",
          summary: "Some issues need a qualified attorney or CPA.",
          details: ["Escalate contracts, claims, employment issues, tax disputes, chargebacks, licensing problems, and major customer conflicts.", "Document facts before asking for professional guidance."]
        }
      ]
    },
    "financial-guide": {
      badge: "Starter",
      title: "Financial Operating Setup",
      intro: "Revenue is not profit, and cash in the account is not all available to spend. This setup turns the written guide into a weekly operating routine.",
      done: "Accounts are separated, weekly numbers are tracked, pricing is based on real costs, and the owner has a simple KPI dashboard.",
      steps: [
        {
          icon: "account_balance",
          title: "Set up money buckets",
          summary: "Create a simple structure before money starts moving.",
          details: ["Operating account.", "Tax reserve account.", "Owner pay account.", "Emergency reserve.", "Inventory and vehicle reserve.", "Marketing budget."]
        },
        {
          icon: "query_stats",
          title: "Track weekly numbers",
          summary: "The owner should know whether jobs are profitable each week.",
          details: ["Gross revenue.", "Completed jobs.", "Average ticket.", "Parts cost.", "Gross margin.", "Ad spend.", "Cost per lead.", "Cost per booked job.", "Fuel and travel cost.", "Chargebacks, refunds, callbacks, and net cash flow."]
        },
        {
          icon: "sell",
          title: "Build pricing from real costs",
          summary: "Each price should cover the work, not just sound competitive.",
          details: ["Include labor, travel, fuel, parts, payment processing, overhead, customer acquisition cost, and profit.", "Separate service call, labor, and parts when it helps clarity.", "Review pricing after real jobs show actual costs."]
        },
        {
          icon: "event_repeat",
          title: "Run the weekly finance routine",
          summary: "A small weekly rhythm prevents messy books.",
          details: ["Reconcile payments.", "Review unpaid invoices.", "Record all expenses.", "Review advertising results.", "Compare actual ticket size to target."]
        },
        {
          icon: "calendar_month",
          title: "Run the monthly review",
          summary: "Use monthly patterns to adjust the business.",
          details: ["Review profit and loss.", "Move money into tax reserve.", "Review parts reorder needs.", "Review vehicle costs.", "Review ad channels.", "List the most and least profitable job types."]
        },
        {
          icon: "dashboard",
          title: "Build the KPI dashboard",
          summary: "Keep the dashboard small enough to actually use.",
          details: ["Booked jobs.", "Completed jobs.", "Revenue by service type.", "Average invoice by service type.", "Margin by service type.", "Cost per lead by channel.", "Repeat customer count.", "Review count."]
        }
      ]
    },
    "google-business-profile": {
      badge: "Starter",
      title: "Google Business Profile Setup",
      intro: "Do this before ads. A complete profile helps customers find the locksmith on Google Search and Maps and supports many Local Services Ads setups.",
      done: "The profile is verified, service areas are accurate, the phone and website are correct, photos are live, and reviews can be collected.",
      steps: [
        { icon: "open_in_new", title: "Open the setup page", summary: "Use the business Google account, not a personal account that may be lost later.", details: ["Start the profile with the login the business will keep."], links: [{ label: "Open Google Business Profile setup", href: "https://business.google.com/add" }] },
        { icon: "add_business", title: "Add or claim the business", summary: "Claim an existing profile or create a new one.", details: ["If the business already appears on Google, claim it.", "If it does not exist yet, add it as a new business."], links: [{ label: "Read Google's add or claim guide", href: "https://support.google.com/business/answer/2911778?hl=en" }] },
        { icon: "map", title: "Choose the correct business type", summary: "Most new locksmiths are service-area businesses.", details: ["Hide the address unless customers visit a staffed storefront with signage.", "List only practical service areas."], links: [{ label: "Set service areas correctly", href: "https://support.google.com/business/answer/9157481?hl=en" }] },
        { icon: "edit_note", title: "Fill in every core field", summary: "Complete the data customers and Google need.", details: ["Business name.", "Phone.", "Website.", "Hours.", "Service categories.", "Service descriptions.", "Opening date.", "Plain-language business description."] },
        { icon: "photo_camera", title: "Upload proof and photos", summary: "Make the business look real and local.", details: ["Add logo, cover image, vehicle photos, tools, team photos, and real job photos.", "Do not use fake stock photos as the main proof."] },
        { icon: "verified", title: "Verify the profile", summary: "Follow the verification option Google gives you.", details: ["Video verification is common.", "Record slowly and show business proof clearly."], links: [{ label: "Open Google's verification help", href: "https://support.google.com/business/answer/7107242?hl=en" }] },
        { icon: "rate_review", title: "Ask for the first real reviews", summary: "Send the review link after completed jobs.", details: ["Send the request the same day.", "Never buy reviews or review your own business."], links: [{ label: "Get your Google review link", href: "https://support.google.com/business/answer/3474122?hl=en" }] }
      ]
    },
    "seo-setup": {
      badge: "Starter",
      title: "SEO & Search Console Setup",
      intro: "Make the locksmith website understandable to Google and useful to local customers. Do not create fake city pages or duplicate pages.",
      done: "Search Console is verified, the sitemap is submitted, service pages exist, and the business name, phone, and website match everywhere.",
      steps: [
        { icon: "map", title: "Write the service-area list", summary: "List only places the locksmith can actually reach.", details: ["Use exact cities, neighborhoods, ZIP codes, or counties.", "Keep it honest and practical."] },
        { icon: "web", title: "Create essential pages", summary: "Build the pages buyers expect.", details: ["Homepage.", "About.", "Contact.", "Residential Locksmith.", "Commercial Locksmith.", "Rekey.", "Lock Change.", "Lockout.", "Auto Lockout if offered."] },
        { icon: "call", title: "Put the phone number high", summary: "The phone number should be easy to tap.", details: ["Make it clickable on mobile.", "Match the Google Business Profile phone number."] },
        { icon: "search", title: "Add Search Console", summary: "Verify the live website.", details: ["Use the domain property method if possible."], links: [{ label: "Open Search Console", href: "https://search.google.com/search-console/welcome" }, { label: "Verify site ownership", href: "https://support.google.com/webmasters/answer/9008080?hl=en" }] },
        { icon: "upload_file", title: "Submit the sitemap", summary: "Help Google discover pages faster.", details: ["Submit the website sitemap after verification."], links: [{ label: "Submit a sitemap", href: "https://support.google.com/webmasters/answer/183668?hl=en" }] },
        { icon: "verified_user", title: "Add local trust content", summary: "Prove the business is real.", details: ["Use real photos.", "Add service descriptions, FAQs, reviews, licensing information when applicable, and clear service-area language."] },
        { icon: "event_repeat", title: "Check indexing weekly", summary: "Use Search Console as an operating habit.", details: ["Review indexing problems.", "Check manual actions and mobile usability issues.", "Review top search queries."] }
      ]
    },
    "local-services-ads": {
      badge: "Intermediate",
      title: "Local Services Ads Setup",
      intro: "Local Services Ads can be strong for locksmith leads, but eligibility, screening, insurance, licensing, and profile verification still matter.",
      done: "The profile is verified, required checks are approved, services and service areas are accurate, and someone is ready to answer every lead.",
      steps: [
        { icon: "verified", title: "Confirm eligibility", summary: "Start with Google's Local Services Ads onboarding.", details: ["Choose the correct country, state, and locksmith category."], links: [{ label: "Open Local Services Ads", href: "https://ads.google.com/local-services-ads/" }, { label: "Read Google's getting started guide", href: "https://support.google.com/localservices/answer/6224841?co=GENIE.CountryCode%3DUS&hl=en" }] },
        { icon: "folder",
          title: "Prepare business documents",
          summary: "Gather proof before starting verification.",
          details: ["Business registration.", "Insurance.", "Licensing.", "Owner information.", "Field worker information.", "Google Business Profile login."],
          links: [{ label: "Review U.S. verification requirements", href: "https://support.google.com/localservices/answer/12174778?co=GENIE.CountryCode%3DUS&hl=en" }]
        },
        { icon: "storefront", title: "Connect the Google profile", summary: "Use an owner or manager login.", details: ["The person setting up ads should be an owner or manager of the verified Google Business Profile."] },
        { icon: "security", title: "Complete screening", summary: "Submit exactly what Google asks for.", details: ["Do not launch before verification is complete."], links: [{ label: "Understand screening and verification", href: "https://support.google.com/localservices/answer/6226575?hl=en" }] },
        { icon: "build", title: "Choose services and service areas", summary: "Advertise only what the business can perform and answer quickly.", details: ["Keep the area tight at launch.", "Turn on only services the locksmith can actually provide."] },
        { icon: "support_agent", title: "Set lead handling rules", summary: "Ads only work when leads are handled quickly.", details: ["Answer calls fast.", "Mark bad leads.", "Listen to calls.", "Pause ads if nobody can answer."] }
      ]
    },
    "google-ads": {
      badge: "Intermediate",
      title: "Google Search Ads Setup",
      intro: "Use standard Search campaigns only after the website, phone number, service area, and tracking are ready. Start small and target buying intent.",
      done: "One focused Search campaign is live, conversion tracking is ready, negative keywords are added, and the landing page matches the ad.",
      steps: [
        { icon: "ads_click", title: "Open Google Ads", summary: "Create the account with the business Google login.", details: ["Connect the Google Business Profile when prompted."], links: [{ label: "Open Google Ads", href: "https://ads.google.com/home/" }, { label: "Create a campaign", href: "https://support.google.com/google-ads/answer/6324971?hl=en" }] },
        { icon: "search", title: "Create one Search campaign", summary: "Start narrow.", details: ["Choose Leads or Website traffic.", "Select Search.", "Do not start with broad automated campaign types for a brand-new locksmith account."], links: [{ label: "Create a Search campaign", href: "https://support.google.com/google-ads/answer/9510373?hl=en" }] },
        { icon: "category", title: "Use one service cluster", summary: "Keep intent clean.", details: ["Example: one campaign for Rekey and Lock Change, or one campaign for Lockout.", "Keep emergency, rekey, and commercial work separate."] },
        { icon: "location_on", title: "Set a tight service area", summary: "Spend where the business can arrive profitably.", details: ["Advertise only where the locksmith can arrive reliably and profitably."] },
        { icon: "key", title: "Use high-intent keywords", summary: "Focus on buyers, not browsers.", details: ["Start with phrase and exact match terms like locksmith near me, rekey locks, lock change, and house lockout."] },
        { icon: "block", title: "Add negative keywords", summary: "Prevent wasted spend from day one.", details: ["Add free, DIY, job, salary, training, course, wholesale, key blank, template, and how to."], links: [{ label: "Set negative keywords", href: "https://support.google.com/google-ads/answer/2453972?hl=en" }] },
        { icon: "link", title: "Match ads to landing pages", summary: "Send each ad to the matching page.", details: ["Rekey ads go to the rekey page.", "Lockout ads go to the lockout page.", "Do not send everything to the homepage."] },
        { icon: "manage_search", title: "Check search terms twice weekly", summary: "Keep the budget where calls are profitable.", details: ["Pause bad keywords.", "Add negatives.", "Move spend toward booked jobs."] }
      ]
    },
    "analytics-tracking": {
      badge: "Intermediate",
      title: "Analytics & Tracking Setup",
      intro: "Tracking tells the owner which marketing creates real calls and forms. Without it, ads become guessing.",
      done: "GA4 is installed, events are tested, Google Ads is linked if used, and the owner can see which channels produce leads.",
      steps: [
        { icon: "monitoring", title: "Create Google Analytics 4", summary: "Create an Analytics account and GA4 property for the locksmith website.", details: ["Use the business Google account."], links: [{ label: "Open Google Analytics", href: "https://analytics.google.com/" }, { label: "Set up Analytics for a website", href: "https://support.google.com/analytics/answer/14183469?hl=en" }] },
        { icon: "language", title: "Add a web data stream", summary: "Connect the live website URL.", details: ["Enter the live website URL.", "Copy the measurement ID."] },
        { icon: "code", title: "Install the tag", summary: "Add the Google tag or use Tag Manager.", details: ["Use Google Tag Manager if the business is ready for that."], links: [{ label: "Set up Google Tag Manager", href: "https://support.google.com/tagmanager/answer/6103696?hl=en" }] },
        { icon: "touch_app", title: "Track important actions", summary: "Track the actions that create leads.", details: ["Phone button clicks.", "Contact form submissions.", "Quote requests.", "Clicks from the Google Business Profile when possible."] },
        { icon: "sync_alt", title: "Link Google Ads", summary: "Let campaigns use conversion data.", details: ["Connect Google Ads and Analytics when Google Ads is used."], links: [{ label: "Link Google Ads and Analytics", href: "https://support.google.com/analytics/answer/9379420?hl=en" }] },
        { icon: "science", title: "Test before spending", summary: "Do not increase budget until events are working.", details: ["Click the phone link.", "Send a test form.", "Confirm the events show up."] }
      ]
    },
    "social-media-setup": {
      badge: "Starter",
      title: "Social Media Setup",
      intro: "Social media is trust support for a locksmith. It should prove the business is real, active, and reachable.",
      done: "The pages look real, contact details match, starter posts are published, and someone can respond to messages.",
      steps: [
        { icon: "share", title: "Create the main pages", summary: "Start with Facebook. Add Instagram only if the business can post photos consistently.", details: ["Use business-owned logins."], links: [{ label: "Create a Facebook Page", href: "https://www.facebook.com/pages/create" }, { label: "Set up an Instagram business account", href: "https://help.instagram.com/502981923235522" }] },
        { icon: "sync", title: "Match business details exactly", summary: "Make every profile match the website and Google profile.", details: ["Business name.", "Phone.", "Website.", "Service area.", "Hours."] },
        { icon: "image", title: "Upload brand assets", summary: "Make the page look finished.", details: ["Logo.", "Cover image.", "Short description.", "Service list.", "Clickable contact buttons."] },
        { icon: "post_add", title: "Publish ten starter posts", summary: "Show that the business is active.", details: ["Rekey tips.", "Lockout tips.", "Deadbolt education.", "Commercial hardware examples.", "Service-area posts.", "Review highlights."] },
        { icon: "event_repeat", title: "Create a weekly habit", summary: "Keep posting simple enough to sustain.", details: ["Post one real photo.", "Post one tip.", "Post one service reminder every week."] },
        { icon: "quickreply", title: "Save responses", summary: "Prepare replies before messages arrive.", details: ["Pricing requests.", "Service-area questions.", "After-hours calls.", "Review thank-yous."] }
      ]
    },
    "email-campaigns": {
      badge: "Intermediate",
      title: "Email Campaign Setup",
      intro: "Email should help with follow-up, review requests, repeat service, and commercial relationships. Keep it simple and useful.",
      done: "The owner can send a review request, follow up on quotes, and contact past customers without guessing what to write.",
      steps: [
        { icon: "alternate_email", title: "Choose an email platform", summary: "Connect the business email before sending campaigns.", details: ["Use a reputable tool.", "Use the real reply-to address."], links: [{ label: "Create a Mailchimp account", href: "https://mailchimp.com/help/create-an-account/" }, { label: "Create a Klaviyo account", href: "https://help.klaviyo.com/hc/en-us/articles/115005255728" }] },
        { icon: "table_chart", title: "Create customer fields", summary: "Save the data needed for follow-up.", details: ["Name.", "Email.", "Phone.", "Service type.", "Service date.", "City.", "Residential or commercial customer type."] },
        { icon: "rate_review", title: "Build the review request email", summary: "Send it one day after a completed job.", details: ["Include the Google review link.", "Use a short thank-you."] },
        { icon: "mark_email_unread", title: "Build quote follow-up", summary: "Follow up once when a quote does not book.", details: ["Include the phone number.", "Give a clear next step."] },
        { icon: "business_center", title: "Build commercial follow-up", summary: "Stay visible to recurring B2B customers.", details: ["Send useful reminders to property managers, offices, realtors, and small businesses every few months."] },
        { icon: "policy", title: "Stay compliant", summary: "Do not turn follow-up into spam.", details: ["Use honest subject lines.", "Use a real reply-to address.", "Include unsubscribe where required.", "Do not buy random email lists."], links: [{ label: "Read CAN-SPAM rules", href: "https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business" }] }
      ]
    }
  },

  events: {
    publish: {
      tabChange: "mtk-biab:tab-change",
      menuSelect: "mtk-biab:menu-select",
      itemSelect: "mtk-biab:item-select",
      ready: "mtk-biab:ready"
    },
    subscribe: []
  }
};
