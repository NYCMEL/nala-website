const MTK_BIAB_CONFIG = {
  component: "mtk-biab",
  version: "1.0.0",

  tabs: [
    {
      id: "website-maker",
      label: "Website Maker",
      icon: "language",
      active: true,
      type: "iframe",
      iframeUrl: "client"
    },
    {
      id: "business-guide",
      label: "Business Guide & Pricing",
      icon: "menu_book",
      active: false,
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
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#eef4ff;color:#0d47a1;font-size:12px;font-weight:700;text-transform:uppercase;">Starter</span></p>
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
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#eef4ff;color:#0d47a1;font-size:12px;font-weight:700;text-transform:uppercase;">Starter</span></p>
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
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#eef4ff;color:#0d47a1;font-size:12px;font-weight:700;text-transform:uppercase;">Starter</span></p>
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
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#eef4ff;color:#0d47a1;font-size:12px;font-weight:700;text-transform:uppercase;">Starter</span></p>
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
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#eef4ff;color:#0d47a1;font-size:12px;font-weight:700;text-transform:uppercase;">Starter</span></p>
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
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#eef4ff;color:#0d47a1;font-size:12px;font-weight:700;text-transform:uppercase;">Starter</span></p>
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
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#eef4ff;color:#0d47a1;font-size:12px;font-weight:700;text-transform:uppercase;">Starter</span></p>
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
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#eef4ff;color:#0d47a1;font-size:12px;font-weight:700;text-transform:uppercase;">Starter</span></p>
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
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#eef4ff;color:#0d47a1;font-size:12px;font-weight:700;text-transform:uppercase;">Starter</span></p>
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
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#eef4ff;color:#0d47a1;font-size:12px;font-weight:700;text-transform:uppercase;">Starter</span></p>
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
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#eef4ff;color:#0d47a1;font-size:12px;font-weight:700;text-transform:uppercase;">Starter</span></p>
<h3>Recommended Implementation</h3>
<p>The best practical version is a guided logo generator, not a totally open-ended canvas. Let the user pick a business tone, icon direction, and color family, then generate a few controlled concepts.</p>

<h3>Inputs</h3>
<ul>
  <li>Business name</li>
  <li>Slogan (optional)</li>
  <li>Brand tone: budget / premium / commercial / family / emergency</li>
  <li>Icon direction: key / shield / keyhole / monogram / wordmark</li>
  <li>Color palette</li>
</ul>

<h3>Outputs</h3>
<ul>
  <li>Primary logo</li>
  <li>Icon-only logo</li>
  <li>Horizontal logo</li>
  <li>Square logo</li>
  <li>Black version</li>
  <li>White version</li>
</ul>

<h3>Good Locksmith Logo Directions</h3>
<ul>
  <li>Clean wordmark with subtle keyhole or key accent</li>
  <li>Shield plus monogram for trust and security</li>
  <li>Minimal modern icon for commercial feel</li>
  <li>Bold van-friendly mark readable from a distance</li>
</ul>

<h3>Avoid</h3>
<ul>
  <li>Tiny details</li>
  <li>Overly metallic fake effects</li>
  <li>Generic clip-art feel</li>
  <li>Too many colors</li>
</ul>`
                }
              },
              {
                id: "brand-guidelines",
                label: "Brand Guidelines",
                icon: "color_lens",
                content: {
                  title: "Brand Guidelines",
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fff4e5;color:#8a4b00;font-size:12px;font-weight:700;text-transform:uppercase;">Intermediate</span></p>
<h3>What the Customer Should Receive</h3>
<ul>
  <li>Primary logo</li>
  <li>Secondary logo</li>
  <li>Icon mark</li>
  <li>Light-background version</li>
  <li>Dark-background version</li>
  <li>Color palette with HEX values</li>
  <li>Font pairings</li>
  <li>Spacing rules</li>
  <li>Minimum size rules</li>
  <li>“Do not” examples</li>
</ul>

<h3>Why This Matters</h3>
<p>Consistency creates trust. A locksmith who uses the same look across vehicle wrap, business cards, invoices, website, and Google profile feels more established and professional.</p>`
                }
              },
              {
                id: "logo-variations",
                label: "Logo Variations",
                icon: "grid_view",
                content: {
                  title: "Logo Variations",
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fff4e5;color:#8a4b00;font-size:12px;font-weight:700;text-transform:uppercase;">Intermediate</span></p>
<h3>Recommended Export Set</h3>
<ul>
  <li>SVG</li>
  <li>PNG with transparent background</li>
  <li>PDF print version</li>
  <li>Favicon square</li>
  <li>Social profile image</li>
  <li>Van decal version</li>
  <li>Single-color embroidery-safe version</li>
</ul>

<h3>Recommended UX</h3>
<p>After the user picks a logo direction, show all required variants as one pack. Do not make them manually recreate the logo in multiple sizes.</p>`
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
                id: "social-media-setup",
                label: "Social Media Setup",
                icon: "share",
                content: {
                  title: "Social Media Setup",
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#eef4ff;color:#0d47a1;font-size:12px;font-weight:700;text-transform:uppercase;">Starter</span></p>
<h3>Best Starter Channels for a Local Locksmith</h3>
<ul>
  <li>Google Business Profile first</li>
  <li>Facebook business page second</li>
  <li>Instagram only if the business will post consistently</li>
  <li>Nextdoor if active in the service area</li>
</ul>

<h3>Step-by-Step</h3>
<ol>
  <li>Use the same business name, phone, and website everywhere.</li>
  <li>Upload the logo, cover image, and service-area description.</li>
  <li>Add hours, contact buttons, and service list.</li>
  <li>Write a short, clear business bio.</li>
  <li>Upload a few real photos.</li>
  <li>Publish 6 to 10 starter posts before sending traffic.</li>
  <li>Create a repeatable review request process.</li>
</ol>

<h3>Starter Post Ideas</h3>
<ul>
  <li>Rekey education</li>
  <li>Lock maintenance tips</li>
  <li>Commercial hardware examples</li>
  <li>“What to do when locked out” tips</li>
  <li>Service-area announcement posts</li>
  <li>Customer review highlights</li>
</ul>`
                }
              },
              {
                id: "seo-setup",
                label: "SEO Setup",
                icon: "search",
                content: {
                  title: "SEO Setup",
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fff4e5;color:#8a4b00;font-size:12px;font-weight:700;text-transform:uppercase;">Intermediate</span></p>
<h3>Goal</h3>
<p>Show up for high-intent local searches like “locksmith near me,” “rekey locks in [city],” “car lockout [city],” and “commercial locksmith [city].”</p>

<h3>Step-by-Step</h3>
<ol>
  <li>Create a unique page title and meta description for each important page.</li>
  <li>Build separate pages for major service types.</li>
  <li>Build city or service-area pages only for places the business truly serves.</li>
  <li>Put phone number and service area high on every page.</li>
  <li>Add trust signals: reviews, FAQs, real photos, service details.</li>
  <li>Link related service pages together.</li>
  <li>Add local business schema only if implemented correctly.</li>
  <li>Keep business name, address, and phone data consistent across listings.</li>
  <li>Connect Google Search Console and analytics.</li>
  <li>Update the site regularly instead of publishing and forgetting it.</li>
</ol>

<h3>SEO Warning</h3>
<p>Do not mass-produce thin city pages with nearly identical text. That usually creates weak pages and hurts trust.</p>`
                }
              },
              {
                id: "email-campaigns",
                label: "Email Campaigns",
                icon: "send",
                content: {
                  title: "Email Campaigns",
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fff4e5;color:#8a4b00;font-size:12px;font-weight:700;text-transform:uppercase;">Intermediate</span></p>
<h3>What Email Should Do for a Locksmith Business</h3>
<ul>
  <li>Follow up on quotes</li>
  <li>Request reviews</li>
  <li>Reconnect with past customers</li>
  <li>Stay top of mind with property managers and business clients</li>
  <li>Educate instead of spam</li>
</ul>

<h3>Core Automations</h3>
<ol>
  <li>New customer thank-you + receipt</li>
  <li>Review request 1 day later</li>
  <li>Quote follow-up if the customer did not book</li>
  <li>6-month home or business security follow-up</li>
  <li>Periodic B2B follow-up for property managers, offices, and realtors</li>
</ol>

<h3>Starter Sequence</h3>
<ul>
  <li><strong>Email 1:</strong> Thanks for choosing us</li>
  <li><strong>Email 2:</strong> Please leave a review</li>
  <li><strong>Email 3:</strong> We’re here for rekeys, lock changes, and commercial service when you need us</li>
</ul>

<h3>Rules</h3>
<ul>
  <li>Always identify the business clearly</li>
  <li>Use a real reply-to address</li>
  <li>Keep subject lines honest</li>
  <li>Offer actual value</li>
  <li>Follow applicable email rules and consent practices</li>
</ul>`
                }
              },
              {
                id: "google-ads",
                label: "Google Ads Setup",
                icon: "ads_click",
                content: {
                  title: "Google Ads Setup",
                  body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fff4e5;color:#8a4b00;font-size:12px;font-weight:700;text-transform:uppercase;">Intermediate</span></p>
<h3>Strategic Note</h3>
<p>For locksmiths, Google Business Profile should be set up first. Where eligible, Local Services Ads may be one of the best paid channels. Standard Google Ads can work well too, but only when tightly targeted and tracked.</p>

<h3>Step-by-Step</h3>
<ol>
  <li>Create the Google Ads account using the main business Google account.</li>
  <li>Make sure the website is live and the Google Business Profile is set up correctly.</li>
  <li>Install call and form conversion tracking before spending heavily.</li>
  <li>Start with one campaign for one service cluster.</li>
  <li>Target only the real service area.</li>
  <li>Use high-intent keywords only.</li>
  <li>Write ads that mention the real service and real location.</li>
  <li>Send traffic to a matching service page, not just the homepage.</li>
  <li>Add negative keywords immediately.</li>
  <li>Review search terms and performance every few days.</li>
</ol>

<h3>Starter Campaign Structure</h3>
<p><strong>Campaign 1: Lockouts</strong></p>
<ul>
  <li>House lockout</li>
  <li>Car lockout</li>
  <li>Locksmith near me</li>
</ul>

<p><strong>Campaign 2: Rekey / Lock Change</strong></p>
<ul>
  <li>Rekey locks</li>
  <li>Lock change</li>
  <li>Deadbolt installation</li>
</ul>

<h3>Starter Negative Keywords</h3>
<ul>
  <li>free</li>
  <li>diy</li>
  <li>job</li>
  <li>salary</li>
  <li>training</li>
  <li>course</li>
  <li>how to</li>
  <li>wholesale</li>
  <li>key blank</li>
</ul>

<h3>Do Not Launch Ads Until</h3>
<ul>
  <li>The phone is answered quickly</li>
  <li>The landing page matches the ad</li>
  <li>Tracking is working</li>
  <li>The service area is set correctly</li>
</ul>`
                }
              }
            ]
          }
        ]
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
        body: `<p><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fff4e5;color:#8a4b00;font-size:12px;font-weight:700;text-transform:uppercase;">Starter</span></p>
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
    subscribe: [
      "mtk-biab:tab-change",
      "mtk-biab:menu-select",
      "mtk-biab:item-select",
      "mtk-biab:ready"
    ]
  }
};
