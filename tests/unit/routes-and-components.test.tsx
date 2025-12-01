import assert from "node:assert/strict"
import { describe, it } from "node:test"

const componentModules = [
  "@/components/AppointmentsCsvControls",
  "@/components/CurrentVisitorsView",
  "@/components/ErrorDialogPortal",
  "@/components/ErrorDemoPage",
  "@/components/app-shell",
  "@/components/app-header",
  "@/components/CurrentInsideDemoPage",
]

const routeModules = [
  "@/app/page",
  "@/app/login/page",
  "@/app/checkin/page",
  "@/app/schedule/page",
  "@/app/schedule/layout",
]

describe("route modules", () => {
  for (const modulePath of routeModules) {
    it(`${modulePath} exports a component`, async () => {
      const mod = await import(modulePath)
      assert.equal(typeof mod.default, "function")
    })
  }
})

describe("non-UI components", () => {
  for (const modulePath of componentModules) {
    it(`${modulePath} exports a component function`, async () => {
      const mod = await import(modulePath)
      const exported = mod.default ?? mod.AppHeaderComponent ?? mod.HeaderLogo
      assert.equal(typeof exported, "function")
    })
  }
})


describe("appointments CSV controls", () => {
  it("exposes helper text for import/export actions", async () => {
    const fs = await import("node:fs/promises")
    const content = await fs.readFile("src/components/AppointmentsCsvControls.tsx", "utf8")
    assert.match(content, /Esporta Excel/)
    assert.match(content, /Importa Excel/)
  })
})

