const { test, expect } = require('@playwright/test');
const {
  getSubscriptionIds,
  getUser,
  gotoApp,
  showDashboard,
  usePersona
} = require('./helpers/nala');

test.describe('Persona entitlements', () => {
  const cases = [
    {
      persona: 'registered',
      user: { has_premium: 0, has_business_in_a_box: 0 },
      cards: ['premium-course', 'business-in-a-box']
    },
    {
      persona: 'premium',
      user: { has_premium: 1, has_business_in_a_box: 0 },
      cards: ['active-premium', 'business-in-a-box']
    },
    {
      persona: 'business',
      user: { has_premium: 1, has_business_in_a_box: 1 },
      cards: ['active-premium', 'active-business-in-a-box']
    },
    {
      persona: 'admin',
      user: { has_premium: 1, has_business_in_a_box: 1 },
      cards: ['active-premium', 'active-business-in-a-box']
    }
  ];

  for (const scenario of cases) {
    test(`${scenario.persona} sees the expected dashboard entitlements`, async ({ page }) => {
      await usePersona(page, scenario.persona);
      await gotoApp(page);
      await showDashboard(page);

      const user = await getUser(page);
      expect(Number(user.has_premium)).toBe(scenario.user.has_premium);
      expect(Number(user.has_business_in_a_box)).toBe(scenario.user.has_business_in_a_box);

      const ids = await getSubscriptionIds(page);
      expect(ids).toEqual(scenario.cards);
    });
  }
});
