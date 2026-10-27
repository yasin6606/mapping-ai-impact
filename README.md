# Mapping the Impact of AI through Data

**Università di Genova** · Course project  
**Group:** Neural Cartographers  
**Team members:** Yasin (lead) · Research Agent · Design Agent · Implementation Agent

Interactive website that turns open AI statistics into clear visual narratives.

## Live site (GitHub Pages)

Once Pages is enabled (Settings → Pages → Deploy from branch `main` / root):

**https://yasin6606.github.io/mapping-ai-impact/**

## Repository

https://github.com/yasin6606/mapping-ai-impact

## What this project does

We map the real-world footprint of artificial intelligence using only public data:

| Source | Focus |
|--------|--------|
| [Stanford HAI AI Index 2026](https://hai.stanford.edu/ai-index/2026-ai-index-report) | Model performance, investment, incidents, opinion |
| [Our World in Data – AI](https://ourworldindata.org/search?topics=Artificial+Intelligence&resultType=all) | Publications, patents, compute, funding |
| [Eurostat isoc_eb_ai](https://ec.europa.eu/eurostat/databrowser/view/isoc_eb_ai/default/table?lang=en) | Enterprise AI adoption by country & size |
| [Anthropic Economic Index](https://huggingface.co/datasets/Anthropic/EconomicIndex) | Labour-market signals |
| [OECD.AI](https://oecd.ai/en/) | Policy & international comparisons |

## Site structure

```
index.html                 ← main page (title, group, project description, data list, section previews)
css/styles.css             ← ALL styling (Roboto Slab + Fira Sans, UniGe palette)
pages/
  adoption.html            ← Eurostat bar chart (SVG + CSS selectors)
  investment.html          ← Investment / compute line chart
  research.html            ← Model origin & transparency
```

New visualisation pages will be added roughly weekly as the course progresses.

## Requirements checklist

### System architecture
- [x] Public GitHub repository
- [x] Shared with team + instructor (annalisabarla) — invite as collaborator if needed
- [x] Content served via GitHub Pages

### HTML
- [x] `index.html` is the entry point
- [x] Proper semantic structure: `h1`–`h3`, paragraphs, ordered & unordered lists
- [x] Valid HTML5 (validate at https://validator.w3.org/)

### SVG
- [x] Charts are pure SVG
- [x] **No inline styles** — every visual property controlled by CSS selectors (`.bar`, `.line-path`, `.axis-label` …)

### Style
- [x] All CSS lives in a dedicated file (`css/styles.css`)
- [x] Titles & headings → **Roboto Slab**
- [x] Body text → **Fira Sans**
- [x] Colour & mark inspired by [id.unige.it](https://id.unige.it) (deep blue + accent orange/gold)

## How the three agents collaborated

1. **Research Agent** – harvested key figures from Stanford AI Index 2026, Eurostat isoc_eb_ai (2025), Our World in Data and OECD.AI; selected the most communicable indicators.
2. **Design Agent** – defined UniGe-aligned palette, typography, layout system and pure-SVG chart language that never uses inline styles.
3. **Implementation Agent** – wrote semantic HTML5, external CSS, responsive navigation and the first three visualisation pages; pushed everything to this public repo.

## Enabling GitHub Pages (one-time)

1. Go to the repository **Settings → Pages**
2. Under “Build and deployment” choose **Source: Deploy from a branch**
3. Branch: `main` · Folder: `/ (root)`
4. Save. The site will be live at `https://yasin6606.github.io/mapping-ai-impact/` within a minute or two.

## Licence & credits

Data remain under the licences of their original publishers.  
Website code © 2026 Neural Cartographers / Università di Genova course project.
