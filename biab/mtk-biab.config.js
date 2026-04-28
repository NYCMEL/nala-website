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
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fff4e5;color:#8a4b00;font-size:12px;font-weight:700;text-transform:uppercase;">Starter</span></p>
<h3>Important Note</h3>
<p>This guide is practical and professional, but it is not legal advice. Locksmith rules vary by state, county, and city. Before operating, check your local requirements and talk to a qualified attorney or CPA when needed.</p>

<h3>1. Form the Business Properly</h3>
<p>Choose and register the legal structure you will actually use. Keep business and personal finances separate from day one.</p>

<h3>2. Check Licensing and Registration Rules</h3>
<p>Before advertising or taking jobs, confirm whether you need a locksmith license, local business license, contractor registration for certain installation work, sales tax registration, alarm or low-voltage licensing for access control work, or any other category-specific approval.</p>

<h3>3. Carry Insurance</h3>
<ul>
  <li>General liability</li>
  <li>Commercial auto</li>
  <li>Tools / inland marine coverage</li>
  <li>Workers’ compensation if applicable</li>
  <li>Any other coverage your professional recommends</li>
</ul>

<h3>4. Verify Authorization Before Entry</h3>
<p>Never unlock, rekey, or modify security hardware without verifying that the customer is authorized to request the work.</p>
<ul>
  <li>Ask for ID when appropriate</li>
  <li>Confirm address or vehicle connection</li>
  <li>Document who approved the work</li>
  <li>Record any unusual circumstances</li>
</ul>

<h3>5. Use Written Policies</h3>
<ul>
  <li>Estimate / service authorization wording</li>
  <li>Payment terms</li>
  <li>Warranty terms</li>
  <li>Cancellation policy</li>
  <li>Destructive-entry authorization wording</li>
  <li>Customer-supplied-parts disclaimer where appropriate</li>
</ul>

<h3>6. Keep Good Records</h3>
<p>Keep estimates, invoices, payments, photos, customer communications, tax records, and service notes in an organized system.</p>

<h3>7. Use Honest Advertising</h3>
<p>Do not advertise fake low prices, fake reviews, fake licensing, fake emergency times, or services you do not actually provide.</p>

<h3>8. Understand Tax Responsibilities</h3>
<p>Sales tax and service tax treatment can vary by state and by the mix of labor and goods on the invoice. Confirm the rules that apply in your state.</p>

<h3>9. Protect Customer Data</h3>
<p>Names, addresses, phone numbers, gate codes, job notes, and other customer data should be handled carefully and only shared when necessary for business operations.</p>

<h3>10. Know When to Escalate</h3>
<p>For contracts, claims, employment issues, tax disputes, chargebacks, licensing problems, or major customer conflicts, talk to a qualified attorney or CPA.</p>

<h3>10 Commandments for Locksmiths</h3>
<ol>
  <li>Verify authorization before you touch the lock.</li>
  <li>Choose non-destructive entry before destructive entry whenever reasonably possible.</li>
  <li>Quote honestly; never bait customers with fake low prices.</li>
  <li>Arrive professional: clean vehicle, clean clothes, clear communication.</li>
  <li>Protect the customer’s door, trim, hardware, vehicle, and property while you work.</li>
  <li>Test everything before you leave.</li>
  <li>Clean up every time and leave the site better than you found it.</li>
  <li>Document the job clearly: what was requested, what was done, and what was charged.</li>
  <li>Never fake expertise. If you are out of your depth, stop before you damage something.</li>
  <li>Guard your reputation like a master key. Trust is one of your most valuable tools.</li>
