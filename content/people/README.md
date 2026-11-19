# Contributor profiles

Create a Markdown file here for each person. Its filename becomes the public URL
(for example, `first-last.md` becomes `/people/first-last`). Keep the filename
stable after publication. Use a single file per person even when a handle or
program changes. The directory, profile routes and sitemap are generated at build
time.

```yaml
---
name: Full name
image: /assets/images/people/portrait.jpg
links:
  - label: GitHub
    icon: github
    href: https://github.com/handle
programs:
  - program: fellowship
    name: Fellowship
    organization: Vinteum
    role: { EN: Fellow, BR: Fellow }
    status: current
    href: /programs/fellowship
    work: { EN: Published project or topic, BR: Projeto ou tema publicado }
---
## EN

Public biography in English.

## PT

Biografia pública em português.
```

Only `name` is required. Add known information and omit unavailable fields and
sections. Biography headings are optional. A single biography is shown in both
languages if a translation is unavailable. Localized frontmatter uses `EN` and
`BR`. Images and media thumbnails use a path relative to `public/`, starting
with `/`. The directory uses initials when a portrait is unavailable.

- **Identity:** `name`, `image`, `handle` (without @), `pseudonymous`,
  localized `location`, an optional `projectLabel` for the directory, `focus` (a list of topics), and `links` (label, URL, and
  optional icon, including `gitlab`). `updatedAt` is an optional profile-wide editorial
  date, displayed in the profile header rather than below its final section.
- **History:** Add an item to `programs` for each program participation and to
  `affiliations` for other roles or organizations. Each item has an
  `organization` and a localized `role`. Add `status` (`current` or `past`),
  `start`, `end`, and `href` when known. Preserve the original role when a
  participation becomes past. Use quoted ISO dates at the precision supported by
  the source (`YYYY`, `YYYY-MM` or `YYYY-MM-DD`). An affiliation can set
  `directoryRole: team` or `directoryRole: fellow` to show that role in the
  directory. The existing program pages maintain their own rosters.
- **Directory filters:** Vinteum entries with `program: fellowship` or
  `program: grants` and a status determine the directory filters. `work` is the translated project or topic label for that
  participation. `name` is the program’s display name. For Launchpad alumni
  (`bitcoin-dev-launchpad`), add `cohort` and, where published, `fundedBy`.
  Team cards use the current Vinteum position, while the Team filter remains
  collective. Fellow labels omit the start year; dated history remains intact.
  Do not use an employer-valued programme field as the directory's project label.
- **Projects:** Each `projects` item has a `name` and optional `href`,
  localized `description` and `contribution`, and a boolean `current`. Describe
  the contributor's technical scope and purpose, not a count of pull requests or
  an inventory of a few narrow patches presented as their whole contribution.
  Keep concrete patch-level detail in Selected Contributions; broaden summaries
  only as far as primary evidence supports, without inventing ownership or work.
  Only explicitly past projects display a Past badge; current flags remain in the data.
- **Activity:** `contributions`, `discussions`, `writing` and `media` use unique
  item IDs within each list, localized `title`, and optional `href`, `source`,
  `date`, localized `description`, and `featured`. Contributions specify a
  `type` such as `PR`, `Code Review`, `Research`, `Tooling`, `Documentation`
  or `Protocol Specification`. Use `writing` for blog posts, books and other
  non-academic texts, and `media` for talks, interviews, podcasts and coverage
  about the person. Media accepts `mediaType` (`video` or `article`) and `thumbnail`.
- **Academic publications:** `publications` is a separate optional section for
  papers and theses. Each entry uses the activity fields plus an ordered
  `authors` list, `venue`, optional `doi`, and `publicationType` (`paper`,
  `conference-abstract`, `preprint`, `masters-thesis` or `doctoral-thesis`). Keep
  preprints and conference abstracts explicitly labelled. A direct `href` to the DOI, publisher or institutional
  repository is required. Preserve original titles and author order; translate
  descriptions, not official titles. Use the work's publication/degree year,
  not a later repository deposit date. Do not duplicate the same work in Writing
  or Selected Contributions, or mistake a thesis supervisor for a coauthor.
  The section is hidden when there are no entries.
