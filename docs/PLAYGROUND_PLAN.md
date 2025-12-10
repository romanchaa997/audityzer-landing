# Playground Widget Optimization Plan

**Epic**: [AGENT-B] Add playground widget for live demo  
**Status**: In Progress  
**Linked Issue**: https://github.com/romanchaa997/audityzer-landing/issues/7

## Overview
Comprehensive optimization strategy for integrating an interactive LLM playground demo into the audityzer-landing site with focus on performance, user experience, conversion, and reliability.

---

## 1. Architecture & Performance

### Objectives
- Lazy-mount playground (iframe or dynamic script)
- Separate heavy JS bundle from main landing page
- Ensure above-the-fold content loads fast (LCP, INP, CLS in green zone)

### Checklist
- [ ] Create `public/playground.html` or `/playground` route
- [ ] Isolate playground dependencies (no imports in main bundle)
- [ ] Setup IntersectionObserver for auto-load on scroll
- [ ] Verify with Lighthouse: LCP ≤ 2.5s, INP ≤ 100ms, CLS ≤ 0.1

---

## 2. UX & Conversion

### Objectives
- Single clear CTA per page ("Try live demo")
- 1-2 guided scenarios with pre-filled prompts
- Explicit next-step (Sign up / Book a call) after demo

### Checklist
- [ ] Place primary CTA in hero → anchor to `#playground`
- [ ] Build 1-2 demo scenarios (buttons with predefined prompts)
- [ ] Add auto-focus on input field after start
- [ ] Place Sign up / Book a call CTA below demo results
- [ ] Measure: demo→signup/book conversion rate

---

## 3. Analytics & Metrics

### Event Schema
- `playground_view` - section became visible
- `playground_start` - user initiated demo
- `playground_first_result` - received LLM response
- `playground_scenario_complete` - user finished a scenario
- `playground_click_signup` - clicked next-step CTA

### Parameters per Event
```json
{
  "scenario_id": "string (e.g., 'audit_check', 'risk_assessment')",
  "time_to_first_result_ms": "number",
  "model_name": "string (e.g., 'gpt-4')",
  "error_type": "string (if applicable)"
}
```

### Checklist
- [ ] Create `src/analytics/playgroundEvents.ts` helper
- [ ] Track all 5 events via GA4 / PostHog / Plausible
- [ ] Log Web Vitals before and after playground integration
- [ ] Setup dashboard to monitor demo funnel

---

## 4. Error Handling & Limits

### Constraints
- API request timeout: 15-20 seconds
- Max requests per session: N (configurable)
- Graceful error messages (user-friendly, no technical details)
- Technical errors logged to backend/console

### Checklist
- [ ] Add timeout handling in API calls
- [ ] Implement session request counter
- [ ] Create error handler with user-friendly messages
- [ ] Test failure scenarios (timeout, rate limit, API down)

---

## 5. Assets & Optimization

### Performance Targets
- All images in WebP/AVIF
- Fixed dimensions (no layout shift)
- Lazy loading (`loading="lazy"`)
- Minified JS/CSS
- Long-lived CDN cache (Vercel/Cloudflare)

### Checklist
- [ ] Convert playground images to WebP/AVIF
- [ ] Add `loading="lazy"` + fixed width/height to `<img>` tags
- [ ] Enable minification in build config
- [ ] Verify CLS ≈ 0 in playground section

---

## 6. A/B Testing & Expansion (Next Phase)

### Experiments to Run
1. **Layout**: Playground above vs below fold
2. **Trigger**: Auto-load on scroll vs manual click
3. **Depth**: Quick 1-click vs guided 3-step flow

### KPIs to Track
- Demo view rate (% of page visitors)
- Completion rate (% who finish scenario)
- Conversion rate (demo → signup / book-a-call)
- Time to value (median time to first result)
- Bounce rate after demo (negative signal)

---

## Timeline & Milestones

| Phase | Focus | Owner | Est. Duration |
|-------|-------|-------|---------------|
| 1 | Arch, Iframe, Perf | Dev | 1-2 weeks |
| 2 | UX, CTA, Copy | Design/Product | 1 week |
| 3 | Analytics, Testing | Dev | 3-5 days |
| 4 | A/B Tests, Optimization | Growth | 2-4 weeks |

---

## Acceptance Criteria (Definition of Done)

✅ **Code & Structure**
- Playground lives in separate file/route
- Main bundle JS does NOT contain playground dependencies
- Build analyzer confirms isolation

✅ **Performance**
- Lighthouse LCP ≥ good (≤ 2.5s)
- INP ≤ 100ms
- CLS ≈ 0 (< 0.1)
- Compared before/after integration

✅ **UX**
- One primary CTA on page ("Try live demo")
- Demo has 1-2 guided scenarios
- Clear next-step visible after results

✅ **Analytics**
- All 5 events firing with correct parameters
- Events visible in GA4 / PostHog dashboard
- Web Vitals tracked per session

✅ **Reliability**
- Playground handles timeout gracefully
- Error messages are user-friendly
- No crashes or broken states in UI

---

## References & Resources

- GitHub Issue: [#7 Add playground widget for live demo](https://github.com/romanchaa997/audityzer-landing/issues/7)
- Web Vitals Guide: https://web.dev/vitals/
- Code Splitting (Next.js): https://nextjs.org/docs/advanced-features/dynamic-import
- Analytics Best Practices: https://developers.google.com/analytics/devguides/collection/ga4

---

## Notes & Learnings

*To be updated as work progresses*

### Phase 1 Learnings
- [ ] Document what worked/didn't with lazy-load approach
- [ ] Record actual LCP/INP numbers (before vs after)
- [ ] Note any framework-specific gotchas

### Phase 2-3 Learnings
- [ ] User feedback on demo flow
- [ ] Which scenario gets more engagement?
- [ ] Where do users drop off?

### Phase 4 Learnings
- [ ] A/B test winner (layout, trigger, depth)
- [ ] Impact on signup/conversion funnel
- [ ] Ideas for next iteration