</ol>`
                }
              },
              {
                id: "financial-guide",
                label: "Financial Planning Guide",
                icon: "account_balance",
                content: {
                  title: "Financial Planning Guide",
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fbf4e5;color:#4a3a08;font-size:12px;font-weight:700;text-transform:uppercase;">Starter</span></p>
<h3>Core Rule</h3>
<p>Revenue is not profit, and cash in the account is not all yours to spend.</p>

<h3>Accounts and Buckets to Set Up</h3>
<ul>
  <li>Operating account</li>
  <li>Tax reserve account</li>
  <li>Owner pay account</li>
  <li>Emergency reserve</li>
  <li>Inventory and vehicle reserve</li>
  <li>Marketing budget</li>
</ul>

<h3>Numbers to Track Every Week</h3>
<ul>
  <li>Gross revenue</li>
  <li>Completed jobs</li>
  <li>Average ticket</li>
  <li>Parts cost</li>
  <li>Gross margin</li>
  <li>Ad spend</li>
  <li>Cost per lead</li>
  <li>Cost per booked job</li>
  <li>Fuel and travel cost</li>
  <li>Chargebacks / refunds / callbacks</li>
  <li>Net cash flow</li>
</ul>

<h3>Build Pricing from Real Costs</h3>
<p>Each job price should account for labor, travel, fuel, parts, payment processing, overhead, customer acquisition cost, and profit.</p>

<h3>Weekly Discipline</h3>
<ul>
  <li>Reconcile payments</li>
  <li>Review unpaid invoices</li>
  <li>Record all expenses</li>
  <li>Review advertising results</li>
  <li>Compare actual ticket size to target</li>
</ul>

<h3>Monthly Discipline</h3>
<ul>
  <li>Review profit and loss</li>
  <li>Move money into tax reserve</li>
  <li>Review parts reorder needs</li>
  <li>Review vehicle costs</li>
  <li>Review ad channels</li>
  <li>List your most profitable job types</li>
  <li>List your least profitable job types</li>
</ul>

<h3>Simple KPI Dashboard</h3>
<ul>
  <li>Booked jobs</li>
  <li>Completed jobs</li>
  <li>Revenue by service type</li>
  <li>Average invoice by service type</li>
  <li>Margin by service type</li>
  <li>Cost per lead by channel</li>
  <li>Repeat customer count</li>
  <li>Review count</li>
</ul>`
                }
              }
            ]
          },
          {
            id: "zip-code-pricing",
            label: "Per Zip Code Pricing",
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
<h3>Recommended Implementation</h3>
<p>The fastest useful version is a template-based designer. Let the locksmith enter their business name, phone, email, website, city, logo, colors, and tagline. Then place that data into a small set of locked, professional layouts.</p>

<h3>Best MVP Approach</h3>
<ol>
  <li>Offer 3 to 6 card templates.</li>
  <li>Let the user upload a logo or use a simple text logo.</li>
  <li>Let the user choose colors and font pairing from safe presets.</li>
  <li>Show a live front/back preview.</li>
  <li>Export print-ready PDF and PNG.</li>
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

<h3>Recommended Future Upgrade</h3>
<p>Add a “Use in Canva” button later so users can move the design into a richer editor without replacing the in-site starter designer.</p>`
                }
              },
              {
                id: "letterhead",
                label: "Letterhead",
                icon: "note_alt",
                content: {
                  title: "Letterhead Designer",
                  body: `<div data-stationery-designer-panel="letterhead"></div><p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fbf4e5;color:#4a3a08;font-size:12px;font-weight:700;text-transform:uppercase;">Starter</span></p>
<h3>Recommended Implementation</h3>
<p>Use the same template-based system as the business cards. The user should enter their brand details once and have them populate automatically across all stationery products.</p>

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
<h3>Recommended Implementation</h3>
<p>Use simple templates. This is not the place for heavy design. The goal is a clean, branded envelope that feels professional.</p>

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
<p>This prototype uses free Google Fonts and temporary in-house SVG icons so the workflow can be tested now. <strong>Before production, buy a premium locksmith icon pack and a licensed production font set.</strong></p>
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
<p>These guidelines are generated from the user’s live logo selections so the output feels like a real starter brand system instead of static advice.</p>
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
<p>The variation pack below shows the same logo system adapted for light, dark, social, favicon, and one-color use so buyers understand what a production handoff should include.</p>
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
<p>Download a production starter package with SVG logo files, color notes, and usage guidance for web, invoices, social profiles, and print handoff.</p>
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
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fbf4e5;color:#4a3a08;font-size:12px;font-weight:700;text-transform:uppercase;">Starter</span></p>
<p>Do this before ads. A complete Google Business Profile helps customers find the locksmith on Google Search and Maps, and it is also required for many Local Services Ads setups.</p>
<div class="mtk-biab-guide">
  <div class="mtk-biab-guide__step"><strong>1. Open the setup page.</strong><p>Use the business Google account, not a personal account that will be lost later.</p><a class="mtk-biab-guide__link" href="https://business.google.com/add" target="_blank" rel="noopener">Open Google Business Profile setup</a></div>
  <div class="mtk-biab-guide__step"><strong>2. Add or claim the business.</strong><p>If the business already appears on Google, claim it. If it does not exist yet, add it as a new business.</p><a class="mtk-biab-guide__link" href="https://support.google.com/business/answer/2911778?hl=en" target="_blank" rel="noopener">Read Google's add or claim guide</a></div>
  <div class="mtk-biab-guide__step"><strong>3. Choose the correct business type.</strong><p>Most new locksmiths are service-area businesses. If customers do not visit a staffed storefront with signage, hide the address and list service areas instead.</p><a class="mtk-biab-guide__link" href="https://support.google.com/business/answer/9157481?hl=en" target="_blank" rel="noopener">Set service areas correctly</a></div>
  <div class="mtk-biab-guide__step"><strong>4. Fill in every core field.</strong><p>Add business name, phone, website, hours, service categories, service descriptions, opening date, and a plain-language business description.</p></div>
  <div class="mtk-biab-guide__step"><strong>5. Upload proof and photos.</strong><p>Add logo, cover image, vehicle photos, tools, team photos, and real job photos. Do not use fake stock photos as the main proof.</p></div>
  <div class="mtk-biab-guide__step"><strong>6. Verify the profile.</strong><p>Follow the verification option Google gives you. Video verification is common; record slowly and show business proof clearly.</p><a class="mtk-biab-guide__link" href="https://support.google.com/business/answer/7107242?hl=en" target="_blank" rel="noopener">Open Google's verification help</a></div>
  <div class="mtk-biab-guide__step"><strong>7. Ask for the first real reviews.</strong><p>After each completed job, send the review link the same day. Never buy reviews or review your own business.</p><a class="mtk-biab-guide__link" href="https://support.google.com/business/answer/3474122?hl=en" target="_blank" rel="noopener">Get your Google review link</a></div>
</div>
<p><strong>Done means:</strong> the profile is verified, service areas are accurate, the phone and website are correct, photos are live, and the business can receive reviews.</p>`
                }
              },
              {
                id: "seo-setup",
                label: "SEO & Search Console",
                icon: "search",
                content: {
                  title: "SEO & Search Console Setup",
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fbf4e5;color:#4a3a08;font-size:12px;font-weight:700;text-transform:uppercase;">Starter</span></p>
<p>The goal is to make the locksmith website understandable to Google and useful to local customers. Do not make fake city pages or copy the same page twenty times.</p>
<div class="mtk-biab-guide">
  <div class="mtk-biab-guide__step"><strong>1. Write the service-area list.</strong><p>List the exact cities, neighborhoods, ZIP codes, or counties the locksmith can actually reach. Keep it honest and practical.</p></div>
  <div class="mtk-biab-guide__step"><strong>2. Create the essential pages.</strong><p>Homepage, About, Contact, Residential Locksmith, Commercial Locksmith, Rekey, Lock Change, Lockout, and Auto Lockout if offered.</p></div>
  <div class="mtk-biab-guide__step"><strong>3. Put the phone number high on every page.</strong><p>The number should be clickable on mobile and match the Google Business Profile phone number.</p></div>
  <div class="mtk-biab-guide__step"><strong>4. Add Search Console.</strong><p>Add the live website as a property and verify ownership. If possible, use the domain property method.</p><a class="mtk-biab-guide__link" href="https://search.google.com/search-console/welcome" target="_blank" rel="noopener">Open Search Console</a><a class="mtk-biab-guide__link" href="https://support.google.com/webmasters/answer/9008080?hl=en" target="_blank" rel="noopener">Verify site ownership</a></div>
  <div class="mtk-biab-guide__step"><strong>5. Submit the sitemap.</strong><p>After verification, submit the website sitemap so Google can discover the pages faster.</p><a class="mtk-biab-guide__link" href="https://support.google.com/webmasters/answer/183668?hl=en" target="_blank" rel="noopener">Submit a sitemap</a></div>
  <div class="mtk-biab-guide__step"><strong>6. Add local trust content.</strong><p>Use real photos, service descriptions, FAQs, reviews, licensing information when applicable, and clear service-area language.</p></div>
  <div class="mtk-biab-guide__step"><strong>7. Check indexing once per week.</strong><p>In Search Console, look for coverage/indexing problems, manual actions, mobile usability issues, and top search queries.</p></div>
</div>
<p><strong>Done means:</strong> Google Search Console is verified, the sitemap is submitted, the site has service pages, and the business name, phone, and website match everywhere.</p>`
                }
              },
              {
                id: "local-services-ads",
                label: "Local Services Ads",
                icon: "verified",
                content: {
                  title: "Local Services Ads Setup",
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fff4e5;color:#8a4b00;font-size:12px;font-weight:700;text-transform:uppercase;">Intermediate</span></p>
<p>Local Services Ads can be strong for locksmith leads, but Google may require screening, licenses, insurance, background checks, and a verified Google Business Profile.</p>
<div class="mtk-biab-guide">
  <div class="mtk-biab-guide__step"><strong>1. Confirm eligibility.</strong><p>Start with Google's Local Services Ads onboarding and choose the correct country, state, and locksmith category.</p><a class="mtk-biab-guide__link" href="https://ads.google.com/local-services-ads/" target="_blank" rel="noopener">Open Local Services Ads</a><a class="mtk-biab-guide__link" href="https://support.google.com/localservices/answer/6224841?co=GENIE.CountryCode%3DUS&amp;hl=en" target="_blank" rel="noopener">Read Google's getting started guide</a></div>
  <div class="mtk-biab-guide__step"><strong>2. Prepare business documents.</strong><p>Gather business registration, insurance, licensing, owner information, field worker information, and the Google Business Profile login.</p><a class="mtk-biab-guide__link" href="https://support.google.com/localservices/answer/12174778?co=GENIE.CountryCode%3DUS&amp;hl=en" target="_blank" rel="noopener">Review U.S. verification requirements</a></div>
  <div class="mtk-biab-guide__step"><strong>3. Connect the Google Business Profile.</strong><p>The person setting up ads should be an owner or manager of the verified profile.</p></div>
  <div class="mtk-biab-guide__step"><strong>4. Complete screening.</strong><p>Submit the requested checks exactly as Google asks. Do not launch before verification is complete.</p><a class="mtk-biab-guide__link" href="https://support.google.com/localservices/answer/6226575?hl=en" target="_blank" rel="noopener">Understand screening and verification</a></div>
  <div class="mtk-biab-guide__step"><strong>5. Choose services and service areas.</strong><p>Turn on only services the locksmith can actually perform and answer quickly. Keep the area tight at launch.</p></div>
  <div class="mtk-biab-guide__step"><strong>6. Set lead handling rules.</strong><p>Answer calls fast, mark bad leads, listen to calls, and pause ads if nobody can answer.</p></div>
</div>
<p><strong>Done means:</strong> the profile is verified, required checks are approved, services and service areas are accurate, and someone is ready to answer every lead.</p>`
                }
              },
              {
                id: "google-ads",
                label: "Google Search Ads",
                icon: "ads_click",
                content: {
                  title: "Google Search Ads Setup",
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fff4e5;color:#8a4b00;font-size:12px;font-weight:700;text-transform:uppercase;">Intermediate</span></p>
<p>Use standard Search campaigns only after the website, phone number, service area, and tracking are ready. Start small and target buying intent.</p>
<div class="mtk-biab-guide">
  <div class="mtk-biab-guide__step"><strong>1. Open Google Ads.</strong><p>Create the account with the business Google login and connect the Google Business Profile when prompted.</p><a class="mtk-biab-guide__link" href="https://ads.google.com/home/" target="_blank" rel="noopener">Open Google Ads</a><a class="mtk-biab-guide__link" href="https://support.google.com/google-ads/answer/6324971?hl=en" target="_blank" rel="noopener">Create a campaign</a></div>
  <div class="mtk-biab-guide__step"><strong>2. Create one Search campaign.</strong><p>Choose Leads or Website traffic, then select Search. Do not start with broad automated campaign types for a brand-new locksmith account.</p><a class="mtk-biab-guide__link" href="https://support.google.com/google-ads/answer/9510373?hl=en" target="_blank" rel="noopener">Create a Search campaign</a></div>
  <div class="mtk-biab-guide__step"><strong>3. Use one service cluster.</strong><p>Example: one campaign for Rekey and Lock Change, or one campaign for Lockout. Keep emergency, rekey, and commercial work separate.</p></div>
  <div class="mtk-biab-guide__step"><strong>4. Set a tight service area.</strong><p>Advertise only where the business can arrive reliably and profitably.</p></div>
  <div class="mtk-biab-guide__step"><strong>5. Use high-intent keywords.</strong><p>Start with phrase and exact match terms like "locksmith near me", "rekey locks", "lock change", and "house lockout".</p></div>
  <div class="mtk-biab-guide__step"><strong>6. Add negative keywords on day one.</strong><p>Add free, DIY, job, salary, training, course, wholesale, key blank, template, and how to.</p><a class="mtk-biab-guide__link" href="https://support.google.com/google-ads/answer/2453972?hl=en" target="_blank" rel="noopener">Set negative keywords</a></div>
  <div class="mtk-biab-guide__step"><strong>7. Send each ad to the matching page.</strong><p>Rekey ads go to the rekey page. Lockout ads go to the lockout page. Do not send everything to the homepage.</p></div>
  <div class="mtk-biab-guide__step"><strong>8. Check search terms twice per week.</strong><p>Pause bad keywords, add negatives, and keep the budget where the calls are profitable.</p></div>
</div>
<p><strong>Done means:</strong> one focused Search campaign is live, conversion tracking is ready, negative keywords are added, and the landing page matches the ad.</p>`
                }
              },
              {
                id: "analytics-tracking",
                label: "Analytics & Tracking",
                icon: "monitoring",
                content: {
                  title: "Analytics & Tracking Setup",
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fff4e5;color:#8a4b00;font-size:12px;font-weight:700;text-transform:uppercase;">Intermediate</span></p>
<p>Tracking tells the owner which marketing creates real calls and forms. Without it, ads become guessing.</p>
<div class="mtk-biab-guide">
  <div class="mtk-biab-guide__step"><strong>1. Create Google Analytics 4.</strong><p>Create an Analytics account and GA4 property for the locksmith website.</p><a class="mtk-biab-guide__link" href="https://analytics.google.com/" target="_blank" rel="noopener">Open Google Analytics</a><a class="mtk-biab-guide__link" href="https://support.google.com/analytics/answer/14183469?hl=en" target="_blank" rel="noopener">Set up Analytics for a website</a></div>
  <div class="mtk-biab-guide__step"><strong>2. Add a web data stream.</strong><p>Enter the live website URL and copy the measurement ID.</p></div>
  <div class="mtk-biab-guide__step"><strong>3. Install the tag.</strong><p>Add the Google tag to the website or use Google Tag Manager if the business is ready for that.</p><a class="mtk-biab-guide__link" href="https://support.google.com/tagmanager/answer/6103696?hl=en" target="_blank" rel="noopener">Set up Google Tag Manager</a></div>
  <div class="mtk-biab-guide__step"><strong>4. Track important actions.</strong><p>Track phone button clicks, contact form submissions, quote requests, and clicks from the Google Business Profile when possible.</p></div>
  <div class="mtk-biab-guide__step"><strong>5. Link Google Ads.</strong><p>Connect Google Ads and Analytics so campaigns can use conversion data.</p><a class="mtk-biab-guide__link" href="https://support.google.com/analytics/answer/9379420?hl=en" target="_blank" rel="noopener">Link Google Ads and Analytics</a></div>
  <div class="mtk-biab-guide__step"><strong>6. Test before spending.</strong><p>Click the phone link and send a test form. Confirm the events show up before increasing ad budget.</p></div>
</div>
<p><strong>Done means:</strong> GA4 is installed, events are tested, Google Ads is linked if used, and the owner can see which channels produce leads.</p>`
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
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fbf4e5;color:#4a3a08;font-size:12px;font-weight:700;text-transform:uppercase;">Starter</span></p>
<p>Social media is trust support for a locksmith. It should prove the business is real, active, and reachable.</p>
<div class="mtk-biab-guide">
  <div class="mtk-biab-guide__step"><strong>1. Create the main pages.</strong><p>Start with Facebook Business Page. Add Instagram only if the business can post photos consistently.</p><a class="mtk-biab-guide__link" href="https://www.facebook.com/pages/create" target="_blank" rel="noopener">Create a Facebook Page</a><a class="mtk-biab-guide__link" href="https://help.instagram.com/502981923235522" target="_blank" rel="noopener">Set up an Instagram business account</a></div>
  <div class="mtk-biab-guide__step"><strong>2. Match business details exactly.</strong><p>Use the same business name, phone, website, service area, and hours as the website and Google Business Profile.</p></div>
  <div class="mtk-biab-guide__step"><strong>3. Upload brand assets.</strong><p>Add logo, cover image, short description, service list, and clickable contact buttons.</p></div>
  <div class="mtk-biab-guide__step"><strong>4. Publish ten starter posts.</strong><p>Use rekey tips, lockout tips, deadbolt education, commercial hardware examples, service-area posts, and review highlights.</p></div>
  <div class="mtk-biab-guide__step"><strong>5. Create a simple weekly habit.</strong><p>Post one real photo, one tip, and one service reminder every week. Keep it practical.</p></div>
  <div class="mtk-biab-guide__step"><strong>6. Save responses.</strong><p>Prepare short replies for pricing requests, service-area questions, after-hours calls, and review thank-yous.</p></div>
</div>
<p><strong>Done means:</strong> the pages look real, contact details match, starter posts are published, and someone can respond to messages.</p>`
                }
              },
              {
                id: "email-campaigns",
                label: "Email Campaigns",
                icon: "send",
                content: {
                  title: "Email Campaigns",
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fff4e5;color:#8a4b00;font-size:12px;font-weight:700;text-transform:uppercase;">Intermediate</span></p>
<p>Email should help with follow-up, review requests, repeat service, and commercial relationships. Keep it simple and useful.</p>
<div class="mtk-biab-guide">
  <div class="mtk-biab-guide__step"><strong>1. Choose an email platform.</strong><p>Use a reputable tool and connect the business email address before sending campaigns.</p><a class="mtk-biab-guide__link" href="https://mailchimp.com/help/create-an-account/" target="_blank" rel="noopener">Create a Mailchimp account</a><a class="mtk-biab-guide__link" href="https://help.klaviyo.com/hc/en-us/articles/115005255728" target="_blank" rel="noopener">Create a Klaviyo account</a></div>
  <div class="mtk-biab-guide__step"><strong>2. Create the customer list fields.</strong><p>Save name, email, phone, service type, service date, city, and whether the customer is residential or commercial.</p></div>
  <div class="mtk-biab-guide__step"><strong>3. Build the review request email.</strong><p>Send it one day after a completed job. Include the Google review link and a short thank-you.</p></div>
  <div class="mtk-biab-guide__step"><strong>4. Build the quote follow-up email.</strong><p>If a customer asks for a quote but does not book, follow up once with the phone number and clear next step.</p></div>
  <div class="mtk-biab-guide__step"><strong>5. Build the commercial follow-up.</strong><p>For property managers, offices, realtors, and small businesses, send a helpful reminder every few months.</p></div>
  <div class="mtk-biab-guide__step"><strong>6. Stay compliant.</strong><p>Use honest subject lines, a real reply-to address, and an unsubscribe option where required. Do not buy random email lists.</p><a class="mtk-biab-guide__link" href="https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business" target="_blank" rel="noopener">Read CAN-SPAM rules</a></div>
</div>
<p><strong>Done means:</strong> the owner can send a review request, follow up on quotes, and contact past customers without guessing what to write.</p>`
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