- **Courses:** `courses` uses the activity fields for original teaching playlists
  or course material, separately from talks and podcasts. Video courses use
  `mediaType: video` and an original local `thumbnail`, like media cards. Link
  the actual course, preserve its official title, and omit unverified dates or
  lesson counts. Empty course sections stay hidden.
- **Connections:** An optional `connections` entry uses another published
  profile's `slug` and a localized `reason`.

Run `pnpm test:people` (Node 22.13 or newer) and `pnpm build` before review. To
check rendered routes, start the production build with `pnpm start` and run
`PEOPLE_TEST_URL=http://localhost:3000 pnpm test:people`.

## Source and relationship checks

Use the brain, annual reports and announcements as discovery maps. Selected
contributions must link to the work itself: a public repository, pull request,
commit, issue, review, discussion, paper or original technical publication. Read
the target and verify the contributor's role and the claims in its description.
A report or alumni article is not a substitute for that direct link. Keep broad
study or project context out of Selected Contributions when no concrete public
artifact can be verified; never invent a link or attach a loosely related PR to
a bundle of claims. Project links should open the actual project.

Do not copy private reports, internal register links, assessments, compensation
or undisclosed security findings into these files.

Programme history and current affiliations are separate records. Check status and
dates against the canonical community register before marking a relationship
`current`; a historical roster or annual report does not establish current
funding. Record later employment or grants from other organizations under
`affiliations`, not as the work of a past Vinteum fellowship. BDL participation
alone does not imply a fellowship. Keep pseudonymous contributors under their
chosen public identity, and confirm permission for biographies, photos and
personal links before publication.

Keep biographies to one short paragraph per language, without links or source
attribution such as "according to the report". Put technical detail in project
summaries, selected-contribution descriptions, publications and programme history.
Keep the supporting public link with the relevant entry instead of in the bio.

Fellowships and grants remain in `programs` as the single source used by directory
filters. The profile renders them as **Affiliations** using only institution,
Fellow/Grantee role and useful dates. Technical work and career narratives do not
belong in the affiliation display. Current/Past labels are hidden when the period
already conveys the state; Past remains useful when an end date is unknown.
Bitcoin Dev Launchpad and Summer of Bitcoin student cards under **Community &
programs** show only programme name, organization attribution and cohort, without
project, funder, alumni role or status. Summer of Bitcoin uses the verified annual
cohort year when available; do not infer student participation from mentoring or
host-company employment, or infer a Vinteum fellowship from either programme. Preserve the full underlying history for filters and provenance; do
not create duplicate fellowship/grant rows in `affiliations` just for display.

Grants and fellowships from other organizations also belong in `affiliations`,
with their own role, status and period. Keep concurrent funding relationships
separate: a current external grant does not erase a past Vinteum fellowship or
imply that another grant has ended. Check the external-affiliation register as
well as the programme rosters when updating a profile.

Keep contributor roles in software projects under `projects`, including creator,
maintainer, developer and reviewer. Those roles alone do not establish an
institutional affiliation. Sustained technical research, BIP review and education
initiatives can also be projects when supported by actual public work; programme
participation by itself is not a project. For example, BDK belongs in Projects
while a grant from the Bitcoin Dev Kit Foundation belongs in Affiliations.

## Initial profiles

The Fellowship and Grants rosters provide the initial names, photos, program
status and work labels. The Launchpad alumni roster supplies the cohort and
funding context on that page. The supplied prototype also provides four additional people and enriches the
roster profiles with biographies, links, projects and published activity. Update
these fields when the upstream information changes and leave unpublished dates
and affiliations out.
