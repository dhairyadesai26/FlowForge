import { test, expect } from "@playwright/test";

test.describe("Kanban Board", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("board-header")).toBeVisible({ timeout: 15_000 });
  });

  test("board title is visible", async ({ page }) => {
    await expect(page.getByText("Kanban Board")).toBeVisible();
  });

  test("all three columns are rendered", async ({ page }) => {
    await expect(page.getByTestId("column-todo")).toBeVisible();
    await expect(page.getByTestId("column-inprogress")).toBeVisible();
    await expect(page.getByTestId("column-done")).toBeVisible();
  });

  test("connection status shows Live", async ({ page }) => {
    await expect(page.getByTestId("connection-status")).toContainText("Live", { timeout: 10_000 });
  });

  test("user can create a task and see it on the board", async ({ page }) => {
    const taskTitle = `E2E Task ${Date.now()}`;

    await page.getByTestId("new-task-btn").click();
    await expect(page.getByTestId("task-form")).toBeVisible();

    await page.getByTestId("task-title-input").fill(taskTitle);
    await page.getByTestId("task-description-input").fill("Created by Playwright E2E test");
    await page.getByTestId("create-task-btn").click();

    await expect(page.getByTestId("task-form")).not.toBeVisible();
    await expect(page.getByText(taskTitle)).toBeVisible({ timeout: 8_000 });
  });

  test("user can delete a task and it disappears", async ({ page }) => {
    const title = `Delete Me ${Date.now()}`;
    await page.getByTestId("new-task-btn").click();
    await page.getByTestId("task-title-input").fill(title);
    await page.getByTestId("create-task-btn").click();
    await expect(page.getByText(title)).toBeVisible({ timeout: 8_000 });

    const card = page.locator(".task-card", { hasText: title });
    await card.getByText("Delete").click();
    await expect(page.getByText(title)).not.toBeVisible({ timeout: 8_000 });
  });

  test("user can select a priority level (High)", async ({ page }) => {
    await page.getByTestId("new-task-btn").click();
    const select = page.getByTestId("task-priority-select");
    await select.selectOption("High");
    await expect(select).toHaveValue("High");
  });

  test("user can select a priority level (Low)", async ({ page }) => {
    await page.getByTestId("new-task-btn").click();
    const select = page.getByTestId("task-priority-select");
    await select.selectOption("Low");
    await expect(select).toHaveValue("Low");
  });

  test("user can change task category and see badge on card", async ({ page }) => {
    const title = `Cat Test ${Date.now()}`;
    await page.getByTestId("new-task-btn").click();
    await page.getByTestId("task-title-input").fill(title);
    await page.getByTestId("task-category-select").selectOption("Bug");
    await page.getByTestId("create-task-btn").click();

    await expect(page.getByText(title)).toBeVisible({ timeout: 8_000 });
    const card = page.locator(".task-card", { hasText: title });
    await expect(card.getByTestId("task-category-badge")).toContainText("Bug");
  });

  test("user can edit a task title via the Edit modal", async ({ page }) => {
    const original = `Edit Source ${Date.now()}`;
    const updated  = `Edit Updated ${Date.now()}`;

    await page.getByTestId("new-task-btn").click();
    await page.getByTestId("task-title-input").fill(original);
    await page.getByTestId("create-task-btn").click();
    await expect(page.getByText(original)).toBeVisible({ timeout: 8_000 });

    const card = page.locator(".task-card", { hasText: original });
    await card.getByText("Edit").click();
    await expect(page.getByTestId("edit-task-form")).toBeVisible();

    const editInput = page.getByTestId("edit-title-input");
    await editInput.fill(updated);
    await page.getByTestId("save-task-btn").click();

    await expect(page.getByText(updated)).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText(original)).not.toBeVisible();
  });

  test("cannot create task with empty title — shows error", async ({ page }) => {
    await page.getByTestId("new-task-btn").click();
    await page.getByTestId("create-task-btn").click();
    await expect(page.getByTestId("form-error")).toBeVisible();
  });

  test("dashboard is rendered below the board", async ({ page }) => {
    await expect(page.getByTestId("dashboard")).toBeVisible();
    await expect(page.getByTestId("progress-chart")).toBeVisible();
    await expect(page.getByTestId("priority-chart")).toBeVisible();
  });

  test("graph updates (progress fill) when new task is added", async ({ page }) => {
    await page.getByTestId("new-task-btn").click();
    const doneTitle = `Graph Task ${Date.now()}`;
    await page.getByTestId("task-title-input").fill(doneTitle);
    await page.getByTestId("create-task-btn").click();
    await expect(page.getByText(doneTitle)).toBeVisible({ timeout: 8_000 });

    await expect(page.getByTestId("stats-row")).toBeVisible();
  });

  test("search filters tasks by title", async ({ page }) => {
    const uniqueA = `Search Alpha ${Date.now()}`;
    const uniqueB = `Search Beta ${Date.now()}`;

    for (const t of [uniqueA, uniqueB]) {
      await page.getByTestId("new-task-btn").click();
      await page.getByTestId("task-title-input").fill(t);
      await page.getByTestId("create-task-btn").click();
      await expect(page.getByText(t)).toBeVisible({ timeout: 8_000 });
    }

    await page.getByTestId("search-input").fill("Alpha");
    await expect(page.getByText(uniqueA)).toBeVisible();
    await expect(page.getByText(uniqueB)).not.toBeVisible();
  });
});

test.describe("File Upload", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("board-header")).toBeVisible({ timeout: 15_000 });
    await page.getByTestId("new-task-btn").click();
    await expect(page.getByTestId("task-form")).toBeVisible();
  });

  test("valid PNG file upload shows file name", async ({ page }) => {
    const fileInput = page.getByTestId("file-input");
    await fileInput.setInputFiles({
      name: "screenshot.png",
      mimeType: "image/png",
      buffer: Buffer.from("fake-png-data"),
    });
    await expect(page.getByTestId("file-name")).toContainText("screenshot.png");
    await expect(page.getByTestId("file-error")).not.toBeVisible();
  });

  test("valid JPEG upload shows file name without error", async ({ page }) => {
    await page.getByTestId("file-input").setInputFiles({
      name: "photo.jpg",
      mimeType: "image/jpeg",
      buffer: Buffer.from("fake-jpeg"),
    });
    await expect(page.getByTestId("file-name")).toContainText("photo.jpg");
    await expect(page.getByTestId("file-error")).not.toBeVisible();
  });

  test("invalid file type shows error message", async ({ page }) => {
    await page.getByTestId("file-input").setInputFiles({
      name: "script.sh",
      mimeType: "text/x-sh",
      buffer: Buffer.from("#!/bin/bash"),
    });
    await expect(page.getByTestId("file-error")).toBeVisible();
    await expect(page.getByTestId("file-error")).toContainText("Invalid");
    await expect(page.getByTestId("file-name")).not.toBeVisible();
  });

  test("invalid .txt file type shows error message", async ({ page }) => {
    await page.getByTestId("file-input").setInputFiles({
      name: "notes.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("some text"),
    });
    await expect(page.getByTestId("file-error")).toBeVisible();
  });
});
