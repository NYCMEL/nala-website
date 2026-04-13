const { expect } = require('@playwright/test');

async function postJsonFromPage(page, url, payload) {
  const result = await page.evaluate(async ({ requestUrl, requestPayload }) => {
    const response = await fetch(requestUrl, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestPayload || {})
    });

    const text = await response.text();
    let json = null;

    try {
      json = text ? JSON.parse(text) : null;
    } catch (error) {
      json = { parse_error: true, raw: text };
    }

    return {
      ok: response.ok,
      status: response.status,
      json
    };
  }, { requestUrl: url, requestPayload: payload });

  return result;
}

async function usePersona(page, persona) {
  await page.goto('index.html', { waitUntil: 'domcontentloaded' });

  const response = await postJsonFromPage(page, '/api/dev_persona.php', { persona });
  expect(response.ok, `dev_persona should succeed for ${persona}: ${JSON.stringify(response.json)}`).toBeTruthy();
  expect(response.json && response.json.ok, `dev_persona payload should be ok for ${persona}`).toBeTruthy();
  return response.json.user;
}

async function setCurrentLesson(page, lesson) {
  const response = await postJsonFromPage(page, '/api/setCurrentLesson.php', { lesson });
  expect(response.ok, `setCurrentLesson should succeed: ${JSON.stringify(response.json)}`).toBeTruthy();
  expect(response.json && response.json.ok, 'setCurrentLesson payload should be ok').toBeTruthy();
  return response.json.current_lesson;
}

async function gotoApp(page, hash = '') {
  const target = hash ? `index.html#${hash}` : 'index.html';
  await page.goto(target, { waitUntil: 'domcontentloaded' });
  await waitForApp(page);
}

async function waitForApp(page) {
  await page.waitForFunction(() => {
    return Boolean(
      window.wc &&
      wc.pages &&
      typeof wc.pages.show === 'function' &&
      wc.session &&
      wc.session.user
    );
  });
}

async function refreshSession(page) {
  await page.evaluate(() => {
    return new Promise((resolve, reject) => {
      if (!window.wc || typeof wc.getSession !== 'function') {
        reject(new Error('wc.getSession unavailable'));
        return;
      }

      const maybePromise = wc.getSession((loggedIn, session) => {
        if (!loggedIn || !session || !session.user) {
          reject(new Error('session refresh failed'));
          return;
        }
        resolve(session);
      });

      if (maybePromise && typeof maybePromise.catch === 'function') {
        maybePromise.catch(reject);
      }
    });
  });
}

async function showPage(page, pageName) {
  await page.evaluate((name) => {
    wc.pages.show(name);
  }, pageName);
}

async function showHierarchy(page) {
  await showPage(page, 'hierarchy');
  await page.locator('.mtk-hierarchy').waitFor({ state: 'visible' });
}

async function showDashboard(page) {
  await showPage(page, 'dashboard');
  await page.locator('.mtk-dashboard').waitFor({ state: 'visible' });
}

async function getUser(page) {
  return page.evaluate(() => {
    const user = wc && wc.session && wc.session.user ? wc.session.user : null;
    return user ? JSON.parse(JSON.stringify(user)) : null;
  });
}

async function getSubscriptionIds(page) {
  return page.locator('[data-subscription-id]').evaluateAll((nodes) => {
    return nodes.map((node) => node.getAttribute('data-subscription-id')).filter(Boolean);
  });
}

async function clickLesson(page, lessonNo) {
  const locator = page.locator(`[data-testid="lesson-${lessonNo}"] .mtk-lesson__header`);
  await expect(locator).toBeVisible();
  await locator.click();
}

async function expectLessonDisabled(page, lessonNo) {
  const locator = page.locator(`[data-testid="lesson-${lessonNo}"]`);
  await expect(locator).toHaveClass(/mtk-lesson--disabled/);
}

async function expectLessonEnabled(page, lessonNo) {
  const locator = page.locator(`[data-testid="lesson-${lessonNo}"]`);
  await expect(locator).not.toHaveClass(/mtk-lesson--disabled/);
}

async function completeCurrentLesson(page, lessonNo) {
  await clickLesson(page, lessonNo);

  const before = await getUser(page);
  const previousCurrent = Number(before.current_lesson);

  const completion = await page.evaluate(async ({ lessonNo: currentLessonNo }) => {
    return new Promise((resolve, reject) => {
      if (!window.wc || typeof wc.lessonComplete !== 'function') {
        reject(new Error('wc.lessonComplete unavailable'));
        return;
      }

      const expectedCurrent = Number(wc.session.user.current_lesson);
      wc.lessonComplete(currentLessonNo, expectedCurrent, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result || {});
      });
    });
  }, { lessonNo });

  await refreshSession(page);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await waitForApp(page);
  await showHierarchy(page);

  const after = await getUser(page);
  return {
    before,
    after,
    previousCurrent,
    currentLesson: Number(after.current_lesson),
    result: completion
  };
}

module.exports = {
  clickLesson,
  completeCurrentLesson,
  expectLessonDisabled,
  expectLessonEnabled,
  getSubscriptionIds,
  getUser,
  gotoApp,
  refreshSession,
  setCurrentLesson,
  showDashboard,
  showHierarchy,
  usePersona,
  waitForApp
};
