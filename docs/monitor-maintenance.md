# Monitoring workflow maintenance

Updated: 2026-10-24.

## Why checks stopped

GitHub blocked the old Uptime and Response Time workflows before any job started, reporting that the workflow might be malicious. They passed the entire `secrets` context into a third-party action. The repository has public endpoints and does not require contextual secrets.

Separately, the daily template updater tried to modify `.github/workflows` with the built-in GitHub App token. GitHub rejected that push because the token cannot update workflow files.

## Current behavior

- Upptime monitor actions are pinned to reviewed commit `fefca90fa2ccfc66ca39a11f40dcc90236da05ac` (v1.46.4).
- `.upptimerc.yml` explicitly declares `secrets: []`. Runtime workflows pass an empty secrets context and the repository-scoped `github.token` separately as the action's required `GH_PAT` input.
- Uptime checks retain the five-minute schedule. The GitHub scheduler may delay runs; the schedule is not a five-minute service guarantee.
- Uptime/response-time workflows request only content and issue writes. Setup additionally needs Actions write to dispatch graphs.
- Setup updates monitoring data and the README; it does not rewrite workflows or deploy the legacy Sapper site.
- The existing Static Snapshot CI publishes the public status site. Legacy Static Site CI remains disabled, and `skipGeneratingWebsite` prevents the old generator from competing with it.
- Template updates are manual maintenance. Without an optional dedicated `UPPTIME_TEMPLATE_TOKEN`, the manual job emits an explicit skip notice. No personal credential is needed for routine monitoring, and no new long-lived credential was added for this repair.

## Future upgrades

Review the upstream release and update the pinned action commits in a normal Git change. Keep the empty secrets allowlist and explicit workflow permissions.

If choosing to use the template generator, use a dedicated repository credential with Contents and Workflows write access, run it on a maintenance branch, and review its generated changes before merging. Regeneration restores upstream schedules and Setup/Site behavior; retain this repository's manual template policy and Static Snapshot deployment before merging.

The main website and monitor are separate repositories. Monitor data commits do not deploy the website.
