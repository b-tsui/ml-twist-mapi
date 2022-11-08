import algoliasearch from "algoliasearch/lite";
import React, { useRef } from "react";
import {
  Configure,
  Highlight,
  Hits,
  HitsPerPage,
  InstantSearch,
  Pagination,
  RefinementList,
  SearchBox,
  SortBy,
} from "react-instantsearch-hooks-web";

import {
  AlgoliaSvg,
  ClearFilters,
  ClearFiltersMobile,
  NoResults,
  NoResultsBoundary,
  Panel,
  PriceSlider,
  ResultsNumberMobile,
  SaveFiltersMobile,
} from "./components";

import "./App.css";
import "./App.mobile.css";
import "./components/Pagination.css";
import { ScrollTo } from "./components/ScrollTo";
import getRouting from "./routing";
import "./Theme.css";
import { formatNumber } from "./utils";

const searchClient = algoliasearch(process.env.ALGOLIA_APPLICATION_ID!, process.env.ALGOLIA_API_KEY!);

const indexName = "PRIMED";
const routing = getRouting(indexName);

export function App() {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef(null);

  function openFilters() {
    document.body.classList.add("filtering");
    window.scrollTo(0, 0);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("click", onClick);
  }

  function closeFilters() {
    document.body.classList.remove("filtering");
    containerRef.current!.scrollIntoView();
    window.removeEventListener("keyup", onKeyUp);
    window.removeEventListener("click", onClick);
  }

  function onKeyUp(event) {
    if (event.key !== "Escape") {
      return;
    }

    closeFilters();
  }

  function onClick(event) {
    if (event.target !== headerRef.current) {
      return;
    }

    closeFilters();
  }

  return (
    <InstantSearch searchClient={searchClient} indexName={indexName} routing={true}>
      <header className="header" ref={headerRef}>
        <p className="header-logo">
          <AlgoliaSvg />
        </p>
        <SearchBox placeholder="Search material by formula or elements" submitIconComponent={SubmitIcon} />
      </header>

      <Configure
        attributesToSnippet={["description:10"]}
        snippetEllipsisText="…"
        removeWordsIfNoResults="allOptional"
      />

      <ScrollTo>
        <main className="container" ref={containerRef}>
          <div className="container-wrapper">
            <section className="container-filters" onKeyUp={onKeyUp}>
              <div className="container-header">
                <h2>Filters</h2>

                <div className="clear-filters" data-layout="desktop">
                  <ClearFilters />
                </div>

                <div className="clear-filters" data-layout="mobile">
                  <ResultsNumberMobile />
                </div>
              </div>

              <div className="container-body">
                {/* <Panel header="Category">
                  <HierarchicalMenu attributes={["hierarchicalCategories.lvl0", "hierarchicalCategories.lvl1"]} />
                </Panel> */}

                <Panel header="Elements">
                  <RefinementList
                    operator="and"
                    attribute="elements"
                    searchable={true}
                    searchablePlaceholder="Search for elements…"
                  />
                </Panel>

                <Panel header="Band Gap">
                  <PriceSlider attribute="band_gap" />
                </Panel>

                <Panel header="Crystallinity">
                  <RefinementList
                    //operator="and"
                    attribute="crystallinity"
                    searchable={true}
                    searchablePlaceholder="Search for crystallinity"
                  />
                </Panel>

                <Panel header="Source">
                  <RefinementList
                    operator="and"
                    attribute="source"
                    searchable={true}
                    //searchablePlaceholder="Search for elements…"
                  />
                </Panel>

                {/* <Panel header="Free shipping">
                  <ToggleRefinement attribute="free_shipping" label="Display only items with free shipping" on={true} />
                </Panel> */}
                {/* 
                <Panel header="Ratings">
                  <Ratings attribute="rating" />
                </Panel> */}
              </div>
            </section>

            <footer className="container-filters-footer" data-layout="mobile">
              <div className="container-filters-footer-button-wrapper">
                <ClearFiltersMobile containerRef={containerRef} />
              </div>

              <div className="container-filters-footer-button-wrapper">
                <SaveFiltersMobile onClick={closeFilters} />
              </div>
            </footer>
          </div>

          <section className="container-results">
            <header className="container-header container-options">
              <SortBy
                className="container-option"
                items={[
                  {
                    label: "Sort by featured",
                    value: "instant_search",
                  },
                  {
                    label: "Price ascending",
                    value: "instant_search_price_asc",
                  },
                  {
                    label: "Price descending",
                    value: "instant_search_price_desc",
                  },
                ]}
              />

              <HitsPerPage
                className="container-option"
                items={[
                  {
                    label: "16 hits per page",
                    value: 16,
                    default: true,
                  },
                  {
                    label: "32 hits per page",
                    value: 32,
                  },
                  {
                    label: "64 hits per page",
                    value: 64,
                  },
                ]}
              />
            </header>

            <NoResultsBoundary fallback={<NoResults />}>
              <Hits hitComponent={Hit} />
            </NoResultsBoundary>

            <footer className="container-footer">
              <Pagination padding={2} showFirst={false} showLast={false} />
            </footer>
          </section>
        </main>
      </ScrollTo>

      <aside data-layout="mobile">
        <button className="filters-button" data-action="open-overlay" onClick={openFilters}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 14">
            <path
              d="M15 1H1l5.6 6.3v4.37L9.4 13V7.3z"
              stroke="#fff"
              strokeWidth="1.29"
              fill="none"
              fillRule="evenodd"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Filters
        </button>
      </aside>
    </InstantSearch>
  );
}

function SubmitIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 18">
      <g
        fill="none"
        fillRule="evenodd"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.67"
        transform="translate(1 1)"
      >
        <circle cx="7.11" cy="7.11" r="7.11" />
        <path d="M16 16l-3.87-3.87" />
      </g>
    </svg>
  );
}

function Hit({ hit }) {
  return (
    <article className="hit">
      {/* <header className="hit-image-container">
        <img src={hit.image} alt={hit.name} className="hit-image" />
      </header> */}

      <div className="hit-info-container">
        <h1>
          <Highlight attribute="formula_pretty" highlightedTagName="mark" hit={hit} />
        </h1>
        <p className="hit-description">
          <Highlight attribute="elements" highlightedTagName="mark" hit={hit} />
        </p>
        <p className="hit-description">Crystallinity: {hit.crystallinity || "unavailable"}</p>

        <div>
          <p>
            <span className="hit-em"></span>Band Gap: {formatNumber(hit.band_gap)}{" "}
          </p>
          <p>
            <span className="hit-em"></span>Volume:{" "}
            {hit.materials.map(
              (mat, i) =>
                `${mat.volume?.toFixed(4) || mat.attributes._odbx_cell_volume?.toFixed(4)} ${
                  i < hit.n_materials - 1 ? "| " : ""
                }`
            )}
          </p>
          <p className="hit-em">
            src:{" "}
            <div>
              {hit.url.map((url, i) => (
                <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  {hit.source[i]}
                  {i < hit.url.length - 1 && " |"}{" "}
                </a>
              ))}
            </div>
          </p>
        </div>
      </div>
    </article>
  );
}
