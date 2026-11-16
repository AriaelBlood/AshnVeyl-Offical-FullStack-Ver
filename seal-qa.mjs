export default async function (page, ui) {
  const r = {}
  // 1. Home with fallback (backend not running)
  await page.waitForTimeout(1500)
  r.fallbackNotice = await page.getByText('Archive link severed').count()
  // 2. Seal I: click footer diamond 3x
  const diamond = page.getByRole('button', { name: 'Ornamental diamond' })
  await diamond.click(); await diamond.click(); await diamond.click()
  await page.waitForTimeout(300)
  // 3. Seal II: click hero avatar (the moon button)
  await page.getByRole('button', { name: "The Hunter's character render" }).click()
  await page.waitForTimeout(500)
  r.sigilVisible = await page.getByText('Speak the name of the hunter').count()
  await page.screenshot({ path: 'context/tests/shot-sigil.png' })
  // 4. Seal III: type the incantation
  await page.keyboard.type('ashnveyl', { delay: 50 })
  await page.waitForTimeout(500)
  r.loginVisible = await page.getByText('Identify Yourself').count()
  await page.screenshot({ path: 'context/tests/shot-login.png' })
  // 5. Escape closes
  await page.keyboard.press('Escape')
  await page.waitForTimeout(300)
  r.closed = (await page.getByText('Identify Yourself').count()) === 0
  // 6. Studio guard (unauthenticated)
  await page.goto('http://localhost:5173/studio')
  await page.waitForTimeout(1500)
  r.studioGuard = await page.getByText('The door is sealed').count()
  await page.screenshot({ path: 'context/tests/shot-studio-guard.png' })
  return r
}
