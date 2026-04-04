# Test Case for Bug #9: Language Selection in Combobox Not Working

## Overview
This document outlines the test cases to verify that the language selection bug fix works correctly on the sidebar and transaction add screen.

## Test Cases

### Test Case 1: Switching between English and Vietnamese on Sidebar

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|-----------------|---------------|--------|
| 1 | Start the application with `npm run dev` | Application window opens, default language is Vietnamese | | |
| 2 | Verify current sidebar text | Sidebar shows "Trang chủ", "Giao dịch", "Ngân sách", etc. (Vietnamese) | | |
| 3 | Click the language combobox in TopNav | Dropdown opens showing "English" and "Tiếng Việt" options | | |
| 4 | Select "English" from the dropdown | Sidebar text immediately updates to "Home", "Transactions", "Budget", etc. (English) | | |
| 5 | Click the language combobox in TopNav | Dropdown opens showing language options | | |
| 6 | Select "Tiếng Việt" from the dropdown | Sidebar text immediately updates to "Trang chủ", "Giao dịch", "Ngân sách", etc. (Vietnamese) | | |
| 7 | Refresh the page (F5) | Application reloads, sidebar maintains Vietnamese language (persistence check) | | |

### Test Case 2: Switching languages on Transaction Add Screen

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|-----------------|---------------|--------|
| 1 | Start the application with `npm run dev` | Application window opens, default language is Vietnamese | | |
| 2 | Navigate to "Add Transaction" screen | Transaction form displays with Vietnamese labels and placeholders | | |
| 3 | Verify form elements | Labels show "Tên giao dịch", "Số tiền", "Loại giao dịch", etc. (Vietnamese) | | |
| 4 | Click the language combobox in TopNav | Dropdown opens showing "English" and "Tiếng Việt" options | | |
| 5 | Select "English" from the dropdown | Form labels immediately update to "Transaction Name", "Amount", "Transaction Type", etc. (English) | | |
| 6 | Verify placeholders | Placeholders update to English (e.g., "Enter transaction name", "Enter amount") | | |
| 7 | Click the language combobox in TopNav | Dropdown opens showing language options | | |
| 8 | Select "Tiếng Việt" from the dropdown | Form labels immediately update to Vietnamese (e.g., "Tên giao dịch", "Số tiền") | | |
| 9 | Verify placeholders | Placeholders update to Vietnamese (e.g., "Nhập tên giao dịch", "Nhập số tiền") | | |
| 10 | Refresh the page (F5) | Application reloads, form maintains Vietnamese language (persistence check) | | |

### Test Case 3: Verify Persistence Across Application Restart

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|-----------------|---------------|--------|
| 1 | Start the application with `npm run dev` | Application window opens | | |
| 2 | Select "English" from the TopNav language combobox | UI updates to English | | |
| 3 | Close the application window | Application closes | | |
| 4 | Start the application again with `npm run dev` | Application window opens | | |
| 5 | Verify language | UI loads in English (persisted language preference) | | |

## Summary

| Test Suite | Test Cases | Passed | Failed | Pending |
|------------|------------|--------|--------|---------|
| Sidebar Language Switching | 1 | 0 | 0 | 1 |
| Transaction Add Screen Language Switching | 1 | 0 | 0 | 1 |
| Persistence | 1 | 0 | 0 | 1 |
| **Total** | **3** | **0** | **0** | **3** |

## Notes

- All tests should be performed on the development build (`npm run dev`).
- The language combobox is located in the TopNav component.
- Changes should be immediate (no page reload required).
- Persistence is verified by closing and reopening the application.
