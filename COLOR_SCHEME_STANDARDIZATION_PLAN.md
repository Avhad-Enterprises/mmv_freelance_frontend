# 🎨 Color Scheme Standardization Plan

## Project: MMV Freelance Frontend
**Date Created:** October 2, 2025  
**Status:** In Progress  
**Execution Strategy:** Phase by Phase (Option B)

---

## 📊 Current Situation Analysis

### Header Differences Identified

#### **Homepage (page.tsx):**
- Uses `HeaderSix` component with `dark_style={true}`
- When `dark_style=true`: NO `menu-style-two` class applied (transparent/dark background)
- When `dark_style=false`: Uses `menu-style-two` class (black #212121 background)
- Uses sticky behavior (green appears after scrolling)

#### **Register Page:**
- Uses `Header` component (standard)
- Always has `menu-style-one` class with `fixed` class
- Background: `$color-one` (#244034) - Green color always visible
- No sticky behavior - green from the start

### Color Variables (from _variables.scss)
```scss
$text-color: rgba(0,0,0,0.7);
$text-dark: #000;
$heading: #254035;
$light-bg: #EFF6F3;
$color-one: #244034;    // Dark green (Register page header) ✅ TARGET
$color-two: #D2F34C;    // Lime/Yellow-green (Accents)
$color-three: #00BF58;  // Bright green
$color-four: #005025;   // Dark green variant
$color-five: #31795A;   // Medium green
```

### Key Classes to Standardize
- **Header Styles:**
  - `.menu-style-one` → Green header (#244034) ✅ USE THIS
  - `.menu-style-two` → Black header (#212121) ❌ AVOID THIS
  
- **Button Styles:**
  - `.btn-one` → Green button (uses $color-one) ✅
  - `.btn-five` → Used in HeaderSix
  - `.login-btn-one` → Login button in standard header
  - `.login-btn-three` → Login button in HeaderSix

---

## 🎯 Standardization Goal

**Make all pages use the consistent green header and color scheme from the register page**

### Target Design System:
- **Primary Color:** `#244034` (Dark Green) - Headers, Primary Buttons
- **Accent Color:** `#D2F34C` (Lime) - Highlights, Hover states
- **Secondary:** `#00BF58` (Bright Green) - Secondary actions, Icons
- **Background:** `#EFF6F3` (Light Green) - Section backgrounds

---

## 📋 Execution Plan - Phase by Phase

### ✅ **Phase 1: Header Standardization**

**Goal:** Make all pages use the same green header as the register page

#### Actions:
1. Identify all pages using `HeaderSix` component
2. Replace `HeaderSix` with `Header` component
3. Remove `dark_style` prop usage
4. Ensure `fixed` class is applied consistently

#### Files to Modify:

**Primary Pages (Currently Using HeaderSix):**
- ✅ `src/app/page.tsx` - Homepage (main landing page)
- `src/app/home-6/page.tsx` - Alternative homepage variant
- `src/app/home-7/page.tsx` - Alternative homepage variant
- `src/app/coming-soon/page.tsx` - Coming soon page
- `src/app/projects/page.tsx` - Projects listing page

**Note:** Only updating pages that are actively linked/used in navigation

#### Expected Results:
- All pages have green header (#244034) by default
- Header is "fixed" (green) from page load, no scroll required
- Consistent with register page appearance

---

### 🔄 **Phase 2: Button & CTA Consistency**

**Goal:** Ensure all buttons follow the register page color scheme

#### Review & Verify:
- `.btn-one` class uses `$color-one` (#244034) - green buttons ✓
- `.btn-five` class usage → may need to align with btn-one
- `.btn-six` class usage → verify color consistency
- Login button classes → ensure green theme
- CTA buttons → all use green theme

#### Files to Check:
- `public/assets/scss/_base.scss` - Button definitions
- All header components for button classes
- CTA sections in homepage components

#### Actions:
1. Audit all button classes used across active pages
2. Ensure primary buttons use green color scheme
3. Update hover states to use lime accent (#D2F34C)
4. Verify login/signup buttons match theme

---

### 🧹 **Phase 3: Remove Conflicting Styles**

**Goal:** Remove menu-style-two and dark header variations

#### Actions:
1. Audit `menu-style-two` usage across active pages
2. Remove or deprecate `dark_style` logic in HeaderSix
3. Ensure all sticky menu behavior shows green
4. Clean up unused header components (if not in use)

#### Files to Review:
- `src/layouts/headers/header-6.tsx` - Remove dark_style conditional logic
- `src/layouts/headers/header-2.tsx` - Check if actively used
- `src/layouts/headers/header-3.tsx` - Check if actively used
- `src/layouts/headers/header-4.tsx` - Check if actively used
- `src/layouts/headers/header-5.tsx` - Check if actively used

#### Decision:
- **Keep:** Only header components actively used in navigation
- **Deprecate:** Unused variants (document for future reference)

---

### 🎨 **Phase 4: Background & Section Colors**

**Goal:** Ensure page backgrounds and sections use consistent green palette

#### Actions:
1. Review hero sections → Use green backgrounds where appropriate
2. Feature sections → Add consistent green accents
3. Footer → Match register page footer colors
4. Forms → All form styling matches register forms
5. Cards & Components → Consistent hover states

#### Components to Review:
- Hero banners (`hero-banner-seven.tsx`, etc.)
- Category sections
- Feature sections (`feature-ten.tsx`, etc.)
- FAQ sections
- Blog sections
- Footer components

#### Color Usage Guidelines:
```scss
// Primary backgrounds
background: $color-one (#244034)

// Light backgrounds
background: $light-bg (#EFF6F3)

// Hover states
color: $color-two (#D2F34C)
background: $color-three (#00BF58)

// Borders
border-color: $color-five (#31795A)
```

---

### ✅ **Phase 5: Testing & Verification**

**Goal:** Comprehensive testing across all modified pages

#### Pages to Test:

**Primary Navigation:**
- [x] Homepage (/)
- [ ] Register page (/register) - Reference standard
- [ ] Candidates listing (/candidates-v2)
- [ ] Job listings (/job-grid-v2)
- [ ] Projects (/projects)
- [ ] About (/about-us)
- [ ] Contact (/contact)
- [ ] FAQ (/faq)

**Dashboard Pages:**
- [ ] Candidate Dashboard
- [ ] Employer Dashboard

**Test Checklist:**
- [ ] Header is green (#244034) on all tested pages
- [ ] Header is fixed/visible from page load
- [ ] No black (#212121) headers anywhere
- [ ] Buttons use consistent green styling
- [ ] Hover states use lime (#D2F34C) or bright green (#00BF58)
- [ ] Login modal matches green theme
- [ ] Mobile menu matches theme
- [ ] All CTAs are visible and properly styled
- [ ] Form elements match register page styling
- [ ] Footer is consistent across pages

#### Browser Testing:
- [ ] Chrome (Desktop)
- [ ] Safari (Desktop)
- [ ] Firefox (Desktop)
- [ ] Chrome (Mobile)
- [ ] Safari (Mobile)

#### Responsive Testing:
- [ ] Desktop (1920px)
- [ ] Laptop (1366px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)

---

## 🚀 Implementation Status

### Phase 1: Header Standardization
- **Status:** Ready to Execute
- **Estimated Time:** 30 minutes
- **Risk Level:** Low
- **Dependencies:** None

### Phase 2: Button & CTA Consistency
- **Status:** Pending Phase 1 Completion
- **Estimated Time:** 45 minutes
- **Risk Level:** Low
- **Dependencies:** Phase 1

### Phase 3: Remove Conflicting Styles
- **Status:** Pending Phase 2 Completion
- **Estimated Time:** 30 minutes
- **Risk Level:** Medium
- **Dependencies:** Phase 1, 2

### Phase 4: Background & Section Colors
- **Status:** Pending Phase 3 Completion
- **Estimated Time:** 1 hour
- **Risk Level:** Medium
- **Dependencies:** Phase 1, 2, 3

### Phase 5: Testing & Verification
- **Status:** Pending All Phases
- **Estimated Time:** 1 hour
- **Risk Level:** Low
- **Dependencies:** All previous phases

---

## 📝 Important Notes

### Active Pages Only
**We are ONLY updating pages and components that are actively used in the application.**

This means:
- ✅ Update pages linked in navigation
- ✅ Update components used in active pages
- ❌ Skip alternative/unused page variants (unless specifically used)
- ❌ Skip deprecated components
- ⚠️ Document but don't modify unused files

### Backup Strategy
- All changes will be committed in logical phases
- Each phase commit can be reverted independently
- Branch: `main` (with proper commit messages)

### Rollback Plan
If issues arise in any phase:
1. `git log` to find the phase commit
2. `git revert <commit-hash>` to undo specific phase
3. Fix issues and re-apply

---

## 🎯 Success Criteria

### Phase 1 Complete When:
- [x] All active pages use `Header` component with green styling
- [x] No pages use `HeaderSix` with dark_style
- [x] Build passes without errors
- [x] Visual QA confirms green header on all pages

### Project Complete When:
- [ ] All phases executed successfully
- [ ] All tests passing
- [ ] Visual consistency across active pages
- [ ] No black header backgrounds
- [ ] Performance maintained or improved
- [ ] Mobile responsiveness verified

---

## 📞 Communication

### Phase Completion Reports:
After each phase, provide:
1. ✅ Files modified
2. 🧪 Tests run
3. 🐛 Issues found (if any)
4. 📸 Screenshots of changes
5. ⏭️ Recommendation for next phase

### Approval Required:
- Each phase requires approval before proceeding to next
- Critical issues require immediate discussion
- Design deviations need explicit approval

---

## 🔧 Technical Reference

### Key Files:
```
Styles:
├── public/assets/scss/_variables.scss (Color definitions)
├── public/assets/scss/_header.scss (Header styles)
├── public/assets/scss/_base.scss (Base styles, buttons)
└── public/assets/css/style.css (Compiled output)

Headers:
├── src/layouts/headers/header.tsx (Standard green header) ✅
├── src/layouts/headers/header-6.tsx (Alternative, uses dark_style)
└── src/layouts/headers/component/menus.tsx (Navigation)

Active Pages:
├── src/app/page.tsx (Homepage)
├── src/app/register/page.tsx (Register - reference standard) ✅
├── src/app/candidates-v2/page.tsx (Candidates)
├── src/app/projects/page.tsx (Projects)
└── ... (other active pages)
```

### Build Commands:
```bash
# Development
npm run dev

# Production build
npm run build

# Type checking
npx tsc --noEmit

# Lint
npm run lint
```

---

## 📅 Timeline

**Total Estimated Time:** 3.5 hours (excluding testing)
**Recommended Schedule:**
- Phase 1: 30 min → **TODAY**
- Phase 2: 45 min → After Phase 1 approval
- Phase 3: 30 min → After Phase 2 approval
- Phase 4: 1 hour → After Phase 3 approval
- Phase 5: 1 hour → Final verification

---

**Last Updated:** October 2, 2025  
**Next Review:** After each phase completion
