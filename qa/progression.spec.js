const { test, expect } = require('@playwright/test');
const {
  completeCurrentLesson,
  expectLessonDisabled,
  expectLessonEnabled,
  getUser,
  gotoApp,
  setCurrentLesson,
  showHierarchy,
  usePersona
} = require('./helpers/nala');

test.describe('Registered progression', () => {
  test('unlocks on completion and stops at the registered cap', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Progression is covered in the desktop flow; mobile remains a follow-up QA pass.');

    await usePersona(page, 'registered');
    await setCurrentLesson(page, 0);
    await gotoApp(page);
    await showHierarchy(page);

    await expectLessonEnabled(page, 0);
    await expectLessonDisabled(page, 1);

    for (const lessonNo of [0, 1, 2]) {
      const completion = await completeCurrentLesson(page, lessonNo);
      expect(Number(completion.before.current_lesson)).toBe(lessonNo);
      expect(Number(completion.currentLesson)).toBe(lessonNo + 1);
      await expectLessonEnabled(page, lessonNo + 1);
    }

    const beforeCap = await getUser(page);
    expect(Number(beforeCap.current_lesson)).toBe(3);
    await expectLessonEnabled(page, 3);

    const capped = await completeCurrentLesson(page, 3);
    expect(Number(capped.before.current_lesson)).toBe(3);
    expect(Number(capped.currentLesson)).toBe(3);
    expect(Boolean(capped.result.advanced)).toBeFalsy();
    expect(String(capped.result.reason || '')).toContain('cap');

    await expectLessonDisabled(page, 4);
  });
});
