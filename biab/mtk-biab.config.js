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
      iframeUrl: "/repo_deploy/client/index.html"
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
                  body: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                  <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                  <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                  <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>`
                }
              },
              {
                id: "startup-checklist",
                label: "Startup Checklist",
                icon: "checklist",
                content: {
                  title: "Startup Checklist",
                  body: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac mauris vitae enim fringilla gravida. Quisque vel ligula at eros tincidunt faucibus eget vel risus.</p>
                  <p>Fusce convallis metus id felis luctus adipiscing. Pellentesque eget neque at sem venenatis eleifend. Ut nonummy mi in odio. Nunc interdum lacus sit amet orci.</p>
                  <p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin vel ante a orci tempus eleifend ut et magna.</p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus luctus urna sed urna ultricies ac tempor dui sagittis.</p>`
                }
              },
              {
                id: "legal-guide",
                label: "Legal Guide",
                icon: "gavel",
                content: {
                  title: "Legal Guide",
                  body: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel libero at lectus rutrum vestibulum vitae ut turpis. Ut nisl quam, interdum eu tincidunt interdum, adipiscing laoreet purus.</p>
                  <p>Fusce accumsan mollis eros. Pellentesque a diam sit amet mi ullamcorper vehicula. Integer adipiscing risus a sem. Nullam quis massa sit amet nibh viverra malesuada.</p>
                  <p>Nunc sem lacus, accumsan quis, faucibus non, congue vel, leo. Duis mi erat, commodo ut, facilisis non, euismod nec, massa. Nunc sem lacus, accumsan quis, faucibus non.</p>`
                }
              },
              {
                id: "financial-guide",
                label: "Financial Planning Guide",
                icon: "account_balance",
                content: {
                  title: "Financial Planning Guide",
                  body: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.</p>
                  <p>Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent.</p>
                  <p>Per conubia nostra, per inceptos hymenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor.</p>`
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
                  body: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.</p>
                  <p>Nunc viverra imperdiet enim. Fusce est. Vivamus a tellus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra nonummy pede. Mauris et orci.</p>
                  <p>Aenean nec lorem. In porttitor. Donec laoreet nonummy augue. Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend.</p>`
                }
              },
              {
                id: "pricing-southeast",
                label: "Southeast Region",
                icon: "map",
                content: {
                  title: "Southeast Region Pricing",
                  body: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pretium, ligula sollicitudin laoreet viverra, tortor libero sodales leo, eget blandit nunc tortor eu nibh. Nullam mollis.</p>
                  <p>Ut justo. Suspendisse potenti. Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est.</p>
                  <p>Sed lectus. Praesent elementum hendrerit tortor. Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl.</p>`
                }
              },
              {
                id: "pricing-midwest",
                label: "Midwest Region",
                icon: "map",
                content: {
                  title: "Midwest Region Pricing",
                  body: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.</p>
                  <p>Nullam arcu aliquam metus. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus. Praesent elementum hendrerit tortor.</p>
                  <p>Sed semper lorem at felis. Vestibulum volutpat, lacus a ultrices sagittis, mi neque euismod dui, eu pulvinar nunc sapien ornare nisl. Phasellus pede arcu, dapibus eu, fermentum et, dapibus sed, urna.</p>`
                }
              },
              {
                id: "pricing-west",
                label: "West Region",
                icon: "map",
                content: {
                  title: "West Region Pricing",
                  body: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat.</p>
                  <p>Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.</p>
                  <p>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.</p>`
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
                  body: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sit amet est. Quisque diam lorem, interdum vitae, dapibus ac, scelerisque vitae, pede. Donec eget tellus non erat lacinia fermentum.</p>
                  <p>Donec in velit vel ipsum auctor pulvinar. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Praesent hendrerit lacus ut lacus consequat convallis.</p>
                  <p>Praesent luctus. Nullam faucibus purus in turpis blandit aliquet. Sed molestie. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.</p>`
                }
              },
              {
                id: "letterhead",
                label: "Letterhead",
                icon: "note_alt",
                content: {
                  title: "Letterhead Designer",
                  body: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam dui ligula, fringilla a, euismod sodales, sollicitudin vel, wisi. Morbi auctor lorem non justo. Nam lacus libero, pretium at, lobortis vitae, ornare et, wisi.</p>
                  <p>Donec aliquet, tortor sed accumsan bibendum, erat ligula aliquet magna, vitae ornare odio metus a mi. Morbi ac orci et nisl hendrerit mollis. Vestibulum ut nisl. Donec vitae sapien ut libero venenatis faucibus.</p>
                  <p>Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc.</p>`
                }
              },
              {
                id: "envelopes",
                label: "Envelopes",
                icon: "mail",
                content: {
                  title: "Envelope Designer",
                  body: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede. Donec nec justo eget felis facilisis fermentum.</p>
                  <p>Aliquam porttitor mauris sit amet orci. Aenean dignissim pellentesque felis. Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam.</p>
                  <p>Sed arcu. Cras consequat. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat.</p>`
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
                  body: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
                  <p>Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.</p>
                  <p>In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi.</p>`
                }
              },
              {
                id: "brand-guidelines",
                label: "Brand Guidelines",
                icon: "color_lens",
                content: {
                  title: "Brand Guidelines",
                  body: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.</p>
                  <p>Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus.</p>
                  <p>Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem.</p>`
                }
              },
              {
                id: "logo-variations",
                label: "Logo Variations",
                icon: "grid_view",
                content: {
                  title: "Logo Variations",
                  body: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt.</p>
                  <p>Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero.</p>
                  <p>Fusce fermentum. Nullam varius nulla suscipit quam. Sed aliquam odio. Proin mattis lacinia justo. Vestibulum facilisis auctor urna. Aliquam in lorem sit amet leo accumsan lacinia.</p>`
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
                  body: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.</p>
                  <p>Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra.</p>
                  <p>Per inceptos hymenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas nisl est, ultrices nec congue eget, auctor vitae massa.</p>`
                }
              },
              {
                id: "seo-setup",
                label: "SEO Setup",
                icon: "search",
                content: {
                  title: "SEO Setup",
                  body: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce fermentum. Nullam varius nulla suscipit quam. Sed aliquam odio. Proin mattis lacinia justo. Vestibulum facilisis auctor urna.</p>
                  <p>Aliquam in lorem sit amet leo accumsan lacinia. Integer rutrum ante eu lacus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed aliquam, nisi quis porttitor congue.</p>
                  <p>Elit erat fermentum orci, eget tempor diam velit aliquet diam. Donec et mauris. Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue. Proin sodales libero eget ante.</p>`
                }
              },
              {
                id: "email-campaigns",
                label: "Email Campaigns",
                icon: "send",
                content: {
                  title: "Email Campaigns",
                  body: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sit amet enim. Suspendisse id velit vitae ligula volutpat condimentum. Aliquam erat volutpat. Sed quis velit.</p>
                  <p>Nulla facilisi. Nulla libero. Vivamus pharetra posuere sapien. Nam consectetuer. Sed aliquam, nisi quis porttitor congue, elit erat fermentum orci, eget tempor diam velit aliquet diam.</p>
                  <p>Donec et mauris. Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue. Proin sodales libero eget ante. Nulla quam. Aenean laoreet. Vestibulum nisi lectus, commodo ac, facilisis ac, ultricies eu, pede.</p>`
                }
              },
              {
                id: "google-ads",
                label: "Google Ads Setup",
                icon: "ads_click",
                content: {
                  title: "Google Ads Setup",
                  body: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tincidunt tincidunt erat. Sed cursus turpis vitae lorem. Nullam tristique diam non turpis. Cras placerat accumsan nulla. Nullam rutrum. Nam vestibulum accumsan nisl.</p>
                  <p>Nullam eu ante vel est convallis dignissim. Fusce suscipit, wisi nec facilisis facilisis, est dui fermentum leo, quis tempor ligula erat quis odio. Nunc porta vulputate tellus.</p>
                  <p>Nunc rutrum turpis sed pede. Sed bibendum. Aliquam posuere. Nunc aliquet, augue nec adipiscing interdum, lacus tellus malesuada massa, quis varius mi purus non odio.</p>`
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
        body: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
        <p>Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>
        <p>Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui.</p>`
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
